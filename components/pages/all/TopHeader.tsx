import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { APP_NAME } from '@/utils/config'
import { SessionType, useSession } from '@lens-protocol/react-web'
import { useAccount } from 'wagmi'
const TopHeader = () => {
  const { data, loading } = useSession()
  const { isConnected } = useAccount()
  console.log('data', data)
  return (
    <div className="flex flex-row items-center justify-between p-5">
      <div className="text-xl font-bold">{APP_NAME}</div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {data?.type === SessionType.Anonymous && (
            <>
              {isConnected ? (
                <button onClick={() => {}}>Login Lens</button>
              ) : (
                <ConnectButton />
              )}
            </>
          )}
          {data?.type === SessionType.WithProfile && (
            <div>{data?.profile?.handle?.fullHandle}</div>
          )}
          {data?.type === SessionType.JustWallet && (
            <>
              <div>{data?.address}</div>
              <button onClick={() => {}}>Login Lens</button>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default TopHeader
