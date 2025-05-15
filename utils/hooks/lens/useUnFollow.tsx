import { useState } from 'react'
import {
  ResultAsync,
  UnauthenticatedError,
  UnexpectedError,
  useSessionClient,
  UnfollowResult,
  CreateUnfollowRequest
} from '@lens-protocol/react'
import { unfollow } from '@lens-protocol/client/actions'

interface UseUnFollowReturn {
  execute: (
    request: CreateUnfollowRequest
  ) => Promise<
    ResultAsync<UnfollowResult, UnexpectedError | UnauthenticatedError>
  >
  loading: boolean
  data: UnfollowResult | null
}

const useUnFollow = (): UseUnFollowReturn => {
  const { data: sessionClient } = useSessionClient()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<UnfollowResult | null>(null)

  const execute = async (
    request: CreateUnfollowRequest
  ): Promise<
    ResultAsync<UnfollowResult, UnexpectedError | UnauthenticatedError>
  > => {
    setLoading(true)

    // @ts-ignore - Handle potential type issues with sessionClient
    const result = await unfollow(sessionClient, request)

    setData(result?.isOk() ? result.value : null)
    setLoading(false)

    return result
  }

  return {
    execute,
    loading,
    data
  }
}

export default useUnFollow
