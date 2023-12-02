export const APP_NAME = 'BloomersTv'
export const APP_LINK = 'https://bloomers.tv'
export const STS_TOKEN_URL = process.env.NEXT_PUBLIC_STS_TOKEN_URL
export const EVER_REGION = 'us-west-2'

export const useOnlyPWAOnMobile = false
export const isMainnet = process.env.NEXT_PUBLIC_LENS_MODE === 'mainnet'

export const AVATAR = 'tr:w-300,h-300'

export const NODE_API_MODE = process.env.NEXT_PUBLIC_NODE_API_MODE

export const LOCAL_NODE_API_URL = 'http://localhost:8000'
export const PRODUCTION_NODE_API_URL = 'http://localhost:8000'
export const DEVELOPMENT_NODE_API_URL = 'http://localhost:8000'
export const NODE_API_URL =
  NODE_API_MODE === 'local'
    ? LOCAL_NODE_API_URL
    : NODE_API_MODE === 'production'
      ? PRODUCTION_NODE_API_URL
      : DEVELOPMENT_NODE_API_URL
export const NODE_GRAPHQL_URL = `${NODE_API_URL}/graphql`
export const LIVE_PEER_RTMP_URL = 'rtmp://rtmp.livepeer.com/live'

export const localStorageCredKey = isMainnet
  ? 'lens.production.credentials'
  : 'lens.development.credentials'
export const lensTestnetUrl = 'https://api-v2-mumbai-live.lens.dev'
export const lensMainnetUrl = 'https://api-v2.lens.dev'

export const lensUrl = isMainnet ? lensMainnetUrl : lensTestnetUrl
export const handlePrefix = isMainnet ? 'lens/' : 'test/'
