export const getLiveStreamUrl = (playbackId?: string | null) => {
  if (!playbackId) {
    return ''
  }
  // return `https://livepeercdn.studio/hls/${playbackId}/index.m3u8`
  return `https://livepeercdn.studio/webrtc/${playbackId}`
}

export const getLiveStreamUrlWebRTC = (playbackId?: string | null) => {
  // example https://livepeercdn.studio/webrtc/620e8dq03chzhyi2
  if (!playbackId) return ''

  return `https://livepeercdn.studio/webrtc/${playbackId}`
}
