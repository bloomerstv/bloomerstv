import React from 'react'
import { Post } from '@lens-protocol/react-web'
import HomeVideoCard from '../../common/HomeVideoCard'
import LoadingVideoCard from '../../ui/LoadingVideoCard'
import { useStreamReplayPublications } from '../../../utils/hooks/useStreamReplayPublications'
import { usePublicationsStore } from '../../store/usePublications'
import { Button } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import { useStreamersWithProfiles } from '../../store/useStreamersWithProfiles'
const HomePageCards = () => {
  const [showAll, setShowAll] = React.useState(false)
  const publications = usePublicationsStore((state) => state.publications)
  const streamReplayPublication = usePublicationsStore(
    (state) => state.streamReplayPublication
  )
  const profiles = useStreamersWithProfiles(
    (state) => state.profilesFromPublicReplays
  )

  const profilesMap = new Map(profiles?.map((p) => [p?.id, p]))

  const isMobile = useIsMobile()

  const publicationsMap = new Map(publications?.map((p) => [p?.id, p]))

  const renderLoadingCards = () => {
    // Create an array of 8 elements and map over it
    return Array(8)
      .fill(null)
      .map((_, i) => <LoadingVideoCard key={i} />)
  }
  return (
    <>
      {/* @ts-ignore */}
      <div className="flex flex-row flex-wrap w-full gap-y-6">
        {streamReplayPublication?.streamReplayPublications &&
        streamReplayPublication?.streamReplayPublications?.length > 0
          ? streamReplayPublication?.streamReplayPublications
              ?.slice(
                0,
                showAll
                  ? streamReplayPublication?.streamReplayPublications?.length
                  : isMobile
                    ? 4
                    : 8
              )
              ?.map((streamReplay) => {
                // @ts-ignore
                const post = streamReplay?.publicationId
                  ? // @ts-ignore
                    publicationsMap.get(streamReplay?.publicationId)
                  : null

                if (streamReplay?.publicationId && !post) return null

                return (
                  <HomeVideoCard
                    // @ts-ignore
                    cover={streamReplay?.thumbnail}
                    // @ts-ignore
                    duration={streamReplay?.sourceSegmentsDuration}
                    premium={!!streamReplay?.premium}
                    key={post?.id ?? streamReplay?.sessionId}
                    post={post as Post}
                    // @ts-ignore
                    session={
                      post
                        ? undefined
                        : {
                            createdAt: streamReplay?.createdAt!,
                            sessionId: streamReplay?.sessionId!,
                            profile: profilesMap.get(
                              // @ts-ignore
                              streamReplay?.profileId
                            )
                          }
                    }
                  />
                )
              })
          : renderLoadingCards()}

        {!showAll && (
          <div className="w-full centered-row -mt-4">
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

  const streamReplayMap = new Map(
    streamReplayPublication?.streamReplayPublications?.map((p) => [
      p?.publicationId,
      p
    ])
  )

  return (
    <>
      {/* @ts-ignore */}
      {publications?.length > 0 ? (
        <div className="flex flex-row flex-wrap w-full gap-y-6">
          {publications?.map((post) => {
            return (
              <HomeVideoCard
                // @ts-ignore
                cover={streamReplayMap.get(post?.id)?.thumbnail}
                // @ts-ignore
                duration={streamReplayMap.get(post?.id)?.sourceSegmentsDuration}
                premium={!!streamReplayMap.get(post?.id)?.premium}
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
  const isMobile = useIsMobile()
  return (
    <div className="w-full">
      {!isMobile && (
        <div className="text-p-text leading-5 font-bold text-2xl py-2 px-2 mb-2 sm:mb-4">
          Past Streams
        </div>
      )}

      {profileId ? (
        <ProfilesHomeCards profileId={profileId} />
      ) : (
        <HomePageCards />
      )}
    </div>
  )
}

export default LiveStreamPublicReplays
