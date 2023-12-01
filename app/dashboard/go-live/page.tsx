import React from 'react'
import LiveChat from '../../../components/pages/dashboard/go-live/LiveChat'
import LiveStreamEditor from '../../../components/pages/dashboard/go-live/LiveStreamEditor'

const GoLivePage = () => {
  return (
    <div className="flex flex-row h-full">
      <div className="w-full flex-grow overflow-auto h-full">
        <LiveStreamEditor />
      </div>
      <div className="w-[400px] flex-none h-full">
        <LiveChat />
      </div>
    </div>
  )
}

export default GoLivePage
