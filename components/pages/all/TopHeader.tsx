import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { APP_NAME } from '@/utils/config'
import { SessionType, useSession } from '@lens-protocol/react-web'
import { useAccount } from 'wagmi'
import { Button } from '@mui/material'
import CelebrationIcon from '@mui/icons-material/Celebration'
import { useTheme } from '../../wrappers/TailwindThemeProvider'

const TopHeader = () => {
  const { data, loading } = useSession()
  const { isConnected } = useAccount()
  console.log('data', data)
  const { theme, toggleTheme } = useTheme()
  return (
    <div className="flex flex-row items-center justify-between p-5 bg-s-bg">
      <div className="font-bold">{APP_NAME}</div>
      <Button
        variant="contained"
        onClick={toggleTheme}
        className=""
        size="medium"
      >
        {theme === 'light' ? 'Dark' : 'Light'}
      </Button>
      <div className="text-blue-400">
        <CelebrationIcon />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {data?.type === SessionType.Anonymous && (
            <>
              {isConnected ? (
                <Button
                  variant="contained"
                  className="font-bold text-sm"
                  onClick={() => {}}
                  size="medium"
                >
                  Login Lens
                </Button>
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
