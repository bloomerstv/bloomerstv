import { Post, useProfile } from '@lens-protocol/react-web'
import React, { memo, useEffect } from 'react'
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
import Player from '../../common/Player'
const VideoPage = ({
  post,
  sessionId
}: {
  post?: Post
  sessionId?: string
}) => {
  const isMobile = useIsMobile()

  const asset = post ? getPublicationData(post?.metadata)?.asset : null

  const { data, error } = useStreamReplayRecordingQuery({
    variables: {
      publicationId: post?.id,
      sessionId: sessionId
    },
    skip:
      (post && post?.metadata?.__typename !== 'LiveStreamMetadataV3') ||
      (!post?.id && !sessionId)
  })

  const { data: profile } = useProfile({
    // @ts-ignore
    forProfileId: data?.streamReplayRecording?.profileId
  })

  useEffect(() => {
    if (!error) return
    toast.error(String(error))
  }, [error])

  const memoizedVideo = React.useMemo(() => {
    if (!data?.streamReplayRecording?.recordingUrl) return null

    return (
      <Player
        // @ts-ignore
        src={data?.streamReplayRecording?.recordingUrl}
        className="w-full"
        muted={false}
        poster={getThumbnailFromRecordingUrl(
          data?.streamReplayRecording?.recordingUrl
        )}
      />
    )
  }, [data?.streamReplayRecording?.recordingUrl])

  const memoizedAsset = React.useMemo(() => {
    if (!asset?.uri) return null
    return (
      <Player
        // @ts-ignore
        src={asset?.uri}
        className="w-full"
        muted={false}
        poster={asset?.cover}
      />
    )
  }, [asset?.uri])

  if (
    post &&
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
        {post?.metadata?.__typename === 'LiveStreamMetadataV3' ||
        data?.streamReplayRecording?.recordingUrl ? (
          <>
            {/* //todo here check if there is a recording is allowd to  from api, fetch it and show it here instead of liveUrl  */}

            {data?.streamReplayRecording?.recordingUrl ? (
              memoizedVideo
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
          <>{asset?.uri && memoizedAsset}</>
        )}
      </div>
      <ProfileInfoWithStream
        // @ts-ignore
        profile={post?.by ?? profile}
        post={post}
        premium={!post && data?.streamReplayRecording?.premium}
      />

      <div className="sm:mx-8 sm:mt-6 sm:mb-0 text-p-text font-semibold sm:text-base text-sm sm:p-6 m-2 p-3 gap-y-1 start-col  rounded-xl shadow-sm bg-p-hover lg:bg-s-bg">
        {/* // add total views count here */}
        <div className="">
          {`${
            post?.metadata?.__typename === 'LiveStreamMetadataV3' ||
            (!post && sessionId)
              ? 'Streamed'
              : 'Posted'
          } ${timeAgo(post?.createdAt || data?.streamReplayRecording?.createdAt)}`}{' '}
        </div>
        <Markup className="">
          {post
            ? String(
                getSenitizedContent(
                  // @ts-ignore
                  post?.metadata?.content,
                  // @ts-ignore
                  post?.metadata?.title
                ).length > 0
                  ? getSenitizedContent(
                      // @ts-ignore
                      post?.metadata?.content,
                      // @ts-ignore
                      post?.metadata?.title
                    )
                  : // @ts-ignore
                    post?.metadata?.title
              )
            : 'Untitled streams are those stream that are not associated with any lens post. They are not visible on other lens platform. These streams are only accessible through direct link. \n\n Why is you stream untitled?\nYou may have not been on go-live page when your stream was live, this means no lens post was created for your stream. Go-live page will automatically create a lens post for your stream, when you visit the page while your stream is still live, we can not create a post on your behalf otherwise.\nSoon you will be able to create a post for your untitled streams later from content page, in case you missed creating it somehow while it was still live.'}
        </Markup>
        {/* links */}
      </div>

      {!isMobile && post && (
        <div className="border-t border-p-border mt-8 mb-4">
          <div className="text-xl font-semibold my-4">{`${post?.stats?.comments} Comment${post?.stats?.comments > 1 ? 's' : ''}`}</div>
          <CommentSection publication={post} />
        </div>
      )}
      {isMobile && <OtherVideosRecommendations className="py-4" />}
    </div>
  )
}

export default memo(VideoPage)
