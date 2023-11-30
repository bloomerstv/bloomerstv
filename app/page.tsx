'use client'
import Video from '../components/livepeer/Video'
import LoginButton from '../components/pages/all/Header/LoginButton'
import { APP_NAME } from '../utils/config'
import useIsMobile from '../utils/hooks/useIsMobile'

export default function Home() {
  const isMobile = useIsMobile()
  return (
    <div className="">
      {/* top header */}
      {isMobile && (
        <div className="flex flex-row items-center sticky top-0 z-10 justify-between p-2 sm:p-3 bg-s-bg">
          <div className="font-bold">{APP_NAME}</div>
          <LoginButton />
        </div>
      )}
      <div className="m-2 p-4 bg-s-bg">Project : {APP_NAME}</div>
      <Video src="https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/1953toojwlx55gx3/index.m3u8" />
      <div className="m-2 p-4 bg-s-bg">Project : {APP_NAME}</div>
      <div className="m-2 p-4 bg-s-bg">Project : {APP_NAME}</div>
      <div className="m-2 p-4 bg-s-bg">Project : {APP_NAME}</div>
      <div className="m-2 p-4 bg-s-bg">Project : {APP_NAME}</div>
      <div className="m-2 p-4 bg-s-bg">Project : {APP_NAME}</div>
      <div className="m-2 p-4 bg-s-bg">Project : {APP_NAME}</div>
      <div className="m-2 p-4 bg-s-bg">Project : {APP_NAME}</div>
      <div className="m-2 p-4 bg-s-bg">Project : {APP_NAME}</div>
      <div className="m-2 p-4 bg-s-bg">Project : {APP_NAME}</div>
      <div className="m-2 p-4 bg-s-bg">Project : {APP_NAME}</div>
      <div className="m-2 p-4 bg-s-bg">Project : {APP_NAME}</div>
      <div className="m-2 p-4 bg-s-bg">Project : {APP_NAME}</div>
      <div className="m-2 p-4 bg-s-bg">Project : {APP_NAME}</div>
    </div>
  )
}
