import React from 'react'
import LoadingImage from '../../ui/LoadingImage'
import { usePost } from '@lens-protocol/react'
import clsx from 'clsx'

const ClipPostThumbnail = ({
  clipPostId,
  className
}: {
  clipPostId: string
  className: string
}) => {
  const { data, loading } = usePost({
    post: clipPostId
  })

  if (
    !loading &&
    data?.__typename === 'Post' &&
    data?.metadata?.__typename === 'VideoMetadata'
  ) {
    return (
      <LoadingImage className={className} src={data?.metadata?.video?.cover} />
    )
  }

  return <div className={clsx(className, 'animate-pulse bg-s-bg')} />
}

const ClipThumbnail = ({
  clipPostId,
  imageUrl,
  className
}: {
  clipPostId: string
  imageUrl: string
  className: string
}) => {
  if (!imageUrl.startsWith('https://vod-cdn.lp-playback.studio')) {
    return <LoadingImage src={imageUrl} className={className} />
  }

  return <ClipPostThumbnail clipPostId={clipPostId} className={className} />
}

export default ClipThumbnail
