export const APP_NAME = 'BloomersTv'
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
