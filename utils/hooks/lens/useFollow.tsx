import { useState } from 'react'
import {
  CreateFollowRequest,
  FollowResult,
  ResultAsync,
  UnauthenticatedError,
  UnexpectedError,
  useSessionClient
} from '@lens-protocol/react'
import { follow } from '@lens-protocol/client/actions'

interface UseFollowReturn {
  execute: (
    createFollowRequest: CreateFollowRequest
  ) => Promise<
    ResultAsync<FollowResult, UnexpectedError | UnauthenticatedError>
  >
  loading: boolean
  data: FollowResult | null
}

const useFollow = (): UseFollowReturn => {
  const { data: sessionClient } = useSessionClient()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<FollowResult | null>(null)

  const execute = async (
    createFollowRequest: CreateFollowRequest
  ): Promise<
    ResultAsync<FollowResult, UnexpectedError | UnauthenticatedError>
  > => {
    setLoading(true)

    // @ts-ignore - Handle potential type issues with sessionClient
    const result = await follow(sessionClient, createFollowRequest)

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

export default useFollow
