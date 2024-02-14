'use client'
import React, { memo, useEffect } from 'react'
import Video from '../../../common/Video'
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
  SessionType,
  useCreatePost,
  useSession
} from '@lens-protocol/react-web'
import formatHandle from '../../../../utils/lib/formatHandle'
import {
  APP_ID,
  APP_LINK,
  NODE_API_URL,
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
import { Broadcast } from '@livepeer/react'
import { Button } from '@mui/material'
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation'
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
  const { execute } = useCreatePost()
  const [createMyLensStreamSession] = useCreateMyLensStreamSessionMutation({
    fetchPolicy: 'no-cache'
  })
  const streamReplayViewType = useMyPreferences(
    (state) => state.streamReplayViewType
  )
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
    const m3u8Url = `${NODE_API_URL}/api/livestream?sessionId=${sessionId}&format=.m3u8`
    const mp4Url = `${NODE_API_URL}/api/livestream?sessionId=${sessionId}&format=.mp4`
    const thumbnail = `${NODE_API_URL}/api/livestream?sessionId=${sessionId}&format=.png`
    const duration = `${NODE_API_URL}/api/livestream?sessionId=${sessionId}&format=seconds`
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
        external_url: profileLink
        // image: thumbnail?.thumbnail
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
    // invoke the `execute` function to create the post
    const result = await execute({
      metadata: `ar://${transactionId}`,
      sponsored: defaultSponsored
    })

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
    return (
      <Video
        className="w-[360px] 2xl:w-[480px] shrink-0"
        src={getLiveStreamUrl(myStream?.playbackId)}
        streamOfflineErrorComponent={ConnectStreamMemo}
        onStreamStatusChange={(isLive) => {
          setStartedStreaming(isLive)
        }}
      />
    )
  }, [])

  const broadcastComponent = React.useMemo(() => {
    return (
      <div className="w-[360px] 2xl:w-[480px] shrink-0 relative">
        <Broadcast
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
        />
        {/* stop streaming button */}
        <div className="absolute top-2 right-2 z-50">
          <Button
            variant="contained"
            color="secondary"
            size="small"
            className="opacity-80"
            startIcon={<CancelPresentationIcon />}
            onClick={() => {
              setStreamFromBrowser(false)
            }}
          >
            Stop
          </Button>
        </div>
      </div>
    )
  }, [])

  return <div>{streamFromBrowser ? broadcastComponent : videoComponent}</div>
}

export default memo(LiveVideoComponent)
