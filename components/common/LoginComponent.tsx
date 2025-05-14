import { CircularProgress } from '@mui/material'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import clsx from 'clsx'
import React, { useEffect } from 'react'
import { useAccount, useDisconnect, useWalletClient } from 'wagmi'
import getAvatar from '../../utils/lib/getAvatar'
import formatHandle from '../../utils/lib/formatHandle'
import LoadingButton from '@mui/lab/LoadingButton'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import toast from 'react-hot-toast'
import WalletIcon from '@mui/icons-material/Wallet'
import useEns from '../../utils/hooks/useEns'
import getStampFyiURL from '../../utils/getStampFyiURL'
import { getShortAddress } from '../../utils/lib/getShortAddress'
import LoadingImage from '../ui/LoadingImage'
import {
  LoginParams,
  Role,
  useAccountsAvailable,
  useLogin
} from '@lens-protocol/react'
import { signMessageWith } from '@lens-protocol/react/viem'
import useSession from '../../utils/hooks/useSession'
import { APP_ADDRESS } from '../../utils/config'
// import useEnableSignless from '../../utils/hooks/useEnableSignless'

const LoginComponent = ({
  open,
  onClose
}: {
  open?: boolean
  onClose?: () => void
}) => {
  const { data: walletClient } = useWalletClient()
  const { disconnectAsync } = useDisconnect()
  const { isConnected, address, isConnecting, isReconnecting } = useAccount()
  const { openConnectModal } = useConnectModal()
  const [selectedAccountAddress, setSelectedAccountAddress] =
    React.useState<string>()
  const { data: profiles, loading: loadingProfiles } = useAccountsAvailable({
    managedBy: address,
    includeOwned: true
  })
  const { isAuthenticated, authenticatedUser } = useSession()

  const { ensAvatar, ensName } = useEns({
    address: profiles?.items?.length === 0 ? address : null
  })

  const { execute, loading: logging } = useLogin()

  // todo use enableSignless from lens in v3 instead of this
  // const { execute: enableSignless, loading, error } = useEnableSignless()

  // const {
  //   execute: enableProfileManager,
  //   loading,
  //   error
  // } = useUpdateProfileManagers()

  // useEffect(() => {
  //   if (error) {
  //     toast.error(error.message)
  //   }
  // }, [error])

  useEffect(() => {
    if (open && !isConnected && openConnectModal && !isAuthenticated) {
      openConnectModal()
    }
  }, [open, isConnected, isAuthenticated])

  return (
    <div className="p-4 sm:p-0">
      {isConnected ? (
        <>
          {!isAuthenticated ? (
            <>
              <div className="text-2xl font-bold">
                Login with your Lens Profile
              </div>

              <div className="start-col my-4 w-full rounded-xl bg-s-bg border border-p-border">
                {loadingProfiles && (
                  <div className="centered-row w-full p-4">
                    <CircularProgress />
                  </div>
                )}

                {profiles?.items?.map((profile, i) => (
                  <div
                    className={clsx(
                      'between-row w-full p-4',
                      i < profiles?.items.length - 1 &&
                        'border-b border-p-border '
                    )}
                    key={profile?.account?.address}
                  >
                    <div className="centered-row space-x-4">
                      <img
                        src={getAvatar(profile?.account)}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="text-s-text font-bold text-lg">
                        {formatHandle(profile?.account)}
                      </div>
                    </div>
                    <div className="centered-row">
                      <LoadingButton
                        variant="contained"
                        onClick={async () => {
                          setSelectedAccountAddress(profile?.account.address)

                          const params: LoginParams =
                            profile?.__typename === 'AccountManaged'
                              ? {
                                  accountManager: {
                                    account: profile.account.address,
                                    manager: address,
                                    app: APP_ADDRESS
                                  },
                                  signMessage: signMessageWith(walletClient!)
                                }
                              : {
                                  accountOwner: {
                                    account: profile.account.address,
                                    owner: address,
                                    app: APP_ADDRESS
                                  },
                                  signMessage: signMessageWith(walletClient!)
                                }

                          const data = await execute(params)

                          // if (data?.isOk() && data?.value.sponsored) {
                          if (data?.isOk()) {
                            onClose?.()
                            window.location.reload()
                          } else if (!data?.isOk() || data?.isErr()) {
                            toast.error('Error logging in')
                          }
                        }}
                        loading={
                          logging &&
                          selectedAccountAddress === profile?.account.address
                        }
                        loadingPosition="start"
                        startIcon={
                          <img
                            src={`/Lens-Icon-T-White.svg`}
                            className="sm:w-7 sm:h-7 w-6 h-6 rounded-full"
                          />
                        }
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

                {profiles?.items.length === 0 &&
                  !loadingProfiles &&
                  (!authenticatedUser ||
                    authenticatedUser?.role !== Role.OnboardingUser) && (
                    <div className="centered-row w-full text-s-text p-4 text-sm">
                      You don’t have any lens profiles linked to this wallet
                      address. However, You can log in with your wallet and chat
                      with streamers
                    </div>
                  )}

                {profiles?.items.length === 0 &&
                  !loadingProfiles &&
                  authenticatedUser?.role === Role.OnboardingUser && (
                    <div className="p-4 space-y-4">
                      <div className="centered-row w-full text-s-text text-sm">
                        You don’t have any lens profiles linked to this wallet
                        address.
                      </div>
                      <div className="text-xs sm:text-sm text-s-text font-semibold">
                        {address}
                      </div>
                    </div>
                  )}

                {profiles?.items.length === 0 &&
                  !loadingProfiles &&
                  (!authenticatedUser ||
                    authenticatedUser?.role !== Role.OnboardingUser) && (
                    <div className="px-4 pb-4 space-y-4">
                      <div className="start-center-row gap-x-3">
                        <LoadingImage
                          src={ensAvatar ?? getStampFyiURL(String(address))}
                          className="w-10 h-10 rounded-full"
                          loading="eager"
                        />
                        <div>
                          <div className="text-xs sm:text-sm text-s-text font-semibold">
                            {getShortAddress(String(address), 30)}
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
                            signMessage: signMessageWith(walletClient!),
                            onboardingUser: {
                              wallet: String(address),
                              app: APP_ADDRESS
                            }
                          })

                          if (data?.isOk()) {
                            onClose?.()
                          } else {
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

              <div className="centered-row w-full text-s-text text-xs mb-2 px-2">
                If you're unable to login, please try clearing this site's cache
                and refreshing the page.
              </div>
              {/* // disconnect wallet */}
              <div
                onClick={async () => {
                  await disconnectAsync()
                }}
                className="unselectable text-p-text cursor-pointer w-fit font-bold text-sm hover:bg-p-hover rounded-full px-3 py-1 -ml-1 text-center"
              >
                Disconnect wallet
              </div>
            </>
          ) : (
            <></>
            // <>
            //   {!authenticatedUser?.sponsored && (
            //     <>
            //       <div className="text-2xl font-bold ">
            //         Enable signless transactions
            //       </div>
            //       <div className="text-s-text font-semibold text-sm mb-4">
            //         This will allow you to post onchain without signing. No fees
            //         required.
            //       </div>

            //       {/* // todo enable sponsored action */}

            //       <div className="p-4 mb-4 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200">
            //         <div className="font-medium">Coming Soon!</div>
            //         <div className="text-sm">
            //           Sponsored transactions will be available soon. Some
            //           features may be limited until then.
            //         </div>
            //       </div>

            //       <LoadingButton
            //         variant="contained"
            //         loading={loading}
            //         loadingPosition="start"
            //         startIcon={<AutoAwesomeIcon />}
            //         onClick={async () => {
            //           try {
            //             const { isOk } = await enableSignless()
            //             if (isOk()) {
            //               onClose?.()
            //             }
            //           } catch (e) {
            //             // @ts-ignore
            //             toast.error(e.message)
            //           }
            //         }}
            //         sx={{
            //           borderRadius: '2rem'
            //         }}
            //         disabled={loading || data?.sponsored}
            //       >
            //         Approve signless
            //       </LoadingButton>
            //     </>
            //   )}
            // </>
          )}
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
