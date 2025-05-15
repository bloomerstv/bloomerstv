import { enableSignless } from '@lens-protocol/client/actions'
import {
  EnableSignlessResult,
  usePublicClient,
  UnexpectedError,
  SessionClient,
  ResultAsync,
  UnauthenticatedError
} from '@lens-protocol/react'
import { useState, useCallback, useEffect, useRef } from 'react'

interface UseEnableSignlessReturn {
  execute: () => Promise<
    ResultAsync<EnableSignlessResult, UnexpectedError | UnauthenticatedError>
  >
  loading: boolean
  error: UnexpectedError | UnauthenticatedError | null
  result: EnableSignlessResult | null
  reset: () => void
}

const useEnableSignless = (): UseEnableSignlessReturn => {
  const publicClient = usePublicClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<
    UnexpectedError | UnauthenticatedError | null
  >(null)
  const [result, setResult] = useState<EnableSignlessResult | null>(null)

  // Reference to track if component is mounted
  const isMountedRef = useRef(true)

  // Set up cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Reset function to clear states
  const reset = useCallback(() => {
    if (!isMountedRef.current) return
    setLoading(false)
    setError(null)
    setResult(null)
  }, [])

  const executeEnableSignless = async (): Promise<
    ResultAsync<EnableSignlessResult, UnexpectedError | UnauthenticatedError>
  > => {
    if (!publicClient?.currentSession?.isSessionClient()) {
      const clientError = new UnexpectedError('Session client is not available')
      setError(clientError)
      return Promise.reject(clientError)
    }

    setLoading(true)
    setError(null)

    try {
      // @ts-ignore
      const response = await enableSignless(publicClient.currentSession)

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        if (response.isOk()) {
          setResult(response.value)
        } else if (response.isErr()) {
          setError(response.error)
        }
        setLoading(false)
      }

      return response
    } catch (err) {
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setError(
          err instanceof UnexpectedError
            ? err
            : new UnexpectedError(String(err))
        )
        setLoading(false)
      }
      return Promise.reject(err)
    }
  }

  return {
    execute: executeEnableSignless,
    loading,
    error,
    result,
    reset
  }
}

export default useEnableSignless
