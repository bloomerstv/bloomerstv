import { Post } from '@lens-protocol/react-web'
import React from 'react'
import useIsMobile from '../../utils/hooks/useIsMobile'
import HomeVideoCard from './HomeVideoCard'
import getPublicationData from '../../utils/lib/getPublicationData'
import formatHandle from '../../utils/lib/formatHandle'
import { timeAgo } from '../../utils/helpers'
import { stringToLength } from '../../utils/stringToLength'
import Link from 'next/link'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

const RecommendedVideoCard = ({ post }: { post: Post }) => {
  const isMobile = useIsMobile()

  const asset = getPublicationData(post?.metadata)?.asset

  if (isMobile) {
    return <HomeVideoCard post={post} />
  }

  return (
    <Link
      prefetch
      className="no-underline text-p-text w-full group shrink-0"
      href={`/watch/${post?.id}`}
    >
      <div className="w-full flex flex-row gap-x-3 font-semibold">
        <div className="relative h-[99px] w-[176px] rounded-md">
          <img
            src={asset?.cover}
            className="h-[99px] w-[176px] object-cover rounded-md"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayArrowIcon className="text-white transform transition-transform group-hover:scale-110 duration-500" />
          </div>
        </div>
        <div>
          <div className="text-sm">
            {/* @ts-ignore */}
            {stringToLength(post?.metadata?.title, 55)}
          </div>

          <Link
            prefetch
            className="no-underline text-p-text w-full text-sm"
            href={`/${formatHandle(post?.by)}`}
          >
            <div className="text-s-text">{formatHandle(post?.by)}</div>
          </Link>
          <div className="text-xs text-s-text">
            {post?.stats?.upvotes} likes &middot; {timeAgo(post?.createdAt)}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default RecommendedVideoCard
