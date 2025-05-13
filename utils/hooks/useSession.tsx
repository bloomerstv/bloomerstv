import { fetchAccount } from '@lens-protocol/client/actions'
import {
  Account,
  AuthenticatedUser,
  useAuthenticatedUser,
  usePublicClient
} from '@lens-protocol/react'
import { useMemo, useState, useEffect } from 'react'

interface SessionData {
  /** The authenticated user data from Lens Protocol */
  authenticatedUser: AuthenticatedUser | null | undefined
  /** Account information related to the authenticated user */
  account: Account | null | undefined
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean
  /** Combined error from authentication or account fetching */
  error: Error | null
  /** Whether any data is currently loading */
  isLoading: boolean
  /** Whether any error has occurred */
  isError: boolean
}

/**
 * Custom hook that manages authentication session data.
 * Combines Lens Protocol authentication with account information.
 *
 * @returns {SessionData} Object containing authentication and account details
 */
const useSession = (): SessionData => {
  const { data, error, loading } = useAuthenticatedUser()
  const { currentSession } = usePublicClient()

  // Store actual account data in state
  const [account, setAccount] = useState<Account | null | undefined>(undefined)
  const [accountError, setAccountError] = useState<Error | null>(null)
  const [accountLoading, setAccountLoading] = useState<boolean>(false)

  // Fetch account in an effect, not during render
  useEffect(() => {
    if (!data?.address) {
      setAccount(undefined)
      return
    }

    setAccountLoading(true)

    // Simulate fetching account - this could be an API call or whatever method
    // the Lens Protocol provides for getting account data outside of hooks
    const getAccountData = async () => {
      try {
        // @ts-ignore
        const accountResult = await fetchAccount(currentSession, {
          address: data.address
        })

        if (accountResult.isErr()) {
          setAccountError(accountResult.error)
          return
        }
        const accountData = accountResult.value
        setAccount(accountData)
        setAccountError(null)
      } catch (err) {
        setAccountError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setAccountLoading(false)
      }
    }

    getAccountData()
  }, [data?.address])

  return useMemo(
    () => ({
      authenticatedUser: data,
      account,
      isAuthenticated: Boolean(data),
      error: error || accountError || null,
      isLoading: loading || accountLoading,
      isError: Boolean(error || accountError)
    }),
    [data, account, error, accountError, loading, accountLoading]
  )
}

export default useSession
