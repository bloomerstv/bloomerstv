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
  profilesFromPublicReplays: Profile[]
  setProfilesFromPublicReplays: (profilesFromPublicReplays: Profile[]) => void
  resetStreamersWithProfiles: () => void
  resetProfilesFromPublicReplays: () => void
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
    profilesFromPublicReplays: [],
    setProfilesFromPublicReplays: (profilesFromPublicReplays) =>
      set(() => ({ profilesFromPublicReplays })),
    resetProfilesFromPublicReplays: () =>
      set(() => ({ profilesFromPublicReplays: [] })),
    loading: true,
    setLoading: (loading) => set(() => ({ loading }))
  })
)
