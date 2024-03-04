export const APP_NAME = 'BloomersTV'
export const APP_LINK = 'https://bloomers.tv'
export const APP_ID = 'bloomers.tv'
export const STS_TOKEN_URL = process.env.NEXT_PUBLIC_STS_TOKEN_URL
export const EVER_REGION = 'us-west-2'

export const useOnlyPWAOnMobile = false
export const isMainnet = process.env.NEXT_PUBLIC_LENS_MODE
  ? process.env.NEXT_PUBLIC_LENS_MODE === 'mainnet'
  : true

export const AVATAR = 'tr:w-300,h-300'

export const NODE_API_MODE =
  process.env.NEXT_PUBLIC_NODE_API_MODE ?? 'production'

export const LOCAL_NODE_API_URL = 'http://localhost:8000'
export const PRODUCTION_NODE_API_URL = 'https://api.bloomers.tv'
// export const PRODUCTION_NODE_API_URL = 'https://bloomerstv-api.onrender.com'
export const DEVELOPMENT_NODE_API_URL =
  'https://bloomerstv-api-dev.onrender.com'

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
export const lensTestnetUrl = 'https://api-v2-mumbai-live.lens.dev'
export const lensMainnetUrl = 'https://api-v2.lens.dev'
export const wsLensGraphEndpoint = isMainnet
  ? 'wss://api-v2.lens.dev'
  : 'wss://api-v2-mumbai-live.lens.dev'
export const lensUrl = isMainnet ? lensMainnetUrl : lensTestnetUrl
export const handlePrefix = isMainnet ? 'lens/' : 'test/'
export const defaultSponsored = process.env.NEXT_PUBLIC_DEFAULT_SPONSORED
  ? process.env.NEXT_PUBLIC_DEFAULT_SPONSORED === 'true'
  : true
export const SHARE_LENS_URL = 'https://share.lens.xyz'
export const GITHUB_URL = 'https://github.com/bloomerstv/bloomerstv'
export const FEEDBACK_URL =
  'https://github.com/bloomerstv/bloomerstv/issues/new'
export const REPORT_URL = 'https://github.com/bloomerstv/bloomerstv/issues/new'
export const HEY_URL = 'https://hey.xyz/u/bloomerstv'
export const DISCORD_INVITE_URL = 'https://discord.gg/rXUBVm7JxA'
export const X_URL = 'https://twitter.com/bloomerstv'
export const THUMBNAIL_FALLBACK =
  'https://npwelch.com/wp-content/uploads/2022/06/video-placeholder-brain-bites.png'

export const PROJECT_ADDRESS = '0xC8D0E78379d96D0A436b8597835670b13445A6Db'

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
    name: 'USD Coin (PoS)',
    decimals: 6,
    symbol: 'USDC',
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    chainType: 'polygon'
  },
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
    name: 'pointless',
    decimals: 18,
    symbol: 'pointless',
    address: '0x9B8cc6320F22325759B7D2CA5CD27347bB4eCD86',
    chainType: 'polygon'
  },

  {
    kind: 1,
    name: 'Carlos Money',
    decimals: 18,
    symbol: 'CMONEY',
    address: '0x8F0cc4c9810678fAc61B2AF921cCEBca9c78d0f6',
    chainType: 'polygon'
  },
  {
    kind: 1,
    name: 'POOR Token',
    decimals: 18,
    symbol: 'POOR',
    address: '0x3881c079958CC8c89543C1199De7b714e26A9CF7',
    chainType: 'polygon'
  },
  {
    kind: 1,
    name: 'SHELLZ Token',
    decimals: 18,
    symbol: 'SHELLZ',
    address: '0x3223af86fcf0d2c7dEACD8FA7702e387Ae996620',
    chainType: 'polygon'
  },
  {
    kind: 1,
    name: 'ISH Token',
    decimals: 18,
    symbol: 'ISH',
    address: '0x7ED2e70E7C3D24766a025f57907948CBF1d7E9EA',
    chainType: 'polygon'
  },
  {
    kind: 1,
    name: 'KURO Token',
    decimals: 18,
    symbol: 'KURO',
    address: '0xa057521169C9C10aAe0e2036B586cf68fF8241C5',
    chainType: 'polygon'
  },
  {
    kind: 1,
    name: 'Monavale',
    decimals: 18,
    symbol: 'MONA',
    address: '0x6968105460f67c3BF751bE7C15f92F5286Fd0CE5',
    chainType: 'polygon'
  },
  {
    kind: 1,
    name: 'MOSH Token',
    decimals: 18,
    symbol: 'MOSH',
    address: '0x48777A9ff1B703d3d29EDd6E4DC0DcfcFa0533e5',
    chainType: 'polygon'
  },
  {
    kind: 1,
    name: 'Toucan Protocol: Nature Carbon Tonne',
    decimals: 18,
    symbol: 'NCT',
    address: '0xD838290e877E0188a4A44700463419ED96c16107',
    chainType: 'polygon'
  }
]

export const CURRENCIES = isMainnet ? MAINNET_CURRENCIES : TESTNET_CURRENCIES
