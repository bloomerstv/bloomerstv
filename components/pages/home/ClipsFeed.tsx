'use client'
import React, { useEffect, useRef, useState } from 'react'
import { APP_ADDRESS } from '../../../utils/config'
import HomeVideoCard from '../../common/HomeVideoCard'
import LoadingVideoCard from '../../ui/LoadingVideoCard'
import { useIsVerifiedQuery } from '../../../graphql/generated'
import {
  MainContentFocus,
  Post,
  PostType,
  usePosts
} from '@lens-protocol/react'

const ClipsFeed = ({ handle }: { handle?: string }) => {
  const [cursor, setCursor] = React.useState<string | undefined>()
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [allVerifiedMap, setAllVerifiedMap] = useState<Map<string, boolean>>(
    new Map()
  )

  const { data, loading } = usePosts({
    filter: {
      postTypes: [PostType.Root, PostType.Quote],
      metadata: {
        mainContentFocus: [MainContentFocus.ShortVideo, MainContentFocus.Video],
        tags: handle
          ? {
              oneOf: [`clip-${handle}`]
            }
          : undefined
      },
      apps: [APP_ADDRESS]
    },
    cursor
  })

  console.log('data', data)

  useEffect(() => {
    if (data?.items && data.items.length > 0) {
      setAllPosts((prevPosts) => {
        // Combine previous posts with new posts, avoiding duplicates
        const newPosts = [...prevPosts]
        data.items.forEach((post) => {
          if (!newPosts.some((p) => p.id === post.id)) {
            newPosts.push(post as Post)
          }
        })
        return newPosts
      })
    }
  }, [data?.items])

  const loadMoreRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && data?.pageInfo?.next && !loading) {
          setCursor(data?.pageInfo?.next)
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
  }, [data?.pageInfo?.next, loading])

  const { data: isVerified } = useIsVerifiedQuery({
    variables: {
      accountAddresses: data?.items.map((p) => p.author?.address)
    }
  })

  useEffect(() => {
    if (isVerified?.isVerified && isVerified?.isVerified?.length > 0) {
      setAllVerifiedMap((prevMap) => {
        const newMap = new Map(prevMap)
        isVerified?.isVerified?.forEach((v) => {
          if (v?.accountAddress) {
            newMap.set(v.accountAddress, v?.isVerified ?? false)
          }
        })
        return newMap
      })
    }
  }, [isVerified])

  if (!loading && allPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <p className="text-lg font-bold">No clips available</p>
      </div>
    )
  }
  return (
    <div className="w-full">
      {/* @ts-ignore */}
      <div className="flex flex-row flex-wrap w-full gap-y-6">
        {allPosts.map((post) => {
          return (
            <HomeVideoCard
              premium={allVerifiedMap.get(post?.author?.address)}
              key={post?.id}
              post={post as Post}
            />
          )
        })}

        {/* // show loadingVideocard 6 times  */}
        {loading &&
          Array.from({ length: 3 }, (_, i) => <LoadingVideoCard key={i} />)}
      </div>

      <div ref={loadMoreRef} className="h-1" />
    </div>
  )
}

export default ClipsFeed
