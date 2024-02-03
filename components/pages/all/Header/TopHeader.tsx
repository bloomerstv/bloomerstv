import React from 'react'
import { APP_NAME } from '@/utils/config'
import LoginButton from './LoginButton'
import HeaderSearch from './HeaderSearch'
import Link from 'next/link'
import { useTheme } from '../../../wrappers/TailwindThemeProvider'
import clsx from 'clsx'
import { SessionType, useSession } from '@lens-protocol/react-web'
import { IconButton, Tooltip } from '@mui/material'
import { useRouter } from 'next/navigation'
import VideoCallIcon from '@mui/icons-material/VideoCall'

const TopHeader = () => {
  const { theme } = useTheme()
  const { data } = useSession()
  const { push } = useRouter()
  return (
    <div
      className={clsx(
        'flex flex-row items-center justify-between p-2 px-4 shadow-sm bg-s-bg h-[60px]',
        theme === 'dark' && 'border-b border-p-border'
      )}
    >
      <Link prefetch href="/" className="no-underline start-row">
        <div className="bg-brand rounded-full w-6 h-6 mr-2" />
        <div className="transition-all duration-200 ease-in-out font-bold text-s-text hover:text-p-text no-underline cursor-pointer">
          {APP_NAME}
        </div>
      </Link>
      <HeaderSearch />
      <div className="centered-row">
        {data?.type === SessionType.WithProfile && (
          <Tooltip title="Go Live">
            <IconButton
              onClick={() => {
                push(`/dashboard/go-live`)
              }}
            >
              <VideoCallIcon />
            </IconButton>
          </Tooltip>
        )}
        <LoginButton />
      </div>
    </div>
  )
}

export default TopHeader
