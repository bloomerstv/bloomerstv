import React from 'react'
import { useTheme } from './TailwindThemeProvider'
import { ToastContainer } from 'react-toastify'
import useIsMobile from '../../utils/hooks/useIsMobile'

const ToastWrapper = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme()
  const isMobile = useIsMobile()
  return (
    <>
      <ToastContainer
        position={isMobile ? 'top-center' : 'bottom-left'}
        theme={theme}
        closeButton={false}
      />
      {children}
    </>
  )
}

export default ToastWrapper
