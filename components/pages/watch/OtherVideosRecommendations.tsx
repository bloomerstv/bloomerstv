import {
  Post,
  PublicationMetadataMainFocusType,
  PublicationType,
  usePublications
} from '@lens-protocol/react-web'
import React from 'react'
import { APP_ID } from '../../../utils/config'
import clsx from 'clsx'
import RecommendedVideoCard from '../../common/RecommendedVideoCard'

const OtherVideosRecommendations = ({ className }: { className?: string }) => {
  const { data } = usePublications({
    where: {
      publicationTypes: [PublicationType.Post],
      metadata: {
        mainContentFocus: [
          PublicationMetadataMainFocusType.Video,
          PublicationMetadataMainFocusType.ShortVideo
        ],
        // @ts-ignore
        publishedOn: [APP_ID]
      }
    }
  })

  if (!data) return null
  return (
    <div className={clsx('flex flex-col w-full h-full gap-y-6', className)}>
      {data?.map((post) => {
        return <RecommendedVideoCard key={post?.id} post={post as Post} />
      })}
    </div>
  )
}

export default OtherVideosRecommendations
