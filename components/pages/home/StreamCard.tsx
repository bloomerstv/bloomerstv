import React from 'react'
import { StreamerWithProfile } from '../../store/useStreamersWithProfiles'
import getAvatar from '../../../utils/lib/getAvatar'
import formatHandle from '../../../utils/lib/formatHandle'
import Link from 'next/link'
import LiveDiv from '../../ui/LiveDiv'
import LoadingImage from '../../ui/LoadingImage'

const StreamCard = ({ streamer }: { streamer: StreamerWithProfile }) => {
  return (
    <Link
      prefetch
      href={`/${formatHandle(streamer?.profile)}`}
      className="no-underline text-p-text w-full"
    >
      <div className="w-full aspect-w-16 aspect-h-9 sm:w-[416px] h-[234px] relative mb-2.5 sm:mb-2  overflow-hidden">
        {/* @ts-ignore */}
        <LoadingImage
          // @ts-ignore
          src={streamer?.thumbnail}
          className="w-full h-full transition-transform duration-500 ease-in-out transform hover:scale-110"
          alt="thumbnail"
        />
        <div className="absolute top-4 left-4">
          <LiveDiv />
        </div>
      </div>
      <div className="sm:px-0 px-4 w-full sm:w-[416px] start-row space-x-4">
        <img
          src={getAvatar(streamer?.profile)}
          className="w-12 h-12 rounded-full"
          alt="avatar"
        />
        <div className="start-col">
          <div className="font-semibold">{streamer?.streamName}</div>
          <div className="text-sm">{formatHandle(streamer?.profile)} </div>
        </div>
      </div>
    </Link>
  )
}

export default StreamCard
