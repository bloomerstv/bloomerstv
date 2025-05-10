import LoadingButton from '@mui/lab/LoadingButton'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { useAccount as useFetchAccount } from '@lens-protocol/react'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import { TextField } from '@mui/material'
import toast from 'react-hot-toast'
import { useTheme } from '../wrappers/TailwindThemeProvider'
import { stringToLength } from '../../utils/stringToLength'
import useCreateAccount from '../../utils/hooks/lens/useCreateAccount'

const SignupComponent = ({
  setOpen,
  setOpenSignup
}: {
  openSignup: boolean
  setOpen: (value: boolean) => void
  setOpenSignup: (value: boolean) => void
}) => {
  // const { data } = useSession()
  const { isConnected, address, isConnecting, isReconnecting } = useAccount()
  const { openConnectModal } = useConnectModal()
  const [localName, setLocalName] = useState('')
  const { data, loading } = useFetchAccount({
    username: {
      localName
    }
  })

  const { execute: createAccount, loading: creating } = useCreateAccount()

  const { theme } = useTheme()

  const onHandleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return
    setLocalName(e.target.value)
  }

  const handleCreateHandle = async () => {
    try {
      if (!loading && !data?.address) {
        toast.error('Handle already exists')
        return
      }

      const createProfileResult = await createAccount({
        username: {
          localName: localName
        },
        metadataUri: ''
      })

      if (createProfileResult.isErr()) {
        toast.error(createProfileResult.error.message)
        return
      }

      toast.success('Profile created successfully')
      setOpenSignup(false)
      setOpen(true)
    } catch (e) {
      console.error(e)
      toast.error(stringToLength(String(e), 100))
    }
  }

  return (
    <div className="sm:px-0 px-3 py-2">
      <div className="text-2xl font-bold">Create your handle</div>
      <div className="text-s-text font-semibold text-xs mt-0.5 mb-4">
        This will be the last handle you'll ever need. Streaming & Live Chat on
        BloomersTV requires a Lens profile
      </div>

      {address && (
        <div>
          <TextField
            className="w-full text-xl"
            label="Handle"
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
          {localName && !data && !loading && (
            <div className="text-red-500 text-xs font-semibold mt-1">
              {'Username not available!'}
            </div>
          )}
          <div className="text-s-text text-xs mt-1 mb-4">
            Connected Wallet: {address}
          </div>
        </div>
      )}

      {isConnected ? (
        <LoadingButton
          variant="contained"
          onClick={handleCreateHandle}
          loading={loading || creating || isConnecting || isReconnecting}
          loadingPosition="start"
          className="w-full"
          sx={{
            borderRadius: '24px',
            padding: '12px 0'
          }}
          disabled={loading || creating || !localName}
          startIcon={
            <img
              src={`/Lens-Icon-T-${theme === 'dark' ? 'Black' : 'White'}.svg`}
              className="sm:w-7 sm:h-7 w-6 h-6 rounded-full"
            />
          }
        >
          {creating ? 'Creating...' : 'Create for 8 WMATIC'}
        </LoadingButton>
      ) : (
        <div className="start-row space-x-4">
          <LoadingButton
            variant="contained"
            onClick={openConnectModal}
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
        </div>
      )}
    </div>
  )
}

export default SignupComponent
