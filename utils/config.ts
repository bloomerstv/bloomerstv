export const APP_NAME = 'BloomersTV'
export const APP_LINK = 'https://bloomers.tv'
export const APP_ID = 'bloomers.tv'
export const STS_TOKEN_URL = process.env.NEXT_PUBLIC_STS_TOKEN_URL
export const EVER_REGION = 'us-west-2'

export const useOnlyPWAOnMobile = false
export const isMainnet = process.env.NEXT_PUBLIC_LENS_MODE
  ? process.env.NEXT_PUBLIC_LENS_MODE === 'mainnet'
  : true

export const AVATAR = 'tr:w-200,h-200'

export const NODE_API_MODE =
  process.env.NEXT_PUBLIC_NODE_API_MODE ?? 'production'

export const LOCAL_NODE_API_URL = 'http://localhost:8000'
export const PRODUCTION_NODE_API_URL = 'https://api.bloomers.tv'
// export const PRODUCTION_NODE_API_URL = 'https://bloomerstv-api.onrender.com'
export const DEVELOPMENT_NODE_API_URL =
  'https://bloomerstv-api-dev.onrender.com'

export const LOCAL_WIDGETS_URL = 'http://localhost:3001'
export const PRODUCTION_WIDGETS_URL = 'https://widgets.bloomers.tv'
export const DEVELOPMENT_WIDGETS_URL =
  'https://widgets-git-dev-diversehq-xyz.vercel.app'

export const WIDGETS_URL =
  NODE_API_MODE === 'local'
    ? LOCAL_WIDGETS_URL
    : NODE_API_MODE === 'production'
      ? PRODUCTION_WIDGETS_URL
      : DEVELOPMENT_WIDGETS_URL

export const NODE_API_URL =
  NODE_API_MODE === 'local'
    ? LOCAL_NODE_API_URL
    : NODE_API_MODE === 'production'
      ? PRODUCTION_NODE_API_URL
      : DEVELOPMENT_NODE_API_URL

export const LIVE_CHAT_WEB_SOCKET_URL =
  NODE_API_MODE === 'local'
    ? `ws://localhost:8000`
    : NODE_API_MODE === 'production'
      ? `wss://api.bloomers.tv`
      : `wss://bloomerstv-api-dev.onrender.com`
export const REDIRECTOR_URL =
  NODE_API_MODE === 'production'
    ? 'https://redirect.bloomers.tv'
    : 'https://redirector-git-dev-diversehq-xyz.vercel.app'

export const NODE_GRAPHQL_URL = `${NODE_API_URL}/graphql`
export const LIVE_PEER_RTMP_URL = 'rtmp://rtmp.livepeer.com/live'

export const localStorageCredKey = isMainnet
  ? 'lens.production.credentials'
  : 'lens.development.credentials'
export const lensTestnetUrl = 'https://api-v2-amoy.lens.dev'
export const lensMainnetUrl = 'https://api-v2.lens.dev'
export const wsLensGraphEndpoint = isMainnet
  ? 'ws://api-v2.lens.dev'
  : 'ws://api-v2-amoy.lens.dev'
export const lensUrl = isMainnet ? lensMainnetUrl : lensTestnetUrl
export const handlePrefix = 'lens/'
export const defaultSponsored = process.env.NEXT_PUBLIC_DEFAULT_SPONSORED
  ? process.env.NEXT_PUBLIC_DEFAULT_SPONSORED === 'true'
  : true
export const SHARE_LENS_URL = 'https://share.lens.xyz'
export const GITHUB_URL = 'https://github.com/bloomerstv/bloomerstv'
export const FEEDBACK_URL =
  'https://github.com/bloomerstv/bloomerstv/issues/new'
export const REPORT_URL = 'https://github.com/bloomerstv/bloomerstv/issues/new'
export const HEY_URL = 'https://hey.xyz/u/bloomerstv'
export const HEY_APP_LINK = isMainnet
  ? 'https://hey.xyz'
  : 'https://testnet.hey.xyz'
export const DISCORD_INVITE_URL = 'https://discord.gg/rXUBVm7JxA'
export const X_URL = 'https://twitter.com/bloomerstv'
export const THUMBNAIL_FALLBACK =
  'https://npwelch.com/wp-content/uploads/2022/06/video-placeholder-brain-bites.png'

export const PROJECT_ADDRESS = '0xC8D0E78379d96D0A436b8597835670b13445A6Db'

export const POLYGON_CHAIN_ID = 137
export const AMOY_CHAIN_ID = 80002

export const LENS_CHAIN_ID = POLYGON_CHAIN_ID

export const TESTNET_CURRENCIES = [
  {
    kind: 1,
    name: 'Wrapped Matic',
    symbol: 'WMATIC',
    decimals: 18,
    address: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    chainType: 'polygon'
  },
  {
    kind: 1,
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
    address: '0x0FA8781a83E46826621b3BC094Ea2A0212e71B23',
    chainType: 'polygon'
  },
  {
    kind: 1,
    name: 'DAI',
    symbol: 'DAI',
    decimals: 18,
    address: '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F',
    chainType: 'polygon'
  }
]

export const MAINNET_CURRENCIES = [
  {
    kind: 1,
    name: 'Bonsai Token',
    symbol: 'BONSAI',
    decimals: 18,
    address: '0x3d2bD0e15829AA5C362a4144FdF4A1112fa29B5c',
    chainType: 'polygon'
  },
  {
    kind: 1,
    name: 'pointless',
    decimals: 18,
    symbol: 'pointless',
    address: '0x9B8cc6320F22325759B7D2CA5CD27347bB4eCD86',
    chainType: 'polygon'
  },
  {
    kind: 1,
    name: 'CHAOS TOKEN',
    decimals: 18,
    symbol: 'CHAOS',
    address: '0xaA05F05d77b10d0b12BfA2407b3180f1a1298965',
    chainType: 'polygon'
  },
  {
    kind: 1,
    name: 'Wrapped Matic',
    decimals: 18,
    symbol: 'WMATIC',
    address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    chainType: 'polygon'
  },
  {
    kind: 1,
    name: 'USD Coin (PoS)',
    decimals: 6,
    symbol: 'USDC',
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    chainType: 'polygon'
  },

  // {
  //   kind: 1,
  //   name: 'ELECTRIC',
  //   decimals: 18,
  //   symbol: 'ELECTRIC',
  //   address: '0x22D4DFE6dA0D661F48BD7c8a9224fF1c866Fe0E2',
  //   chainType: 'polygon'
  // },
  // {
  //   kind: 1,
  //   name: 'VINYL',
  //   decimals: 18,
  //   symbol: 'VINYL',
  //   address: '0xbFC67397aE5f278Cd9C51520Af521feBEFA42BcE',
  //   chainType: 'polygon'
  // },
  {
    kind: 1,
    name: '(PoS) Tether USD',
    decimals: 6,
    symbol: 'USDT',
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    chainType: 'polygon'
  },
  {
    kind: 1,
    name: '(PoS) Dai Stablecoin',
    decimals: 18,
    symbol: 'DAI',
    address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    chainType: 'polygon'
  },
  {
    kind: 1,
    name: 'Wrapped Ether',
    decimals: 18,
    symbol: 'WETH',
    address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    chainType: 'polygon'
  }
]

export const CURRENCIES = isMainnet ? MAINNET_CURRENCIES : TESTNET_CURRENCIES

export const CHAT_BOX_PREVIEW_VIDEO =
  'https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/b40azu14uorpov6u/720p0.mp4'
export const ALERT_BOX_PREVIEW_VIDEO =
  'https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/1d46hps10mofkmpj/720p0.mp4'
export const HOW_TO_ADD_WIDGETS_VIDEO =
  'https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/6913ct06fo4vrc9p/1080p0.mp4'

export const SuperFluidInfo = {
  endPoint: 'https://polygon-mainnet.subgraph.x.superfluid.dev/',
  receiver: '0xC8D0E78379d96D0A436b8597835670b13445A6Db',
  currentFlowRate_gte: '3801369863013',
  token: '0x07b24bbd834c1c546ece89ff95f71d9f13a2ebd1',
  checkoutLink:
    'https://checkout.superfluid.finance/Qmdu86h75r1xYBt1zGsKrMk8WXiBrFsiV3PvvKk24RWos6',
  getCancleLink: (address: string): string => {
    return `https://app.superfluid.finance/stream/polygon/${address?.toLowerCase()}-0xc8d0e78379d96d0a436b8597835670b13445a6db-0x07b24bbd834c1c546ece89ff95f71d9f13a2ebd1?view=${address}`
  }
}
