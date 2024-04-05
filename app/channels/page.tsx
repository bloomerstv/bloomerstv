'use client'
import React from 'react'
import StreamerSidebar from '../../components/common/StreamerSidebar'
import useIsMobile from '../../utils/hooks/useIsMobile'
import MobileTopHeader from '../../components/common/MobileTopHeader'

const page = () => {
  const isMobile = useIsMobile()
  if (!isMobile) return null
  return (
    <div className="w-full overflow-x-hidden">
      {isMobile && <MobileTopHeader />}

      <StreamerSidebar />
    </div>
  )
}

export default page
