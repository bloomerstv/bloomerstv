'use client'
import React, { use } from 'react';
import LiveChat from '../../../components/common/LiveChat/LiveChat'

const page = (
  props: {
    params: Promise<{
      profileId: string
    }>
  }
) => {
  const params = use(props.params);
  // @ts-ignore
  const chatData = window?.chatData || [] // Get the chat data passed from the parent window

  return (
    <div className="h-full w-full">
      <LiveChat
        profileId={params.profileId}
        preMessages={chatData}
        showLiveCount
      />
    </div>
  )
}

export default page
