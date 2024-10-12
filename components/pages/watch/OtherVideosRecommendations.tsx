import {
  Post,
  PublicationMetadataMainFocusType,
  PublicationType,
  usePublications
} from '@lens-protocol/react-web'
import React, { useCallback } from 'react'
import { APP_ID, hideProfilesIds } from '../../../utils/config'
import clsx from 'clsx'
import RecommendedVideoCard from '../../common/RecommendedVideoCard'
import { usePublicationsStore } from '../../store/usePublications'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import HomeVideoCard from '../../common/HomeVideoCard'
import RecommendedCardLayout from '../../common/RecommendedCardLayout'

const OtherVideosRecommendations = ({ className }: { className?: string }) => {
  const isMobile = useIsMobile()

  const { data } = usePublications({
    where: {
      publicationTypes: [PublicationType.Post],
      metadata: {
        mainContentFocus: [
          PublicationMetadataMainFocusType.Video,
          PublicationMetadataMainFocusType.ShortVideo
        ],
        // @ts-ignore
        publishedOn: [APP_ID]
      }
    }
  })

  const publications = usePublicationsStore((state) => state.publications)
  const streamReplayPublication = usePublicationsStore(
    (state) => state.streamReplayPublication
  )

  const getStreamReplay = useCallback(
    (publicationId: string) => {
      const streamReplay =
        streamReplayPublication?.streamReplayPublications?.streamReplayPublications?.find(
          (p) => p?.publicationId === publicationId
        )
      return {
        thumbnail: streamReplay?.thumbnail,
        duration: streamReplay?.sourceSegmentsDuration
      }
    },
    [streamReplayPublication]
  )

  // add type streamClips to data
  const streamClips =
    data?.map((post) => {
      return {
        ...post,
        type: 'streamClips'
      }
    }) ?? []

  // add type streamReplays to publications
  const streamReplays =
    publications?.map((post) => {
      return {
        ...post,
        type: 'streamReplays'
      }
    }) ?? []

  const combinedData = [...streamClips, ...streamReplays].sort(
    (a, b) =>
      new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
  )

  if (!data) return null
  return (
    <div className={clsx('flex flex-col w-full h-full gap-y-4', className)}>
      {combinedData?.map((post) => {
        if (hideProfilesIds.includes(post?.by?.id)) {
          return null
        }
        if (post?.type === 'streamClips') {
          return <RecommendedVideoCard key={post?.id} post={post as Post} />
        } else {
          if (isMobile) {
            return (
              <HomeVideoCard
                post={post as Post}
                // @ts-ignore
                cover={getStreamReplay(post?.id)?.thumbnail}
                // @ts-ignore
                duration={getStreamReplay(post?.id)?.duration}
                key={post?.id}
              />
            )
          } else {
            return (
              <RecommendedCardLayout
                createdAt={post?.createdAt}
                // @ts-ignore
                coverUrl={getStreamReplay(post?.id)?.thumbnail}
                postLink={`/watch/${post?.id}`}
                profile={post?.by}
                // @ts-ignore
                stats={post?.stats}
                // @ts-ignore
                title={post?.metadata?.title}
                key={post?.id}
              />
            )
          }
        }
      })}
    </div>
  )
}

export default OtherVideosRecommendations
