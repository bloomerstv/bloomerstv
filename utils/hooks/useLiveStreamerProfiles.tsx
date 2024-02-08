import React from 'react'
import { useLiveStreamersQuery } from '../../graphql/generated'
import { useStreamersWithProfiles } from '../../components/store/useStreamersWithProfiles'
import { useProfiles } from '@lens-protocol/react-web'

const useLiveStreamerProfiles = () => {
  const { data, loading: streamersLoading } = useLiveStreamersQuery()
  const setStreamersWithProfiles = useStreamersWithProfiles(
    (state) => state.setStreamersWithProfiles
  )

  const setLoading = useStreamersWithProfiles((state) => state.setLoading)

  const { data: profiles, loading: profilesLoading } = useProfiles({
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

  React.useEffect(() => {
    setLoading(streamersLoading || profilesLoading)
  }, [streamersLoading, profilesLoading])
}

export default useLiveStreamerProfiles
