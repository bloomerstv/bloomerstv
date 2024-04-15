import React from 'react'
import StartLoadingPage from '../pages/loading/StartLoadingPage'
import { useSession } from '@lens-protocol/react-web'

const ShowLoadingWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data, loading } = useSession()

  if (loading && !data) {
    return (
      <div className="h-screen">
        <StartLoadingPage />
      </div>
    )
  }
  return <>{children}</>
}

export default ShowLoadingWrapper
