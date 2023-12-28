import { useMediaController } from '@livepeer/react'
import React, { memo, useEffect } from 'react'

const VideoClipHandler = ({
  setPlaybackOffsetMs
}: {
  setPlaybackOffsetMs: (offset: number) => void
}) => {
  const playbackOffsetMs = useMediaController((state) => state.playbackOffsetMs)
  useEffect(() => {
    setPlaybackOffsetMs(playbackOffsetMs!)
  }, [playbackOffsetMs])

  return <></>
}

export default memo(VideoClipHandler)
