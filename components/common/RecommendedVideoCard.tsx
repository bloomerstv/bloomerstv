import React from 'react'
import useIsMobile from '../../utils/hooks/useIsMobile'
import HomeVideoCard from './HomeVideoCard'
import getPublicationData from '../../utils/lib/getPublicationData'
import RecommendedCardLayout from './RecommendedCardLayout'
import { Post } from '@lens-protocol/react'

const RecommendedVideoCard = ({ post }: { post: Post }) => {
  const isMobile = useIsMobile()

  const asset = getPublicationData(post?.metadata)?.asset

  if (isMobile) {
    return <HomeVideoCard post={post} />
  }

  return (
    <RecommendedCardLayout
      // @ts-ignore
      title={post?.metadata?.title}
      postLink={`/watch/${post?.slug}`}
      coverUrl={asset?.cover}
      account={post?.author}
      stats={post?.stats}
      createdAt={post?.timestamp}
      duration={
        post?.metadata?.__typename === 'VideoMetadata'
          ? (post?.metadata?.video?.duration ?? undefined)
          : undefined
      }
    />
  )
}

export default RecommendedVideoCard
