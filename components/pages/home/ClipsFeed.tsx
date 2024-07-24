'use client'

import {
  Post,
  PublicationMetadataMainFocusType,
  PublicationType,
  usePublications
} from '@lens-protocol/react-web'
import React from 'react'
import { APP_ID } from '../../../utils/config'
import HomeVideoCard from '../../common/HomeVideoCard'
import LoadingVideoCard from '../../ui/LoadingVideoCard'
import { useIsVerifiedQuery } from '../../../graphql/generated'

const ClipsFeed = ({ handle }: { handle?: string }) => {
  const { data, loading } = usePublications({
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

  const { data: isVerified } = useIsVerifiedQuery({
    variables: {
      profileIds: data?.map((p) => p.by?.id)
    }
  })

  const verifiedMap = new Map(
    isVerified?.isVerified?.map((v) => [v?.profileId, v?.isVerified ?? false])
  )

  if (!loading && data?.length === 0) {
    return null
  }
  return (
    <div className="w-full">
      {/* @ts-ignore */}
      {data?.length > 0 ? (
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
        </div>
      ) : (
        <>{loading && <LoadingVideoCard />}</>
      )}
    </div>
  )
}

export default ClipsFeed
