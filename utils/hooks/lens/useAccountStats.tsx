import { useEffect, useState } from 'react'
import {
  useSessionClient,
  UnexpectedError,
  AccountStats,
  AccountStatsRequest
} from '@lens-protocol/react'
import { fetchAccountStats } from '@lens-protocol/client/actions'

interface UseAccountStatsReturn {
  loading: boolean
  data: AccountStats | null
  error: UnexpectedError | null
}

const useAccountStats = (
  request: AccountStatsRequest
): UseAccountStatsReturn => {
  const { data: sessionClient } = useSessionClient()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<AccountStats | null>(null)
  const [error, setError] = useState<UnexpectedError | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // @ts-ignore - Handle potential type issues with sessionClient
      const result = await fetchAccountStats(sessionClient, request)

      if (result?.isOk()) {
        setData(result.value)
      } else if (result?.isErr()) {
        setError(result.error)
      }
      setLoading(false)
    }

    fetchData()
  }, [request])

  return {
    loading,
    data,
    error
  }
}

export default useAccountStats
