import React from 'react'
import LiveChat from '../../../components/pages/dashboard/go-live/LiveChat'
import LiveStreamEditor from '../../../components/pages/dashboard/go-live/LiveStreamEditor'

const GoLivePage = () => {
  return (
    <div className="flex flex-row h-full">
      <div className="flex-grow">
        <LiveStreamEditor />
      </div>
      <div className="w-[300px] flex-none h-full">
        <LiveChat />
      </div>
    </div>
  )
}

export default GoLivePage
