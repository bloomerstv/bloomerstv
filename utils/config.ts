export const APP_NAME = 'BloomersTV'
export const APP_LINK = 'https://bloomers.tv'
export const APP_ID = 'bloomers.tv'
export const STS_TOKEN_URL = process.env.NEXT_PUBLIC_STS_TOKEN_URL
export const EVER_REGION = 'us-west-2'

export const useOnlyPWAOnMobile = false
export const CREATOR_EMAIL = 'devenrathodrd@gmail.com'

export const isMainnet = process.env.NEXT_PUBLIC_LENS_MODE
  ? process.env.NEXT_PUBLIC_LENS_MODE === 'mainnet'
  : true

export const APP_ADDRESS = isMainnet
  ? // bloomers.tv
    '0x5eD76435f79E025Ca5c534e17184FEC29b681DB5'
  : '0x0f6c48a220ddC674662D53340FE1fF0653CC7e4f'

export const LENS_JWKS_URL = isMainnet
  ? 'https://api.lens.xyz/.well-known/jwks.json'
  : 'https://api.testnet.lens.xyz/.well-known/jwks.json'

export const AVATAR = 'tr:w-120,h-120'

export const NODE_API_MODE =
  process.env.NEXT_PUBLIC_NODE_API_MODE ?? 'production'

export const LOCAL_NODE_API_URL =
  process.env.NEXT_PUBLIC_LOCAL_NODE_API_URL ?? 'http://localhost:8000'
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
  ? 'lens.mainnet.credentials'
  : 'lens.testnet.credentials'
export const lensTestnetUrl = 'https://api.testnet.lens.xyz/graphql'
export const lensMainnetUrl = 'https://api.lens.xyz/graphql'
export const wsLensGraphEndpoint = isMainnet
  ? 'wss://api-v2.lens.dev'
  : 'wss://api-v2-amoy.lens.dev'
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
export const X_URL = 'https://x.com/intent/follow?screen_name=bloomerstv'
export const DONATE_LINK =
  'https://explorer.gitcoin.co/#/projects/0x16429f74cbb2cef6f9f48481b6c8bc49fa12989d75c1f9d82462f8bb91f079eb'
export const PRIVACY_POLICY =
  'https://www.termsfeed.com/live/2064c7f9-de9e-44a0-b640-20cbc51c3b04'

export const PROJECT_ADDRESS = '0xC8D0E78379d96D0A436b8597835670b13445A6Db'

export const POLYGON_CHAIN_ID = 137
export const AMOY_CHAIN_ID = 80002

export const LENS_CHAIN_ID = isMainnet ? POLYGON_CHAIN_ID : AMOY_CHAIN_ID

export const TESTNET_CURRENCIES = [
  {
    kind: 1,
    name: 'Wrapped Matic',
    symbol: 'WMATIC',
    decimals: 18,
    address: '0x360ad4f9a9A8EFe9A8DCB5f461c4Cc1047E1Dcf9',
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

export const GITCOIN_ROUND_LINK =
  'https://explorer.gitcoin.co/#/round/42161/608/149'

export const SuperFluidInfo = {
  endPoint: 'https://polygon-mainnet.subgraph.x.superfluid.dev/',
  receiver: '0xC8D0E78379d96D0A436b8597835670b13445A6Db',
  checkoutLink:
    'https://checkout.superfluid.finance/Qme2rLg4RQWJEYJY26gYiDUCZntY82tB2Y5ULzNmLLt1H9',
  getCancleLink: (address: string): string => {
    return `https://app.superfluid.finance/?view=${address}`
  },
  tokensAndMinFlowRate: [
    {
      // bonsai 500/month
      token: '0x48a7908771c752aacf5cd0088dad0a0daaea3716',
      minFlowRate: '190258751902586'
    },
    {
      // wmatic 15/month
      token: '0xe04ad5d86c40d53a12357e1ba2a9484f60db0da5',
      minFlowRate: '5707762557076'
    },
    {
      // usdc 5/month
      token: '0x07b24bbd834c1c546ece89ff95f71d9f13a2ebd1',
      minFlowRate: '1902587519024'
    }
  ]
}

// todo, move this to api to add / remove profiles from this list on the backend
export const hideAccountAddresses: string[] = []

export const NEXT_PUBLIC_VAPID_KEY =
  'BDv44ZwY7G3E1fgEuHeiw74cda-LG9gOFwTLFaD2ArveOdd3meLf37noJbztWUeS8GFSR59SjRpYToF3oZrG1dE'

export const DEFAULT_THEME = 'light'
