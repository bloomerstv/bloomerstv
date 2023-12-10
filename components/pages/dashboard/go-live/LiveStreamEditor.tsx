'use client'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import {
  ShouldCreateNewPostDocument,
  useCreateMyLensStreamSessionMutation,
  useMyStreamQuery,
  useUploadDataToIpfsMutation
} from '../../../../graphql/generated'
import Video from '../../../common/Video'
import { getLiveStreamUrl } from '../../../../utils/lib/getLiveStreamUrl'
import ConnectStream from './ConnectStream'
import MyStreamEditButton from './MyStreamEditButton'
import {
  SessionType,
  useCreatePost,
  useSession
} from '@lens-protocol/react-web'
import { Button, TextField } from '@mui/material'
import {
  APP_ID,
  APP_LINK,
  LIVE_PEER_RTMP_URL,
  defaultSponsored
} from '../../../../utils/config'
import { useApolloClient } from '@apollo/client'
import { liveStream } from '@lens-protocol/metadata'
import formatHandle from '../../../../utils/lib/formatHandle'
// import { stringToLength } from '../../../../utils/stringToLength'
import { v4 as uuid } from 'uuid'
import getUserLocale from '../../../../utils/getUserLocale'
import clsx from 'clsx'
import StartLoadingPage from '../../loading/StartLoadingPage'

const LiveStreamEditor = () => {
  const { data: session } = useSession()
  const { data, error, refetch, loading } = useMyStreamQuery()
  const [startedStreaming, setStartedStreaming] = React.useState(false)

  const client = useApolloClient()

  const [createMyLensStreamSession] = useCreateMyLensStreamSessionMutation()
  const { execute, error: createPostError } = useCreatePost()

  const [uploadDataToIpfs] = useUploadDataToIpfsMutation()

  const shouldCreateNewPost = async () => {
    const { data } = await client.query({
      query: ShouldCreateNewPostDocument
    })

    return data?.shouldCreateNewPost
  }

  useEffect(() => {
    if (createPostError) {
      toast.error(createPostError.message)
    }
  }, [createPostError])

  useEffect(() => {
    if (!error) return
    toast.error(error?.message)
  }, [error])

  const myStream = data?.myStream

  const createLensPost = async (): Promise<string | undefined> => {
    if (session?.type !== SessionType.WithProfile) {
      return
    }
    // code logic here
    const streamName = myStream?.streamName ?? undefined
    if (!streamName) {
      toast.info('Please enter a stream name')
      throw new Error('No stream name')
    }
    const streamerHandle = formatHandle(session?.profile)
    const profileLink = `${APP_LINK}/${streamerHandle}`
    const id = uuid()
    const locale = getUserLocale()

    const metadata = liveStream({
      title: streamName,
      content: `${streamName}\n\nLive Chat at ${profileLink}`,
      marketplace: {
        name: streamName,
        description: `${streamName}\n\nLive on ${profileLink}`,
        external_url: profileLink
      },
      id: id,
      locale: locale,
      appId: APP_ID,
      liveUrl: getLiveStreamUrl(myStream?.playbackId),
      playbackUrl: getLiveStreamUrl(myStream?.playbackId),
      startsAt: new Date().toISOString()
    })

    const { data } = await uploadDataToIpfs({
      variables: {
        data: JSON.stringify(metadata)
      }
    })

    const cid = data?.uploadDataToIpfs?.cid

    if (!cid) {
      throw new Error('Error uploading metadata to IPFS')
    }
    // invoke the `execute` function to create the post
    const result = await execute({
      metadata: `ipfs://${cid}`,
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

  useEffect(() => {
    if (startedStreaming) {
      handleStartedStreaming()
    }
  }, [startedStreaming])

  const handleStartedStreaming = async () => {
    try {
      console.log('started streaming')
      // check if should create new post
      const res = await shouldCreateNewPost()
      console.log('should create new post', res)
      if (!res) {
        return
      }

      // if yet, create lens post and get post id
      const publicationId = await toast.promise(createLensPost(), {
        pending: 'Creating post for your stream...',
        success: 'Post created!',
        error: 'Error creating post'
      })

      if (!publicationId) {
        return
      }

      console.log('created publicationId', publicationId)
      // submit the lens post id to create a lens stream session to api
      // so when/if we check for lens post id on the latest session, it will be there

      const { data, errors } = await createMyLensStreamSession({
        variables: {
          publicationId: publicationId
        }
      })

      if (errors?.[0] && !data?.createMyLensStreamSession) {
        toast.error(errors[0].message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // memoized connect stream component
  const ConnectStreamMemo = React.useMemo(() => {
    return <ConnectStream />
  }, [])

  const videoComponent = React.useMemo(
    () => (
      <Video
        className="w-[360px] 2xl:w-[480px] shrink-0"
        src={getLiveStreamUrl(myStream?.playbackId)}
        streamOfflineErrorComponent={ConnectStreamMemo}
        onStreamStatusChange={(isLive) => {
          setStartedStreaming(isLive)
        }}
      />
    ),
    [myStream?.playbackId]
  )

  if (session?.type !== SessionType.WithProfile) {
    return <div>You must be logged in to stream.</div>
  }

  if (loading && !myStream) {
    return <StartLoadingPage />
  }

  if (!myStream) {
    return <div>You can't stream right now.</div>
  }

  return (
    <div className="p-8">
      <div className="bg-s-bg shadow-md">
        <div className="flex flex-row">
          {videoComponent}
          <div className="flex flex-row justify-between items-start p-8 w-full">
            <div className="space-y-4">
              <div className="">
                <div className="text-s-text font-bold text-md">Title</div>
                <div className="text-p-text font-semibold text-md 2xl:text-lg">
                  {myStream?.streamName}
                </div>
              </div>

              {/* <div className="">
                <div className="text-s-text font-bold text-sm">Description</div>
                <div className="text-p-text font-semibold ">
                  {stringToLength(myStream?.streamDescription, 100) ||
                    'No description provided'}
                </div>
              </div> */}
            </div>

            <MyStreamEditButton
              refreshStreamInfo={refetch}
              myStream={myStream}
            />
          </div>
        </div>
        <div className="px-4 py-3 start-row space-x-4">
          {/* dot that goes red when live and green when not */}
          <div
            className={clsx(
              'w-4 h-4 rounded-full',
              startedStreaming ? 'bg-brand' : 'bg-s-text'
            )}
          />

          <div className="font-semibold ">
            {startedStreaming
              ? `You're live! You can end your stream from obs or your streaming software.`
              : 'Start streaming from obs or your streaming software to go live'}
          </div>
        </div>
      </div>

      <div className="mt-8 p-8 bg-s-bg shadow-md ">
        <div className="space-y-8 w-[400px]">
          <div className="font-bold text-lg text-s-text">Stream Key</div>
          <div className="start-row space-x-2">
            {/* mui input with copy button  */}
            <TextField
              type="password"
              label="Stream Key"
              value={myStream?.streamKey}
              // don't allow editing
              InputProps={{
                readOnly: true
              }}
              size="small"
              fullWidth
            />
            <Button
              variant="outlined"
              onClick={() => {
                navigator.clipboard.writeText(myStream?.streamKey || '')
                toast.success('Copied to clipboard')
              }}
            >
              Copy
            </Button>
          </div>

          {/* stream url */}
          <div className="start-row space-x-2">
            <TextField
              label="Stream URL"
              value={LIVE_PEER_RTMP_URL}
              // don't allow editing
              InputProps={{
                readOnly: true
              }}
              size="small"
              fullWidth
            />
            <Button
              variant="outlined"
              onClick={() => {
                navigator.clipboard.writeText(LIVE_PEER_RTMP_URL)
                toast.success('Copied to clipboard')
              }}
            >
              Copy
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveStreamEditor
