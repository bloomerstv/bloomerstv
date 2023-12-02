import React from 'react'
import { StreamerWithProfile } from '../../store/useStreamersWithProfiles'
import getAvatar from '../../../utils/lib/getAvatar'
import formatHandle from '../../../utils/lib/formatHandle'
import Link from 'next/link'

const StreamerBar = ({ streamer }: { streamer: StreamerWithProfile }) => {
  return (
    <Link
      href={`/${formatHandle(streamer?.profile)}`}
      key={streamer?.profileId}
      className="flex flex-row no-underline w-full items-center px-4 py-2 justify-between hover:bg-p-hover cursor-pointer"
    >
      <div className="start-row">
        <img
          src={getAvatar(streamer?.profile)}
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
        <div className="text-s-text font-bold text-lg ml-2">
          {formatHandle(streamer?.profile)}
        </div>
      </div>

      {/* red dot */}
      {streamer?.isActive && (
        <div className="w-2 h-2 rounded-full bg-red-600" />
      )}
    </Link>
  )
}

export default StreamerBar
