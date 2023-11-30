import React from 'react'
import {
  LivepeerConfig,
  createReactClient,
  studioProvider
} from '@livepeer/react'

const client = createReactClient({
  provider: studioProvider({
    apiKey: ''
  })
})

const LivePeerWrapper = ({ children }: { children: React.ReactNode }) => {
  return <LivepeerConfig client={client}>{children}</LivepeerConfig>
}

export default LivePeerWrapper
