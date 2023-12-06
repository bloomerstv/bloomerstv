import {
  SessionType,
  useLogin,
  useProfiles,
  useSession
} from '@lens-protocol/react-web'
import { CircularProgress } from '@mui/material'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import clsx from 'clsx'
import React, { useEffect } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import getAvatar from '../../utils/lib/getAvatar'
import formatHandle from '../../utils/lib/formatHandle'
import LoadingButton from '@mui/lab/LoadingButton'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import LoginIcon from '@mui/icons-material/Login'
const LoginComponent = ({
  open,
  onClose
}: {
  open?: boolean
  onClose?: () => void
}) => {
  const { data } = useSession()
  const { disconnectAsync } = useDisconnect()
  const { isConnected, address, isConnecting, isReconnecting } = useAccount()
  const { openConnectModal } = useConnectModal()
  const [selectedProfileId, setSelectedProfileId] = React.useState<string>()
  const { data: profiles, loading: loadingProfiles } = useProfiles({
    where: {
      // @ts-ignore
      ownedBy: [address]
    }
  })
  const { execute, loading: logging } = useLogin()

  useEffect(() => {
    if (open && !isConnected && openConnectModal) {
      openConnectModal()
    }
  }, [open, isConnected])

  useEffect(() => {
    if (data?.type === SessionType.WithProfile) {
      if (onClose) {
        onClose()
      }
    }
  }, [data?.type])

  return (
    <div className="p-4 sm:p-0">
      {isConnected ? (
        <>
          <div className="text-2xl font-bold">Login with your profile</div>
          <div className="start-col my-4 w-full rounded-xl bg-s-bg border border-p-border">
            {loadingProfiles && (
              <div className="centered-row w-full p-4">
                <CircularProgress />
              </div>
            )}

            {profiles?.map((profile, i) => (
              <div
                className={clsx(
                  'between-row w-full p-4',
                  i < profiles.length - 1 && 'border-b border-p-border '
                )}
                key={profile?.id}
              >
                <div className="start-row space-x-4">
                  <img
                    src={getAvatar(profile)}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="text-s-text font-bold text-lg">
                    {formatHandle(profile)}
                  </div>
                </div>
                <div className="centered-row">
                  <LoadingButton
                    variant="contained"
                    onClick={() => {
                      setSelectedProfileId(profile.id)
                      execute({
                        // @ts-ignore
                        address: address,
                        profileId: profile.id
                      })
                    }}
                    loading={logging && selectedProfileId === profile.id}
                    loadingPosition="start"
                    startIcon={<LoginIcon />}
                    sx={{
                      borderRadius: '2rem'
                    }}
                    size="small"
                  >
                    Login
                  </LoadingButton>
                </div>
              </div>
            ))}
          </div>
          {/* // disconnect wallet */}
          <div
            onClick={async () => {
              await disconnectAsync()
            }}
            className="text-s-text hover:text-p-text cursor-pointer font-bold text-sm"
          >
            Disconnect wallet
          </div>
        </>
      ) : (
        <>
          <div className="text-2xl font-bold mb-4">Connect your wallet</div>

          <div className="start-row space-x-4">
            <LoadingButton
              variant="contained"
              onClick={openConnectModal}
              loading={isConnecting || isReconnecting}
              loadingPosition="start"
              startIcon={<AccountBalanceWalletIcon />}
            >
              Connect
            </LoadingButton>
          </div>
        </>
      )}
    </div>
  )
}

export default LoginComponent
