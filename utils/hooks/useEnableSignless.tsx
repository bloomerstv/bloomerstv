import {
  EnableSignlessMutation,
  EnableSignlessResult,
  ResultAsync,
  UnauthenticatedError,
  UnexpectedError,
  useSessionClient
} from '@lens-protocol/react'
import { useState, useCallback, useEffect } from 'react'

const useEnableSignless = () => {
  const { data: client } = useSessionClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [result, setResult] = useState<EnableSignlessResult | null>(null)

  // Reference to track if component is mounted
  const [isMounted, setIsMounted] = useState(true)

  // Set up cleanup on unmount
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // Reset function to clear states
  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setResult(null)
  }, [])

  const executeEnableSignless = useCallback(async () => {
    if (!client) {
      const clientError = new Error('Client is not available')
      setError(clientError)
      return Promise.reject(clientError)
    }

    setLoading(true)
    setError(null)

    try {
      const response = await client.mutation(EnableSignlessMutation, {})

      // Only update state if component is still mounted
      if (isMounted) {
        response.match(
          (data) => {
            console.log('EnableSignless response', data)
            setResult(data)
            setLoading(false)
          },
          (err) => {
            console.error('EnableSignless error', err)
            setError(err)

            setLoading(false)
          }
        )
      }

      return response
    } catch (err) {
      // Only update state if component is still mounted
      if (isMounted) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
        setLoading(false)
      }
      return Promise.reject(err)
    }
  }, [client, isMounted])

  return {
    enableSignless: executeEnableSignless,
    loading,
    error,
    result,
    reset
  }
}

export default useEnableSignless
