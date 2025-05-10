import Link from 'next/link'
import React from 'react'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import formatHandle from '../../utils/lib/formatHandle'
import { timeAgo } from '../../utils/helpers'
import { stringToLength } from '../../utils/stringToLength'
import Markup from './Lexical/Markup'
import LoadingImage from '../ui/LoadingImage'
import { Account, PostStats } from '@lens-protocol/react'

const RecommendedCardLayout = ({
  postLink,
  coverUrl,
  account,
  stats,
  createdAt,
  title
}: {
  title: string
  postLink: string
  coverUrl?: string
  account: Account
  stats: PostStats
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
          <LoadingImage
            src={coverUrl}
            className="h-[99px] w-[176px] object-cover rounded-md"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayArrowIcon className="text-white transform transition-transform group-hover:scale-105 duration-300" />
          </div>
        </div>
        <div>
          <div className="text-sm">
            <Markup>{stringToLength(title, 55)}</Markup>
          </div>
          <Link
            prefetch
            className="no-underline text-p-text w-full text-sm"
            href={`/${formatHandle(account)}`}
          >
            <div className="text-s-text">{formatHandle(account)}</div>
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
