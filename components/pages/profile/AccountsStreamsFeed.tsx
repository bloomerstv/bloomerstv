import { useEffect, useRef, useState } from 'react'
import { useStreamReplayPostsOfAccount } from '../../../utils/hooks/useStreamReplayPosts'
import { StreamReplayPost } from '../../../graphql/generated'
import { AnyPost, Post } from '@lens-protocol/react'
import HomeVideoCard from '../../common/HomeVideoCard'
import LoadingVideoCard from '../../ui/LoadingVideoCard'

export const AccountsStreamsFeed = ({
  accountAddress
}: {
  accountAddress: string
}) => {
  const [skip, setSkip] = useState(0)
  const { loading, posts, streamReplayPosts } = useStreamReplayPostsOfAccount({
    accountAddress,
    skip: skip
  })

  const [allStreamReplayPosts, setAllStreamReplayPosts] = useState<
    StreamReplayPost[]
  >([])

  const [allPosts, setAllPosts] = useState<AnyPost[]>([])

  useEffect(() => {
    // add it to allPosts if it isn't already added

    setAllPosts((prev) => {
      const newPosts = posts?.filter(
        (p) => !prev?.some((prevP) => prevP?.id === p?.id)
      )

      if (!newPosts || newPosts?.length === 0) return prev

      return [...prev, ...newPosts!]
    })
  }, [posts])

  useEffect(() => {
    // @ts-ignore
    setAllStreamReplayPosts((prev) => {
      const newStreamReplayPosts =
        streamReplayPosts?.streamReplayPosts?.streamReplayPosts?.filter(
          (p) => !prev?.some((prevP) => prevP?.postId === p?.postId)
        )

      if (!newStreamReplayPosts || newStreamReplayPosts?.length === 0)
        return prev

      return [...prev, ...newStreamReplayPosts!]
    })
  }, [streamReplayPosts?.streamReplayPosts?.streamReplayPosts])

  const streamReplayMap = new Map(
    allStreamReplayPosts?.map((p) => [p?.postId, p])
  )

  const loadMoreRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          streamReplayPosts?.streamReplayPosts?.hasMore &&
          !loading
        ) {
          setSkip(streamReplayPosts?.streamReplayPosts?.next)
        }
      },
      { threshold: 1.0 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current)
      }
    }
  }, [
    streamReplayPosts?.streamReplayPosts?.hasMore,
    loading,
    streamReplayPosts?.streamReplayPosts?.next
  ])

  return (
    <div className="w-full">
      {/* @ts-ignore */}
      <div className="flex flex-row flex-wrap w-full gap-y-6">
        {allPosts?.map((post) => {
          return (
            <HomeVideoCard
              // @ts-ignore
              cover={streamReplayMap.get(post?.id)?.thumbnail}
              // @ts-ignore
              duration={streamReplayMap.get(post?.id)?.sourceSegmentsDuration}
              premium={!!streamReplayMap.get(post?.id)?.premium}
              key={post?.id}
              post={post as Post}
            />
          )
        })}

        {(streamReplayPosts?.streamReplayPosts?.hasMore ||
          (!allPosts?.length && loading)) &&
          Array.from({ length: 3 }, (_, i) => <LoadingVideoCard key={i} />)}
      </div>
      <div ref={loadMoreRef} className="h-1" />
    </div>
  )
}
