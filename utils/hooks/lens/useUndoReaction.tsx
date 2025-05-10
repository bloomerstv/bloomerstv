import { useState } from 'react'
import {
  UndoReactionRequest,
  UndoReactionResult,
  ResultAsync,
  UnauthenticatedError,
  UnexpectedError,
  useSessionClient
} from '@lens-protocol/react'
import { undoReaction } from '@lens-protocol/client/actions'

interface UseUndoReactionReturn {
  execute: (
    request: UndoReactionRequest
  ) => Promise<
    ResultAsync<UndoReactionResult, UnexpectedError | UnauthenticatedError>
  >
  loading: boolean
  data: UndoReactionResult | null
}

const useUndoReaction = (): UseUndoReactionReturn => {
  const { data: sessionClient } = useSessionClient()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<UndoReactionResult | null>(null)

  const execute = async (
    request: UndoReactionRequest
  ): Promise<
    ResultAsync<UndoReactionResult, UnexpectedError | UnauthenticatedError>
  > => {
    setLoading(true)

    // @ts-ignore - Handle potential type issues with sessionClient
    const result = await undoReaction(sessionClient, request)

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

export default useUndoReaction
