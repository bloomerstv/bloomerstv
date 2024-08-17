import React from 'react'

const StreamerBarLoading = () => {
  return (
    <div className="between-row hover:bg-p-hover cursor-pointer w-full p-2 2xl:px-4">
      <div className="start-center-row gap-x-2">
        <div className="w-8 h-8 rounded-full bg-s-text animate-pulse" />
        <div className="w-24 h-3 rounded-md bg-s-text animate-pulse" />
      </div>
      <div className="w-10 h-3 rounded-md bg-s-text animate-pulse" />
    </div>
  )
}

export default StreamerBarLoading
