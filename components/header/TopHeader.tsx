import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { APP_NAME } from '@/utils/config'
const TopHeader = () => {
  return (
    <div className="flex flex-row items-center justify-between p-5">
      <div className="text-xl font-bold">{APP_NAME}</div>
      <ConnectButton />
    </div>
  )
}

export default TopHeader
