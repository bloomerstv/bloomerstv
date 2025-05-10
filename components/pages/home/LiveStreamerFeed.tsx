import React from 'react'
import StreamCard from './StreamCard'
import LoadingVideoCard from '../../ui/LoadingVideoCard'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import { useStreamersWithAccounts } from '../../store/useStreamersWithAccounts'

const LiveStreamerFeed = () => {
  const { streamerWithAccounts, loading } = useStreamersWithAccounts(
    (state) => ({
      streamerWithAccounts: state.streamersWithAccounts,
      loading: state.loading
    })
  )
  const isMobile = useIsMobile()

  if (!loading && streamerWithAccounts && streamerWithAccounts?.length === 0)
    return <div className="-mb-4" />

  return (
    <div className="w-full">
      {!isMobile && (
        <div className="text-p-text font-bold text-2xl py-2 px-2 mb-2 sm:mb-4">
          Live Now
        </div>
      )}

      {streamerWithAccounts?.length > 0 ? (
        <div className="flex flex-row flex-wrap w-full gap-y-4 sm:gap-y-8">
          {streamerWithAccounts?.map((streamer) => {
            return (
              <StreamCard key={streamer?.accountAddress} streamer={streamer} />
            )
          })}
        </div>
      ) : (
        <>
          {loading ? (
            <>
              <LoadingVideoCard className="2xl:w-1/3" />
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
