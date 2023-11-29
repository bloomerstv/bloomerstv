'use client'

import React, { useEffect, useState } from 'react'
import RainbowKitWrapper from './RainbowKitWrapper'
import { ToastContainer } from 'react-toastify'
import UILayout from './UILayout'
import { useOnlyPWAOnMobile } from '../../utils/config'
import AddPWAPage from '../pages/home/AddPWAPage'
import 'react-toastify/dist/ReactToastify.css'
import LivePeerWrapper from './LivePeerWrapper'
import LensWrapper from './LensWrapper'

const WrappersWithOnlyPwa = ({ children }: { children: React.ReactNode }) => {
  const [isPWA, setIsPWA] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (
      window.navigator.standalone ||
      window.matchMedia('(display-mode: standalone)').matches
    ) {
      setIsPWA(true)
    }

    setIsMobile(window.matchMedia('(max-width: 767px)').matches)
  }, [])

  return (
    <>
      {!isPWA && isMobile && useOnlyPWAOnMobile ? (
        <AddPWAPage />
      ) : (
        <>
          <RainbowKitWrapper>
            <LensWrapper>
              <LivePeerWrapper>
                <ToastContainer
                  position="top-right"
                  theme="dark"
                  closeButton={false}
                />
                <UILayout>{children}</UILayout>
              </LivePeerWrapper>
            </LensWrapper>
          </RainbowKitWrapper>
        </>
      )}
    </>
  )
}

export default WrappersWithOnlyPwa
