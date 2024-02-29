import React from 'react'
import { StreamerWithProfile } from '../../store/useStreamersWithProfiles'
import getAvatar from '../../../utils/lib/getAvatar'
import formatHandle from '../../../utils/lib/formatHandle'
import Link from 'next/link'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const StreamerBar = ({ streamer }: { streamer: StreamerWithProfile }) => {
  const pathname = usePathname()
  const minimize = pathname !== '/'
  return (
    <Link
      prefetch
      href={`/${formatHandle(streamer?.profile)}`}
      key={streamer?.profileId}
      className="flex flex-row no-underline w-full items-center px-2 2xl:px-4 py-2 justify-between hover:bg-p-hover cursor-pointer"
    >
      <div className="centered-row">
        <img
          src={getAvatar(streamer?.profile)}
          alt="avatar"
          className={clsx(' rounded-full', minimize ? 'w-10 h-10' : 'w-8 h-8')}
        />
        {!minimize && (
          <div className="text-s-text font-bold ml-2">
            {formatHandle(streamer?.profile)}
          </div>
        )}
      </div>

      {/* red dot */}
      {!minimize && (
        <>
          {streamer?.isActive ? (
            <div className="centered-row gap-x-1 text-xl text-brand ">
              <PermIdentityIcon fontSize="inherit" />
              <div className="text-base font-semibold">
                {streamer?.liveCount}
              </div>
            </div>
          ) : (
            <div className="text-s-text text-xs">Offline</div>
          )}
        </>
      )}
    </Link>
  )
}

export default StreamerBar
