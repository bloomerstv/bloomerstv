import React from 'react'
import { useLiveStreamersQuery } from '../../graphql/generated'
import {
  StreamerWithAccount,
  useStreamersWithAccounts
} from '../../components/store/useStreamersWithAccounts'
import { useAccountsBulk } from '@lens-protocol/react'

const useLiveStreamerProfiles = () => {
  const { data, loading: streamersLoading } = useLiveStreamersQuery()
  const { setStreamersWithAccounts, setLoading } = useStreamersWithAccounts(
    (state) => ({
      setStreamersWithAccounts: state.setStreamersWithAccounts,
      setLoading: state.setLoading
    })
  )

  // Memoize the addresses array to prevent unnecessary re-renders
  const addresses = React.useMemo(() => {
    return (
      data?.liveStreamers?.map((streamer) => streamer?.accountAddress) || []
    )
  }, [data?.liveStreamers])

  // Skip the query if there are no addresses
  const { data: accounts, loading: accountsLoading } = useAccountsBulk({
    addresses
  })

  // Memoize the streamers array
  const streamers = React.useMemo(() => {
    if (!data?.liveStreamers || !accounts) return []

    return data.liveStreamers.map((streamer) => {
      return {
        ...streamer,
        account: accounts.find(
          (account) => account?.address === streamer?.accountAddress
        )
      }
    })
  }, [data?.liveStreamers, accounts])

  // Update the store only when streamers change
  React.useEffect(() => {
    if (streamers && streamers.length > 0) {
      const validStreamers = streamers.filter(
        (streamer): streamer is StreamerWithAccount =>
          streamer.account !== undefined
      )
      setStreamersWithAccounts(validStreamers)
    }
  }, [streamers, setStreamersWithAccounts])

  // Update loading state
  React.useEffect(() => {
    setLoading(streamersLoading || accountsLoading)
  }, [streamersLoading, accountsLoading, setLoading])

  // Return values in case they're needed elsewhere
  return {
    streamers,
    loading: streamersLoading || accountsLoading
  }
}

export default useLiveStreamerProfiles
