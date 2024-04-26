export const getFileFromDataURL = async (
  dataUrl: string,
  fileName: string
): Promise<File | null> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = dataUrl

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0, img.width, img.height)

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], fileName, { type: blob.type })
          resolve(file)
        } else {
          resolve(null)
        }
      })
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
  })
}
