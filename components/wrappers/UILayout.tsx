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
import { useLiveStreamersQuery } from '../../graphql/generated'
import { useStreamersWithProfiles } from '../store/useStreamersWithProfiles'
import { useProfiles } from '@lens-protocol/react-web'

interface Props {
  // Define any props that the component will accept
  children: React.ReactNode
}

const inter = Inter({ subsets: ['latin'] })

const UILayout: React.FC<Props> = (props) => {
  const isMobile = useIsMobile()
  const pathname = usePathname()

  const { data, loading: streamersLoading } = useLiveStreamersQuery()
  const setStreamersWithProfiles = useStreamersWithProfiles(
    (state) => state.setStreamersWithProfiles
  )

  const setLoading = useStreamersWithProfiles((state) => state.setLoading)

  const { data: profiles, loading: profilesLoading } = useProfiles({
    where: {
      // @ts-ignore
      profileIds: data?.liveStreamers?.map((streamer) => streamer?.profileId)
    }
  })

  const streamers = data?.liveStreamers?.map((streamer) => {
    return {
      ...streamer,
      profile: profiles?.find((profile) => profile?.id === streamer?.profileId)
    }
  })

  React.useEffect(() => {
    // @ts-ignore
    setStreamersWithProfiles(streamers)
  }, [streamers])

  React.useEffect(() => {
    if (!streamersLoading && !profilesLoading) {
      setLoading(false)
    }
  }, [streamersLoading, profilesLoading])

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
          <div className="flex-grow overflow-auto no-scrollbar">
            {props.children}
          </div>
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
            <div className="start-row h-screen pt-[60px] overflow-hidden">
              {pathname.startsWith('/dashboard') ? (
                <DashboardSidebar />
              ) : (
                <>
                  {!pathname.startsWith('/watch/') &&
                    !pathname.startsWith('/live-chat') && <StreamerSidebar />}
                </>
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
