'use client'
import React, { useState, useCallback } from 'react'
import {
  AuthKitProvider,
  SignInButton,
  StatusAPIResponse
} from '@farcaster/auth-kit'
import '@farcaster/auth-kit/styles.css'
import toast from 'react-hot-toast'

interface FarcasterLoginButtonProps {
  onSuccess?: () => void
}

const config = {
  domain: typeof window !== 'undefined' ? window.location.host : 'localhost',
  siweUri:
    typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3000',
  rpcUrl: 'https://mainnet.optimism.io',
  relay: 'https://relay.farcaster.xyz'
}

export const FarcasterLoginButton = ({
  onSuccess = () => {}
}: FarcasterLoginButtonProps) => {
  const [farcasterUser, setFarcasterUser] = useState<StatusAPIResponse | null>(
    null
  )
  const [showDebugInfo, setShowDebugInfo] = useState(false)

  const handleSuccess = useCallback((res: StatusAPIResponse) => {
    console.log('Farcaster login successful:', res)
    setFarcasterUser(res)
    toast.success(`Welcome, @${res.username || 'Farcaster user'}!`)
    setShowDebugInfo(true) // Automatically show debug info for testing
    onSuccess?.()
  }, [])

  const handleSignOut = useCallback(() => {
    setFarcasterUser(null)
    setShowDebugInfo(false)
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
              <strong>Full Response:</strong>
              <pre className="mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded text-xs overflow-auto">
                {JSON.stringify(farcasterUser, null, 2)}
              </pre>
            </div>
            {farcasterUser.verifications &&
              farcasterUser.verifications.length > 0 && (
                <div className="mt-2">
                  <strong>Verified Addresses:</strong>
                  <ul className="ml-4 mt-1">
                    {farcasterUser.verifications.map((addr, index) => (
                      <li key={index}>{addr}</li>
                    ))}
                  </ul>
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
      </div>
    )
  }

  // Show sign in button
  return (
    <AuthKitProvider config={config}>
      <div className="space-y-2">
        <SignInButton
          onSuccess={handleSuccess}
          onError={(error) => {
            console.error('Farcaster login error:', error)
            toast.error(`Login failed: ${error?.message || 'Unknown error'}`)
          }}
        />

        <div className="text-xs text-center text-s-text opacity-70">
          Scan QR code with Warpcast or click to continue in app
        </div>
      </div>
    </AuthKitProvider>
  )
}
