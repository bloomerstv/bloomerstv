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
  Profile,
  SessionType,
  useProfiles,
  useSession
} from '@lens-protocol/react-web'
import { usePathname, useRouter } from 'next/navigation'
import clsx from 'clsx'
import HomeIcon from '@mui/icons-material/Home'
import { IconButton } from '@mui/material'
import XIcon from '@mui/icons-material/X'
import GitHubIcon from '@mui/icons-material/GitHub'
import { useTheme } from '../wrappers/TailwindThemeProvider'
import { useOfflineStreamersQuery } from '../../graphql/generated'
const StreamerSidebar = () => {
  const { data } = useSession()
  const pathname = usePathname()
  const { push } = useRouter()
  const { theme } = useTheme()
  const streamersWithProfiles = useStreamersWithProfiles(
    (state) => state.streamersWithProfiles
  )

  const { data: offlineStreamers } = useOfflineStreamersQuery()
  const { data: offlineProfiles } = useProfiles({
    where: {
      // @ts-ignore
      profileIds: offlineStreamers?.offlineStreamers?.map(
        (streamer) => streamer?.profileId
      )
    }
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

  const getOfflineProfileLastSeen = useCallback(
    (profileId: string) => {
      return offlineStreamers?.offlineStreamers?.find(
        (streamer) => streamer?.profileId === profileId
      )?.lastSeen
    },
    [offlineStreamers]
  )

  const offlineFollowingStreamers = getOfflineFollowingStreamers()
  const offlineRecommendedStreamers = getOfflineRecommendedStreamers()

  const minimize = pathname !== '/'

  return (
    <div
      className={clsx(
        'h-full bg-s-bg overflow-auto no-scrollbar',
        !minimize ? 'min-w-[250px] w-1/6 py-4' : 'py-4'
      )}
    >
      <div className="flex flex-col w-full h-full justify-between">
        <div className="flex flex-col w-full h-full overflow-y-auto no-scrollbar">
          {minimize && (
            <IconButton
              sx={{
                borderRadius: '0px'
              }}
              onClick={() => {
                push('/')
              }}
              className="rounded-[0px]"
            >
              <HomeIcon fontSize="large" />
            </IconButton>
          )}
          {data?.type === SessionType.WithProfile && (
            <>
              {!minimize && (
                <div className="font-bold px-4 py-2">Following Channels</div>
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
                          lastSeen: getOfflineProfileLastSeen(profile?.id)
                        }}
                      />
                    )
                  })}
                </div>
              ) : (
                <>
                  {!minimize && (
                    <div className="px-4 py-2 text-sm text-s-text font-semibold">
                      No one from your followings has gone live yet.
                    </div>
                  )}
                </>
              )}
            </>
          )}

          <>
            {!minimize && (
              <div className="font-bold px-4 py-2">Recommended Channels</div>
            )}
            {Boolean(restOfTheStreamers?.length) ||
            Boolean(offlineRecommendedStreamers?.length) ? (
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
                        lastSeen: getOfflineProfileLastSeen(profile?.id)
                      }}
                    />
                  )
                })}
              </div>
            ) : (
              <>
                {!minimize && (
                  <div className="px-4 py-2 text-sm text-s-text font-semibold">
                    No more recommended channels.
                  </div>
                )}
              </>
            )}
          </>
        </div>

        {minimize ? (
          <div className="flex flex-col w-full">
            <IconButton
              LinkComponent={Link}
              href={X_URL}
              target="_blank"
              sx={{
                borderRadius: '0px'
              }}
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
      </div>
    </div>
  )
}

export default StreamerSidebar
