export const getVideoDuration = (url: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.src = url

    video.onloadedmetadata = () => {
      resolve(video.duration)
    }

    video.onerror = () => {
      reject(new Error('Failed to load video'))
    }
  })
}
