import { create } from 'zustand'
import { StreamReplayPublicationsQuery } from '../../graphql/generated'
import { AnyPublication } from '@lens-protocol/react-web'

interface PublicationStore {
  streamReplayPublication?: StreamReplayPublicationsQuery
  publications?: AnyPublication[]
  setPublications: (publications: AnyPublication[]) => void
  setStreamReplayPublication: (
    streamReplayPublication?: StreamReplayPublicationsQuery
  ) => void
}

export const usePublicationsStore = create<PublicationStore>((set) => ({
  streamReplayPublication: undefined,
  publications: undefined,
  setPublications: (publications) => set(() => ({ publications })),
  setStreamReplayPublication: (streamReplayPublication) =>
    set(() => ({ streamReplayPublication }))
}))
