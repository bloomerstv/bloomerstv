import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export const viemPublicClient = createPublicClient({
  chain: mainnet,
  transport: http()
})
