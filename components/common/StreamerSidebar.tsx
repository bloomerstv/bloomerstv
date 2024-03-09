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
import { Profile, SessionType, useSession } from '@lens-protocol/react-web'
import { usePathname, useRouter } from 'next/navigation'
import clsx from 'clsx'
import HomeIcon from '@mui/icons-material/Home'
import { IconButton } from '@mui/material'
import XIcon from '@mui/icons-material/X'
import GitHubIcon from '@mui/icons-material/GitHub'
const StreamerSidebar = () => {
  const { data } = useSession()
  const pathname = usePathname()
  const { push } = useRouter()
  const streamersWithProfiles = useStreamersWithProfiles(
    (state) => state.streamersWithProfiles
  )

  const profilesFromPublicReplays = useStreamersWithProfiles(
    (state) => state.profilesFromPublicReplays
  )

  const followingStreamers = streamersWithProfiles?.filter((streamer) => {
    return streamer?.profile?.operations?.isFollowedByMe?.value
  })

  const restOfTheStreamers = streamersWithProfiles?.filter((streamer) => {
    return !streamer?.profile?.operations?.isFollowedByMe?.value
  })

  const getOfflineFollowingStreamers = useCallback((): Profile[] => {
    // get following profiles from public replays
    const followingProfiles = profilesFromPublicReplays?.filter((profile) => {
      return profile?.operations?.isFollowedByMe?.value
    })

    // show onlyy that are offline, check it from followingStreamers
    const offlineFollowingStreamers = followingProfiles?.filter((profile) => {
      return !streamersWithProfiles?.find(
        (streamer) => streamer?.profileId === profile?.id
      )
    })

    return offlineFollowingStreamers
  }, [profilesFromPublicReplays, followingStreamers])

  const getOfflineRecommendedStreamers = useCallback((): Profile[] => {
    // get following profiles from public replays
    const unFollowedProfiles = profilesFromPublicReplays?.filter((profile) => {
      return !profile?.operations?.isFollowedByMe?.value
    })

    // show onlyy that are offline, check it from followingStreamers
    const offlineRecommendedStreamers = unFollowedProfiles?.filter(
      (profile) => {
        return !streamersWithProfiles?.find(
          (streamer) => streamer?.profileId === profile?.id
        )
      }
    )

    return offlineRecommendedStreamers
  }, [profilesFromPublicReplays, restOfTheStreamers])

  const offlineFollowingStreamers = getOfflineFollowingStreamers()
  const offlineRecommendedStreamers = getOfflineRecommendedStreamers()

  const minimize = pathname !== '/'

  return (
    <div
      className={clsx(
        'h-full bg-s-bg overflow-auto no-scrollbar',
        !minimize ? 'min-w-[250px] w-1/6 py-6' : 'py-4'
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

                  {offlineFollowingStreamers?.map((profile) => {
                    return (
                      // @ts-ignore
                      <StreamerBar key={profile?.id} streamer={{ profile }} />
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

                {offlineRecommendedStreamers?.map((profile) => {
                  return (
                    // @ts-ignore
                    <StreamerBar key={profile?.id} streamer={{ profile }} />
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
