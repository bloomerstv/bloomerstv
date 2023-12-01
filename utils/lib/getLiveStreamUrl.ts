export const getLiveStreamUrl = (playbackId?: string | null) => {
  if (!playbackId) {
    return ''
  }
  return `https://livepeercdn.studio/hls/${playbackId}/index.m3u8`
}
