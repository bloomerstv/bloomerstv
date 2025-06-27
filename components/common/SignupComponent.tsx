import LoadingButton from '@mui/lab/LoadingButton'
import React, { useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import {
  Role,
  useAccount as useFetchAccount,
  useLogin
} from '@lens-protocol/react'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import { TextField } from '@mui/material'
import toast from 'react-hot-toast'
import { useTheme } from '../wrappers/TailwindThemeProvider'
import { stringToLength } from '../../utils/stringToLength'
import useCreateAccount from '../../utils/hooks/lens/useCreateAccount'
import { account as accountMetadata } from '@lens-protocol/metadata'
import { acl, storageClient } from '../../utils/lib/lens/storageClient'
import useSession from '../../utils/hooks/useSession'
import { signMessageWith } from '@lens-protocol/react/viem'
import { APP_ADDRESS } from '../../utils/config'
import { ConnectKitButton } from 'connectkit'

const SignupComponent = ({
  setOpen,
  setOpenSignup
}: {
  openSignup: boolean
  setOpen: (value: boolean) => void
  setOpenSignup: (value: boolean) => void
}) => {
  const { authenticatedUser } = useSession()
  const { execute: login, loading: loginLoading } = useLogin()
  const { isConnected, address, isConnecting, isReconnecting } = useAccount()
  const [localName, setLocalName] = useState('')
  const { data, loading } = useFetchAccount({
    username: {
      localName
    }
  })
  const { data: walletClient } = useWalletClient()

  const { execute: createAccount, loading: creating } = useCreateAccount()

  const { theme } = useTheme()

  const onHandleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return
    setLocalName(e.target.value)
  }

  const handleCreateUsername = async () => {
    try {
      if (!loading && data?.address) {
        toast.error('Username already exists')
        return
      }

      console.log('createAccount', localName)

      const account = accountMetadata({
        name: localName
      })

      const response = await storageClient.uploadAsJson(account, {
        acl: acl
      })

      await createAccount({
        username: {
          localName: localName
        },
        metadataUri: response?.uri
      })

      toast.success('Profile created successfully')
      setOpenSignup(false)
      setOpen(false)
    } catch (e) {
      console.error(e)
      toast.error(stringToLength(String(e), 100))
    }
  }

  return (
    <div className="sm:px-0 px-3 py-2">
      <div className="text-2xl font-bold">Create your account</div>
      <div className="text-s-text font-semibold text-xs mt-0.5 mb-4">
        Streaming & Live Chat on BloomersTV requires a Lens Account
      </div>

      {address && (
        <div>
          <TextField
            className="w-full text-xl"
            label="Username"
            variant="outlined"
            value={localName}
            onChange={onHandleChange}
            disabled={creating}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px'
              }
            }}
            size="medium"
            focused={true}
          />
          {localName && data && !loading && (
            <div className="text-red-500 text-xs font-semibold mt-1">
              {'Username not available!'}
            </div>
          )}
          {localName && data && loading && (
            <div className="text-s-text text-xs font-semibold mt-1">
              {'Checking username...'}
            </div>
          )}
          {localName && !data && !loading && (
            <div className="text-green-500 text-xs font-semibold mt-1">
              {'Username available!'}
            </div>
          )}
          <div className="text-s-text text-xs mt-1 mb-4">
            Connected Wallet: {address}
          </div>
        </div>
      )}

      {isConnected ? (
        authenticatedUser?.role === Role.OnboardingUser ? (
          <LoadingButton
            variant="contained"
            onClick={handleCreateUsername}
            loading={loading || creating || isConnecting || isReconnecting}
            loadingPosition="start"
            className="w-full"
            sx={{
              borderRadius: '24px',
              padding: '12px 0'
            }}
            disabled={loading || creating || !localName || data?.address}
            startIcon={
              <img
                src={`/Lens-Icon-T-${theme === 'dark' ? 'Black' : 'White'}.svg`}
                className="sm:w-7 sm:h-7 w-6 h-6 rounded-full"
              />
            }
          >
            {creating ? 'Creating...' : 'Create'}
          </LoadingButton>
        ) : (
          <LoadingButton
            variant="contained"
            onClick={async () => {
              if (!walletClient) {
                toast.error('Wallet client not available')
                return
              }
              const data = await login({
                onboardingUser: {
                  wallet: address,
                  app: APP_ADDRESS
                },
                signMessage: signMessageWith(walletClient)
              })

              if (data?.isErr()) {
                toast.error('Error signing in')
                return
              }
            }}
            loading={loginLoading}
            loadingPosition="start"
            className="w-full"
            sx={{
              borderRadius: '24px',
              padding: '12px 0'
            }}
            disabled={loginLoading}
            startIcon={
              <img
                src={`/Lens-Icon-T-${theme === 'dark' ? 'Black' : 'White'}.svg`}
                className="sm:w-7 sm:h-7 w-6 h-6 rounded-full"
              />
            }
          >
            {'Sign with wallet'}
          </LoadingButton>
        )
      ) : (
        <div className="start-row space-x-4">
          <ConnectKitButton.Custom>
            {({ show }) => (
              <LoadingButton
                variant="contained"
                onClick={show}
                loadingPosition="start"
                className="w-full"
                sx={{
                  borderRadius: '24px',
                  padding: '12px 0'
                }}
                startIcon={<AccountBalanceWalletIcon />}
              >
                Connect Wallet
              </LoadingButton>
            )}
          </ConnectKitButton.Custom>
        </div>
      )}
    </div>
  )
}

export default SignupComponent
