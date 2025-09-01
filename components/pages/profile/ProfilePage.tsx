'use client'

import React, { memo } from 'react'
import LiveChat from '../../common/LiveChat/LiveChat'
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
import AboutProfile from './AboutProfile'
import formatHandle from '../../../utils/lib/formatHandle'
import PostClipOnLens from './PostClipOnLens'
import ClipsFeed from '../home/ClipsFeed'
import toast from 'react-hot-toast'
import { timeAgo } from '../../../utils/helpers'
import Markup from '../../common/Lexical/Markup'
import Player from '../../common/Player/Player'
import { getLiveStreamUrl } from '../../../utils/lib/getLiveStreamUrl'
import {
  PlayerStreamingMode,
  useMyPreferences
} from '../../store/useMyPreferences'
import { Src } from '@livepeer/react'
import HorizontalNavigation from '../../ui/HorizontalNavigation'
import ZoraFeaturedCoin from './zora-featured-coin'
import { useAccount } from '@lens-protocol/react'
import useSession from '../../../utils/hooks/useSession'
import { AccountsStreamsFeed } from './AccountsStreamsFeed'

const ProfilePage = ({ handle }: { handle: string }) => {
  const [clipUrl, setClipUrl] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(false)
  const playerStreamingMode = useMyPreferences(
    (state) => state.playerStreamingMode
  )

  const isMobile = useIsMobile()

  const {
    data: account,
    error,
    loading: accountLoading
  } = useAccount({
    username: {
      localName: handle.split('/')?.[1]
    }
  })

  const [createClip] = useCreateClipMutation()
  const { account: sessionAccount, isLensAuthenticated } = useSession()

  const {
    data: streamer,
    refetch,
    loading: streamerLoading
  } = useStreamerQuery({
    variables: {
      accountAddress: account?.address
    },
    skip: !account?.address
  })

  const { data: replayRecording } = useStreamReplayRecordingQuery({
    variables: {
      accountAddress: account?.address
    },
    skip: !account?.address || Boolean(streamer?.streamer?.isActive)
  })

  const hasPlaybackId = Boolean(streamer?.streamer?.playbackId)

  if (error) {
    toast.error(error)
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
            name: `Clip from ${formatHandle(account)}'s stream`
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
            streamReplayRecording={replayRecording?.streamReplayRecording!}
            account={account!}
            // @ts-ignore
            streamer={streamer?.streamer}
          />
        }
        clipLength={isLensAuthenticated ? 30 : undefined}
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
    sessionAccount?.address,
    replayRecording?.streamReplayRecording?.recordingUrl,
    playerStreamingMode
  ])

  if (accountLoading || (streamerLoading && !streamer?.streamer)) {
    return <StartLoadingPage />
  }

  if (!account) {
    return <div>Profile not found</div>
  }

  const navItems = [
    {
      name: `About`,
      component: 'AboutProfile',
      render: () => (
        <div className="pb-[80vh]">
          <AboutProfile account={account} />{' '}
        </div>
      )
    },
    {
      name: 'Clips',
      component: 'ClipsFeed',
      render: () => (
        <div className="pb-[80vh]">
          <ClipsFeed handle={formatHandle(account)} />
        </div>
      )
    },
    {
      name: 'Streams',
      component: 'LiveStreamPublicReplays',
      render: () => (
        <div className="pb-[80vh]">
          <AccountsStreamsFeed accountAddress={account?.address} />
        </div>
      )
    }
  ]

  return (
    <div className="flex flex-row h-full w-full">
      {clipUrl && account && isLensAuthenticated && (
        <PostClipOnLens
          open={open}
          setOpen={setOpen}
          url={clipUrl}
          account={account}
          sessionId={streamer?.streamer?.latestSessionId}
        />
      )}
      <div className="w-full flex-grow overflow-auto no-scrollbar h-full">
        {hasPlaybackId ? (
          <div className="w-full">{videoComponent}</div>
        ) : (
          <div className="h-[230px] sm:h-[700px] w-full">
            <StreamerOffline
              streamReplayRecording={replayRecording?.streamReplayRecording!}
              account={account!}
              // @ts-ignore
              streamer={streamer?.streamer!}
            />
          </div>
        )}

        <ProfileInfoWithStream
          account={account}
          // @ts-ignore
          streamer={streamer?.streamer}
        />

        {isMobile && streamer?.streamer?.featuredCoin?.coinAddress && (
          <div className="m-2">
            {' '}
            <ZoraFeaturedCoin
              coinAddress={streamer?.streamer?.featuredCoin?.coinAddress}
            />{' '}
          </div>
        )}

        {(streamer?.streamer?.latestSessionCreatedAt ||
          streamer?.streamer?.streamDescription) && (
          <div className="sm:mx-8 sm:mt-6 sm:mb-0 text-p-text font-semibold sm:text-base text-sm sm:p-6 m-2 p-3 gap-y-1 start-col  rounded-xl shadow-sm bg-p-hover lg:bg-s-bg">
            {/* // todo add total views count here */}
            {streamer?.streamer?.latestSessionCreatedAt && (
              <div className="">
                {`${
                  streamer?.streamer?.isActive
                    ? 'Started streaming '
                    : 'Streamed '
                } ${
                  streamer?.streamer?.isActive
                    ? timeAgo(streamer?.streamer?.latestSessionCreatedAt)
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

        <div className="sm:mx-8 sm:my-6">
          <HorizontalNavigation
            navClassName="mx-2 sm:mx-0"
            navItems={navItems}
          />
        </div>
      </div>

      {account?.address && !isMobile && (
        <div className="w-[310px] relative 2xl:w-[350px] flex-none h-full">
          {streamer?.streamer?.featuredCoin?.coinAddress && (
            <div className="absolute w-[310px] 2xl:w-[350px] top-14 p-2 left-0 to-transparent z-50">
              <ZoraFeaturedCoin
                coinAddress={streamer?.streamer?.featuredCoin?.coinAddress}
              />
            </div>
          )}
          <LiveChat accountAddress={account?.address} />
        </div>
      )}
    </div>
  )
}

export default memo(ProfilePage)
