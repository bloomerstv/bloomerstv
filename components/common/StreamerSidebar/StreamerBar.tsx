import React from 'react'
import { StreamerWithProfile } from '../../store/useStreamersWithProfiles'
import getAvatar from '../../../utils/lib/getAvatar'
import formatHandle from '../../../utils/lib/formatHandle'
import Link from 'next/link'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'

const StreamerBar = ({ streamer }: { streamer: StreamerWithProfile }) => {
  return (
    <Link
      prefetch
      href={`/${formatHandle(streamer?.profile)}`}
      key={streamer?.profileId}
      className="flex flex-row no-underline w-full items-center px-4 py-2 justify-between hover:bg-p-hover cursor-pointer"
    >
      <div className="start-row">
        <img
          src={getAvatar(streamer?.profile)}
          alt="avatar"
          className="w-7 h-7 rounded-full"
        />
        <div className="text-s-text font-bold ml-2">
          {formatHandle(streamer?.profile)}
        </div>
      </div>

      {/* red dot */}
      {streamer?.isActive ? (
        <div className="start-row gap-x-1 text-xl text-brand ">
          <PermIdentityIcon fontSize="inherit" />
          <div className="text-base font-semibold">{streamer?.liveCount}</div>
        </div>
      ) : (
        <div className="text-s-text text-xs">Offline</div>
      )}
    </Link>
  )
}

export default StreamerBar
