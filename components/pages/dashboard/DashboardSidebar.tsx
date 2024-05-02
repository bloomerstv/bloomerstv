import { SessionType, useSession } from '@lens-protocol/react-web'
import { ListItemButton } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import getAvatar from '../../../utils/lib/getAvatar'
import formatHandle from '../../../utils/lib/formatHandle'
import CircleIcon from '@mui/icons-material/Circle'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'
import WidgetsIcon from '@mui/icons-material/Widgets'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import { useMyStreamQuery } from '../../../graphql/generated'
import VerifiedBadge from '../../ui/VerifiedBadge'
const DashboardSidebar = () => {
  const pathname = usePathname()
  const { data } = useSession()
  const { data: myStream } = useMyStreamQuery({
    skip: data?.type !== SessionType.WithProfile
  })
  return (
    <div className="min-w-[250px] max-w-[300px] h-full bg-s-bg overflow-auto">
      {data?.type === SessionType.WithProfile && (
        <div className="flex flex-col items-center justify-center my-4">
          <img
            className="w-20 h-20 rounded-full my-2"
            src={getAvatar(data?.profile)}
            alt="avatar"
          />
          <div className="text-sm font-bold text-s-text start-center-row gap-x-1">
            <div>{formatHandle(data?.profile)}</div>
            {myStream?.myStream?.premium && <VerifiedBadge />}
          </div>
        </div>
      )}
      <div className="space-y-2">
        <ListItemButton
          selected={pathname === '/dashboard/go-live'}
          LinkComponent={Link}
          href="/dashboard/go-live"
          sx={{
            padding: '10px 20px'
          }}
        >
          <CircleIcon className="mr-2" />
          Go Live
        </ListItemButton>
        <ListItemButton
          selected={pathname === '/dashboard/content'}
          LinkComponent={Link}
          href="/dashboard/content"
          sx={{
            padding: '10px 20px'
          }}
        >
          <VideoLibraryIcon className="mr-2" />
          Content
        </ListItemButton>
        <ListItemButton
          selected={pathname.startsWith('/dashboard/widgets')}
          LinkComponent={Link}
          href="/dashboard/widgets"
          sx={{
            padding: '10px 20px'
          }}
        >
          <WidgetsIcon className="mr-2" />
          Widgets
        </ListItemButton>

        <ListItemButton
          selected={pathname.startsWith('/dashboard/subscription')}
          LinkComponent={Link}
          href="/dashboard/subscription"
          sx={{
            padding: '10px 20px'
          }}
        >
          <RocketLaunchIcon className="mr-2" />
          Subscription
        </ListItemButton>
      </div>
    </div>
  )
}

export default DashboardSidebar
