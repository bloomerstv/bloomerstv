import { Button, TextField } from '@mui/material'
import React from 'react'
import { LIVE_PEER_RTMP_URL } from '../../../../utils/config'
import toast from 'react-hot-toast'
import { MyStream } from '../../../../graphql/generated'

const StreamKey = ({ myStream }: { myStream: MyStream }) => {
  return (
    <div className="space-y-6 w-[400px]">
      <div className="font-bold text-lg text-s-text">Stream Key</div>
      <div className="start-center-row space-x-2">
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
      <div className="start-center-row space-x-2">
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
  )
}

export default StreamKey
