import React from 'react'
import { StreamerWithProfile } from '../../store/useStreamersWithProfiles'
import getAvatar from '../../../utils/lib/getAvatar'
import formatHandle from '../../../utils/lib/formatHandle'
import Link from 'next/link'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import LiveDiv from '../../ui/LiveDiv'
import { humanReadableNumber, timeAgoShort } from '../../../utils/helpers'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import VerifiedBadge from '../../ui/VerifiedBadge'
import LoadingImage from '../../ui/LoadingImage'
const StreamerBar = ({ streamer }: { streamer: StreamerWithProfile }) => {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const minimize = !isMobile && pathname !== '/'
  return (
    <Link
      prefetch
      href={`/${formatHandle(streamer?.profile)}`}
      key={streamer?.profileId}
      className={clsx(
        'flex flex-row no-underline px-2 w-full items-center  py-1 justify-between hover:bg-p-hover cursor-pointer',
        minimize ? '2xl:px-2.5' : '2xl:px-4'
      )}
    >
      <div className={clsx(minimize ? 'centered-col' : 'centered-row')}>
        <LoadingImage
          src={getAvatar(streamer?.profile)}
          alt="avatar"
          className={clsx(
            ' rounded-full',
            minimize ? 'w-10 h-10' : 'sm:w-8 sm:h-8 w-10 h-10'
          )}
        />
        {minimize && streamer?.isActive && (
          <div className="-mt-4">
            <LiveDiv />
          </div>
        )}
        {!minimize && (
          <div className="ml-2">
            <div className="start-center-row gap-x-1">
              <div className="text-s-text font-bold ">
                {formatHandle(streamer?.profile)}
              </div>

              {streamer?.premium && <VerifiedBadge />}
            </div>
            {isMobile && (
              <div className="text-s-text sm:font-normal leading-3 font-semibold text-xs">
                {`${humanReadableNumber(streamer?.profile?.stats?.followers)} followers`}
              </div>
            )}
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
            <div className="text-s-text text-xs">
              {streamer?.lastSeen
                ? `${timeAgoShort(streamer?.lastSeen)} ago`
                : 'Offline'}
            </div>
          )}
        </>
      )}
    </Link>
  )
}

export default StreamerBar
