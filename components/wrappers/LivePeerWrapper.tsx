import React from 'react'
import {
  LivepeerConfig,
  createReactClient,
  studioProvider
} from '@livepeer/react'

const client = createReactClient({
  provider: studioProvider({
    apiKey: String(process.env.NEXT_PUBLIC_LIVE_PEER_STUDIO_API)
  })
})

const LivePeerWrapper = ({ children }: { children: React.ReactNode }) => {
  return <LivepeerConfig client={client}>{children}</LivepeerConfig>
}

export default LivePeerWrapper
