import React, { useCallback, useEffect } from 'react'
import {
  StreamReplayPublicationsQuery,
  useStreamReplayPublicationsQuery
} from '../../../graphql/generated'
import { Post, usePublications, useSession } from '@lens-protocol/react-web'
import HomeVideoCard from '../../common/HomeVideoCard'
import LoadingVideoCard from '../../ui/LoadingVideoCard'
import { useStreamersWithProfiles } from '../../store/useStreamersWithProfiles'

const PublicationsHomeCards = ({
  data,
  allowSetProfilesFromPublicReplays = true
}: {
  data?: StreamReplayPublicationsQuery
  allowSetProfilesFromPublicReplays?: boolean
}) => {
  const { data: session } = useSession()
  const setProfilesFromPublicReplays = useStreamersWithProfiles(
    (state) => state.setProfilesFromPublicReplays
  )

  const { data: publications, loading } = usePublications({
    where: {
      // @ts-ignore
      publicationIds: data?.streamReplayPublications?.map(
        (p) => p?.publicationId
      )
    }
  })

  useEffect(() => {
    if (
      publications &&
      publications?.length > 0 &&
      allowSetProfilesFromPublicReplays
    ) {
      // get unique profileIds from publications
      const uniqueProfiles = Array.from(
        new Set(publications.map((p) => p?.by))
        // @ts-ignore
      ).filter((profile) => profile?.id !== session?.profile?.id)

      setProfilesFromPublicReplays(uniqueProfiles)
    }
  }, [publications, allowSetProfilesFromPublicReplays, session])

  const getStreamReplay = useCallback(
    (publicationId: string) => {
      const streamReplay = data?.streamReplayPublications?.find(
        (p) => p?.publicationId === publicationId
      )
      return {
        thumbnail: streamReplay?.thumbnail,
        duration: streamReplay?.sourceSegmentsDuration
      }
    },
    [data]
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
  const { data, loading: streamReplayLoading } =
    useStreamReplayPublicationsQuery({
      variables: {
        skip: 0,
        profileId: profileId
      }
    })

  return (
    <div className="sm:m-8 my-4">
      <div className="text-p-text font-bold text-2xl py-2 px-2 mb-2 sm:mb-4">
        Past Streams
      </div>

      {data?.streamReplayPublications ? (
        <PublicationsHomeCards
          data={data}
          allowSetProfilesFromPublicReplays={!profileId}
        />
      ) : (
        <>{streamReplayLoading && <LoadingVideoCard />}</>
      )}
    </div>
  )
}

export default LiveStreamPublicReplays
