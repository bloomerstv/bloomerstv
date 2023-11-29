'use client'
import React from 'react'
// import { Broadcast, useCreateStream } from '@livepeer/react'
// import { toast } from 'react-toastify'
// import Video from './Video'

const LiveStreamEditor = () => {
  // const {
  //   mutate: createStream,
  //   data: stream,
  //   status
  // } = useCreateStream({ name: 'test' })

  return (
    <>
      <div className="spinner border-p-text w-4 h-4" />
      {/* {stream ? (
        <>
          <div>PlaybackId : {stream.playbackId}</div>
          <div>Is Active : {stream?.isActive} </div>
          <div>StreakKey : {stream?.streamKey}</div>
          <div>Video : </div>

          <Broadcast
            displayMediaOptions={{
              video: true,
              audio: false
            }}
            streamKey={stream?.streamKey}
          />
        </>
      ) : (
        <>
          <button onClick={createLiveStream} disabled={status !== 'idle'}>
            <>{status === 'loading' ? 'Creating' : 'Create Live Stream'}</>
          </button>
        </>
      )}

      <div>A sample live stream video </div>

      <Video
        src={`https://livepeercdn.studio/hls/0663n6aucb6j749n/index.m3u8`}
        playerbackId="0663n6aucb6j749n"
      /> */}
    </>
  )
}

export default LiveStreamEditor
