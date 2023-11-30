'use client'
import clsx from 'clsx'
import React from 'react'

import { Inter } from 'next/font/google'
import TopHeader from '@/components/pages/all/Header/TopHeader'
import useIsMobile from '../../utils/hooks/useIsMobile'
import MobileBottomNavbar from '../pages/all/MobileBottom/MobileBottomNavbar'
import LoginPage from '../pages/home/LoginPage'
import { useIsMounted } from 'usehooks-ts'
import StartLoadingPage from '../pages/loading/StartLoadingPage'
import StreamerSidebar from '../common/StreamerSidebar'
import { usePathname } from 'next/navigation'
import DashboardSidebar from '../pages/dashboard/DashboardSidebar'

interface Props {
  // Define any props that the component will accept
  children: React.ReactNode
}

const inter = Inter({ subsets: ['latin'] })

const UILayout: React.FC<Props> = (props) => {
  const isMounted = useIsMounted()
  // Define the component's logic and rendering here
  const isMobile = useIsMobile()

  const pathname = usePathname()

  if (!isMounted()) {
    return <StartLoadingPage />
  }

  if (isMobile) {
    return (
      <div
        className={clsx(
          inter.className,
          'bg-p-bg text-p-text flex flex-col h-screen'
        )}
      >
        <LoginPage />
        <div className="flex-grow overflow-auto">{props.children}</div>
        <MobileBottomNavbar />
      </div>
    )
  }
  return (
    <div className={clsx(inter.className, 'bg-p-bg text-s-text')}>
      <div className="w-screen h-screen">
        <div className="w-full">
          <TopHeader />
        </div>
        <div className="start-row h-[calc(100%-58px)] overflow-hidden">
          {pathname.startsWith('/dashboard') ? (
            <DashboardSidebar />
          ) : (
            <StreamerSidebar />
          )}
          <div className="h-full overflow-auto w-full">{props.children}</div>
        </div>
      </div>
    </div>
  )
}

export default UILayout
