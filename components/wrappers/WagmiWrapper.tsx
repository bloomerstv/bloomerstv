'use client'
import React from 'react'

import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector'
import { base } from 'wagmi/chains'
import { lens, lensTestnet } from 'wagmi/chains'
// import { alchemyProvider } from 'wagmi/providers/alchemy'
import {
  APP_DESCRIPTION,
  APP_ICON_LINK,
  APP_LINK,
  APP_NAME,
  isMainnet
} from '@/utils/config'
import { WagmiProvider, http, createConfig } from 'wagmi'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { PublicClient, testnet, mainnet } from '@lens-protocol/react'
import { LensProvider } from '@lens-protocol/react'
import { cookieStorage } from '../../utils/lib/lens/storage'
import { MiniAppProvider } from '@neynar/react'

const defaultChains = isMainnet ? [lens, base] : [lensTestnet, base]

const defaultTransports = {
  [lens.id]: http(),
  [lensTestnet.id]: http(),
  [base.id]: http()
}

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    // @ts-ignore
    chains: defaultChains,
    transports: defaultTransports,
    connectors: [farcasterMiniApp()],
    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_RAINBOW_KIT_PROJECT_ID!,

    // Required App Info
    appName: APP_NAME,

    // Optional App Info
    appDescription: APP_DESCRIPTION,
    appUrl: APP_LINK, // your app's url
    appIcon: APP_ICON_LINK // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
)

const queryClient = new QueryClient()

const WagmiWrapper = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const client = PublicClient.create({
    environment: isMainnet ? mainnet : testnet,
    storage: typeof window !== 'undefined' ? localStorage : cookieStorage
  })

  // Return null or a loading state on server-side
  if (!mounted) {
    return null // Or a loading spinner
  }
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider theme={'auto'} mode={'dark'}>
          <LensProvider client={client}>
            <MiniAppProvider analyticsEnabled={true} backButtonEnabled={false}>
              {children}
            </MiniAppProvider>
          </LensProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default WagmiWrapper
