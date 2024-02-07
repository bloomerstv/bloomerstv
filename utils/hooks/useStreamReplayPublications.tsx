import { useEffect } from 'react'
import {
  AnyPublication,
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
  profileId
}: {
  profileId?: string
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
        skip: 0,
        profileId: profileId
      }
    })

  const { data: publications, loading } = usePublications({
    where: {
      // @ts-ignore
      publicationIds: data?.streamReplayPublications?.map(
        (p) => p?.publicationId
      )
    }
  })

  useEffect(() => {
    if (publications && publications?.length > 0 && !profileId) {
      // get unique profileIds from publications
      const uniqueProfiles = Array.from(
        new Set(publications.map((p) => p?.by))
        // @ts-ignore
      ).filter((profile) => profile?.id !== session?.profile?.id)

      setProfilesFromPublicReplays(uniqueProfiles)
      setStreamReplayPublication(data)
      setPublications(publications)
    }
  }, [publications, profileId, session])

  return {
    streamReplayPublication: data,
    publications: publications,
    loading: streamReplayLoading || loading
  }
}
