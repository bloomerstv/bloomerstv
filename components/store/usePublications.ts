import { create } from 'zustand'
import { StreamReplayPublicationsQuery } from '../../graphql/generated'
import { AnyPublication, Post } from '@lens-protocol/react-web'

interface PublicationStore {
  streamReplayPublication?: StreamReplayPublicationsQuery
  publications?: AnyPublication[]
  setPublications: (publications: AnyPublication[]) => void
  setStreamReplayPublication: (
    streamReplayPublication?: StreamReplayPublicationsQuery
  ) => void
  clipPost?: Post | null
  setClipPost: (clipPost: Post | null) => void
}

export const usePublicationsStore = create<PublicationStore>((set) => ({
  streamReplayPublication: undefined,
  publications: undefined,
  clipPost: undefined,
  setClipPost: (clipPost) =>
    set(() => {
      return { clipPost }
    }),
  setPublications: (publications) => set(() => ({ publications })),
  setStreamReplayPublication: (streamReplayPublication) =>
    set(() => ({ streamReplayPublication }))
}))
