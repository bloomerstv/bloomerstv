import Link from 'next/link'
import React from 'react'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import formatHandle from '../../utils/lib/formatHandle'
import { Profile, PublicationStats } from '@lens-protocol/react-web'
import { timeAgo } from '../../utils/helpers'
import { stringToLength } from '../../utils/stringToLength'
import { THUMBNAIL_FALLBACK } from '../../utils/config'

const RecommendedCardLayout = ({
  postLink,
  coverUrl,
  profile,
  stats,
  createdAt,
  title
}: {
  title: string
  postLink: string
  coverUrl?: string
  profile: Profile
  stats: PublicationStats
  createdAt: string
}) => {
  return (
    <Link
      prefetch
      className="no-underline text-p-text w-full group shrink-0"
      href={postLink}
    >
      <div className="w-full flex flex-row gap-x-3 font-semibold">
        <div className="relative h-[99px] w-[176px] rounded-md">
          <img
            src={coverUrl}
            className="h-[99px] w-[176px] object-cover rounded-md"
            onError={(e) => {
              // @ts-ignore
              e.target.onerror = null // Prevents infinite looping in case the fallback image also fails to load
              // @ts-ignore
              e.target.src = THUMBNAIL_FALLBACK // Replace with your default background image
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayArrowIcon className="text-white transform transition-transform group-hover:scale-110 duration-500" />
          </div>
        </div>
        <div>
          <div className="text-sm">{stringToLength(title, 55)}</div>
          <Link
            prefetch
            className="no-underline text-p-text w-full text-sm"
            href={`/${formatHandle(profile)}`}
          >
            <div className="text-s-text">{formatHandle(profile)}</div>
          </Link>
          <div className="text-xs text-s-text">
            {stats.upvotes} likes &middot; {timeAgo(createdAt)}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default RecommendedCardLayout
