import React from 'react'
import { LensConfig, development } from '@lens-protocol/react-web'
import { bindings as wagmiBindings } from '@lens-protocol/wagmi'
import { LensProvider } from '@lens-protocol/react-web'

const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: development
}

const LensWrapper = ({ children }: { children: React.ReactNode }) => {
  return <LensProvider config={lensConfig}>{children}</LensProvider>
}

export default LensWrapper
