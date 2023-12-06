'use client'
import clsx from 'clsx'
import React from 'react'

import { Inter } from 'next/font/google'
import TopHeader from '@/components/pages/all/Header/TopHeader'
import useIsMobile from '../../utils/hooks/useIsMobile'
import MobileBottomNavbar from '../pages/all/MobileBottom/MobileBottomNavbar'
import LoginPage from '../pages/home/LoginPage'
import StreamerSidebar from '../common/StreamerSidebar'
import { usePathname } from 'next/navigation'
import DashboardSidebar from '../pages/dashboard/DashboardSidebar'
import Head from 'next/head'
import { useTheme } from './TailwindThemeProvider'

interface Props {
  // Define any props that the component will accept
  children: React.ReactNode
}

const inter = Inter({ subsets: ['latin'] })

const UILayout: React.FC<Props> = (props) => {
  const isMobile = useIsMobile()
  const pathname = usePathname()
  const { theme } = useTheme()

  return (
    <>
      <Head>
        <meta
          name="theme-color"
          content={`${theme === 'dark' ? '#18181b' : '#ffffff'}`}
        />
      </Head>
      {isMobile ? (
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
      ) : (
        <div className={clsx(inter.className, 'bg-p-bg text-p-text')}>
          <div className="w-screen h-screen relative">
            <div className="w-full absolute left-0 right-0 top-0 ">
              <TopHeader />
            </div>
            <div className="start-row h-screen pt-[60px] overflow-hidden">
              {pathname.startsWith('/dashboard') ? (
                <DashboardSidebar />
              ) : (
                <StreamerSidebar />
              )}
              <div className="h-full overflow-auto w-full">
                {props.children}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UILayout
