import {
  SessionType,
  useLastLoggedInProfile,
  useLogin,
  useSession
} from '@lens-protocol/react-web'
import React from 'react'
import { useAccount } from 'wagmi'
import getAvatar from '../../../../utils/lib/getAvatar'
import LoadingButton from '@mui/lab/LoadingButton'
import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import AvatarWithOptions from './AvatarWithOptions'

// todo: show available profiles modal and allow user to select profile to login

const LoginButton = () => {
  const { data, loading } = useSession()
  const { isConnected, address, isConnecting, isReconnecting } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { data: lastLoggedInProfile } = useLastLoggedInProfile({
    // @ts-ignore
    for: address
  })
  const { execute, loading: logging } = useLogin()

  return (
    <>
      {data?.type === SessionType.Anonymous && (
        <>
          {isConnected ? (
            <LoadingButton
              variant="contained"
              onClick={() => {
                execute({
                  // @ts-ignore
                  address: address,
                  profileId: lastLoggedInProfile?.id
                })
              }}
              disabled={!lastLoggedInProfile}
              startIcon={
                <img
                  src={getAvatar(lastLoggedInProfile)}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
              }
              loading={logging}
              loadingPosition="start"
            >
              Login
            </LoadingButton>
          ) : (
            <LoadingButton
              variant="contained"
              onClick={openConnectModal}
              loading={isConnecting || isReconnecting}
              loadingPosition="start"
              startIcon={<AccountBalanceWalletIcon />}
            >
              Connect
            </LoadingButton>
          )}
        </>
      )}
      {data?.type === SessionType.WithProfile && (
        <AvatarWithOptions profile={data.profile} />
      )}
    </>
  )
}

export default LoginButton
