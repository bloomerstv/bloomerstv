import { ListItemButton } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import getAvatar from '../../../utils/lib/getAvatar'
import formatHandle from '../../../utils/lib/formatHandle'
import { Circle, Video, Grid3X3, Rocket, DollarSign } from 'lucide-react'
import VerifiedBadge from '../../ui/VerifiedBadge'
import useSession from '../../../utils/hooks/useSession'
import { useMyStreamQuery } from '../../../graphql/generated'

const DashboardSidebar = () => {
  const pathname = usePathname()
  const { isAuthenticated, account } = useSession()
  const { data: myStream } = useMyStreamQuery({
    skip: !isAuthenticated
  })
  return (
    <div className="sm:w-[200px] 2xl:w-[250px] h-full bg-s-bg overflow-auto">
      {isAuthenticated && (
        <Link
          href={`/${formatHandle(account)}`}
          className="text-p-text no-underline"
        >
          <div className="flex flex-col items-center justify-center my-4">
            <img
              className="w-20 h-20 rounded-full my-2"
              src={getAvatar(account)}
              alt="avatar"
            />
            <div className="text-sm font-bold text-s-text start-center-row gap-x-1">
              <div>{formatHandle(account)}</div>
              {myStream?.myStream?.premium && <VerifiedBadge />}
            </div>
          </div>
        </Link>
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
          <Circle className="mr-2" />
          Go Live
        </ListItemButton>
        <ListItemButton
          selected={pathname === '/dashboard/coins'}
          LinkComponent={Link}
          href="/dashboard/coins"
          sx={{
            padding: '10px 20px'
          }}
        >
          <DollarSign className="mr-2" />
          Coins
        </ListItemButton>
        <ListItemButton
          selected={pathname === '/dashboard/content'}
          LinkComponent={Link}
          href="/dashboard/content"
          sx={{
            padding: '10px 20px'
          }}
        >
          <Video className="mr-2" />
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
          <Grid3X3 className="mr-2" />
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
          <Rocket className="mr-2" />
          Subscription
        </ListItemButton>
      </div>
    </div>
  )
}

export default DashboardSidebar
