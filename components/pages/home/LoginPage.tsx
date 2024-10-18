import {
  SessionType,
  useLogin,
  useProfilesManaged,
  useSession,
  useUpdateProfileManagers
} from '@lens-protocol/react-web'
import LoadingButton from '@mui/lab/LoadingButton'
import { Button, CircularProgress } from '@mui/material'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import React, { useEffect } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import formatHandle from '../../../utils/lib/formatHandle'
import getAvatar from '../../../utils/lib/getAvatar'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import toast from 'react-hot-toast'
import { useTheme } from '../../wrappers/TailwindThemeProvider'
import WalletIcon from '@mui/icons-material/Wallet'
import { getShortAddress } from '../../../utils/lib/getShortAddress'
import useEns from '../../../utils/hooks/useEns'
import getStampFyiURL from '../../../utils/getStampFyiURL'

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

  const { ensAvatar, ensName } = useEns({
    address: profiles?.length === 0 ? address : null
  })
  const {
    execute: enableProfileManager,
    loading: loadingEnableProfileManager,
    error
  } = useUpdateProfileManagers()

  const { theme } = useTheme()

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  const { execute, loading: logging } = useLogin()

  if (
    loginAsGuest ||
    loading ||
    (data?.type === SessionType.WithProfile && data?.profile?.signless) ||
    data?.type === SessionType.JustWallet ||
    path !== '/'
  ) {
    return null
  }
  return (
    <div className="absolute z-[60] top-0 bottom-0 left-0 right-0 w-full h-dvh bg-p-bg p-8 overflow-auto no-scrollbar">
      {isConnected ? (
        <>
          {data?.type !== SessionType.WithProfile ? (
            // login page
            <div className="between-col h-full">
              <div className="font-bold text-5xl mt-4 mb-8">
                Login with your Lens profile
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
                          onClick={async () => {
                            setSelectedProfileId(profile.id)
                            const data = await execute({
                              // @ts-ignore
                              address: address,
                              profileId: profile.id
                            })

                            if (data?.isSuccess() && data?.value?.signless) {
                              window?.location.reload()
                            } else {
                              toast.error('Failed to login')
                            }
                          }}
                          loading={logging && selectedProfileId === profile.id}
                          loadingPosition="start"
                          startIcon={
                            <img
                              src={`/Lens-Icon-T-${theme === 'dark' ? 'Black' : 'White'}.svg`}
                              className="sm:w-7 sm:h-7 w-6 h-6 rounded-full"
                            />
                          }
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

                  {profiles?.length === 0 && !loadingProfiles && (
                    <div className="centered-row w-full text-s-text p-4 text-sm">
                      You don’t have any lens profiles linked to this wallet
                      address. However, You can log in with your wallet and chat
                      with streamers
                    </div>
                  )}

                  {profiles?.length === 0 && !loadingProfiles && (
                    <div className="px-4 pb-4 space-y-4">
                      <div className="start-center-row gap-x-3">
                        <img
                          src={ensAvatar ?? getStampFyiURL(String(address))}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="text-xs sm:text-sm text-s-text font-semibold">
                            {getShortAddress(String(address), 20)}
                          </div>
                          <div>
                            {ensName ?? getShortAddress(String(address))}
                          </div>
                        </div>
                      </div>
                      <LoadingButton
                        startIcon={<WalletIcon />}
                        onClick={async () => {
                          const data = await execute({
                            // @ts-ignore
                            address: address
                          })

                          if (!data?.isSuccess()) {
                            toast.error('Failed to login')
                          }
                        }}
                        loading={logging}
                        loadingPosition="start"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        className="text-3xl"
                        sx={{
                          borderRadius: '1rem',
                          padding: '1rem 0'
                        }}
                      >
                        Login with Wallet
                      </LoadingButton>
                    </div>
                  )}
                </div>

                {/* continue as guest */}
                <div className="start-col space-y-4 w-full">
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

                  <div className="centered-row w-full text-s-text text-xs">
                    If you're unable to login, please try clearing this site's
                    cache and refreshing the page.
                  </div>

                  {/* // disconnect wallet */}
                  <div
                    onClick={async () => {
                      await disconnectAsync()
                    }}
                    className="text-s-text font-bold text-sm "
                  >
                    Disconnect wallet
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {!data?.profile?.signless && (
                <div className="between-col h-full">
                  <div>
                    <div className="font-bold text-5xl mt-16 mb-8">
                      Enable signless transactions
                    </div>
                    <div className="text-s-text font-semibold text-sm mb-4">
                      This will allow you to post onchain without signing. No
                      fees required.
                    </div>
                  </div>

                  {/* continue as guest */}
                  <div className="start-col space-y-6 w-full">
                    <LoadingButton
                      startIcon={<AutoAwesomeIcon />}
                      onClick={async () => {
                        try {
                          await enableProfileManager({
                            approveSignless: true
                          })
                        } catch (e) {
                          // @ts-ignore
                          toast.error(e.message)
                        }
                      }}
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      className="text-3xl"
                      sx={{
                        borderRadius: '2rem',
                        padding: '1rem 0'
                      }}
                      loadingPosition="start"
                      loading={loadingEnableProfileManager}
                    >
                      Approve signless
                    </LoadingButton>
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
              )}
            </>
          )}
        </>
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
