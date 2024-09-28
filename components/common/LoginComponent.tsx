import {
  SessionType,
  useLogin,
  useProfilesManaged,
  useSession,
  useUpdateProfileManagers
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
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import toast from 'react-hot-toast'
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
  const { data: profiles, loading: loadingProfiles } = useProfilesManaged({
    // @ts-ignore
    for: address,
    includeOwned: true
  })
  const { execute, loading: logging } = useLogin()
  const {
    execute: enableProfileManager,
    loading,
    error
  } = useUpdateProfileManagers()

  useEffect(() => {
    if (
      open &&
      !isConnected &&
      openConnectModal &&
      data?.type !== SessionType.WithProfile
    ) {
      openConnectModal()
    }
  }, [open, isConnected, data?.type])

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  return (
    <div className="p-4 sm:p-0">
      {isConnected ? (
        <>
          {data?.type !== SessionType.WithProfile ? (
            <>
              <div className="text-2xl font-bold">Login with your handle</div>

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
                    <div className="centered-row space-x-4">
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
                            onClose?.()
                            window.location.reload()
                          } else if (!data?.isSuccess()) {
                            toast.error('Error logging in')
                          }
                        }}
                        loading={logging && selectedProfileId === profile.id}
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

                {profiles?.length === 0 && !loadingProfiles && (
                  <div className="centered-row w-full p-4">
                    You don't own any lens profiles associated with this wallet
                    address.
                  </div>
                )}
              </div>

              <div className="centered-row w-full text-s-text font-bold text-xs mb-2 px-2">
                If you're unable to sign in to your Lens profile, please try
                clearing this site's cache and refreshing the page.
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
            <>
              {!data?.profile?.signless && (
                <>
                  <div className="text-2xl font-bold ">
                    Enable signless transactions
                  </div>
                  <div className="text-s-text font-semibold text-sm mb-4">
                    This will allow you to post onchain without signing. No fees
                    required.
                  </div>

                  <LoadingButton
                    variant="contained"
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<AutoAwesomeIcon />}
                    onClick={async () => {
                      try {
                        const { isSuccess } = await enableProfileManager({
                          approveSignless: true
                        })
                        if (isSuccess()) {
                          onClose?.()
                        }
                      } catch (e) {
                        // @ts-ignore
                        toast.error(e.message)
                      }
                    }}
                    sx={{
                      borderRadius: '2rem'
                    }}
                    disabled={loading || data?.profile?.signless}
                  >
                    Approve signless
                  </LoadingButton>
                </>
              )}
            </>
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
