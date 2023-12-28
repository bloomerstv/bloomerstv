import { Post } from '@lens-protocol/react-web'
import React from 'react'
import Video from '../../common/Video'
import getPublicationData from '../../../utils/lib/getPublicationData'
import ProfileInfoWithStream from '../profile/ProfileInfoWithStream'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import OtherVideosRecommendations from './OtherVideosRecommendations'
import CommentSection from './CommentSection'
import { getSenitizedContent } from '../../../utils/lib/getSenitizedContent'
import Markup from '../../common/Lexical/Markup'
import { timeAgo } from '../../../utils/helpers'
const VideoPage = ({ post }: { post: Post }) => {
  const isMobile = useIsMobile()

  const asset = getPublicationData(post?.metadata)?.asset

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
            <Video
              src={post?.metadata?.liveURL || post?.metadata?.playbackURL}
              className="w-full"
            />
          </>
        ) : (
          <Video
            poster={asset?.cover}
            src={String(asset?.uri)}
            className="w-full"
          />
        )}
      </div>
      <ProfileInfoWithStream profile={post?.by} post={post} />

      <div className="sm:mx-8 sm:my-6 text-p-text text-sm font-semibold sm:p-4 m-2 p-2 gap-y-2 start-col  rounded-xl shadow-sm bg-p-hover sm:bg-s-bg">
        {/* // add total views count here */}
        <div className=""> {timeAgo(post?.createdAt)} </div>
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
