'use client'
import React from 'react'
import { toast } from 'react-toastify'
import { useMyStreamQuery } from '../../../../graphql/generated'
import Video from '../../../common/Video'
import { getLiveStreamUrl } from '../../../../utils/lib/getLiveStreamUrl'
import ConnectStream from './ConnectStream'
import MyStreamEditButton from './MyStreamEditButton'
import { SessionType, useSession } from '@lens-protocol/react-web'
import { Button, TextField } from '@mui/material'
import { LIVE_PEER_RTMP_URL } from '../../../../utils/config'
// import { stringToLength } from '../../../../utils/stringToLength'

const LiveStreamEditor = () => {
  const { data: session } = useSession()
  const { data, error, refetch } = useMyStreamQuery()

  if (error) {
    toast.error(error.message)
  }

  if (session?.type !== SessionType.WithProfile) {
    return <div>You must be logged in to stream.</div>
  }

  const myStream = data?.myStream

  if (!myStream) {
    return <div>You can't stream right now.</div>
  }

  console.log('myStream', myStream)

  return (
    <div className="p-8">
      <div className="bg-s-bg shadow-md">
        <div className="flex flex-row">
          <Video
            className="w-[480px] shrink-0"
            src={getLiveStreamUrl(myStream?.playbackId)}
            streamOfflineErrorComponent={<ConnectStream />}
          />
          <div className="flex flex-row justify-between items-start p-8 w-full">
            <div className="space-y-4">
              <div className="">
                <div className="text-s-text font-bold text-md">Title</div>
                <div className="text-p-text font-semibold text-lg">
                  {myStream?.streamName}
                </div>
              </div>

              {/* <div className="">
                <div className="text-s-text font-bold text-sm">Description</div>
                <div className="text-p-text font-semibold ">
                  {stringToLength(myStream?.streamDescription, 100) ||
                    'No description provided'}
                </div>
              </div> */}
            </div>

            <MyStreamEditButton
              refreshStreamInfo={refetch}
              myStream={myStream}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 p-8 bg-s-bg shadow-md ">
        <div className="space-y-8 w-[400px]">
          <div className="font-bold text-lg text-s-text">Stream Key</div>
          <div className="start-row space-x-2">
            {/* mui input with copy button  */}
            <TextField
              type="password"
              label="Stream Key"
              value={myStream?.streamKey}
              // don't allow editing
              InputProps={{
                readOnly: true
              }}
              size="small"
              fullWidth
            />
            <Button
              variant="outlined"
              onClick={() => {
                navigator.clipboard.writeText(myStream?.streamKey || '')
                toast.success('Copied to clipboard')
              }}
            >
              Copy
            </Button>
          </div>

          {/* stream url */}
          <div className="start-row space-x-2">
            <TextField
              label="Stream URL"
              value={LIVE_PEER_RTMP_URL}
              // don't allow editing
              InputProps={{
                readOnly: true
              }}
              size="small"
              fullWidth
            />
            <Button
              variant="outlined"
              onClick={() => {
                navigator.clipboard.writeText(LIVE_PEER_RTMP_URL)
                toast.success('Copied to clipboard')
              }}
            >
              Copy
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveStreamEditor
