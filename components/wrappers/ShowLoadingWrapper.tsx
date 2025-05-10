import React from 'react'
import StartLoadingPage from '../pages/loading/StartLoadingPage'
import { useSessionClient } from '@lens-protocol/react'

const ShowLoadingWrapper = ({ children }: { children: React.ReactNode }) => {
  const { loading, data } = useSessionClient()

  if (loading && !data) {
    return (
      <div className="h-dvh">
        <StartLoadingPage />
      </div>
    )
  }
  return <>{children}</>
}

export default ShowLoadingWrapper
