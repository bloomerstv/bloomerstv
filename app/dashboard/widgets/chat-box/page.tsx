'use client'
import { Button, Input } from '@mui/material'
import React, { useState } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { WIDGETS_URL } from '../../../../utils/config'
import { SessionType, useSession } from '@lens-protocol/react-web'
import toast from 'react-hot-toast'
const ChatBoxWidgetPage = () => {
  const { data } = useSession()
  const [width, setWidth] = useState(300)
  const [height, setHeight] = useState(400)
  const [iframeKey, setIframeKey] = useState(Date.now())

  const refreshIframe = () => {
    setIframeKey(Date.now())
  }

  if (data?.type !== SessionType.WithProfile) {
    return null
  }

  const handleCopy = () => {
    const chatSourceUrl = `${WIDGETS_URL}/live-chat/${data?.profile?.id}`
    navigator.clipboard.writeText(chatSourceUrl)
    toast.success('Copied to clipboard')
  }

  return (
    <div>
      <div className="">
        <div className="text-3xl font-bold">Chat Box Widget</div>
        <div className="text-sm font-semibold text-s-text">
          The chat box allows you to display your live chat on your stream
        </div>
      </div>

      <div className="flex flex-row justify-between mt-6">
        {/* options */}
        <div className="start-col gap-y-3">
          <div className="start-center-row gap-x-4">
            <div>Width</div>
            <Input
              type="number"
              defaultValue={400}
              inputProps={{ min: 100, max: 800 }}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
          </div>
          <div className="start-center-row gap-x-4">
            <div>Height</div>
            <Input
              type="number"
              defaultValue={400}
              inputProps={{ min: 100, max: 800 }}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </div>
          <div className="start-center-row gap-x-4 mt-4">
            {/* // copy source url */}
            <Button
              startIcon={<ContentCopyIcon />}
              onClick={handleCopy}
              variant="contained"
            >
              Copy Source url
            </Button>

            {/* emulate */}
            <Button
              onClick={() => {
                refreshIframe()
              }}
              startIcon={<PlayArrowIcon />}
              variant="contained"
            >
              Emulate
            </Button>
          </div>
        </div>
        {/* iframe preview */}
        <div>
          <div className="font-semibold text-sm mb-2">Chat Box Preview</div>
          <div className=" border-dotted rounded-xl p-2">
            <iframe
              // src="https://bloomers.tv"
              width={width}
              height={height}
              style={{
                border: 'none'
              }}
              key={iframeKey}
              src={`${WIDGETS_URL}/live-chat/${data?.profile?.id}?emulate=true`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatBoxWidgetPage
