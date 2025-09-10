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
  isLensAuthenticated: boolean
  farcasterToken: string | null
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
  const { data: farcasterAuthData, loading: fcAuthLoading } =
    useVerifyFarcasterAuthQuery({
      variables: { token: farcasterToken || '' },
      skip: !farcasterToken,
      fetchPolicy: 'no-cache'
    })

  // Check for Farcaster mini app authentication on mount
  useEffect(() => {
    const checkFarcasterAuth = async () => {
      try {
        // Try to get token from Farcaster mini app SDK
        const result = await sdk.quickAuth.getToken()
        // console.log('Farcaster mini app SDK getToken response:', result)

        if (result?.token) {
          setFarcasterToken(result?.token)

          // just for debugging - remove later
          console.log(
            'Farcaster token obtained from mini app SDK',
            result?.token
          )
        }
      } catch {
        console.log('Farcaster mini app SDK getToken failed')
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
    }
  }, [farcasterAuthData])

  // Logout function for Farcaster
  const logoutFarcaster = useCallback(() => {
    setFarcasterUser(null)
    setFarcasterToken(null)
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
    isLensAuthenticated: Boolean(data && data.role !== Role.OnboardingUser),
    farcasterToken,
    error: error || accountError || null,
    isLoading: loading || accountLoading || fcAuthLoading,
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
