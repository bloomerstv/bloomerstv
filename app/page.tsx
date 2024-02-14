'use client'
import clsx from 'clsx'
import MobileTopHeader from '../components/common/MobileTopHeader'
// import Video from '../components/common/Video'
import ClipsFeed from '../components/pages/home/ClipsFeed'
import LiveStreamPublicReplays from '../components/pages/home/LiveStreamPublicReplays'
import LiveStreamerFeed from '../components/pages/home/LiveStreamerFeed'
// import VideosFeed from '../components/pages/home/VideosFeed'
import useIsMobile from '../utils/hooks/useIsMobile'
import Video from '../components/common/Video'

export default function Home() {
  const isMobile = useIsMobile()

  return (
    <div
      className={clsx(
        'w-full h-full overflow-x-hidden overflow-y-auto',
        isMobile && 'no-scrollbar'
      )}
    >
      {/* top header */}
      {isMobile && <MobileTopHeader />}

      {/* <Video src="https://dev-bloomerstv-api.onrender.com/api/livestream?sessionId=5084354e-7900-458d-b3bc-ff650ffd3da6&format=.m3u8" /> */}

      {/* <Video src="http://localhost:8000/api/livestream?sessionId=5084354e-7900-458d-b3bc-ff650ffd3da6&format=.m3u8" /> */}

      <Video src="https://redirector-git-dev-diversehq-xyz.vercel.app/livestream?sessionId=5084354e-7900-458d-b3bc-ff650ffd3da6&format=.m3u8" />

      <LiveStreamerFeed />
      <div className="mt-4">
        <LiveStreamPublicReplays />
      </div>
      {!isMobile && (
        <div className="mt-4 ">
          <ClipsFeed />
        </div>
      )}
      {/* <div className="mt-4">
        <VideosFeed />
      </div> */}
    </div>
  )
}
