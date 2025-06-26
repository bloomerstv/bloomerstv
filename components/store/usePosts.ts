import { create } from 'zustand'
import { AnyPost } from '@lens-protocol/react'
import { StreamReplayPostsQuery } from '../../graphql/generated'

interface PostsStore {
  posts: AnyPost[]
  setPosts: (posts: AnyPost[]) => void
  streamReplayPosts: StreamReplayPostsQuery | null
  setStreamReplayPosts: (
    streamReplayPosts: StreamReplayPostsQuery | null
  ) => void
}

export const usePostsStore = create<PostsStore>((set) => ({
  posts: [],
  streamReplayPosts: null,
  setPosts: (posts) =>
    set((state) => {
      // Check if posts have changed by comparing length and post IDs
      const hasChanged =
        state.posts.length !== posts.length ||
        !state.posts.every((post, index) => post.id === posts[index]?.id)

      return hasChanged ? { posts } : state
    }),
  setStreamReplayPosts: (streamReplayPosts) =>
    set(() => ({ streamReplayPosts }))
}))
