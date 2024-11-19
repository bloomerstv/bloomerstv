import {
  Post,
  SessionType,
  useProfile,
  useSession
} from '@lens-protocol/react-web'
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
import Player from '../../common/Player/Player'
import { getCategoryForTag } from '../../../utils/categories'
import Link from 'next/link'
const VideoPage = ({
  post,
  sessionId
}: {
  post?: Post
  sessionId?: string
}) => {
  const isMobile = useIsMobile()
  const { data: session } = useSession()

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
        premium={data?.streamReplayRecording?.premium}
      />

      <div className="sm:mx-8 sm:mt-6 sm:mb-0 text-p-text font-semibold sm:text-base text-sm sm:p-6 m-2 p-3 gap-y-1 start-col  rounded-xl shadow-sm bg-p-hover lg:bg-s-bg">
        <div className="flex flex-row flex-wrap gap-3 items-center">
          {/* // todo add total views count here */}

          <div className="">
            {`${
              post?.metadata?.__typename === 'LiveStreamMetadataV3' ||
              (!post && sessionId)
                ? 'Streamed'
                : 'Posted'
            } ${timeAgo(post?.createdAt || data?.streamReplayRecording?.createdAt)}`}{' '}
          </div>
          {post?.metadata?.tags?.[0] &&
            getCategoryForTag(post?.metadata?.tags?.[0]) && (
              <div className="text-p-text bg-p-bg sm:bg-p-hover rounded-lg px-2 sm:px-3 py-0.5 sm:py-1 text-xs">
                {getCategoryForTag(post?.metadata?.tags?.[0])}
              </div>
            )}
        </div>

        {post ? (
          <Markup className="">
            {String(
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
            )}
          </Markup>
        ) : (
          <div>
            {session?.type === SessionType.WithProfile &&
              session?.profile?.id === profile?.id && (
                <span className="text-2xl">
                  You can create a lens post for your untitled streams from{' '}
                  <span>
                    <Link href={`/dashboard/content`} className="text-brand">
                      {' '}
                      content page
                    </Link>
                  </span>
                  <br />
                </span>
              )}
            <span className="text-sm font-normal">
              Untitled streams are those stream that are not associated with any
              lens post. They are not visible on other lens platform. These
              streams are only accessible through direct link. This may happend
              if for some reason go-live page isn't successfully able to create
              a lens post while the stream was live.{' '}
            </span>
          </div>
        )}
        {/* links */}
      </div>

      {!isMobile && post && (
        <div className="border-t border-p-border mt-8 mb-4 mx-8">
          <div className="text-xl font-semibold my-4">{`${post?.stats?.comments} Comment${post?.stats?.comments > 1 ? 's' : ''}`}</div>
          <CommentSection publication={post} />
        </div>
      )}
      {isMobile && <OtherVideosRecommendations className="py-4" />}
    </div>
  )
}

export default memo(VideoPage)
