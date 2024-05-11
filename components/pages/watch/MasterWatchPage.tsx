'use client'
import React from 'react'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import { Post, usePublication } from '@lens-protocol/react-web'
import VideoPage from './VideoPage'
import StartLoadingPage from '../loading/StartLoadingPage'
import clsx from 'clsx'
import TextAndImagePostPage from '../home/TextAndImagePostPage'
import OtherVideosRecommendations from './OtherVideosRecommendations'

const MasterWatchPage = ({
  postId,
  sessionId
}: {
  postId?: string
  sessionId?: string
}) => {
  const isMobile = useIsMobile()
  const { data, loading } = usePublication({
    // @ts-ignore
    forId: postId
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
    (data?.__typename === 'Post' || data?.__typename === 'Quote') &&
    (data?.metadata?.__typename === 'TextOnlyMetadataV3' ||
      data?.metadata?.__typename === 'ImageMetadataV3')
  ) {
    return (
      <div
        className={clsx(
          'h-full overflow-y-auto w-full flex flex-row sm:p-4 gap-x-4',
          isMobile && 'no-scrollbar'
        )}
      >
        <div className="w-full flex-grow h-full">
          <TextAndImagePostPage publication={data} />
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
      (data?.metadata?.__typename === 'VideoMetadataV3' ||
        data?.metadata?.__typename === 'LiveStreamMetadataV3')) ||
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
