import React, { memo, useEffect, useState } from 'react'
import Player from '../../../common/Player'

const VideoWithEditors = ({
  recordingUrl,
  src
}: {
  recordingUrl: string
  src: string
}) => {
  const videoClipperRef = React.useRef<HTMLDivElement | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (videoClipperRef.current) {
      setIsMounted(true)
    }
  }, [])
  console.log('src', src)
  // todo : use portal from livepeer to use VideoClipper
  return (
    <>
      {isMounted && (
        <Player
          // @ts-ignore
          src={recordingUrl}
          showPipButton={false}
          autoHide={0}
          videoClipperSrc={src}
          videoClipperRef={videoClipperRef}
        />
      )}
      <div ref={videoClipperRef} />
    </>
  )
}

export default memo(VideoWithEditors)
