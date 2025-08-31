'use client'
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback
} from 'react'
import { fetchAccount } from '@lens-protocol/client/actions'
import {
  Account,
  AuthenticatedUser,
  Role,
  useAuthenticatedUser,
  usePublicClient
} from '@lens-protocol/react'
import { sdk } from '@farcaster/miniapp-sdk'
import { useVerifyFarcasterAuthQuery } from '../../graphql/generated'

export interface FarcasterUser {
  fid: number
  username: string
  displayName?: string
  pfpUrl?: string
  bio?: string
  followerCount?: number
  followingCount?: number
  verifiedAddresses?: string[]
  activeStatus?: string
  powerBadge?: boolean
}

export interface AuthContextType {
  authenticatedUser: AuthenticatedUser | null | undefined
  account: Account | null | undefined
  isAuthenticated: boolean
  authenticatedFarcasterUser: FarcasterUser | null
  isFarcasterAuthenticated: boolean
  error: Error | null
  isLoading: boolean
  isError: boolean
  logoutFarcaster: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const { data, error, loading } = useAuthenticatedUser()
  const { currentSession } = usePublicClient()

  const [account, setAccount] = useState<Account | null | undefined>(undefined)
  const [accountError, setAccountError] = useState<Error | null>(null)
  const [accountLoading, setAccountLoading] = useState<boolean>(false)

  // Farcaster state
  const [farcasterUser, setFarcasterUser] = useState<FarcasterUser | null>(null)
  const [farcasterToken, setFarcasterToken] = useState<string | null>(null)

  // Query to verify Farcaster auth when we have a token
  const { data: farcasterAuthData } = useVerifyFarcasterAuthQuery({
    variables: { token: farcasterToken || '' },
    skip: !farcasterToken,
    fetchPolicy: 'no-cache'
  })

  // Check for Farcaster mini app authentication on mount
  useEffect(() => {
    const checkFarcasterAuth = async () => {
      try {
        // Try to get token from Farcaster mini app SDK
        const { token: authToken } = await sdk.quickAuth.getToken()

        if (authToken) {
          setFarcasterToken(authToken)

          // Store token in session storage for persistence
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('farcaster_token', authToken)
          }
        }
      } catch {
        // Not in a mini app or no authentication
        // Try to restore from session storage
        if (typeof window !== 'undefined') {
          const storedToken = sessionStorage.getItem('farcaster_token')
          const storedUser = sessionStorage.getItem('farcaster_user')

          if (storedToken) {
            setFarcasterToken(storedToken)
          }

          if (storedUser) {
            try {
              const user = JSON.parse(storedUser)
              setFarcasterUser(user)
            } catch {
              // Invalid stored data
              sessionStorage.removeItem('farcaster_user')
            }
          }
        }
      }
    }

    checkFarcasterAuth()
  }, [])

  // Handle Farcaster auth data when it arrives from backend verification
  useEffect(() => {
    if (
      farcasterAuthData?.verifyFarcasterAuth?.success &&
      farcasterAuthData.verifyFarcasterAuth.user
    ) {
      const user = farcasterAuthData.verifyFarcasterAuth.user as FarcasterUser
      setFarcasterUser(user)

      // Store user data in session storage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('farcaster_user', JSON.stringify(user))
      }
    }
  }, [farcasterAuthData])

  // Logout function for Farcaster
  const logoutFarcaster = useCallback(() => {
    setFarcasterUser(null)
    setFarcasterToken(null)
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('farcaster_token')
      sessionStorage.removeItem('farcaster_user')
    }
  }, [])

  // Handle Lens account fetching
  useEffect(() => {
    if (!data?.address || data?.role === Role.OnboardingUser) {
      setAccount(undefined)
      return
    }

    setAccountLoading(true)

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

        setAccount(accountResult.value as Account)
        setAccountError(null)
      } catch (err) {
        setAccountError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setAccountLoading(false)
      }
    }

    getAccountData()
  }, [data?.address, currentSession])

  const value = {
    authenticatedUser: data,
    account,
    isAuthenticated:
      Boolean(data && data.role !== Role.OnboardingUser) ||
      Boolean(farcasterUser),
    authenticatedFarcasterUser: farcasterUser,
    isFarcasterAuthenticated: Boolean(farcasterUser),
    error: error || accountError || null,
    isLoading: loading || accountLoading,
    isError: Boolean(error || accountError),
    logoutFarcaster
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
