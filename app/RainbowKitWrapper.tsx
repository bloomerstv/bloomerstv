'use client'

import React from 'react'

import '@rainbow-me/rainbowkit/styles.css'
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum, base, zora } from 'wagmi/chains'
// import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { APP_NAME } from '@/utils/config'

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora],
  [
    // alchemyProvider({ apiKey: String(process.env.ALCHEMY_ID) }),
    publicProvider()
  ]
)
const { connectors } = getDefaultWallets({
  appName: APP_NAME,
  projectId: String(process.env.NEXT_PUBLIC_RAINBOW_KIT_PROJECT_ID),
  chains
})
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

const RainbowKitWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider theme={darkTheme()} chains={chains}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default RainbowKitWrapper
