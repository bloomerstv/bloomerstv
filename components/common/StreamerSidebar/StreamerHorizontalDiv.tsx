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
  const streamersWithProfiles = useStreamersWithProfiles(
    (state) => state.streamersWithProfiles
  )
  const { data: offlineStreamers } = useOfflineStreamersQuery()
  const sortedOfflineStreamers = offlineStreamers?.offlineStreamers
    ? // eslint-disable-next-line no-unsafe-optional-chaining
      [...offlineStreamers?.offlineStreamers]?.sort(
        (a, b) => b?.lastSeen - a?.lastSeen
      )
    : []
  const { data: offlineProfiles } = useProfiles({
    where: {
      // @ts-ignore
      profileIds:
        sortedOfflineStreamers?.map((streamer) => streamer?.profileId) ?? []
    },
    limit: LimitType.Fifty
  })

  return (
    <div className="w-full p-4 no-scrollbar overflow-y-auto flex flex-row items-center gap-x-3">
      {streamersWithProfiles?.map((streamer) => {
        return (
          <SingleHorizontalStreamerDiv
            key={streamer?.profileId}
            profile={streamer?.profile}
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
          />
        )
      })}
    </div>
  )
}

export default StreamerHorizontalDiv
