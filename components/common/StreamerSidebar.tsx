import React from 'react'
import { useStreamersWithProfiles } from '../store/useStreamersWithProfiles'
import StreamerBar from './StreamerSidebar/StreamerBar'
import Link from 'next/link'
import {
  DISCORD_INVITE_URL,
  FEEDBACK_URL,
  GITHUB_URL,
  HEY_URL
} from '../../utils/config'

const StreamerSidebar = () => {
  const streamersWithProfiles = useStreamersWithProfiles(
    (state) => state.streamersWithProfiles
  )

  const followingStreamers = streamersWithProfiles?.filter((streamer) => {
    return streamer?.profile?.operations?.isFollowedByMe?.value
  })

  const restOfTheStreamers = streamersWithProfiles?.filter((streamer) => {
    return !streamer?.profile?.operations?.isFollowedByMe?.value
  })
  return (
    <div className="w-1/6 min-w-[250px] h-full bg-s-bg py-6 overflow-auto">
      <div className="flex flex-col w-full h-full justify-between">
        <div className="flex flex-col w-full h-full overflow-y-auto">
          <div className="font-bold px-4 py-2">Following Channels</div>
          {followingStreamers?.length ? (
            <div className="flex flex-col w-full">
              {followingStreamers?.map((streamer) => {
                return (
                  // @ts-ignore
                  <StreamerBar key={streamer?.profileId} streamer={streamer} />
                )
              })}
            </div>
          ) : (
            <div className="px-4 py-2 text-sm text-s-text font-semibold">
              No one from your followings is live right now
            </div>
          )}

          {Boolean(restOfTheStreamers?.length) && (
            <>
              <div className="font-bold px-4 py-2">Recommended Channels</div>
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
              </div>
            </>
          )}
        </div>
        <div className="start-row flex-wrap gap-2 px-4 text-sm font-semibold">
          <Link
            href={HEY_URL}
            className="no-underline text-s-text hover:text-p-text"
            target="_blank"
          >
            Hey
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
            href={DISCORD_INVITE_URL}
            className="no-underline text-s-text hover:text-p-text"
            target="_blank"
          >
            Discord
          </Link>
        </div>
      </div>
    </div>
  )
}

export default StreamerSidebar
