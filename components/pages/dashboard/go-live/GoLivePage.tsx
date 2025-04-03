'use client'
import React from 'react'
import LiveStreamEditor from './LiveStreamEditor'
import LiveChat from '../../../common/LiveChat/LiveChat'
import { useSession } from '@lens-protocol/react-web'

const GoLivePage = () => {
  const { data } = useSession()

  return (
    <div className="flex flex-row h-full w-full">
      <div className="overflow-auto h-full min-w-0 flex-grow">
        <LiveStreamEditor />
      </div>
      <div className="w-[280px] 2xl:w-[350px] flex-none h-full shrink-0">
        {/* @ts-ignore */}
        {data?.profile?.id && (
          // @ts-ignore
          <LiveChat
            // @ts-ignore
            profileId={data?.profile?.id}
            showPopOutChat
            showLiveCount
          />
        )}
        {/* // ) : (
        //   <div className="flex bg-s-bg flex-col gap-y-8 items-center justify-center h-full">
        //     <CircularProgress color="secondary" />
        //     <div className="text-s-text font-semibold">
        //       Chat will be available after post is created
        //     </div>
        //   </div>
        // )} */}
      </div>
    </div>
  )
}

export default GoLivePage
 