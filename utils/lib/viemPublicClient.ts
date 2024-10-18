import { createPublicClient, http } from 'viem'
import { mainnet, polygon } from 'viem/chains'

export const viemPublicClientEth = createPublicClient({
  chain: mainnet,
  transport: http()
})

export const viewPublicClientPolygon = createPublicClient({
  chain: polygon,
  transport: http()
})
