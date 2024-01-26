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
export const DEVELOPMENT_NODE_API_URL = 'https://api.bloomers.tv'

export const NODE_API_URL =
  NODE_API_MODE === 'local'
    ? LOCAL_NODE_API_URL
    : NODE_API_MODE === 'production'
      ? PRODUCTION_NODE_API_URL
      : DEVELOPMENT_NODE_API_URL

export const LIVE_CHAT_WEB_SOCKET_URL =
  NODE_API_MODE === 'local' ? `ws://localhost:8000` : `wss://api.bloomers.tv`
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
export const FEEDBACK_URL = 'https://forms.gle/mbz1xyUQXdosJZSp8'
export const HEY_URL = 'https://hey.xyz/u/bloomerstv'
export const DISCORD_INVITE_URL = 'https://discord.gg/rXUBVm7JxA'
export const THUMBNAIL_FALLBACK =
  'https://npwelch.com/wp-content/uploads/2022/06/video-placeholder-brain-bites.png'
