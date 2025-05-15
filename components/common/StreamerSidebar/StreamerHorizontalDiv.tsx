'use client'
import React from 'react'
import { useStreamersWithAccounts } from '../../store/useStreamersWithAccounts'
import { useOfflineStreamersQuery } from '../../../graphql/generated'

import SingleHorizontalStreamerDiv from './SingleHorizontalStreamerDiv'
import useSession from '../../../utils/hooks/useSession'
import { useAccountsBulk } from '@lens-protocol/react'

const StreamerHorizontalDiv = () => {
  const { isAuthenticated, authenticatedUser } = useSession()

  const { streamersWithAccounts, loading: streamersLoading } =
    useStreamersWithAccounts((state) => ({
      streamersWithAccounts: state.streamersWithAccounts,
      loading: state.loading
    }))
  const { data: offlineStreamers, loading: offlineStreamersLoading } =
    useOfflineStreamersQuery()
  const sortedOfflineStreamers = offlineStreamers?.offlineStreamers
    ? // eslint-disable-next-line no-unsafe-optional-chaining
      [...offlineStreamers?.offlineStreamers]?.sort(
        (a, b) => b?.lastSeen - a?.lastSeen
      )
    : []

  const { data: offlineAccounts, loading: offlineAccountsLoading } =
    useAccountsBulk({
      addresses:
        sortedOfflineStreamers
          ?.map((streamer) => streamer?.accountAddress)
          ?.slice(0, 50) ?? []
    })

  const getOfflineVerified = (accountAddress: string) => {
    return sortedOfflineStreamers?.find(
      (streamer) => streamer?.accountAddress === accountAddress
    )?.premium
  }

  const loading =
    streamersLoading || offlineStreamersLoading || offlineAccountsLoading

  return (
    <div className="w-full p-4 no-scrollbar overflow-y-auto flex flex-row items-center gap-x-3">
      {loading &&
        Array(5)
          .fill(null)
          .map((_, i) => (
            // loader for single horizontal streamer div
            <div key={i} className="centered-col gap-y-1">
              <div className="w-14 h-14 rounded-full bg-p-hover animate-pulse" />
              <div className="w-20 h-2 rounded-md bg-p-hover animate-pulse" />
            </div>
          ))}

      {streamersWithAccounts?.map((streamer) => {
        return (
          <SingleHorizontalStreamerDiv
            key={streamer?.accountAddress}
            account={streamer?.account}
            premium={streamer?.premium ?? false}
            live={true}
          />
        )
      })}

      {offlineAccounts?.map((account) => {
        if (isAuthenticated && account?.address === authenticatedUser?.address)
          return null
        return (
          <SingleHorizontalStreamerDiv
            key={account?.address}
            account={account}
            live={false}
            premium={getOfflineVerified(account?.address) ?? false}
          />
        )
      })}
    </div>
  )
}

export default StreamerHorizontalDiv
