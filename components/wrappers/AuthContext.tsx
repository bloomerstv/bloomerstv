import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react'
import { fetchAccount } from '@lens-protocol/client/actions'
import {
  Account,
  AuthenticatedUser,
  Role,
  useAuthenticatedUser,
  usePublicClient
} from '@lens-protocol/react'

export interface AuthContextType {
  authenticatedUser: AuthenticatedUser | null | undefined
  account: Account | null | undefined
  isAuthenticated: boolean
  error: Error | null
  isLoading: boolean
  isError: boolean
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

        setAccount(accountResult.value)
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
    isAuthenticated: Boolean(data && data.role !== Role.OnboardingUser),
    error: error || accountError || null,
    isLoading: loading || accountLoading,
    isError: Boolean(error || accountError)
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
