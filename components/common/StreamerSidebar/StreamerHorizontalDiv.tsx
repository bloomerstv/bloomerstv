'use client'
import React from 'react'
import { useStreamersWithProfiles } from '../../store/useStreamersWithProfiles'
import { useOfflineStreamersQuery } from '../../../graphql/generated'
import {
  LimitType,
  SessionType,
  useProfiles,
  useSession
} from '@lens-protocol/react-web'
import SingleHorizontalStreamerDiv from './SingleHorizontalStreamerDiv'

const StreamerHorizontalDiv = () => {
  const { data } = useSession()
  const { streamersWithProfiles, loading: streamersLoading } =
    useStreamersWithProfiles((state) => ({
      streamersWithProfiles: state.streamersWithProfiles,
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
  const { data: offlineProfiles, loading: offlineProfilesLoading } =
    useProfiles({
      where: {
        // @ts-ignore
        profileIds:
          sortedOfflineStreamers?.map((streamer) => streamer?.profileId) ?? []
      },
      limit: LimitType.Fifty
    })

  const getOfflineVerified = (profileId: string) => {
    return sortedOfflineStreamers?.find(
      (streamer) => streamer?.profileId === profileId
    )?.premium
  }

  const loading =
    streamersLoading || offlineStreamersLoading || offlineProfilesLoading

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

      {streamersWithProfiles?.map((streamer) => {
        return (
          <SingleHorizontalStreamerDiv
            key={streamer?.profileId}
            profile={streamer?.profile}
            premium={streamer?.premium ?? false}
            live={true}
          />
        )
      })}

      {offlineProfiles?.map((profile) => {
        if (
          data?.type === SessionType.WithProfile &&
          profile?.id === data?.profile?.id
        )
          return null
        return (
          <SingleHorizontalStreamerDiv
            key={profile?.id}
            profile={profile}
            live={false}
            premium={getOfflineVerified(profile?.id) ?? false}
          />
        )
      })}
    </div>
  )
}

export default StreamerHorizontalDiv
