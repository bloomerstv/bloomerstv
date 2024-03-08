'use client'
import React, { memo, useEffect } from 'react'
import { getLiveStreamUrl } from '../../../../utils/lib/getLiveStreamUrl'
import ConnectStream from './ConnectStream'
import toast from 'react-hot-toast'
import { useApolloClient } from '@apollo/client'
import {
  MyStream,
  ShouldCreateNewPostDocument,
  useCreateMyLensStreamSessionMutation,
  useUploadDataToArMutation
} from '../../../../graphql/generated'
import {
  BroadcastingError,
  InsufficientGasError,
  OpenActionConfig,
  OpenActionType,
  PendingSigningRequestError,
  PostAsyncResult,
  Result,
  SessionType,
  UserRejectedError,
  WalletConnectionError,
  useCreatePost,
  useSession
} from '@lens-protocol/react-web'
import formatHandle from '../../../../utils/lib/formatHandle'
import {
  APP_ID,
  APP_LINK,
  REDIRECTOR_URL,
  defaultSponsored
} from '../../../../utils/config'
import { v4 as uuid } from 'uuid'
import getUserLocale from '../../../../utils/getUserLocale'
import { useMyStreamInfo } from '../../../store/useMyStreamInfo'
import {
  MediaVideoMimeType,
  MetadataAttributeType,
  liveStream
} from '@lens-protocol/metadata'
import { useMyPreferences } from '../../../store/useMyPreferences'
import { IconButton } from '@mui/material'
import { BroadcastLive } from './Broadcast'
import Player from '../../../common/Player'
import CloseIcon from '@mui/icons-material/Close'
import useCollectSettings from '../../../common/Collect/useCollectSettings'
import { getTagsForCategory } from '../../../../utils/categories'
const LiveVideoComponent = ({
  myStream,
  startedStreaming,
  setStartedStreaming,
  streamFromBrowser,
  setStreamFromBrowser
}: {
  myStream: MyStream
  startedStreaming: boolean
  setStartedStreaming: (value: boolean) => void
  streamFromBrowser: boolean
  setStreamFromBrowser: (value: boolean) => void
}) => {
  const {
    type,
    amount,
    collectLimit,
    endsAt,
    followerOnly,
    recipients,
    referralFee,
    recipient
  } = useCollectSettings()
  const { execute } = useCreatePost()
  const [createMyLensStreamSession] = useCreateMyLensStreamSessionMutation({
    fetchPolicy: 'no-cache'
  })
  const { category, streamReplayViewType } = useMyPreferences((state) => {
    return {
      streamReplayViewType: state.streamReplayViewType,
      category: state.category
    }
  })
  const addLiveChatAt = useMyStreamInfo((state) => state.addLiveChatAt)
  const [uploadDataToAR] = useUploadDataToArMutation({
    fetchPolicy: 'no-cache'
  })
  const { data: session } = useSession()
  const client = useApolloClient()
  // const shouldCreateNewPost = async () => {
  //   const { data } = await client.query({
  //     query: ShouldCreateNewPostDocument
  //   })

  //   return data?.shouldCreateNewPost
  // }

  useEffect(() => {
    if (startedStreaming) {
      handleStartedStreaming()
    }
  }, [startedStreaming])

  const createLensPost = async (
    sessionId: string
  ): Promise<string | undefined> => {
    if (session?.type !== SessionType.WithProfile) {
      return
    }
    const m3u8Url = `${REDIRECTOR_URL}/livestream?sessionId=${sessionId}&format=.m3u8`
    const mp4Url = `${REDIRECTOR_URL}/livestream?sessionId=${sessionId}&format=.mp4`
    const thumbnail = `${REDIRECTOR_URL}/livestream?sessionId=${sessionId}&format=.png`
    const duration = `${REDIRECTOR_URL}/livestream?sessionId=${sessionId}&format=seconds`
    // code logic here
    const streamName = myStream?.streamName ?? undefined

    if (!streamName) {
      toast.error('Please enter a stream name')
      throw new Error('No stream name')
    }
    const streamerHandle = formatHandle(session?.profile)
    const profileLink = `${APP_LINK}/${streamerHandle}`
    const id = uuid()
    const locale = getUserLocale()

    const content = `${streamName}${
      myStream?.streamDescription ? `\n\n${myStream?.streamDescription}` : ''
    }${addLiveChatAt ? `\n\nLive Chat at ${profileLink}` : ''}`

    const metadata = liveStream({
      title: streamName,
      content: content,
      marketplace: {
        name: streamName,
        description: `${streamName}\n\nLive on ${profileLink}`,
        external_url: profileLink,
        animation_url: mp4Url,
        image: thumbnail
      },
      attachments: [
        {
          type: MediaVideoMimeType.MP4,
          item: mp4Url,
          cover: thumbnail
        }
      ],
      attributes: [
        {
          key: 'livestream-duration',
          value: duration,
          type: MetadataAttributeType.STRING
        }
      ],
      id: id,
      locale: locale,
      appId: APP_ID,
      liveUrl: m3u8Url,
      playbackUrl: m3u8Url,
      tags: getTagsForCategory(category),
      startsAt: new Date().toISOString()
    })

    const { data, errors } = await uploadDataToAR({
      variables: {
        data: JSON.stringify(metadata)
      }
    })

    if (errors?.[0]) {
      toast.error(errors[0].message)
      throw new Error('Error uploading metadata to Arweave')
    }

    const transactionId = data?.uploadDataToAR

    if (!transactionId) {
      throw new Error('Error uploading metadata to Arweave')
    }

    let actions: OpenActionConfig[] | undefined = undefined

    if (type) {
      actions = [
        {
          type,
          // @ts-ignore
          amount,
          collectLimit,
          endsAt,
          followerOnly,
          referralFee: amount ? referralFee : undefined
        }
      ]

      if (type === OpenActionType.MULTIRECIPIENT_COLLECT) {
        // @ts-ignore
        actions[0]['recipients'] = recipients
      }
      if (type === OpenActionType.SIMPLE_COLLECT) {
        // @ts-ignore
        actions[0]['recipient'] = recipient
      }
    }

    const MAX_RETRIES = 3 // Maximum number of retries
    let retries = 0
    // @ts-ignore
    let result: Result<
      PostAsyncResult,
      | BroadcastingError
      | InsufficientGasError
      | PendingSigningRequestError
      | UserRejectedError
      | WalletConnectionError
    > = null

    while (retries < MAX_RETRIES) {
      try {
        result = await execute({
          metadata: `ar://${transactionId}`,
          sponsored: defaultSponsored,
          actions: actions
        })

        if (result.isSuccess()) {
          // If the execution is successful, break the loop
          break
        } else {
          // If the execution fails, increment the retry counter
          retries++
          if (retries === MAX_RETRIES) {
            if (result.isFailure()) {
              switch (result.error.name) {
                case 'BroadcastingError':
                  console.log(
                    'There was an error broadcasting the transaction',
                    result.error.message
                  )
                  toast.error('Error broadcasting the transaction')
                  break

                case 'PendingSigningRequestError':
                  console.log(
                    'There is a pending signing request in your wallet. ' +
                      'Approve it or discard it and try again.'
                  )
                  toast.error(
                    'There is a pending signing request in your wallet. ' +
                      'Approve it or discard it and try again.'
                  )
                  break

                case 'WalletConnectionError':
                  console.log(
                    'There was an error connecting to your wallet',
                    result.error.message
                  )
                  toast.error(
                    'Error connecting to your wallet' + result.error.message
                  )
                  break

                case 'UserRejectedError':
                  // the user decided to not sign, usually this is silently ignored by UIs
                  break

                default:
                  toast.error('Error from Lens API' + result.error.message)
              }
            }
            // If the maximum number of retries has been reached, throw an error
            // toast.error(result.error.message)
            throw new Error('Error creating post')
          }
        }
      } catch (error) {
        retries++
        if (retries === MAX_RETRIES) {
          // If the maximum number of retries has been reached, throw an error
          toast.error(String(error))
          throw new Error('Error creating post')
        } else {
          console.log(error)
        }
      }
    }

    if (!result.isSuccess()) {
      toast.error(result.error.message)
      // handle failure scenarios
      throw new Error('Error creating post')
    }

    // this might take a while, depends on the type of tx (on-chain or Momoka)
    // and the congestion of the network
    const completion = await result.value.waitForCompletion()

    if (completion.isFailure()) {
      toast.error(completion.error.message)
      throw new Error('Error creating post during tx processing')
    }

    // the post is now ready to be used
    const post = completion.value

    return post?.id
  }

  const getLatestSessionId = async (): Promise<string | null> => {
    try {
      const { data: shouldCreateNewPostRes } = await client.query({
        query: ShouldCreateNewPostDocument,
        fetchPolicy: 'no-cache'
      })

      // return data?.shouldCreateNewPost
      // check if should create new post
      const sessionId = shouldCreateNewPostRes?.shouldCreateNewPost

      return sessionId
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const handleStartedStreaming = async () => {
    try {
      const latestSessionId = await toast.promise(getLatestSessionId(), {
        loading: 'Checking if post already created...',
        success: null,
        error: null
      })

      console.log('latestSessionId', latestSessionId)

      if (!latestSessionId) {
        return
      }

      // if yet, create lens post and get post id
      const publicationId = await toast.promise(
        createLensPost(latestSessionId),
        {
          loading: 'Creating post for this stream...',
          success: 'Post created!',
          error: 'Error creating post'
        }
      )

      if (!publicationId) {
        return
      }

      // submit the lens post id to create a lens stream session to api
      // so when/if we check for lens post id on the latest session, it will be there

      const { data, errors } = await createMyLensStreamSession({
        variables: {
          publicationId: publicationId,
          viewType: streamReplayViewType
        },
        fetchPolicy: 'no-cache'
      })

      if (errors?.[0] && !data?.createMyLensStreamSession) {
        toast.error(errors[0].message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleGoLiveFromBrowser = () => {
    setStreamFromBrowser(true)
  }

  const ConnectStreamMemo = React.useMemo(() => {
    return <ConnectStream handleGoLiveFromBrowser={handleGoLiveFromBrowser} />
  }, [])

  const videoComponent = React.useMemo(() => {
    const liveStreamUrl = getLiveStreamUrl(myStream?.playbackId)

    return (
      <Player
        className="w-full"
        src={liveStreamUrl}
        streamOfflineErrorComponent={ConnectStreamMemo}
        onStreamStatusChange={(isLive) => {
          setStartedStreaming(isLive)
        }}
        clipLength={30}
      />
    )
  }, [])

  const broadcastComponent = React.useMemo(() => {
    return (
      <div className="w-full relative">
        <BroadcastLive
          // @ts-ignore
          streamKey={myStream?.streamKey}
          onStreamStatusChange={(isLive) => {
            setStartedStreaming(isLive)
          }}
        />

        {/* <Broadcast
          streamKey={myStream?.streamKey}
          onPlaybackStatusUpdate={(state) => {
            setStartedStreaming(state.live)
          }}
          controls={{
            autohide: 0
          }}
          displayMediaOptions={{
            audio: true,
            video: true
          }}
          mediaStreamConstraints={{
            preferCurrentTab: true,
            audio: true,
            video: true
          }}
          theme={{
            colors: {
              progressLeft: '#1668b8',
              progressRight: '#f7f7f8',
              progressMiddle: '#ffffff',
              volumeLeft: '#ffffff',
              volumeRight: '#f7f7f8',
              volumeMiddle: '#ffffff',
              loading: '#1668b8',
              liveIndicator: '#1668b8'
            }
          }}
        /> */}
        {/* stop streaming button */}
        <div className="absolute top-2 right-2 z-50 text-xs text-white">
          <IconButton
            onClick={() => {
              setStreamFromBrowser(false)
            }}
            className="rounded-full bg-black/40 backdrop-blur-sm"
            sx={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.2)'
              }
            }}
          >
            <CloseIcon className="text-white rounded-full" />
          </IconButton>
        </div>
      </div>
    )
  }, [])

  return (
    <div className="w-[450px] 2xl:w-[500px] shrink-0">
      {streamFromBrowser ? broadcastComponent : videoComponent}
    </div>
  )
}

export default memo(LiveVideoComponent)
