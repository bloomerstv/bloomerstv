import React, { useCallback } from 'react'
import { APP_ADDRESS, hideAccountAddresses } from '../../../utils/config'
import clsx from 'clsx'
import RecommendedVideoCard from '../../common/RecommendedVideoCard'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import HomeVideoCard from '../../common/HomeVideoCard'
import RecommendedCardLayout from '../../common/RecommendedCardLayout'
import { usePathname } from 'next/navigation'
import {
  MainContentFocus,
  PageSize,
  Post,
  PostStats,
  PostType,
  usePosts
} from '@lens-protocol/react'
import { usePostsStore } from '../../store/usePosts'
import LoadingVideoCard from '../../ui/LoadingVideoCard'

const OtherVideosRecommendations = ({ className }: { className?: string }) => {
  const isMobile = useIsMobile()
  const pathname = usePathname()
  const { data, loading: postsLoading } = usePosts({
    filter: {
      postTypes: [PostType.Root, PostType.Quote],
      // metadata: {
      //   mainContentFocus: [MainContentFocus.Video, MainContentFocus.ShortVideo]
      // },
      apps: [APP_ADDRESS]
    }
  })

  const { posts, streamReplayPosts } = usePostsStore((state) => ({
    posts: state.posts,
    streamReplayPosts: state.streamReplayPosts
  }))

  const getStreamReplay = useCallback(
    (postId: string) => {
      const streamReplay =
        streamReplayPosts?.streamReplayPosts?.streamReplayPosts?.find(
          (p) => p?.postId === postId
        )
      return {
        thumbnail: streamReplay?.thumbnail,
        duration: streamReplay?.sourceSegmentsDuration
      }
    },
    [streamReplayPosts?.streamReplayPosts]
  )

  const filteredPostsClips = data?.items?.filter(
    (p) => p.__typename === 'Post' && p.metadata?.__typename === 'VideoMetadata'
  )

  // add type streamClips to data
  const streamClips =
    filteredPostsClips?.map((post) => {
      return {
        ...post,
        type: 'streamClips'
      }
    }) ?? []

  // add type streamReplays to posts
  const streamReplays =
    posts?.map((post) => {
      return {
        ...post,
        type: 'streamReplays'
      }
    }) ?? []

  const combinedData = [...streamClips, ...streamReplays].sort(
    (a, b) =>
      new Date(b?.timestamp).getTime() - new Date(a?.timestamp).getTime()
  )

  const currentPostId = pathname?.split('/')[2]

  const isLoading = postsLoading

  if (isLoading) {
    return (
      <div className={clsx('flex flex-col w-full h-full gap-y-4', className)}>
        {Array(5)
          .fill(null)
          .map((_, i) => (
            <LoadingVideoCard key={i} />
          ))}
      </div>
    )
  }

  return (
    <div className={clsx('flex flex-col w-full h-full gap-y-4', className)}>
      {combinedData?.map((post) => {
        if (
          hideAccountAddresses.includes(post?.author?.address) ||
          currentPostId === post?.id
        ) {
          return null
        }

        if (post?.type === 'streamClips') {
          return <RecommendedVideoCard key={post?.id} post={post as Post} />
        } else {
          if (isMobile) {
            return (
              <HomeVideoCard
                post={post as Post}
                cover={getStreamReplay(post?.id)?.thumbnail!}
                duration={getStreamReplay(post?.id)?.duration!}
                key={post?.id}
              />
            )
          } else {
            return (
              <RecommendedCardLayout
                createdAt={post?.timestamp}
                coverUrl={getStreamReplay(post?.id)?.thumbnail ?? undefined}
                postLink={`/watch/${post?.id}`}
                account={post?.author}
                // @ts-ignore
                stats={post?.stats as PostStats}
                title={
                  // @ts-ignore
                  post?.metadata?.title ?? post?.metadata?.content?.slice(0, 50)
                }
                key={post?.id}
              />
            )
          }
        }
      })}
    </div>
  )
}

export default OtherVideosRecommendations
