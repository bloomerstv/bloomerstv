export const getThumbnailFromRecordingUrl = (
  url: string,
  keyframe: number = 0
): string => {
  return `${url
    .split('/')
    .slice(0, -1)
    .join('/')}/thumbnails/keyframes_${keyframe}.jpg`
}

export const getListOfThumbnailsFromRecordingUrl = (
  url: string,
  duration: number,
  numberOfThumbnailsToShow: number = 0
): string[] => {
  // there is a thumbnail every 3 seconds
  const thumbnails: string[] = []
  const numberOfThumbnails = Math.floor(duration / 10)
  let step = Math.floor(numberOfThumbnails / numberOfThumbnailsToShow)

  // Check if step is 0 and set it to 1 if true
  if (step === 0) {
    step = 1
  }
  for (let i = 0; i < numberOfThumbnails; i += step) {
    thumbnails.push(getThumbnailFromRecordingUrl(url, i))
  }

  return thumbnails
}
