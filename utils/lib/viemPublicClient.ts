import { createPublicClient, http } from 'viem'
import { base, mainnet, polygon } from 'viem/chains'

export const viemPublicClientEth = createPublicClient({
  chain: mainnet,
  transport: http()
})

export const viewPublicClientPolygon = createPublicClient({
  chain: polygon,
  transport: http()
})

export const viemPublicClientBase = createPublicClient({
  chain: base,
  transport: http()
})
