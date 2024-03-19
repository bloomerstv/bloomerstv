import {
  SessionType,
  useLogin,
  useProfilesManaged,
  useSession
} from '@lens-protocol/react-web'
import LoadingButton from '@mui/lab/LoadingButton'
import { Button, CircularProgress } from '@mui/material'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import React from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import formatHandle from '../../../utils/lib/formatHandle'
import getAvatar from '../../../utils/lib/getAvatar'
import clsx from 'clsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { usePathname } from 'next/navigation'

const LoginPage = () => {
  const [loginAsGuest, setLoginAsGuest] = React.useState(false)
  const path = usePathname()
  const { data, loading } = useSession()
  const { disconnectAsync } = useDisconnect()
  const { isConnected, address, isConnecting, isReconnecting } = useAccount()
  const { openConnectModal } = useConnectModal()
  const [selectedProfileId, setSelectedProfileId] = React.useState<string>()
  const { data: profiles, loading: loadingProfiles } = useProfilesManaged({
    // @ts-ignore
    for: address,
    includeOwned: true
  })

  const { execute, loading: logging } = useLogin()
  if (
    loginAsGuest ||
    loading ||
    data?.type === SessionType.WithProfile ||
    path !== '/'
  ) {
    return null
  }
  return (
    <div className="absolute z-50 top-0 bottom-0 left-0 right-0 w-full h-screen bg-p-bg p-8 overflow-auto no-scrollbar">
      {isConnected ? (
        // login page
        <div className="between-col h-full">
          <div className="font-bold text-5xl mt-16 mb-8">
            Login with your profile
          </div>

          <div className="start-col space-y-8 ">
            <div className="text-s-text font-bold text-lg">
              Select a profile to sign in with{' '}
            </div>
            <div className="start-col w-full rounded-xl bg-s-bg border border-p-border">
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
                      startIcon={<ArrowForwardIcon />}
                      className="text-3xl"
                      sx={{
                        borderRadius: '2rem'
                      }}
                    >
                      Login
                    </LoadingButton>
                  </div>
                </div>
              ))}
            </div>

            {/* continue as guest */}
            <div className="start-col space-y-6 w-full">
              <Button
                startIcon={<PermIdentityIcon />}
                onClick={() => setLoginAsGuest(true)}
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
                className="text-3xl"
                sx={{
                  borderRadius: '2rem',
                  padding: '1rem 0'
                }}
              >
                Continue as guest
              </Button>

              {/* // disconnect wallet */}
              <div
                onClick={async () => {
                  await disconnectAsync()
                }}
                className="text-s-text font-bold text-sm"
              >
                Disconnect wallet
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="between-col h-full">
          {/* Connect Page  */}

          <div className="font-bold text-7xl my-16">Connect your wallet</div>

          <div className="start-col w-full my-6 space-y-8 ">
            <LoadingButton
              variant="contained"
              onClick={openConnectModal}
              loading={isConnecting || isReconnecting}
              loadingPosition="start"
              startIcon={<AccountBalanceWalletIcon />}
              fullWidth
              size="large"
              sx={{
                borderRadius: '2rem',
                padding: '1rem 0'
              }}
            >
              Connect
            </LoadingButton>

            {/* continue as guest */}

            <Button
              startIcon={<PermIdentityIcon />}
              onClick={() => setLoginAsGuest(true)}
              variant="contained"
              color="secondary"
              fullWidth
              size="large"
              className="text-3xl"
              sx={{
                borderRadius: '2rem',
                padding: '1rem 0'
              }}
            >
              Continue as guest
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoginPage
