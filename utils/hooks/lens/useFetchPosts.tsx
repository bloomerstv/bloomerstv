import {
  AnyPost,
  Paginated,
  PostsQuery,
  PostsRequest,
  UnexpectedError,
  usePublicClient
} from '@lens-protocol/react'
import { useEffect, useState } from 'react'
import createStableHook from '../createStableHook'

interface useFetchPostsReturn {
  loading: boolean
  data: Paginated<AnyPost> | null
  error: UnexpectedError | null
}

const useFetchPosts = (request: PostsRequest): useFetchPostsReturn => {
  const { currentSession } = usePublicClient()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Paginated<AnyPost> | null>(null)
  const [error, setError] = useState<UnexpectedError | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      if (!currentSession) {
        return
      }

      setLoading(true)
      try {
        const result = await currentSession.query(PostsQuery, {
          request
        })

        if (result?.isErr())
          if (result?.isOk()) {
            setData(result.value)
          } else if (result?.isErr()) {
            setError(result.error)
          }
      } catch (err) {
        setError(
          err instanceof UnexpectedError
            ? err
            : new UnexpectedError(String(err))
        )
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [request])

  return {
    loading,
    data,
    error
  }
}

export default createStableHook(useFetchPosts)
