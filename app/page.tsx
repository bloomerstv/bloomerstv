'use client'
import MobileTopHeader from '../components/common/MobileTopHeader'
// import Video from '../components/common/Video'
import ClipsFeed from '../components/pages/home/ClipsFeed'
import LiveStreamPublicReplays from '../components/pages/home/LiveStreamPublicReplays'
import LiveStreamerFeed from '../components/pages/home/LiveStreamerFeed'
import VideosFeed from '../components/pages/home/VideosFeed'
import useIsMobile from '../utils/hooks/useIsMobile'

export default function Home() {
  const isMobile = useIsMobile()

  return (
    <div className="w-full overflow-x-hidden">
      {/* top header */}
      {isMobile && <MobileTopHeader />}

      <LiveStreamerFeed />
      {!isMobile && (
        <div className="mt-4 ">
          <ClipsFeed />
        </div>
      )}
      <div className="mt-4">
        <LiveStreamPublicReplays />
      </div>
      <div className="mt-4">
        <VideosFeed />
      </div>
    </div>
  )
}
