import { create } from 'zustand'
import { Streamer } from '../../graphql/generated'
import { Profile } from '@lens-protocol/react-web'

export interface StreamerWithProfile extends Streamer {
  profile: Profile
}

interface StreamerWithProfileStore {
  streamersWithProfiles: StreamerWithProfile[]
  setStreamersWithProfiles: (
    streamersWithProfiles: StreamerWithProfile[]
  ) => void
  resetStreamersWithProfiles: () => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

export const useStreamersWithProfiles = create<StreamerWithProfileStore>(
  (set) => ({
    streamersWithProfiles: [],
    setStreamersWithProfiles: (streamersWithProfiles) =>
      set(() => ({ streamersWithProfiles })),
    resetStreamersWithProfiles: () =>
      set(() => ({ streamersWithProfiles: [] })),
    loading: true,
    setLoading: (loading) => set(() => ({ loading }))
  })
)
