export interface PreviewImage {
  blurhash: string
  medium: string
  small: string
}

export interface CreatorProfile {
  id: string
  handle: string
  avatar: {
    previewImage: PreviewImage
  }
}

export interface MediaContent {
  mimeType: string
  originalUri: string
  previewImage: PreviewImage
}

export interface CurrencyAmount {
  currencyAddress: string
  amountRaw: string
  amountDecimal: number
}

export interface CreatorEarning {
  amount: CurrencyAmount
  amountUsd: string
}

export interface PoolCurrencyToken {
  address: string
  name: string
  decimals: number
}

export interface CoinData {
  id: string
  name: string
  description: string
  address: string
  symbol: string
  totalSupply: string
  totalVolume: string
  volume24h: string
  createdAt: string
  creatorAddress: string
  creatorEarnings: CreatorEarning[]
  poolCurrencyToken: PoolCurrencyToken
  marketCap: string
  marketCapDelta24h: string
  chainId: number
  tokenUri: string
  platformReferrerAddress: string
  payoutRecipientAddress: string
  creatorProfile: CreatorProfile
  mediaContent: MediaContent
  uniqueHolders: number
}

export interface CoinBalance {
  balance: string
  id: string
  coin: CoinData
}

export interface ProfileCoinBalances {
  count: number
  edges: { node: CoinBalance }[]
  pageInfo: {
    hasNextPage: boolean
    endCursor: string | null
  }
}
