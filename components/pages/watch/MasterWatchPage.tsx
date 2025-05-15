'use client'
import React from 'react'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import VideoPage from './VideoPage'
import StartLoadingPage from '../loading/StartLoadingPage'
import clsx from 'clsx'
import TextAndImagePostPage from '../home/TextAndImagePostPage'
import OtherVideosRecommendations from './OtherVideosRecommendations'
import { Post, usePost } from '@lens-protocol/react'

const MasterWatchPage = ({
  postId,
  sessionId
}: {
  postId?: string
  sessionId?: string
}) => {
  const isMobile = useIsMobile()

  const { data, loading } = usePost({
    post: postId
  })

  const memoizedVideoPage = React.useMemo(() => {
    if (!data && !sessionId) return null
    return <VideoPage post={data as Post} sessionId={sessionId} />
  }, [data?.id, sessionId])

  if (loading && postId) return <StartLoadingPage />

  if (!loading && !data && postId) {
    return (
      // video not found
      <div className="centered">Video not found</div>
    )
  }

  if (
    data?.__typename === 'Post' &&
    (data?.metadata?.__typename === 'TextOnlyMetadata' ||
      data?.metadata?.__typename === 'ImageMetadata')
  ) {
    return (
      <div
        className={clsx(
          'h-full overflow-y-auto w-full flex flex-row sm:p-4 gap-x-4',
          isMobile && 'no-scrollbar'
        )}
      >
        <div className="w-full flex-grow h-full">
          <TextAndImagePostPage post={data} />
        </div>
        {!isMobile && (
          <div className="sm:w-[500px] w-full">
            <OtherVideosRecommendations />
          </div>
        )}
      </div>
    )
  }

  if (
    (data?.__typename === 'Post' &&
      (data?.metadata?.__typename === 'VideoMetadata' ||
        data?.metadata?.__typename === 'LivestreamMetadata')) ||
    sessionId
  ) {
    return (
      <div
        className={clsx(
          'h-full overflow-y-auto w-full flex flex-row sm:p-4 gap-x-4',
          isMobile && 'no-scrollbar'
        )}
      >
        <div className="w-full flex-grow h-full">{memoizedVideoPage}</div>
        {!isMobile && (
          <div className="sm:w-[500px] w-full">
            <OtherVideosRecommendations />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="centered">
      This doesn't seem to be a video or stream post
    </div>
  )
}

export default MasterWatchPage
