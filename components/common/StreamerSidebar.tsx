import React from 'react'
import { useStreamersWithProfiles } from '../store/useStreamersWithProfiles'
import { useProfiles } from '@lens-protocol/react-web'
import { useLiveStreamersQuery } from '../../graphql/generated'
import StreamerBar from './StreamerSidebar/StreamerBar'

const StreamerSidebar = () => {
  const { data } = useLiveStreamersQuery()
  const setStreamersWithProfiles = useStreamersWithProfiles(
    (state) => state.setStreamersWithProfiles
  )

  const { data: profiles } = useProfiles({
    where: {
      // @ts-ignore
      profileIds: data?.liveStreamers?.map((streamer) => streamer?.profileId)
    }
  })

  const streamers = data?.liveStreamers?.map((streamer) => {
    return {
      ...streamer,
      profile: profiles?.find((profile) => profile?.id === streamer?.profileId)
    }
  })

  React.useEffect(() => {
    // @ts-ignore
    setStreamersWithProfiles(streamers)
  }, [streamers])

  const followingStreamers = streamers?.filter((streamer) => {
    return streamer?.profile?.operations?.isFollowedByMe?.value
  })

  const restOfTheStreamers = streamers?.filter((streamer) => {
    return !streamer?.profile?.operations?.isFollowedByMe?.value
  })
  return (
    <div className="w-1/6 min-w-[250px] h-full bg-s-bg py-6">
      <div className="flex flex-col w-full">
        <>
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
              No one from your following list is live right now
            </div>
          )}
        </>
        {Boolean(restOfTheStreamers?.length) && (
          <>
            <div className="font-bold px-4 py-2">Recommended Channels</div>
            <div className="flex flex-col w-full">
              {restOfTheStreamers?.map((streamer) => {
                return (
                  // @ts-ignore
                  <StreamerBar key={streamer?.profileId} streamer={streamer} />
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default StreamerSidebar
