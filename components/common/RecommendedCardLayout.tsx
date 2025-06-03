import Link from 'next/link'
import React from 'react'
import { Play } from 'lucide-react'
import formatHandle from '../../utils/lib/formatHandle'
import { secondsToTime, timeAgo } from '../../utils/helpers'
import { stringToLength } from '../../utils/stringToLength'
import Markup from './Lexical/Markup'
import LoadingImage from '../ui/LoadingImage'
import { Account, PostStats } from '@lens-protocol/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const RecommendedCardLayout = ({
  postLink,
  coverUrl,
  account,
  stats,
  createdAt,
  title,
  duration
}: {
  title: string
  postLink: string
  coverUrl?: string
  account: Account
  stats: PostStats
  createdAt: string
  duration?: number
}) => {
  const router = useRouter()

  const handleAccountClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    router.push(`/${formatHandle(account)}`)
  }

  return (
    <Link
      prefetch
      className="no-underline text-p-text w-full group shrink-0"
      href={postLink}
    >
      <div className="w-full flex flex-row gap-x-3 font-semibold">
        <div className="relative h-[99px] w-[176px] rounded-md">
          <LoadingImage
            src={coverUrl}
            className="h-[99px] w-[176px] object-cover rounded-md z-0"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="text-white transform transition-transform group-hover:scale-105 duration-300" />
          </div>
          {duration && (
            <div className="absolute bottom-3 right-2 bg-black bg-opacity-80 px-1.5 rounded">
              <div className="text-xs text-white">
                {secondsToTime(duration)}
              </div>
            </div>
          )}
        </div>
        <div>
          <div className="text-sm">
            <Markup>{stringToLength(title, 55)}</Markup>
          </div>
          <div
            onClick={handleAccountClick}
            className="no-underline text-p-text w-full text-sm cursor-pointer"
          >
            <div className="text-s-text">{formatHandle(account)}</div>
          </div>
          <div className="text-xs text-s-text">
            {stats?.upvotes} likes &middot; {timeAgo(createdAt)}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default RecommendedCardLayout
