'use client'
import React, { useCallback } from 'react'
import { useStreamersWithProfiles } from '../store/useStreamersWithProfiles'
import StreamerBar from './StreamerSidebar/StreamerBar'
import Link from 'next/link'
import {
  DISCORD_INVITE_URL,
  FEEDBACK_URL,
  GITHUB_URL,
  HEY_URL,
  REPORT_URL,
  X_URL
} from '../../utils/config'
import {
  LimitType,
  Profile,
  SessionType,
  useProfiles,
  useSession
} from '@lens-protocol/react-web'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { IconButton } from '@mui/material'
import XIcon from '@mui/icons-material/X'
import GitHubIcon from '@mui/icons-material/GitHub'
import { useTheme } from '../wrappers/TailwindThemeProvider'
import {
  useIsVerifiedQuery,
  useOfflineStreamersQuery
} from '../../graphql/generated'
import useIsMobile from '../../utils/hooks/useIsMobile'
import StreamerBarLoading from './StreamerSidebar/StreamerBarLoading'
import SubscribeToSuperBloomers from './SubscribeToSuperBloomers'

const StreamerSidebar = () => {
  const { data } = useSession()
  const pathname = usePathname()
  const { theme } = useTheme()
  const isMobile = useIsMobile()
  const streamersWithProfiles = useStreamersWithProfiles(
    (state) => state.streamersWithProfiles
  )

  const { data: offlineStreamers, loading } = useOfflineStreamersQuery()

  const { data: isVerified } = useIsVerifiedQuery({
    variables: {
      // @ts-ignore
      profileIds: [data?.profile?.id]
    },
    // @ts-ignore
    skip: !data?.profile?.id
  })

  // Assuming offlineStreamers is already fetched and available
  const sortedOfflineStreamers = React.useMemo(() => {
    if (!offlineStreamers?.offlineStreamers) return []
    const now = new Date()

    // Separate streamers based on nextStreamTime criteria
    const withNextStream =
      offlineStreamers?.offlineStreamers.filter(
        (streamer) =>
          streamer?.nextStreamTime && new Date(streamer.nextStreamTime) > now
      ) || []
    const others =
      offlineStreamers?.offlineStreamers.filter(
        (streamer) =>
          !streamer?.nextStreamTime || new Date(streamer.nextStreamTime) <= now
      ) || []

    // Sort each group
    const sortedWithNextStream = withNextStream.sort(
      (a, b) =>
        new Date(b?.nextStreamTime).getTime() -
        new Date(a?.nextStreamTime).getTime()
    )
    const sortedOthers = others.sort(
      (a, b) =>
        new Date(b?.lastSeen).getTime() - new Date(a?.lastSeen).getTime()
    )

    // Concatenate the sorted groups
    return [...sortedWithNextStream, ...sortedOthers]
  }, [offlineStreamers?.offlineStreamers])

  const offlineStreamersMap = React.useMemo(() => {
    if (!sortedOfflineStreamers) return new Map()
    const map = new Map()
    sortedOfflineStreamers?.forEach((streamer) => {
      if (!streamer) return

      if (map.get(streamer.profileId)) return

      map.set(streamer.profileId, {
        lastSeen: streamer?.lastSeen,
        premium: streamer?.premium,
        nextStreamTime: streamer?.nextStreamTime
      })
    })
    return map
  }, [sortedOfflineStreamers])
  const { data: offlineProfiles, loading: profileLoading } = useProfiles({
    where: {
      // @ts-ignore
      profileIds:
        sortedOfflineStreamers?.map((streamer) => streamer?.profileId) ?? []
    },
    limit: LimitType.Fifty
  })

  const followingStreamers = streamersWithProfiles?.filter((streamer) => {
    return streamer?.profile?.operations?.isFollowedByMe?.value
  })

  const restOfTheStreamers = streamersWithProfiles?.filter((streamer) => {
    return !streamer?.profile?.operations?.isFollowedByMe?.value
  })

  const getOfflineFollowingStreamers = useCallback((): Profile[] => {
    // get following profiles from public replays
    const offlineFollowingStreamers = offlineProfiles?.filter((profile) => {
      return (
        profile?.operations?.isFollowedByMe?.value &&
        // @ts-ignore
        (!data?.profile || profile?.id !== data?.profile?.id)
      )
    })

    return offlineFollowingStreamers || []
  }, [offlineProfiles])

  const getOfflineRecommendedStreamers = useCallback((): Profile[] => {
    // get following profiles from public replays
    const offlineRecommendedStreamers = offlineProfiles?.filter((profile) => {
      return (
        !profile?.operations?.isFollowedByMe?.value &&
        // @ts-ignore
        (!data?.profile || profile?.id !== data?.profile?.id)
      )
    })

    return offlineRecommendedStreamers || []
  }, [offlineProfiles])

  const offlineFollowingStreamers = getOfflineFollowingStreamers()
  const offlineRecommendedStreamers = getOfflineRecommendedStreamers()

  const minimize = !isMobile && pathname !== '/'

  return (
    <div
      className={clsx(
        'h-full bg-s-bg overflow-auto no-scrollbar',
        !minimize ? 'sm:min-w-[250px] sm:max-w-[300px] sm:py-2 pb-4' : 'py-2',
        isMobile && 'px-1'
      )}
    >
      <div className="flex flex-col w-full h-full justify-between">
        <div className="flex flex-col w-full h-full overflow-y-auto no-scrollbar">
          {minimize && !isMobile && (
            <div className="px-2 2xl:px-2.5">
              <div className="w-10 h-0.5" />
            </div>
          )}
          {data?.type === SessionType.WithProfile && (
            <>
              {!minimize && (
                <div className="font-bold px-4 sm:py-2">Following Channels</div>
              )}
              {(loading || profileLoading) && (
                <div className="flex flex-col w-full">
                  <StreamerBarLoading />
                  <StreamerBarLoading />
                  <StreamerBarLoading />
                  <StreamerBarLoading />
                  <StreamerBarLoading />
                  <StreamerBarLoading />
                </div>
              )}
              {Boolean(followingStreamers?.length) ||
              Boolean(offlineFollowingStreamers?.length) ? (
                <div className="flex flex-col w-full">
                  {followingStreamers?.map((streamer) => {
                    return (
                      // @ts-ignore
                      <StreamerBar
                        key={streamer?.profileId}
                        streamer={streamer}
                      />
                    )
                  })}

                  {offlineFollowingStreamers?.slice(0, 10)?.map((profile) => {
                    return (
                      // @ts-ignore
                      <StreamerBar
                        key={profile?.id}
                        streamer={{
                          profile,
                          profileId: profile?.id,
                          lastSeen: offlineStreamersMap.get(profile?.id)
                            ?.lastSeen,
                          nextStreamTime: offlineStreamersMap.get(profile?.id)
                            ?.nextStreamTime,
                          premium:
                            offlineStreamersMap.get(profile?.id)?.premium ??
                            false
                        }}
                      />
                    )
                  })}
                </div>
              ) : (
                <>
                  {!minimize && !(loading || profileLoading) && (
                    <div className="px-4 py-2 text-sm text-s-text font-semibold">
                      No one from your followings has been streaming recently.
                    </div>
                  )}
                </>
              )}
            </>
          )}

          <>
            {!minimize &&
              (loading ||
                profileLoading ||
                restOfTheStreamers.length > 0 ||
                offlineRecommendedStreamers.length > 0) && (
                <div className="font-bold px-4 py-2">Recommended Channels</div>
              )}
            {(loading || profileLoading) && (
              <div className="flex flex-col w-full">
                <StreamerBarLoading />
                <StreamerBarLoading />
                <StreamerBarLoading />
              </div>
            )}
            {(Boolean(restOfTheStreamers?.length) ||
              Boolean(offlineRecommendedStreamers?.length)) && (
              <div className="flex flex-col w-full">
                {restOfTheStreamers?.map((streamer) => {
                  return (
                    // @ts-ignore
                    <StreamerBar
                      key={streamer?.profileId}
                      streamer={streamer}
                    />
                  )
                })}

                {offlineRecommendedStreamers?.slice(0, 10)?.map((profile) => {
                  return (
                    // @ts-ignore
                    <StreamerBar
                      key={profile?.id}
                      streamer={{
                        profile,
                        profileId: profile?.id,
                        lastSeen: offlineStreamersMap.get(profile?.id)
                          ?.lastSeen,
                        premium:
                          offlineStreamersMap.get(profile?.id)?.premium ??
                          false,
                        nextStreamTime: offlineStreamersMap.get(profile?.id)
                          ?.nextStreamTime
                      }}
                    />
                  )
                })}
              </div>
            )}
          </>
        </div>

        {/* subscribe to super bloomers */}

        {!isVerified?.isVerified?.[0]?.isVerified && (
          <SubscribeToSuperBloomers />
        )}

        {!isMobile && (
          <>
            {minimize ? (
              <div className="flex flex-col w-full ">
                <IconButton
                  sx={{
                    borderRadius: '0px'
                  }}
                  LinkComponent={Link}
                  href={X_URL}
                  target="_blank"
                >
                  <XIcon fontSize="medium" />
                </IconButton>
                <IconButton
                  LinkComponent={Link}
                  href={GITHUB_URL}
                  target="_blank"
                  sx={{
                    borderRadius: '0px'
                  }}
                >
                  <GitHubIcon fontSize="medium" />
                </IconButton>
                <IconButton
                  LinkComponent={Link}
                  href={DISCORD_INVITE_URL}
                  target="_blank"
                  sx={{
                    borderRadius: '0px'
                  }}
                >
                  <img
                    src={
                      theme === 'light'
                        ? '/icons/discord-icon.svg'
                        : '/icons/discord-icon-dark.svg'
                    }
                    alt="discord"
                    className="w-6 h-6"
                  />
                </IconButton>
              </div>
            ) : (
              <div className="start-row flex-wrap gap-y-2 gap-x-3 px-4 text-sm font-semibold">
                <Link
                  href={HEY_URL}
                  className="no-underline text-s-text hover:text-p-text"
                  target="_blank"
                >
                  Hey
                </Link>
                <Link
                  href={X_URL}
                  className="no-underline text-s-text hover:text-p-text"
                  target="_blank"
                >
                  X
                </Link>
                <Link
                  href={GITHUB_URL}
                  className="no-underline text-s-text hover:text-p-text"
                  target="_blank"
                >
                  Github
                </Link>
                <Link
                  href={FEEDBACK_URL}
                  className="no-underline text-s-text hover:text-p-text"
                  target="_blank"
                >
                  Feedback
                </Link>
                <Link
                  href={REPORT_URL}
                  className="no-underline text-s-text hover:text-p-text"
                  target="_blank"
                >
                  Report
                </Link>

                <Link
                  href={DISCORD_INVITE_URL}
                  className="no-underline text-s-text hover:text-p-text"
                  target="_blank"
                >
                  Discord
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default StreamerSidebar
