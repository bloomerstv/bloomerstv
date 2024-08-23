import React from 'react'
import { LIVE_PEER_RTMP_URL } from '../../../../utils/config'

import { MyStream } from '../../../../graphql/generated'
import {
  getLiveStreamUrl,
  getLiveStreamUrlWebRTC
} from '../../../../utils/lib/getLiveStreamUrl'
import TextInputWithCopy from './TextInputWithCopy'

const StreamKey = ({ myStream }: { myStream: MyStream }) => {
  const m3u8Url = getLiveStreamUrl(myStream?.playbackId)
  const webrtcUrl = getLiveStreamUrlWebRTC(myStream?.playbackId)

  return (
    <div className="space-y-6 w-[400px]">
      <div className="font-bold text-lg text-s-text">Stream Info</div>

      <TextInputWithCopy
        text={String(myStream?.streamKey)}
        label="Stream Key"
        hideText
      />

      <TextInputWithCopy text={m3u8Url} label="m3u8 URL" />

      <TextInputWithCopy text={webrtcUrl} label="WebRTC URL" />

      <TextInputWithCopy text={LIVE_PEER_RTMP_URL} label="Stream RTMP URL" />
    </div>
  )
}

export default StreamKey
