export const getThumbnailFromRecordingUrl = (
  url: string,
  keyframe: number = 0
) => {
  return `${url
    .split('/')
    .slice(0, -1)
    .join('/')}/thumbnails/keyframes_${keyframe}.jpg`
}
