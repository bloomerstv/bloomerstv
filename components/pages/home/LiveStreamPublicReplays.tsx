import React, { useCallback } from 'react'
import { Post } from '@lens-protocol/react-web'
import HomeVideoCard from '../../common/HomeVideoCard'
import LoadingVideoCard from '../../ui/LoadingVideoCard'
import { useStreamReplayPublications } from '../../../utils/hooks/useStreamReplayPublications'
import { usePublicationsStore } from '../../store/usePublications'
import { Button } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import useIsMobile from '../../../utils/hooks/useIsMobile'
const HomePageCards = () => {
  const [showAll, setShowAll] = React.useState(false)
  const publications = usePublicationsStore((state) => state.publications)
  const streamReplayPublication = usePublicationsStore(
    (state) => state.streamReplayPublication
  )

  const isMobile = useIsMobile()

  const getStreamReplay = useCallback(
    (publicationId: string) => {
      const streamReplay =
        streamReplayPublication?.streamReplayPublications?.find(
          (p) => p?.publicationId === publicationId
        )
      return {
        thumbnail: streamReplay?.thumbnail,
        duration: streamReplay?.sourceSegmentsDuration
      }
    },
    [streamReplayPublication]
  )
  const renderLoadingCards = () => {
    // Create an array of 8 elements and map over it
    return Array(8)
      .fill(null)
      .map((_, i) => <LoadingVideoCard key={i} />)
  }
  return (
    <>
      {/* @ts-ignore */}
      <div className="flex flex-row flex-wrap w-full gap-y-6 sm:gap-y-8">
        {publications && publications?.length > 0
          ? publications
              ?.slice(0, showAll || isMobile ? publications?.length : 12)
              ?.map((post) => {
                return (
                  <HomeVideoCard
                    // @ts-ignore
                    cover={getStreamReplay(post?.id)?.thumbnail}
                    // @ts-ignore
                    duration={getStreamReplay(post?.id)?.duration}
                    key={post?.id}
                    post={post as Post}
                  />
                )
              })
          : renderLoadingCards()}

        {!showAll && !isMobile && (
          <div className="w-full centered-row">
            <Button
              endIcon={<KeyboardArrowDownIcon />}
              variant="text"
              autoCapitalize=""
              onClick={() => setShowAll(true)}
              sx={{ textTransform: 'none' }}
            >
              Show more
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

const ProfilesHomeCards = ({ profileId }: { profileId: string }) => {
  const { loading, publications, streamReplayPublication } =
    useStreamReplayPublications({
      profileId: profileId
    })

  const getStreamReplay = useCallback(
    (publicationId: string) => {
      const streamReplay =
        streamReplayPublication?.streamReplayPublications?.find(
          (p) => p?.publicationId === publicationId
        )
      return {
        thumbnail: streamReplay?.thumbnail,
        duration: streamReplay?.sourceSegmentsDuration
      }
    },
    [streamReplayPublication?.streamReplayPublications]
  )

  return (
    <>
      {/* @ts-ignore */}
      {publications?.length > 0 ? (
        <div className="flex flex-row flex-wrap w-full gap-y-6 sm:gap-y-8">
          {publications?.map((post) => {
            return (
              <HomeVideoCard
                // @ts-ignore
                cover={getStreamReplay(post?.id)?.thumbnail}
                // @ts-ignore
                duration={getStreamReplay(post?.id)?.duration}
                key={post?.id}
                post={post as Post}
              />
            )
          })}
        </div>
      ) : (
        <>{loading && <LoadingVideoCard />}</>
      )}
    </>
  )
}

const LiveStreamPublicReplays = ({ profileId }: { profileId?: string }) => {
  return (
    <div className="sm:m-8 my-4">
      <div className="text-p-text font-bold text-2xl py-2 px-2 mb-2 sm:mb-4">
        Past Streams
      </div>

      {profileId ? (
        <ProfilesHomeCards profileId={profileId} />
      ) : (
        <HomePageCards />
      )}
    </div>
  )
}

export default LiveStreamPublicReplays
