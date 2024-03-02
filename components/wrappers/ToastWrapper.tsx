import React from 'react'
import useIsMobile from '../../utils/hooks/useIsMobile'
import { Toaster } from 'react-hot-toast'

const ToastWrapper = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile()
  return (
    <>
      <Toaster
        position={isMobile ? 'top-center' : 'bottom-left'}
        toastOptions={{
          duration: 3000
        }}
      />
      {children}
    </>
  )
}

export default ToastWrapper
