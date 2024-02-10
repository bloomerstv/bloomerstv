'use client'
import React, { useEffect } from 'react'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import OtherVideosRecommendations from '../../../components/pages/watch/OtherVideosRecommendations'
import { Post, usePublication } from '@lens-protocol/react-web'
import StartLoadingPage from '../../../components/pages/loading/StartLoadingPage'
import VideoPage from '../../../components/pages/watch/VideoPage'
import toast from 'react-hot-toast'

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
    data?.__typename !== 'Post' ||
    (data?.metadata?.__typename !== 'VideoMetadataV3' &&
      data?.metadata?.__typename !== 'LiveStreamMetadataV3')
  ) {
    return (
      <div className="centered">
        This doesn't seem to be a video or stream post
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto w-full flex flex-row sm:pt-8 sm:px-8 gap-x-8">
      <div className="w-full flex-grow h-full">{memoizedVideoPage}</div>
      {!isMobile && (
        <div className="sm:w-[600px] w-full">
          <OtherVideosRecommendations />
        </div>
      )}
    </div>
  )
}

export default page
