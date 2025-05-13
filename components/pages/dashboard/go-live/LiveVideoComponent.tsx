'use client'
import React, { memo, useEffect } from 'react'
import {
  getLiveStreamUrl,
  getLiveStreamUrlWebRTC
} from '../../../../utils/lib/getLiveStreamUrl'
import ConnectStream from './ConnectStream'
import toast from 'react-hot-toast'
import { useApolloClient } from '@apollo/client'
import {
  MyStream,
  ShouldCreateNewPostDocument,
  useCreateClipMutation,
  useCreateMyLensStreamSessionMutation
} from '../../../../graphql/generated'
import formatHandle from '../../../../utils/lib/formatHandle'
import {
  APP_ID,
  APP_LINK,
  REDIRECTOR_URL,
  defaultSponsored
  // isMainnet
} from '../../../../utils/config'
import { v4 as uuid } from 'uuid'
import getUserLocale from '../../../../utils/getUserLocale'
import { useMyStreamInfo } from '../../../store/useMyStreamInfo'
import {
  MediaVideoMimeType,
  MetadataAttributeType,
  liveStream
} from '@lens-protocol/metadata'
import {
  PlayerStreamingMode,
  useMyPreferences
} from '../../../store/useMyPreferences'
import { IconButton } from '@mui/material'
import { BroadcastLive } from './Broadcast'
import Player from '../../../common/Player/Player'
import CloseIcon from '@mui/icons-material/Close'
import useCollectSettings from '../../../common/Collect/useCollectSettings'
import {
  getTagsForCategory,
  getTagsForSymbol
} from '../../../../utils/categories'
// import { VerifiedOpenActionModules } from '../../../../utils/verified-openaction-modules'
// import { encodeAbiParameters, type Address } from 'viem'
import { Src } from '@livepeer/react'
import PostClipOnLens from '../../profile/PostClipOnLens'
import {
  Post,
  Result,
  SigningError,
  TransactionIndexingError,
  UnauthenticatedError,
  UnexpectedError,
  useAccount,
  useCreatePost,
  ValidationError
} from '@lens-protocol/react'
import { useWalletClient } from 'wagmi'
import { handleOperationWith } from '@lens-protocol/react/viem'
import useSession from '../../../../utils/hooks/useSession'
import { acl, storageClient } from '../../../../utils/lib/lens/storageClient'

const LiveVideoComponent = ({
  myStream,
  startedStreaming,
  refreshMyStream,
  setStartedStreaming,
  streamFromBrowser,
  setStreamFromBrowser
}: {
  myStream: MyStream
  startedStreaming: boolean
  refreshMyStream: () => void
  setStartedStreaming: (value: boolean) => void
  streamFromBrowser: boolean
  setStreamFromBrowser: (value: boolean) => void
}) => {
  // const {
  //   type,
  //   amount,
  //   collectLimit,
  //   endsAt,
  //   followerOnly,
  //   recipients,
  //   referralFee,
  //   recipient
  // } = useCollectSettings()
  const [clipUrl, setClipUrl] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(false)

  const { data: walletClient } = useWalletClient()
  const { execute } = useCreatePost(handleOperationWith(walletClient))
  const [createMyLensStreamSession] = useCreateMyLensStreamSessionMutation({
    fetchPolicy: 'no-cache'
  })
  const [createClip] = useCreateClipMutation()

  const { data } = useAccount({
    address: myStream?.accountAddress
  })

  const { category, streamReplayViewType, playerStreamingMode } =
    useMyPreferences((state) => {
      return {
        streamReplayViewType: state.streamReplayViewType,
        category: state.category,
        playerStreamingMode: state.playerStreamingMode
      }
    })
  const addLiveChatAt = useMyStreamInfo((state) => state.addLiveChatAt)

  const { isAuthenticated, account } = useSession()
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

  /**
   * Creates a new post using the provided sessionId
   * @param sessionId the session id to use when creating the post
   * @returns the id of the newly created post, or undefined if an error occurred
   */
  const createLensPost = async (
    sessionId: string
  ): Promise<string | undefined> => {
    if (!isAuthenticated) {
      // If the user is not logged in, return undefined
      return
    }

    // Get the m3u8 url for the live stream
    const m3u8Url = `${REDIRECTOR_URL}/livestream?sessionId=${sessionId}&format=.m3u8`
    // Get the mp4 url for the live stream
    const mp4Url = `${REDIRECTOR_URL}/livestream?sessionId=${sessionId}&format=.mp4`
    // Get the thumbnail url for the live stream
    const thumbnail = `${REDIRECTOR_URL}/livestream?sessionId=${sessionId}&format=.png`
    // Get the duration of the live stream in seconds
    const duration = `${REDIRECTOR_URL}/livestream?sessionId=${sessionId}&format=seconds`
    // code logic here
    const streamName = myStream?.streamName ?? undefined

    if (!streamName) {
      // If the stream name is not set, show an error
      toast.error('Please enter a stream name')
      throw new Error('No stream name')
    }

    // Get the user's handle from their profile
    const streamerHandle = formatHandle(account?.owner)
    // Get the profile link from the user's handle
    const profileLink = `${APP_LINK}/${streamerHandle}`
    // Generate a uuid for the post
    const id = uuid()
    // Get the user's locale
    const locale = getUserLocale()

    // Create the content for the post
    const content = `${streamName}${
      myStream?.streamDescription ? `\n\n${myStream?.streamDescription}` : ''
    }${addLiveChatAt ? `\n\nLive Chat at ${profileLink}` : ''}`

    // Get the tags for the post
    const tags = [
      ...getTagsForCategory(category)
      // ...getTagsForSymbol(
      //   type && amount?.asset?.symbol ? amount.asset.symbol : ''
      // )
    ]

    // Create the metadata for the post
    const metadata = liveStream({
      title: streamName,
      content: content,
      attachments: [
        {
          type: MediaVideoMimeType.MP4,
          item: mp4Url,
          cover: thumbnail,
          altTag: 'Live Stream'
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
      liveUrl: m3u8Url,
      playbackUrl: m3u8Url,
      tags: tags,
      startsAt: new Date().toISOString()
    })

    // Upload the metadata to Arweave
    const response = await storageClient.uploadAsJson(metadata, {
      acl: acl,
      name: `livestream-${formatHandle(account)}-${id}`
    })

    if (!response?.uri) {
      toast.error('Error uploading metadata to Arweave')
      throw new Error('Error uploading metadata to Arweave')
    }

    // let actions: OpenActionConfig[] | undefined = []

    // if (type) {
    //   // If there is a type set, create the actions array
    //   actions = [
    //     // @ts-ignore
    //     {
    //       type,
    //       // @ts-ignore
    //       amount,
    //       collectLimit,
    //       endsAt,
    //       followerOnly,
    //       referralFee: amount ? referralFee : undefined
    //     }
    //   ]

    //   if (type === OpenActionType.MULTIRECIPIENT_COLLECT) {
    //     // @ts-ignore
    //     actions[0]['recipients'] = recipients
    //   }
    //   if (type === OpenActionType.SIMPLE_COLLECT) {
    //     // @ts-ignore
    //     actions[0]['recipient'] = recipient
    //   }
    // }

    // If on mainnet, add the tip action
    // if (isMainnet) {
    //   actions?.push({
    //     type: OpenActionType.UNKNOWN_OPEN_ACTION,
    //     address: VerifiedOpenActionModules.Tip,
    //     // @ts-ignore
    //     data: encodeAbiParameters(
    //       [{ name: 'tipReceiver', type: 'address' }],
    //       [session?.profile?.handle?.ownedBy as Address]
    //     )
    //   })
    // }

    // Set the maximum number of retries
    const MAX_RETRIES = 3
    let retries = 0

    let result:
      | Result<
          Post,
          | SigningError
          | ValidationError<string>
          | TransactionIndexingError
          | UnauthenticatedError
          | UnexpectedError
        >
      | undefined

    // Loop until the post is created or the maximum number of retries is reached
    while (retries < MAX_RETRIES) {
      try {
        // Execute the post creation
        result = await execute({
          contentUri: response.uri
          // actions: actions
        })

        if (result.isOk()) {
          // If the execution is successful, break the loop
          break
        } else {
          // If the execution fails, increment the retry counter
          retries++
          if (retries === MAX_RETRIES) {
            if (result.isErr()) {
              // If the maximum number of retries is reached, show an error
              toast.error('Error from Lens API' + result.error.message)
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

    if (!result) {
      toast.error('Error creating post')
      throw new Error('Error creating post')
    }

    if (result.isErr()) {
      // If the post creation failed, show an error
      toast.error(result.error.message)
      // handle failure scenarios
      throw new Error('Error creating post')
    }

    // The post is now ready to be used
    const post = result.value

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

      refreshMyStream()

      if (!latestSessionId) {
        return
      }

      // if yet, create lens post and get post id
      const postId = await toast.promise(createLensPost(latestSessionId), {
        loading: 'Creating post for this stream...',
        success: 'Post created!',
        error: 'Error creating post'
      })

      if (!postId) {
        return
      }

      // submit the lens post id to create a lens stream session to api
      // so when/if we check for lens post id on the latest session, it will be there

      const { data, errors } = await toast.promise(
        createMyLensStreamSession({
          variables: {
            postId,
            viewType: streamReplayViewType
          },
          fetchPolicy: 'no-cache'
        }),
        {
          loading: 'Sending notification to your followers...',
          success: 'Sent!',
          error: 'Error sending notification to your followers...'
        }
      )

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

  const handleClipClicked = async (
    playbackId: string,
    startTime: number,
    endTime: number
  ) => {
    try {
      // Use `playbackOffsetMsRef.current` instead of `playbackOffsetMs`
      // const offsetMs = playbackOffsetMsRef.current

      if (!playbackId || !startTime || !endTime) return
      // we get the estimated time on the server that the user "clipped"
      // by subtracting the offset from the recorded clip time
      // const estimatedServerClipTime = Date.now() - (offsetMs ?? 0)

      // const startTime = estimatedServerClipTime - 30 * 1000
      // const endTime = estimatedServerClipTime

      const result = await toast.promise(
        createClip({
          variables: {
            playbackId: playbackId,
            startTime,
            endTime,
            name: `Clip from ${formatHandle(data)}'s stream`
          }
        }),
        {
          error: 'Error processing clip',
          loading: 'Processing clip... (this may take a few minutes)',
          success: 'Clip processed! Can post on Lens now'
        }
      )

      if (result?.data?.createClip?.downloadUrl) {
        setClipUrl(result?.data?.createClip?.downloadUrl)
        setOpen(true)
      } else {
        toast.error('Something went wrong creating clip')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const videoComponent = React.useMemo(() => {
    const hlsUrl = getLiveStreamUrl(myStream?.playbackId)
    const webrtcUrl = getLiveStreamUrlWebRTC(myStream?.playbackId)

    return (
      <Player
        className="w-full"
        src={
          playerStreamingMode === PlayerStreamingMode.Quality
            ? ([
                {
                  src: hlsUrl,
                  type: 'hls'
                }
              ] as Src[])
            : ([
                {
                  src: hlsUrl,
                  type: 'hls'
                },
                {
                  src: webrtcUrl,
                  type: 'webrtc'
                }
              ] as Src[])
        }
        streamOfflineErrorComponent={ConnectStreamMemo}
        onStreamStatusChange={(isLive) => {
          setStartedStreaming(isLive)
        }}
        clipLength={isAuthenticated ? 30 : undefined}
        createClip={handleClipClicked}
      />
    )
  }, [playerStreamingMode])

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
    <div className="w-[520px] shrink-0">
      {clipUrl && data && isAuthenticated && (
        <PostClipOnLens
          open={open}
          setOpen={setOpen}
          url={clipUrl}
          account={data}
          sessionId={myStream?.latestSessionId}
        />
      )}
      {streamFromBrowser ? broadcastComponent : videoComponent}
    </div>
  )
}

export default memo(LiveVideoComponent)
