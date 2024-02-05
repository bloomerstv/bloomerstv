import { Post } from '@lens-protocol/react-web'
import React, { useEffect } from 'react'
import Video from '../../common/Video'
import getPublicationData from '../../../utils/lib/getPublicationData'
import ProfileInfoWithStream from '../profile/ProfileInfoWithStream'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import OtherVideosRecommendations from './OtherVideosRecommendations'
import CommentSection from './CommentSection'
import { getSenitizedContent } from '../../../utils/lib/getSenitizedContent'
import Markup from '../../common/Lexical/Markup'
import { timeAgo } from '../../../utils/helpers'
import toast from 'react-hot-toast'
import { getThumbnailFromRecordingUrl } from '../../../utils/lib/getThumbnailFromRecordingUrl'
import { useStreamReplayRecordingQuery } from '../../../graphql/generated'
const VideoPage = ({ post }: { post: Post }) => {
  const isMobile = useIsMobile()

  const asset = getPublicationData(post?.metadata)?.asset

  const { data, error } = useStreamReplayRecordingQuery({
    variables: {
      publicationId: post?.id
    },
    skip: post?.metadata?.__typename !== 'LiveStreamMetadataV3'
  })

  useEffect(() => {
    if (!error) return
    toast.error(String(error))
  }, [error])

  if (
    post?.metadata?.__typename !== 'VideoMetadataV3' &&
    post?.metadata?.__typename !== 'LiveStreamMetadataV3'
  ) {
    return (
      <div className="centered">
        This doesn't seem to be a video or stream post
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      {/* @ts-ignore */}

      <div className="sm:rounded-xl  overflow-hidden ">
        {post?.metadata?.__typename === 'LiveStreamMetadataV3' ? (
          <>
            {/* //todo here check if there is a recording is allowd to  from api, fetch it and show it here instead of liveUrl  */}

            {data?.streamReplayRecording?.recordingUrl ? (
              <Video
                src={data?.streamReplayRecording?.recordingUrl}
                className="w-full"
                muted={false}
                poster={getThumbnailFromRecordingUrl(
                  data?.streamReplayRecording?.recordingUrl
                )}
              />
            ) : (
              <div className="w-full aspect-video animate-pulse bg-p-hover centered-row">
                {error && (
                  <div className="font-semibold">
                    This stream is not available for replay right now
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {asset?.uri && (
              <Video
                poster={asset?.cover}
                src={String(asset?.uri)}
                className="w-full"
                muted={false}
              />
            )}
          </>
        )}
      </div>
      <ProfileInfoWithStream profile={post?.by} post={post} />

      <div className="sm:mx-8 sm:mt-6 sm:mb-0 text-p-text font-semibold sm:text-base text-sm sm:p-6 m-2 p-2 gap-y-1 start-col  rounded-xl shadow-sm bg-p-hover sm:bg-s-bg">
        {/* // add total views count here */}
        <div className="">Posted {timeAgo(post?.createdAt)} </div>
        <Markup className="">
          {String(
            getSenitizedContent(post?.metadata?.content, post?.metadata?.title)
              .length > 0
              ? getSenitizedContent(
                  post?.metadata?.content,
                  post?.metadata?.title
                )
              : post?.metadata?.title
          )}
        </Markup>
        {/* links */}
      </div>

      {!isMobile && (
        <div className="border-t border-p-border mt-8 mb-4">
          <div className="text-xl font-semibold my-4">Comments</div>
          <CommentSection publicationId={post?.id} />
        </div>
      )}
      {isMobile && <OtherVideosRecommendations className="py-4" />}
    </div>
  )
}

export default VideoPage
