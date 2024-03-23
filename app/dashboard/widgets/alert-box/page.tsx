'use client'
import { SessionType, useSession } from '@lens-protocol/react-web'
import React, { useState } from 'react'
import { WIDGETS_URL } from '../../../../utils/config'
import toast from 'react-hot-toast'
import Link from 'next/link'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { Button, Checkbox, Input } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

const AlexBoxWidgetPage = () => {
  const { data } = useSession()
  const [width, setWidth] = useState(300)
  const [height, setHeight] = useState(300)
  const [iframeKey, setIframeKey] = useState(Date.now())
  const [collectAlert, setCollectAlert] = useState(true)
  const [followerAlert, setFollowerAlert] = useState(true)

  const refreshIframe = () => {
    setIframeKey(Date.now())
  }

  if (data?.type !== SessionType.WithProfile) {
    return null
  }

  const handleCopy = () => {
    const chatSourceUrl = `${WIDGETS_URL}/alert-box/${data?.profile?.id}?newCollects=${collectAlert}&newFollowers=${followerAlert}`
    navigator.clipboard.writeText(chatSourceUrl)
    toast.success('Copied to clipboard')
  }

  return (
    <div>
      <div className="">
        <Link href="/dashboard/widgets" className="text-p-text no-underline">
          <div className="start-center-row gap-x-2 text-3xl font-bold cursor-pointer">
            <ArrowBackIosNewIcon className="cursor-pointer" />
            <div>Alert Box</div>
          </div>
        </Link>
        <div className="text-sm font-semibold text-s-text mt-2">
          Use the alert box to display alerts, such as notifications for new
          followers and new collects.
        </div>
      </div>

      <div className="flex flex-row justify-between mt-6">
        {/* options */}
        <div className="start-col gap-y-3">
          <div className="start-col gap-y-2 w-fit">
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
              <div>Show Collect Alerts</div>
              <Checkbox
                checked={collectAlert}
                onChange={(e) => setCollectAlert(e.target.checked)}
                disabled={!followerAlert}
                size="small"
              />
            </div>
            <div className="between-row w-full gap-x-6">
              <div>Show New Follower Alert</div>
              <Checkbox
                checked={followerAlert}
                onChange={(e) => setFollowerAlert(e.target.checked)}
                disabled={!collectAlert}
                size="small"
              />
            </div>
          </div>
          <div className="start-row gap-x-4 mt-4">
            <Button
              variant="contained"
              color="primary"
              onClick={handleCopy}
              startIcon={<ContentCopyIcon />}
            >
              Copy Source URL
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={refreshIframe}
              startIcon={<PlayArrowIcon />}
            >
              Emulate
            </Button>
          </div>
        </div>
        {/* iframe */}
        <div className="">
          <div className="font-semibold text-sm mb-2">Alert Box Preview</div>
          <div className=" border-dotted rounded-xl p-2">
            <iframe
              key={iframeKey}
              width={width}
              height={height}
              style={{
                border: 'none'
              }}
              src={`${WIDGETS_URL}/alert-box/${data?.profile?.id}?newCollects=${collectAlert}&newFollowers=${followerAlert}&emulate=true`}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlexBoxWidgetPage
