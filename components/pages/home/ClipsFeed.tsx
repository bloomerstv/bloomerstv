'use client'

import {
  Post,
  PublicationMetadataMainFocusType,
  PublicationType,
  usePublications
} from '@lens-protocol/react-web'
import React, { useEffect, useRef } from 'react'
import { APP_ID } from '../../../utils/config'
import HomeVideoCard from '../../common/HomeVideoCard'
import LoadingVideoCard from '../../ui/LoadingVideoCard'
import { useIsVerifiedQuery } from '../../../graphql/generated'

const ClipsFeed = ({ handle }: { handle?: string }) => {
  const { data, loading, hasMore, next } = usePublications({
    where: {
      publicationTypes: [PublicationType.Post, PublicationType.Quote],
      metadata: {
        mainContentFocus: [
          PublicationMetadataMainFocusType.ShortVideo,
          PublicationMetadataMainFocusType.Video
        ],
        // @ts-ignore
        publishedOn: [APP_ID],
        tags: handle
          ? {
              oneOf: [`clip-${handle}`]
            }
          : undefined
      }
    }
  })

  const loadMoreRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          next()
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
  }, [hasMore, loading, next])

  const { data: isVerified } = useIsVerifiedQuery({
    variables: {
      profileIds: data?.map((p) => p.by?.id)
    }
  })

  const verifiedMap = new Map(
    isVerified?.isVerified?.map((v) => [v?.profileId, v?.isVerified ?? false])
  )

  if (!loading && data?.length === 0) {
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
        {data?.map((post) => {
          return (
            <HomeVideoCard
              premium={verifiedMap.get(post?.by?.id)}
              key={post?.id}
              post={post as Post}
            />
          )
        })}

        {/* // show loadingVideocard 6 times  */}
        {(hasMore || (!data?.length && loading)) &&
          Array.from({ length: 3 }, (_, i) => <LoadingVideoCard key={i} />)}
      </div>

      <div ref={loadMoreRef} className="h-1" />
    </div>
  )
}

export default ClipsFeed
