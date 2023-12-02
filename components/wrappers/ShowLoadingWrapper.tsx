import { useSession } from '@lens-protocol/react-web'
import React from 'react'
import { useIsMounted } from 'usehooks-ts'
import StartLoadingPage from '../pages/loading/StartLoadingPage'

const ShowLoadingWrapper = ({ children }: { children: React.ReactNode }) => {
  const isMounted = useIsMounted()

  const { loading, data } = useSession()

  if (!isMounted() || loading || !data) {
    return (
      <div className="h-screen">
        <StartLoadingPage />
      </div>
    )
  }
  return <>{children}</>
}

export default ShowLoadingWrapper
