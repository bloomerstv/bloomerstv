import { useEffect } from 'react'
import {
  AnyPublication,
  useProfiles,
  usePublications,
  useSession
} from '@lens-protocol/react-web'
import {
  StreamReplayPublicationsQuery,
  useStreamReplayPublicationsQuery
} from '../../graphql/generated'
import { useStreamersWithProfiles } from '../../components/store/useStreamersWithProfiles'
import { usePublicationsStore } from '../../components/store/usePublications'

export const useStreamReplayPublications = ({
  profileId,
  skip = 0
}: {
  profileId?: string
  skip?: number
}): {
  streamReplayPublication?: StreamReplayPublicationsQuery
  publications?: AnyPublication[]
  loading: boolean
} => {
  const { data: session } = useSession()
  const setProfilesFromPublicReplays = useStreamersWithProfiles(
    (state) => state.setProfilesFromPublicReplays
  )
  const setPublications = usePublicationsStore((state) => state.setPublications)
  const setStreamReplayPublication = usePublicationsStore(
    (state) => state.setStreamReplayPublication
  )
  const { data, loading: streamReplayLoading } =
    useStreamReplayPublicationsQuery({
      variables: {
        skip: skip,
        profileId: profileId
      }
    })

  const { data: profilesWithoutPublications } = useProfiles({
    where: {
      // @ts-ignore
      profileIds: Array.from(
        new Set(
          data?.streamReplayPublications?.streamReplayPublications
            ?.map((p) => {
              if (!p?.publicationId && p?.profileId) {
                return p?.profileId
              }
            })
            .filter((p) => p)
        )
      )
    }
  })

  const { data: publications, loading } = usePublications({
    where: {
      // @ts-ignore
      publicationIds: data?.streamReplayPublications?.streamReplayPublications
        ?.map((p) => p?.publicationId)
        .filter((p) => p)
    }
  })

  useEffect(() => {
    if (publications && publications?.length > 0 && !profileId) {
      // get unique profileIds from publications
      const uniqueProfiles = Array.from(
        new Set(publications.map((p) => p?.by))
      ).filter((profile) => {
        return (
          // @ts-ignore
          profile?.id !== session?.profile?.id &&
          !profilesWithoutPublications?.map((p) => p?.id).includes(profile?.id)
        )
      })

      setProfilesFromPublicReplays([
        ...uniqueProfiles,
        ...(profilesWithoutPublications ?? [])
      ])
      setStreamReplayPublication(data)
      setPublications(publications)
    }
  }, [publications, profileId, session, profilesWithoutPublications])

  return {
    streamReplayPublication: data,
    publications: publications,
    loading: streamReplayLoading || loading
  }
}
