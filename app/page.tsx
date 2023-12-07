'use client'
// import Video from '../components/common/Video'
import LoginButton from '../components/pages/all/Header/LoginButton'
import LiveStreamerFeed from '../components/pages/home/LiveStreamerFeed'
import VideosFeed from '../components/pages/home/VideosFeed'
import { APP_NAME } from '../utils/config'
import useIsMobile from '../utils/hooks/useIsMobile'

export default function Home() {
  const isMobile = useIsMobile()

  return (
    <div className="w-full overflow-x-hidden">
      {/* top header */}
      {isMobile && (
        <div className="flex flex-row items-center sticky top-0 z-10 justify-between p-2 sm:p-3 bg-s-bg">
          <div className="font-bold">{APP_NAME}</div>
          <LoginButton />
        </div>
      )}

      {/* <Video src="https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/995byhoammmk7hfy/index.m3u8" /> */}

      <LiveStreamerFeed />

      <div className="mt-4">
        <VideosFeed />
      </div>
    </div>
  )
}
