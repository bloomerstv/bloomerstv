'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { LoadingButton } from '@mui/lab'
import toast from 'react-hot-toast'
import { sdk } from '@farcaster/miniapp-sdk'

interface FarcasterLoginButtonProps {
  onSuccess?: () => void
}

interface FarcasterUser {
  fid: number
  username: string
  displayName?: string
  pfpUrl?: string
  bio?: string
  custody?: string
  verifiedAddresses?: string[]
  connectedAddress?: string
}

export const FarcasterLoginButton = ({
  onSuccess
}: FarcasterLoginButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [farcasterUser, setFarcasterUser] = useState<FarcasterUser | null>(null)
  const [showDebugInfo, setShowDebugInfo] = useState(false)
  const [isInMiniApp, setIsInMiniApp] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  // Check if we're in a mini app context
  useEffect(() => {
    // Add preconnect for better performance
    if (typeof document !== 'undefined') {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = 'https://auth.farcaster.xyz'
      document.head.appendChild(link)
    }

    // Check if we're in a Farcaster mini app by trying to get a token
    const checkMiniApp = async () => {
      try {
        // Try to get a token - this will only work in a mini app
        const { token: authToken } = await sdk.quickAuth.getToken()
        if (authToken) {
          setIsInMiniApp(true)
          console.log('Running in Farcaster mini app')
        }
      } catch {
        console.log('Not running in Farcaster mini app')
        setIsInMiniApp(false)
      }
    }

    checkMiniApp()
  }, [])

  const handleQuickAuth = useCallback(async () => {
    setIsLoading(true)

    try {
      // Quick Auth flow - get authenticated token
      const { token: authToken } = await sdk.quickAuth.getToken()

      if (authToken) {
        console.log('Quick Auth token received:', authToken)
        setToken(authToken)

        // Decode JWT to get user info (basic parsing, you'd validate on backend)
        const payload = JSON.parse(atob(authToken.split('.')[1]))
        console.log('Token payload:', payload)

        // The token contains the FID in the 'sub' field
        const fid = payload.sub || payload.fid

        // Create user object from token data
        const user: FarcasterUser = {
          fid: parseInt(fid) || 0,
          username: payload.username || `fid:${fid}`,
          displayName: payload.displayName,
          pfpUrl: payload.pfpUrl,
          bio: payload.bio,
          custody: payload.custody,
          verifiedAddresses: payload.verifiedAddresses || [],
          connectedAddress: payload.connectedAddress
        }

        setFarcasterUser(user)
        toast.success(`Welcome, @${user.username}!`)
        setShowDebugInfo(true) // Show debug info for testing

        // Store token for authenticated API calls
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('farcaster_token', authToken)
        }

        // Call onSuccess to close dialog if needed
        onSuccess?.()
      }
    } catch (error) {
      console.error('Quick Auth error:', error)
      toast.error('Failed to authenticate with Farcaster')
    } finally {
      setIsLoading(false)
    }
  }, [onSuccess])

  // Make an authenticated API call example
  const makeAuthenticatedRequest = useCallback(async (url: string) => {
    try {
      // Use the Quick Auth fetch method which automatically adds the token
      const response = await sdk.quickAuth.fetch(url)
      return response
    } catch (error) {
      console.error('Authenticated request failed:', error)
      throw error
    }
  }, [])

  const handleSignOut = useCallback(() => {
    setFarcasterUser(null)
    setShowDebugInfo(false)
    setToken(null)
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('farcaster_token')
    }
    console.log('User signed out')
  }, [])

  // If already authenticated, show user info
  if (farcasterUser) {
    return (
      <div className="space-y-2">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-300 dark:border-green-700">
          <div className="text-sm font-bold text-green-700 dark:text-green-400 mb-2">
            ✅ Farcaster Connected
          </div>
          <div className="text-sm text-s-text space-y-1">
            <div>
              <strong>Username:</strong> @{farcasterUser.username}
            </div>
            <div>
              <strong>FID:</strong> {farcasterUser.fid}
            </div>
            {farcasterUser.displayName && (
              <div>
                <strong>Display Name:</strong> {farcasterUser.displayName}
              </div>
            )}
            {farcasterUser.bio && (
              <div className="mt-2">
                <strong>Bio:</strong> {farcasterUser.bio}
              </div>
            )}
            {farcasterUser.pfpUrl && (
              <div className="mt-2">
                <img
                  src={farcasterUser.pfpUrl}
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
              </div>
            )}
            {farcasterUser.custody && (
              <div className="mt-2">
                <strong>Custody Address:</strong> {farcasterUser.custody}
              </div>
            )}
            {farcasterUser.connectedAddress && (
              <div>
                <strong>Connected Address:</strong>{' '}
                {farcasterUser.connectedAddress}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowDebugInfo(!showDebugInfo)}
          className="text-xs text-blue-500 hover:text-blue-600 underline mx-auto block"
        >
          {showDebugInfo ? 'Hide' : 'Show'} Debug Info (Testing)
        </button>

        {showDebugInfo && (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-2 text-xs">
            <div className="font-bold text-sm mb-2">
              🔍 Debug Info (Testing)
            </div>
            <div>
              <strong>Full User Data:</strong>
              <pre className="mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded text-xs overflow-auto">
                {JSON.stringify(farcasterUser, null, 2)}
              </pre>
            </div>
            {farcasterUser.verifiedAddresses &&
              farcasterUser.verifiedAddresses.length > 0 && (
                <div className="mt-2">
                  <strong>Verified Addresses:</strong>
                  <ul className="ml-4 mt-1">
                    {farcasterUser.verifiedAddresses.map((addr, index) => (
                      <li key={index}>{addr}</li>
                    ))}
                  </ul>
                </div>
              )}
            <div className="mt-2">
              <strong>In Mini App:</strong> {isInMiniApp ? 'Yes' : 'No'}
            </div>
            {token && (
              <div className="mt-2">
                <strong>JWT Token (first 50 chars):</strong>
                <div className="font-mono text-xs break-all">
                  {token.substring(0, 50)}...
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleSignOut}
          className="text-xs text-red-500 hover:text-red-600 underline mx-auto block mt-2"
        >
          Sign Out (Testing)
        </button>

        {/* Example authenticated request button */}
        {isInMiniApp && (
          <button
            onClick={async () => {
              try {
                // Example: fetch user data from your backend
                const response = await makeAuthenticatedRequest('/api/user')
                console.log('Authenticated request response:', response)
                toast.success('Authenticated request successful!')
              } catch {
                toast.error('Authenticated request failed')
              }
            }}
            className="text-xs text-blue-500 hover:text-blue-600 underline mx-auto block"
          >
            Test Authenticated Request
          </button>
        )}
      </div>
    )
  }

  // Show sign in options
  return (
    <div className="space-y-3">
      {/* Quick Auth - only show if in mini app */}
      {isInMiniApp ? (
        <>
          <LoadingButton
            variant="contained"
            fullWidth
            onClick={handleQuickAuth}
            loading={isLoading}
            disabled={isLoading}
            startIcon={!isLoading && <span className="text-lg">⚡</span>}
            sx={{
              borderRadius: '24px',
              padding: '12px 0',
              backgroundColor: '#8b5cf6',
              '&:hover': {
                backgroundColor: '#7c3aed'
              },
              '&.Mui-disabled': {
                backgroundColor: '#8b5cf6',
                opacity: 0.7
              }
            }}
          >
            Quick Auth with Farcaster
          </LoadingButton>

          <div className="text-xs text-center text-s-text opacity-70">
            Authenticate instantly with your Farcaster account
          </div>
        </>
      ) : (
        <>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-300 dark:border-purple-700">
            <div className="text-sm font-bold text-purple-700 dark:text-purple-400 mb-2">
              🟪 Farcaster Sign In
            </div>
            <div className="text-xs text-s-text">
              Quick Auth is only available when using this app inside Farcaster.
            </div>
            <div className="text-xs text-s-text mt-2">
              To sign in with Farcaster on the web, please use the "Connect
              Wallet" button below and connect with a Farcaster-linked wallet.
            </div>
          </div>
        </>
      )}

      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-center text-gray-500">
          In Mini App: {isInMiniApp ? '✓' : '✗'}
        </div>
      )}
    </div>
  )
}
