import { create } from 'zustand'
import { AnyPost, Post } from '@lens-protocol/react'
import { StreamReplayPostsQuery } from '../../graphql/generated'

interface PostsStore {
  posts: AnyPost[]
  setPosts: (posts: AnyPost[]) => void
  streamReplayPosts: StreamReplayPostsQuery | null
  setStreamReplayPosts: (
    streamReplayPosts: StreamReplayPostsQuery | null
  ) => void
  clipPost?: Post | null
  setClipPost: (clipPost: Post | null) => void
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
    set(() => ({ streamReplayPosts })),
  clipPost: null,
  setClipPost: (clipPost) =>
    set((state) => {
      // Only update if clipPost has actually changed
      const hasChanged = state.clipPost?.id !== clipPost?.id

      return hasChanged ? { clipPost } : state
    })
}))
