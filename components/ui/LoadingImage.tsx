import React, { useEffect, useState } from 'react'
import { THUMBNAIL_FALLBACK } from '../../utils/config'
import { motion } from 'framer-motion'
interface LoadingImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  loaderClassName?: string
  defaultImage?: string
}

const LoadingImage: React.FC<LoadingImageProps> = ({
  loaderClassName = '',
  defaultImage = THUMBNAIL_FALLBACK,
  ...props
}) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  // Load the image
  useEffect(() => {
    const img = new Image()
    // @ts-ignore
    img.src = props.src
    img.onload = () => setLoading(false)
    img.onerror = () => {
      setError(true)
      setLoading(false)
    }
  }, [props.src])
  return (
    <div>
      {loading ? (
        <div
          className={`${
            loaderClassName ? loaderClassName : props.className
          } bg-p-hover animate-pulse`}
        />
      ) : (
        // @ts-ignore
        <motion.img
          {...props}
          src={!error ? props.src : defaultImage}
          onError={(e) => {
            setLoading(false)
            setError(true)
            // @ts-ignore
            e.target.onerror = null // Prevents infinite looping in case the fallback image also fails to load
            // @ts-ignore
            e.target.src = defaultImage // Replace with your default background image
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </div>
  )
}

export default LoadingImage
