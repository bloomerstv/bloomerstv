import { Post } from '@lens-protocol/react-web'
import Link from 'next/link'
import React from 'react'
import getAvatar from '../../utils/lib/getAvatar'
import formatHandle from '../../utils/lib/formatHandle'
import getPublicationData from '../../utils/lib/getPublicationData'
import { secondsToTime, timeAgo } from '../../utils/helpers'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

const HomeVideoCard = ({ post }: { post: Post }) => {
  const asset = getPublicationData(post?.metadata)?.asset

  return (
    <Link
      prefetch
      className="no-underline text-p-text group"
      href={`/watch/${post?.id}`}
    >
      <div className="w-full aspect-w-16 aspect-h-9 sm:w-[410px] h-[234px] relative mb-2 sm:mb-2  overflow-hidden">
        <img
          src={asset?.cover}
          className="w-full h-full transition-transform duration-500 ease-in-out transform group-hover:scale-110"
          alt="thumbnail"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <PlayArrowIcon
            fontSize="large"
            className="text-white transform transition-transform group-hover:scale-110 duration-500"
          />
        </div>
        {asset?.duration && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-80 px-1.5 rounded">
            <div className="text-xs text-white">
              {secondsToTime(asset?.duration)}
            </div>
          </div>
        )}
      </div>
      <div className="sm:px-0 px-4 w-full sm:w-[416px] start-row space-x-4">
        <img
          src={getAvatar(post?.by)}
          className="w-8 h-8 rounded-full"
          alt="avatar"
        />
        <div className="start-col">
          {/* @ts-ignore */}
          <div className="text-sm font-semibold">{post?.metadata?.title}</div>
          <div className="start-row text-sm text-s-text gap-x-1.5">
            <Link
              prefetch
              className="no-underline text-p-text group font-semibold text-s-text"
              href={`/${formatHandle(post?.by)}`}
            >
              <div className="">{formatHandle(post?.by)} </div>
            </Link>
            {/* dot */}
            <div className="">&middot;</div>
            <div>{post?.stats?.upvotes} likes</div>
            <div className="">&middot;</div>
            <div className="">{timeAgo(post?.createdAt)}</div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default HomeVideoCard
