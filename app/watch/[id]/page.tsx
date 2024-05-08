'use client'
import React, { useEffect } from 'react'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import OtherVideosRecommendations from '../../../components/pages/watch/OtherVideosRecommendations'
import { Post, usePublication } from '@lens-protocol/react-web'
import StartLoadingPage from '../../../components/pages/loading/StartLoadingPage'
import VideoPage from '../../../components/pages/watch/VideoPage'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import TextAndImagePostPage from '../../../components/pages/home/TextAndImagePostPage'

const page = ({
  params
}: {
  params: {
    id: string
  }
}) => {
  const isMobile = useIsMobile()
  const { data, loading, error } = usePublication({
    // @ts-ignore
    forId: params.id
  })

  const memoizedVideoPage = React.useMemo(() => {
    if (!data) return null
    return <VideoPage post={data as Post} />
  }, [data?.id])

  useEffect(() => {
    if (!error) return
    toast.error(String(error))
  }, [error])

  if (loading) return <StartLoadingPage />

  if (!loading && !data) {
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
    data?.__typename === 'Post' &&
    (data?.metadata?.__typename === 'VideoMetadataV3' ||
      data?.metadata?.__typename === 'LiveStreamMetadataV3')
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

export default page
