import React from 'react'
import { useStreamersWithProfiles } from '../../store/useStreamersWithProfiles'
import StreamCard from './StreamCard'
import LoadingVideoCard from '../../ui/LoadingVideoCard'

const LiveStreamerFeed = () => {
  const streamersWithProfiles = useStreamersWithProfiles(
    (state) => state.streamersWithProfiles
  )
  const loading = useStreamersWithProfiles((state) => state.loading)
  return (
    <div className="sm:m-8 my-4">
      <div className="text-p-text font-bold text-2xl py-2 px-2 mb-2 sm:mb-4">
        Live Channels
      </div>

      {streamersWithProfiles?.length > 0 ? (
        <div className="flex flex-wrap sm:gap-x-4 gap-y-6 sm:gap-y-12">
          {streamersWithProfiles?.map((streamer) => {
            return <StreamCard key={streamer?.profileId} streamer={streamer} />
          })}
        </div>
      ) : (
        <>
          {loading ? (
            <>
              <LoadingVideoCard />
            </>
          ) : (
            <div className="text-s-text font-bold text-xl px-2 mb-4 sm:mb-8">
              No one is live right now
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default LiveStreamerFeed
