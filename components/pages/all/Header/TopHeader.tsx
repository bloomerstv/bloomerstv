import React from 'react'
import { APP_NAME } from '@/utils/config'
import LoginButton from './LoginButton'
import HeaderSearch from './HeaderSearch'
import Link from 'next/link'
import { useTheme } from '../../../wrappers/TailwindThemeProvider'
import clsx from 'clsx'
import { SessionType, useSession } from '@lens-protocol/react-web'
import { IconButton, Tooltip } from '@mui/material'
import VideoCallIcon from '@mui/icons-material/VideoCall'
import CreatePostButton from './CreatePostButton'

const TopHeader = () => {
  const { theme } = useTheme()
  const { data } = useSession()
  return (
    <div
      className={clsx(
        'flex flex-row items-center justify-between py-0.5 px-4 shadow-sm bg-s-bg h-[50px]',
        theme === 'dark' && 'border-b border-p-border'
      )}
    >
      <Link prefetch href="/" className="no-underline centered-row">
        <img
          className="rounded-full w-8 h-8 mr-2"
          src="/icon-192x192.png"
          alt="logo"
        />
        <div className="transition-all duration-200 ease-in-out font-bold text-s-text hover:text-p-text no-underline cursor-pointer">
          {APP_NAME}
        </div>
      </Link>
      <HeaderSearch />
      <div className="centered-row gap-x-1">
        {data?.type === SessionType.WithProfile && <CreatePostButton />}

        {data?.type === SessionType.WithProfile && (
          <Tooltip title="Go Live">
            <IconButton LinkComponent={Link} href="/dashboard/go-live">
              <VideoCallIcon />
            </IconButton>
          </Tooltip>
        )}
        <div className="ml-3">
          <LoginButton />
        </div>
      </div>
    </div>
  )
}

export default TopHeader
