import React from 'react'
import { LensConfig, development, production } from '@lens-protocol/react-web'
import { bindings as wagmiBindings } from '@lens-protocol/wagmi'
import { LensProvider } from '@lens-protocol/react-web'
import { isMainnet } from '../../utils/config'

const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: isMainnet ? production : development
}

const LensWrapper = ({ children }: { children: React.ReactNode }) => {
  return <LensProvider config={lensConfig}>{children}</LensProvider>
}

export default LensWrapper
