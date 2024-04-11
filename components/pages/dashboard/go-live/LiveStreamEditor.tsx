'use client'
import React, { memo, useEffect } from 'react'
import { ViewType, useMyStreamQuery } from '../../../../graphql/generated'

import MyStreamEditButton from './MyStreamEditButton'
import { SessionType, useSession } from '@lens-protocol/react-web'
import { Button, MenuItem, Select, TextField } from '@mui/material'
import { LIVE_PEER_RTMP_URL } from '../../../../utils/config'
import clsx from 'clsx'
import StartLoadingPage from '../../loading/StartLoadingPage'
import toast from 'react-hot-toast'
import { useMyPreferences } from '../../../store/useMyPreferences'
import LiveVideoComponent from './LiveVideoComponent'
import CollectSettingButton from '../../../common/Collect/CollectSettingButton'
import { CATEGORIES_LIST } from '../../../../utils/categories'
// import { stringToLength } from '../../../../utils/stringToLength'
import Link from 'next/link'
const LiveStreamEditor = () => {
  const [startedStreaming, setStartedStreaming] = React.useState(false)
  const [streamFromBrowser, setStreamFromBrowser] = React.useState(false)

  const { data: session } = useSession()
  const { data, error, refetch, loading } = useMyStreamQuery()

  const {
    category,
    setCategory,
    setStreamReplayViewType,
    streamReplayViewType
  } = useMyPreferences((state) => {
    return {
      streamReplayViewType: state.streamReplayViewType,
      setStreamReplayViewType: state.setStreamReplayViewType,
      category: state.category,
      setCategory: state.setCategory
    }
  })

  useEffect(() => {
    if (!error) return
    toast.error(error?.message)
  }, [error])

  const myStream = data?.myStream

  if (session?.type !== SessionType.WithProfile) {
    return <div>You must be logged in to stream.</div>
  }

  if (loading && !myStream) {
    return <StartLoadingPage />
  }

  if (!myStream) {
    return <div>You can't stream right now.</div>
  }

  return (
    <div className="p-4 2xl:p-6">
      <div className="bg-s-bg shadow-sm rounded-xl overflow-hidden">
        <div className="flex flex-row">
          <LiveVideoComponent
            myStream={myStream}
            setStartedStreaming={setStartedStreaming}
            startedStreaming={startedStreaming}
            streamFromBrowser={streamFromBrowser}
            setStreamFromBrowser={setStreamFromBrowser}
          />
          <div className="flex flex-row justify-between items-start px-4 pt-4 w-full">
            <div className="space-y-1.5 2xl:space-y-2.5 w-full">
              <div className="between-row gap-x-1 w-full">
                <div className="">
                  <div className="text-s-text font-bold text-md">Title</div>
                  <div className="text-p-text font-semibold text-sm 2xl:text-base">
                    {myStream?.streamName}
                  </div>
                </div>
                <MyStreamEditButton
                  refreshStreamInfo={refetch}
                  myStream={myStream}
                />
              </div>

              {/* <div className="">
                <div className="text-s-text font-bold text-md">Description</div>
                <div className="text-p-text text-sm 2xl:text-base font-semibold ">
                  <div className="whitespace-pre-wrap break-words ">
                    {stringToLength(myStream?.streamDescription, 50) ||
                      'No description provided'}
                  </div>
                </div>
              </div> */}
              <div className="space-y-1">
                <div className="text-s-text font-bold text-md">
                  Collect Preview
                </div>
                <CollectSettingButton />
              </div>

              {/* select stream replay view type and set */}

              <div className="flex flex-row gap-x-6">
                <div className="flex flex-row gap-x-8">
                  {myStream?.premium && (
                    <div className="space-y-1">
                      <div className="text-s-text font-bold text-md">
                        Replay Visibility
                      </div>
                      <Select
                        value={streamReplayViewType}
                        onChange={(e) => {
                          if (!e.target.value) return
                          setStreamReplayViewType(e.target.value as ViewType)
                        }}
                        variant="standard"
                        size="small"
                      >
                        <MenuItem
                          value={ViewType.Public}
                          title="Your stream replay will be visible on Home, Profile, and Post page"
                          className="text-p-text"
                        >
                          Public
                        </MenuItem>
                        <MenuItem
                          title="Your stream replay will be visible only on Post page"
                          value={ViewType.Unlisted}
                          className="text-p-text"
                        >
                          Unlisted
                        </MenuItem>

                        <MenuItem
                          title="Your stream replay will not be visible for anyone but you can find it in dashboard"
                          value={ViewType.Private}
                          className="text-p-text"
                        >
                          Private
                        </MenuItem>
                      </Select>
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="text-s-text font-bold text-md">
                      Category
                    </div>
                    <Select
                      value={category}
                      onChange={(e) => {
                        if (!e.target.value) return
                        setCategory(e.target.value as string)
                      }}
                      variant="standard"
                      size="small"
                    >
                      {CATEGORIES_LIST.map((category) => (
                        <MenuItem value={category} key={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>

              {!myStream?.premium && (
                <div className="text-xs text-s-text">
                  Stream replay has been moved to Super Plan. Checkout{' '}
                  <Link
                    href={'/dashboard/subscription'}
                    className="text-brand no-underline"
                  >
                    subscription page
                  </Link>{' '}
                  to upgrade.
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="px-4 py-3 start-center-row space-x-4">
          {/* dot that goes red when live and green when not */}
          <div
            className={clsx(
              'w-4 h-4 rounded-full',
              startedStreaming ? 'bg-brand' : 'bg-s-text'
            )}
          />

          <div className="font-semibold ">
            {startedStreaming
              ? `You're live! ${
                  streamFromBrowser
                    ? 'You can Stop streaming by pressing stop button.'
                    : 'You can Stop streaming from your software.'
                }`
              : 'Stream is offline. Stay on this page for post creation after stream starts. Use software for best quality.'}
          </div>
        </div>
      </div>

      <div className="mt-4 2xl:mt-6 p-8 bg-s-bg shadow-sm rounded-xl">
        <div className="space-y-8 w-[400px]">
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
      </div>
    </div>
  )
}

export default memo(LiveStreamEditor)
