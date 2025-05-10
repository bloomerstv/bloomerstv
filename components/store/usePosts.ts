import { create } from 'zustand'
import { StreamReplayPostsQuery } from '../../graphql/generated'
import { AnyPost, Post } from '@lens-protocol/react'

interface PostStore {
  streamReplayPosts?: StreamReplayPostsQuery
  posts?: AnyPost[]
  setPosts: (posts: AnyPost[]) => void
  setStreamReplayPosts: (streamReplayPosts?: StreamReplayPostsQuery) => void
  clipPost?: Post | null
  setClipPost: (clipPost: Post | null) => void
}

export const usePostsStore = create<PostStore>((set) => ({
  streamReplayPosts: undefined,
  posts: undefined,
  clipPost: undefined,
  setClipPost: (clipPost) =>
    set(() => {
      return { clipPost }
    }),
  setPosts: (posts) => set(() => ({ posts })),
  setStreamReplayPosts: (streamReplayPosts) =>
    set(() => ({ streamReplayPosts }))
}))
