import React, { memo } from 'react'
import Video from '../../../common/Video'
import VideoClipper from './VideoClipper'

const VideoWithEditors = ({
  recordingUrl,
  src
}: {
  recordingUrl: string
  src: string
}) => {
  return (
    <Video
      autoPlay={false}
      // @ts-ignore
      src={recordingUrl}
      showPipButton={false}
      autoHide={0}
    >
      <VideoClipper url={src!} />
    </Video>
  )
}

export default memo(VideoWithEditors)
