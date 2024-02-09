import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import React from 'react'

const LoadingVideoCard = ({ className }: { className?: string }) => {
  const pathname = usePathname()
  return (
    <div
      className={clsx(
        'space-y-2 w-full sm:px-2',
        pathname === '/' ? 'lg:w-1/3 2xl:w-1/4' : 'lg:w-1/3',
        className
      )}
    >
      <div
        className={
          'w-full aspect-video relative mb-2 sm:mb-2 overflow-hidden animate-pulse'
        }
      >
        <div className="w-full h-full sm:bg-s-bg bg-p-hover sm:rounded-xl" />
      </div>
      <div className="flex items-center space-x-2 animate-pulse w-full">
        <div className="w-10 h-10 sm:bg-s-bg bg-p-hover rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 sm:bg-s-bg bg-p-hover rounded"></div>
          <div className="h-4 sm:bg-s-bg bg-p-hover rounded w-5/12"></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingVideoCard
