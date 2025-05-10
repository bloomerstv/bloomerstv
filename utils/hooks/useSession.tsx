import {
  Account,
  authenticatedUser,
  AuthenticatedUser,
  useAccount,
  useAuthenticatedUser,
  useSessionClient
} from '@lens-protocol/react'
import { useMemo } from 'react'

/**
 * Interface defining the return type of the useSession hook
 */
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

  const {
    data: account,
    error: accountError,
    loading: accountLoading
  } = useAccount({
    address: data?.address
  })

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
