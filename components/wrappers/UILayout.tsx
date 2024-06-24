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
import { useStreamReplayPublications } from '../../utils/hooks/useStreamReplayPublications'
import useLiveStreamerProfiles from '../../utils/hooks/useLiveStreamerProfiles'
import useNotifictionSubscriptions from '../../utils/hooks/useNotifictionSubscriptions'
import { ModalRoot } from '../common/ModalRoot'

interface Props {
  // Define any props that the component will accept
  children: React.ReactNode
}

const inter = Inter({ subsets: ['latin'] })

const UILayoutPage = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile()
  const pathname = usePathname()

  return (
    <>
      {isMobile ? (
        <div
          className={clsx(
            inter.className,
            'bg-s-bg text-p-text flex flex-col h-screen w-screen'
          )}
        >
          <LoginPage />
          <div className="flex-grow overflow-auto no-scrollbar">{children}</div>
          <div className="shrink-0 w-full">
            {!pathname.startsWith('/live-chat') && <MobileBottomNavbar />}
          </div>
        </div>
      ) : (
        <div className={clsx(inter.className, 'bg-p-bg text-p-text')}>
          <div className="w-screen h-screen relative">
            <div className="w-full absolute left-0 right-0 top-0 ">
              <TopHeader />
            </div>
            <div className="start-center-row h-screen pt-[50px] overflow-hidden">
              {pathname.startsWith('/dashboard') ? (
                <DashboardSidebar />
              ) : (
                <>{pathname === '/' && <StreamerSidebar />}</>
              )}
              <div className="h-full w-full">{children}</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const GlobalHooks = () => {
  useStreamReplayPublications({})
  useLiveStreamerProfiles()
  useNotifictionSubscriptions()

  return <></>
}

const UILayout: React.FC<Props> = (props) => {
  return (
    <>
      <ModalRoot />
      <GlobalHooks />
      <UILayoutPage>{props.children}</UILayoutPage>
    </>
  )
}

export default UILayout
