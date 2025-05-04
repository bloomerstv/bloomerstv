'use client'
import React from 'react'

import '@rainbow-me/rainbowkit/styles.css'
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig
} from '@rainbow-me/rainbowkit'
import { chains } from '@lens-chain/sdk/viem'
import { polygon, polygonAmoy } from 'wagmi/chains'
// import { alchemyProvider } from 'wagmi/providers/alchemy'
import { APP_NAME, isMainnet } from '@/utils/config'
import { WagmiProvider, http, createConfig, injected } from 'wagmi'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { PublicClient, testnet, mainnet } from '@lens-protocol/react'
import { LensProvider } from '@lens-protocol/react'
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  trustWallet,
  walletConnectWallet,
  zerionWallet
} from '@rainbow-me/rainbowkit/wallets'

const defaultChains = isMainnet ? [chains.mainnet] : [chains.testnet]

const defaultTransports = {
  [polygon.id]: http(),
  [polygonAmoy.id]: http(),
  [chains.mainnet.id]: http(),
  [chains.testnet.id]: http()
}

const config = getDefaultConfig({
  appName: APP_NAME,
  projectId: String(process.env.NEXT_PUBLIC_RAINBOW_KIT_PROJECT_ID),
  // @ts-ignore
  chains: defaultChains,
  transports: defaultTransports,
  wallets: [
    {
      groupName: 'Installed',
      wallets: [injectedWallet]
    },
    {
      groupName: 'Popular',
      wallets: [
        metaMaskWallet,
        walletConnectWallet,
        zerionWallet,
        coinbaseWallet,
        trustWallet
      ]
    }
  ],
  ssr: true
})

const queryClient = new QueryClient()

const RainbowKitWrapper = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const client = PublicClient.create({
    environment: isMainnet ? mainnet : testnet,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  })

  // Return null or a loading state on server-side
  if (!mounted) {
    return null // Or a loading spinner
  }
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          appInfo={{
            appName: APP_NAME
          }}
          modalSize="compact"
          theme={darkTheme()}
        >
          <LensProvider client={client}>{children}</LensProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default RainbowKitWrapper
