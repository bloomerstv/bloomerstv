import React from 'react'
import getAvatar from '../../../utils/lib/getAvatar'
import formatHandle from '../../../utils/lib/formatHandle'
import Link from 'next/link'
import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import { User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import LiveDiv from '../../ui/LiveDiv'
import {
  humanReadableDateTime,
  humanReadableNumber,
  timeAgoShort
} from '../../../utils/helpers'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import VerifiedBadge from '../../ui/VerifiedBadge'
import Countdown from 'react-countdown'
import { Tooltip } from '@mui/material'
import { StreamerWithAccount } from '../../store/useStreamersWithAccounts'
import useAccountStats from '../../../utils/hooks/lens/useAccountStats'
import { stringToLength } from '../../../utils/stringToLength'
const StreamerBar = ({ streamer }: { streamer: StreamerWithAccount }) => {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const minimize = !isMobile && pathname !== '/'
  const nextStreamInFuture =
    !!streamer?.nextStreamTime &&
    new Date(streamer?.nextStreamTime) > new Date()

  const { data } = useAccountStats({
    account: streamer?.account?.address
  })
  return (
    <Link
      prefetch
      href={`/${formatHandle(streamer?.account)}`}
      key={streamer?.account?.address}
      className={clsx(
        'flex flex-row no-underline p-2 w-full items-center justify-between hover:bg-p-hover cursor-pointer',
        minimize ? '2xl:px-2.5' : '2xl:px-4'
      )}
    >
      <div className={clsx(minimize ? 'centered-col' : 'centered-row')}>
        <img
          src={getAvatar(streamer?.account)}
          alt="avatar"
          className={clsx(
            'rounded-full',
            minimize ? 'w-10 h-10' : 'sm:w-8 sm:h-8 w-10 h-10'
          )}
        />
        {minimize && streamer?.isActive && (
          <div className="-mt-4">
            <LiveDiv />
          </div>
        )}
        {!minimize && (
          <div className="ml-2 space-y-2">
            <div className="start-center-row gap-x-1 leading-4">
              <div className="text-s-text font-bold ">
                {stringToLength(formatHandle(streamer?.account), 14)}
              </div>

              {streamer?.premium && <VerifiedBadge />}
            </div>

            {nextStreamInFuture && !streamer?.isActive && (
              <div className="text-s-text text-xs leading-4">
                <Countdown
                  renderer={({ days, hours, minutes, seconds, completed }) => {
                    if (completed) {
                      return null
                    } else {
                      return (
                        <div>{`Live in ${days ? `${days}d ` : ''} ${hours ? `${hours}h` : ''} ${minutes ? `${minutes}m` : ''} ${seconds ? `${seconds}s` : ''}`}</div>
                      )
                    }
                  }}
                  date={streamer?.nextStreamTime}
                />
              </div>
            )}
            {isMobile && (
              <div className="text-s-text sm:font-normal leading-3 font-semibold text-xs">
                {`${humanReadableNumber(data?.graphFollowStats?.followers)} followers`}
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
              <User size={18} />
              <div className="text-base font-semibold">
                {streamer?.liveCount}
              </div>
            </div>
          ) : (
            <Tooltip
              title={
                streamer?.lastSeen
                  ? humanReadableDateTime(streamer?.lastSeen)
                  : 'Offline'
              }
              arrow
            >
              <div className="text-s-text text-xs">
                {streamer?.lastSeen
                  ? `${timeAgoShort(streamer?.lastSeen)} ago`
                  : 'Offline'}
              </div>
            </Tooltip>
          )}
        </>
      )}
    </Link>
  )
}

export default StreamerBar
