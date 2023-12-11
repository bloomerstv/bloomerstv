import React, { useState } from 'react'

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
        onError={() => {
          setLoading(false)
          setError(true)
        }}
        onLoad={() => {
          setLoading(false)
        }}
      />
    </>
  )
}

export default LoadingImage
