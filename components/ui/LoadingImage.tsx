import React, { useState } from 'react'
import { THUMBNAIL_FALLBACK } from '../../utils/config'

interface LoadingImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  loaderClassName?: string
  defaultImage?: string
}

const LoadingImage: React.FC<LoadingImageProps> = ({
  loaderClassName = '',
  defaultImage = '/defaultBanner.png',
  ...props
}) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <>
      {loading && (
        <div
          className={`${
            loaderClassName ? loaderClassName : props.className
          } bg-p-hover animate-pulse`}
        />
      )}
      <img
        {...props}
        src={!error ? props.src : defaultImage}
        onError={(e) => {
          setLoading(false)
          setError(true)
          // @ts-ignore
          e.target.onerror = null // Prevents infinite looping in case the fallback image also fails to load
          // @ts-ignore
          e.target.src = THUMBNAIL_FALLBACK // Replace with your default background image
        }}
        onLoad={() => {
          setLoading(false)
        }}
      />
    </>
  )
}

export default LoadingImage
