export interface ZoraCoin {
  id: string
  name: string
  symbol: string
  description?: string
  address: string
  totalSupply?: string
  marketCap?: string
  volume24h?: string
  marketCapDelta24h?: string
  createdAt?: string
  creatorAddress?: string
  uniqueHolders?: number
  uniswapV3PoolAddress?: string
  mediaContent?: {
    mimeType?: string
    originalUri?: string
    previewImage?: {
      small?: string
      medium?: string
      blurhash?: string
    }
  }
}

export interface ZoraFeaturedCoinProps {
  coinAddress: string
  className?: string
}
