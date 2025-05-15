import React from 'react'
import StartLoadingPage from '../pages/loading/StartLoadingPage'
import { usePublicClient } from '@lens-protocol/react'

const ShowLoadingWrapper = ({ children }: { children: React.ReactNode }) => {
  const { currentSession } = usePublicClient()

  if (!currentSession) {
    return (
      <div className="h-dvh">
        <StartLoadingPage />
      </div>
    )
  }
  return <>{children}</>
}

export default ShowLoadingWrapper
