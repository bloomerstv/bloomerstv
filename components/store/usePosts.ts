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
    set((state) => {
      // Only update if streamReplayPosts has actually changed
      // Use simple comparison of postIds to check for changes
      const currentPostIds =
        state.streamReplayPosts?.streamReplayPosts?.streamReplayPosts
          ?.map((p) => p?.postId)
          .filter(Boolean) || []
      const newPostIds =
        streamReplayPosts?.streamReplayPosts?.streamReplayPosts
          ?.map((p) => p?.postId)
          .filter(Boolean) || []

      const hasChanged =
        currentPostIds.length !== newPostIds.length ||
        !currentPostIds.every((id, index) => id === newPostIds[index])

      return hasChanged ? { streamReplayPosts } : state
    }),
  clipPost: null,
  setClipPost: (clipPost) =>
    set((state) => {
      // Only update if clipPost has actually changed
      const hasChanged = state.clipPost?.id !== clipPost?.id

      return hasChanged ? { clipPost } : state
    })
}))
