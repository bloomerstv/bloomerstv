'use client'
import {
  ProfileId,
  SessionType,
  useProfile,
  useSession
} from '@lens-protocol/react-web'
import React, { memo } from 'react'
import LiveChat from '../dashboard/go-live/LiveChat'
import {
  useCreateClipMutation,
  useStreamReplayRecordingQuery,
  useStreamerQuery
} from '../../../graphql/generated'
import ProfileInfoWithStream from './ProfileInfoWithStream'
import StreamerOffline from './StreamerOffline'
import { getLiveStreamUrlWebRTC } from '../../../utils/lib/getLiveStreamUrl'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import StartLoadingPage from '../loading/StartLoadingPage'
// import CommentSection from '../watch/CommentSection'
import AboutProfile from './AboutProfile'
import formatHandle from '../../../utils/lib/formatHandle'
import PostClipOnLens from './PostClipOnLens'
import ClipsFeed from '../home/ClipsFeed'
import toast from 'react-hot-toast'
import LiveStreamPublicReplays from '../home/LiveStreamPublicReplays'
import { timeAgo } from '../../../utils/helpers'
import Markup from '../../common/Lexical/Markup'
import Player from '../../common/Player'
import { getLiveStreamUrl } from '../../../utils/lib/getLiveStreamUrl'
import {
  PlayerStreamingMode,
  useMyPreferences
} from '../../store/useMyPreferences'
import { Src } from '@livepeer/react'

const ProfilePage = ({ handle }: { handle: string }) => {
  const [clipUrl, setClipUrl] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(false)
  const playerStreamingMode = useMyPreferences(
    (state) => state.playerStreamingMode
  )

  const isMobile = useIsMobile()
  const {
    data,
    loading: profileLoading,
    error
  } = useProfile({
    forHandle: handle
  })

  const [createClip] = useCreateClipMutation()
  const { data: sessionData } = useSession()

  const {
    data: streamer,
    refetch,
    loading: streamerLoading
  } = useStreamerQuery({
    variables: {
      profileId: data?.id as ProfileId
    },
    skip: !data?.id
  })

  const { data: replayRecording } = useStreamReplayRecordingQuery({
    variables: {
      profileId: data?.id
    },
    skip: !data?.id || Boolean(streamer?.streamer?.isActive)
  })

  const hasPlaybackId = Boolean(streamer?.streamer?.playbackId)

  if (error) {
    toast.error(error.message)
  }

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
    if (!streamer?.streamer?.playbackId) {
      return null
    }

    const hlsUrl = getLiveStreamUrl(streamer?.streamer?.playbackId)
    const webrtcUrl = getLiveStreamUrlWebRTC(streamer?.streamer?.playbackId)

    return (
      <Player
        onStreamStatusChange={async (isLive) => {
          if (isLive !== streamer?.streamer?.isActive) {
            await refetch()
          }
        }}
        autoPlay={true}
        muted={false}
        streamOfflineErrorComponent={
          <StreamerOffline
            // @ts-ignore
            streamReplayRecording={replayRecording?.streamReplayRecording}
            // @ts-ignore
            profile={data}
            // @ts-ignore
            streamer={streamer?.streamer}
          />
        }
        clipLength={
          sessionData?.type === SessionType.WithProfile ? 30 : undefined
        }
        createClip={handleClipClicked}
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
      />
    )
  }, [
    streamer?.streamer?.playbackId,
    sessionData?.type,
    replayRecording?.streamReplayRecording?.recordingUrl,
    playerStreamingMode
  ])

  if (profileLoading || (streamerLoading && !streamer?.streamer)) {
    return <StartLoadingPage />
  }

  if (!data) {
    return <div>Profile not found</div>
  }

  return (
    <div className="flex flex-row h-full w-full">
      {clipUrl && data && sessionData?.type === SessionType.WithProfile && (
        <PostClipOnLens
          open={open}
          setOpen={setOpen}
          url={clipUrl}
          profile={data}
          sessionId={streamer?.streamer?.latestSessionId}
        />
      )}
      <div className="w-full flex-grow overflow-auto no-scrollbar h-full">
        {hasPlaybackId ? (
          <div className="w-full">{videoComponent}</div>
        ) : (
          <div className="h-[230px] sm:h-[700px] w-full">
            <StreamerOffline
              // @ts-ignore
              streamReplayRecording={replayRecording?.streamReplayRecording}
              profile={data}
              // @ts-ignore
              streamer={streamer?.streamer}
            />
          </div>
        )}

        {/* @ts-ignore */}
        <ProfileInfoWithStream profile={data} streamer={streamer?.streamer} />

        {/* {!isMobile &&
          streamer?.streamer?.isActive &&
          streamer?.streamer?.latestStreamPublicationId && (
            <div className="m-8 border-t border-p-border">
              <div className="text-xl font-semibold my-4">Comments</div>
              <CommentSection
                publicationId={streamer?.streamer?.latestStreamPublicationId}
              />
            </div>
          )} */}

        {(streamer?.streamer?.startedStreaming ||
          streamer?.streamer?.streamDescription) && (
          <div className="sm:mx-8 sm:mt-6 sm:mb-0 text-p-text font-semibold sm:text-base text-sm sm:p-6 m-2 p-3 gap-y-1 start-col  rounded-xl shadow-sm bg-p-hover lg:bg-s-bg">
            {/* // add total views count here */}
            {streamer?.streamer?.startedStreaming && (
              <div className="">
                {`${
                  streamer?.streamer?.isActive
                    ? 'Started streaming '
                    : 'Streamed '
                } ${
                  streamer?.streamer?.isActive
                    ? timeAgo(streamer?.streamer?.startedStreaming)
                    : timeAgo(streamer?.streamer?.lastSeen)
                }`}
              </div>
            )}
            {streamer?.streamer?.streamDescription && (
              <Markup className="">
                {String(streamer?.streamer?.streamDescription)}
              </Markup>
            )}
            {/* links */}
          </div>
        )}

        <AboutProfile profile={data} />

        <ClipsFeed handle={formatHandle(data)} />
        <div className="mt-4">
          <LiveStreamPublicReplays profileId={data?.id} />
        </div>
      </div>
      {data?.id && !isMobile && (
        <div className="w-[280px] 2xl:w-[350px] flex-none h-full">
          <LiveChat
            // @ts-ignore
            // publicationId={streamer?.streamer?.latestStreamPublicationId}
            profileId={data?.id}
          />
        </div>
      )}
    </div>
  )
}

export default memo(ProfilePage)
