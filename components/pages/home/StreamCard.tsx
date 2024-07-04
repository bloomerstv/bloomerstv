import React from 'react'
import { StreamerWithProfile } from '../../store/useStreamersWithProfiles'
import getAvatar from '../../../utils/lib/getAvatar'
import formatHandle from '../../../utils/lib/formatHandle'
import Link from 'next/link'
import LiveDiv from '../../ui/LiveDiv'
import LoadingImage from '../../ui/LoadingImage'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import VerifiedBadge from '../../ui/VerifiedBadge'
import Markup from '../../common/Lexical/Markup'

const StreamCard = ({ streamer }: { streamer: StreamerWithProfile }) => {
  return (
    <Link
      prefetch
      href={`/${formatHandle(streamer?.profile)}`}
      className="no-underline text-p-text w-full lg:w-1/3 2xl:w-1/4 sm:px-2"
    >
      {/* xl:w-[368px] xl:h-[207px] 2xl:w-[392px] 2xl:h-[220px] */}
      <div className="w-full aspect-video relative mb-2 sm:rounded-xl overflow-hidden">
        {/* @ts-ignore */}
        <LoadingImage
          // @ts-ignore
          src={streamer?.thumbnail}
          className="w-full object-cover aspect-video bg-p-hover sm:rounded-xl transition-transform duration-500 ease-in-out transform hover:scale-110"
          alt="thumbnail"
        />
        <div className="absolute top-4 left-4 start-center-row gap-x-2">
          <LiveDiv />
          <div className="centered-row gap-x-1 text-white text-base bg-black bg-opacity-80 px-1.5 rounded-md">
            <PermIdentityIcon fontSize="inherit" />
            <div className="text-sm font-semibold">{streamer?.liveCount}</div>
          </div>
        </div>

        {/* live viewers count */}
        {/* <div className="absolute bottom-4 left-4 "></div> */}
      </div>
      <div className="sm:px-0 px-4 w-full start-row space-x-3">
        <img
          src={getAvatar(streamer?.profile)}
          className="w-10 h-10 rounded-full"
          alt="avatar"
        />
        <div className="start-col">
          {/* @ts-ignore */}
          <Markup className="font-semibold">{streamer?.streamName}</Markup>
          <div className="flex flex-row items-center gap-x-1">
            <div className="text-sm font-semibold text-s-text">
              {formatHandle(streamer?.profile)}{' '}
            </div>
            {streamer?.premium && <VerifiedBadge />}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default StreamCard
