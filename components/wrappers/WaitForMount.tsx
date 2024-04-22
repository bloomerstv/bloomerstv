import React from 'react'

const WaitForMount = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])
  return <>{mounted && children}</>
}

export default WaitForMount
