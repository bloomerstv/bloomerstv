import React from 'react'
import StartLoadingPage from '../pages/loading/StartLoadingPage'
import { useSession } from '@lens-protocol/react-web'

const ShowLoadingWrapper = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = React.useState(false)
  const { data, loading } = useSession()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || (loading && !data)) {
    return (
      <div className="h-screen">
        <StartLoadingPage />
      </div>
    )
  }
  return <>{children}</>
}

export default ShowLoadingWrapper
