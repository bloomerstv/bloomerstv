import React, { memo, useEffect, useState } from 'react'
import Player from '../../../common/Player/Player'

const VideoWithEditors = ({ recordingUrl }: { recordingUrl: string }) => {
  const videoClipperRef = React.useRef<HTMLDivElement | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (videoClipperRef.current) {
      setIsMounted(true)
    }
  }, [])
  // todo : use portal from livepeer to use VideoClipper
  return (
    <>
      {isMounted && (
        <Player
          // @ts-ignore
          src={recordingUrl}
          showPipButton={false}
          autoHide={0}
          videoClipperSrc={recordingUrl}
          videoClipperRef={videoClipperRef}
        />
      )}
      <div ref={videoClipperRef} />
    </>
  )
}

export default memo(VideoWithEditors)
