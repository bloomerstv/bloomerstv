'use client'
import { Button, Input } from '@mui/material'
import React, { useState } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { WIDGETS_URL } from '../../../../utils/config'
import { SessionType, useSession } from '@lens-protocol/react-web'
import toast from 'react-hot-toast'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import Link from 'next/link'
const ChatBoxWidgetPage = () => {
  const { data } = useSession()
  const [width, setWidth] = useState(300)
  const [height, setHeight] = useState(300)
  const [limit, setLimit] = useState(3)
  const [autoRemoveChatInterval, setAutoRemoveChatInterval] = useState(5)
  const [iframeKey, setIframeKey] = useState(Date.now())

  const refreshIframe = () => {
    setIframeKey(Date.now())
  }

  if (data?.type !== SessionType.WithProfile) {
    return null
  }

  const handleCopy = () => {
    const chatSourceUrl = `${WIDGETS_URL}/live-chat/${data?.profile?.id}?limit=${limit}&autoRemoveChatInterval=${autoRemoveChatInterval}`
    navigator.clipboard.writeText(chatSourceUrl)
    toast.success('Copied to clipboard')
  }

  return (
    <div>
      <div className="">
        <Link href="/dashboard/widgets" className="text-p-text no-underline">
          <div className="start-center-row gap-x-2 text-3xl font-bold cursor-pointer">
            <ArrowBackIosNewIcon className="cursor-pointer" />
            <div>Chat Box </div>
          </div>
        </Link>
        <div className="text-sm font-semibold text-s-text mt-2">
          The chat box allows you to display your live chat on your stream
        </div>
      </div>

      <div className="flex flex-row justify-between mt-6 h-full box-border">
        {/* options */}
        <div className="start-col gap-y-3 overflow-y-auto h-full box-border">
          <div className="start-col gap-y-3 w-fit">
            <div className="between-row w-full gap-x-6">
              <div>Width in px</div>
              <Input
                type="number"
                defaultValue={400}
                inputProps={{ min: 100, max: 800 }}
                value={width}
                className="w-[70px]"
                onChange={(e) => setWidth(Number(e.target.value))}
              />
            </div>
            <div className="between-row w-full gap-x-6">
              <div>Height in px</div>
              <Input
                type="number"
                defaultValue={400}
                inputProps={{ min: 100, max: 800 }}
                value={height}
                className="w-[70px]"
                onChange={(e) => setHeight(Number(e.target.value))}
              />
            </div>

            <div className="between-row w-full gap-x-6">
              <div>Limit No. of Chat</div>
              <Input
                type="number"
                defaultValue={4}
                inputProps={{ min: 1, max: 10 }}
                value={limit}
                className="w-[70px]"
                onChange={(e) => setLimit(Number(e.target.value))}
              />
            </div>
            <div className="between-row w-full gap-x-6">
              <div>
                <div>Remove Chat after (s)</div>
                <div className="text-s-text text-sm">Set to 0 to disable</div>
              </div>
              <Input
                type="number"
                defaultValue={4}
                inputProps={{ min: 1, max: 10 }}
                value={autoRemoveChatInterval}
                className="w-[70px]"
                onChange={(e) =>
                  setAutoRemoveChatInterval(Number(e.target.value))
                }
              />
            </div>
          </div>

          <div className="mt-4 w-[500px]">
            <div className="font-bold text-xl">Chat Widget Class Names</div>
            <div className="text-s-text text-sm font-semibold">
              Use this classnames to edit chat widget theme using custom css
              field in browser source of obs
            </div>
            <ul>
              <li>
                <strong>chat-container:</strong>
                <span>
                  Container for each chat message, controlling positioning and
                  margins.
                </span>
              </li>
              <li>
                <strong>profile-container:</strong>
                <span>
                  Container for the profile info (avatar and handle) displayed
                  above the message.
                </span>
              </li>
              <li>
                <strong>avatar:</strong>
                <span>
                  Displays the user's avatar image. Make sure the size fits your
                  design.
                </span>
              </li>
              <li>
                <strong>handle:</strong>
                <span>
                  User's handle (username), displayed alongside the avatar.
                </span>
              </li>
              <li>
                <strong>super-chat:</strong>
                <span>
                  Displays the super chat amount and currency symbol, if
                  applicable.
                </span>
              </li>
              <li>
                <strong>message:</strong>
                <span>The actual content of the chat message.</span>
              </li>
              <li>
                <strong>message-container:</strong>
                <span>
                  Container for the message, with styles for padding and
                  background.
                </span>
              </li>
            </ul>
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
              src={`${WIDGETS_URL}/live-chat/${data?.profile?.id}?emulate=true&limit=${limit}&autoRemoveChatInterval=${autoRemoveChatInterval}`}
            />
          </div>
          <div className="start-center-row gap-x-4 mt-4">
            {/* // copy source url */}
            <Button
              startIcon={<ContentCopyIcon />}
              onClick={handleCopy}
              variant="contained"
              style={{
                borderRadius: '30px',
                paddingLeft: '20px'
              }}
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
              style={{
                borderRadius: '30px',
                paddingLeft: '15px'
              }}
            >
              Emulate
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatBoxWidgetPage
