'use client'
import clsx from 'clsx'
import LiveStreamPublicReplays from '../components/pages/home/LiveStreamPublicReplays'
import useIsMobile from '../utils/hooks/useIsMobile'
import StreamerHorizontalDiv from '../components/common/StreamerSidebar/StreamerHorizontalDiv'
import MobileTopHeader from '../components/pages/all/Header/MobileTopHeader'
import TextAndImagePosts from '../components/pages/home/TextAndImagePosts'

export default function Home() {
  const isMobile = useIsMobile()

  return (
    <div
      className={clsx(
        ' h-full w-full overflow-y-auto relative',
        isMobile ? 'no-scrollbar' : 'p-4 space-y-6'
      )}
    >
      {/* top header */}
      {isMobile && <MobileTopHeader />}

      {isMobile && <StreamerHorizontalDiv />}

      <LiveStreamPublicReplays />
      <TextAndImagePosts />
    </div>
  )
}
