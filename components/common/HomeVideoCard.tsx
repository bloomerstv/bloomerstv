import Link from 'next/link'
import React from 'react'
import getAvatar from '../../utils/lib/getAvatar'
import formatHandle from '../../utils/lib/formatHandle'
import getPublicationData from '../../utils/lib/getPublicationData'
import { secondsToTime, timeAgo } from '../../utils/helpers'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import Markup from './Lexical/Markup'
import { usePathname, useRouter } from 'next/navigation'
import clsx from 'clsx'
import VerifiedBadge from '../ui/VerifiedBadge'
import LoadingImage from '../ui/LoadingImage'
import { IconButton, Tooltip } from '@mui/material'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import useSession from '../../utils/hooks/useSession'
import { Account, Post } from '@lens-protocol/react'
const HomeVideoCard = ({
  post,
  cover,
  duration,
  premium,
  session
}: {
  post?: Post
  cover?: string
  duration?: number
  premium?: boolean
  session?: {
    sessionId: string
    createdAt: string
    account: Account
  }
}) => {
  const pathname = usePathname()
  const asset = post ? getPublicationData(post?.metadata)?.asset : null
  const { isAuthenticated, account } = useSession()
  const { push } = useRouter()

  if (!post && !session) return null

  return (
    <Link
      prefetch
      className={clsx(
        'no-underline text-p-text group w-full sm:px-2 unselectable',
        pathname === '/' ? 'lg:w-1/3 2xl:w-1/4' : 'lg:w-1/3'
      )}
      href={
        post ? `/watch/${post?.slug}` : `/watch/session/${session?.sessionId}`
      }
    >
      <div className="w-full aspect-video relative mb-2 overflow-hidden sm:rounded-xl">
        <LoadingImage
          src={cover ?? asset?.cover}
          className="w-full h-full aspect-video transition-transform duration-300 ease-in-out transform group-hover:scale-105 object-cover"
          alt="thumbnail"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <PlayArrowIcon
            fontSize="large"
            className="text-white transform transition-transform group-hover:scale-105 duration-300"
          />
        </div>
        {(duration || asset?.duration) && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-80 px-1.5 rounded">
            <div className="text-xs text-white">
              {/* @ts-ignore */}
              {secondsToTime(duration ?? asset?.duration)}
            </div>
          </div>
        )}
      </div>
      <div className="sm:px-0 px-4 w-full start-row space-x-3">
        <Link
          prefetch
          className="no-underline text-s-text group font-semibold"
          href={formatHandle(post?.author ?? session?.account)}
        >
          <img
            src={getAvatar(post?.author ?? session?.account)}
            className="w-10 h-10 rounded-full"
            alt="avatar"
          />
        </Link>
        <div className="start-col">
          {/* @ts-ignore */}
          <div className="text-sm font-semibold">
            {/* @ts-ignore */}
            <Markup>{post?.metadata?.title ?? 'Untitled stream'}</Markup>
          </div>
          <div className="start-row flex-wrap text-sm lg:text-xs 2xl:text-sm font-normal text-s-text gap-x-1">
            <div className="flex flex-row items-center gap-x-1">
              <Link
                prefetch
                className="no-underline group text-s-text font-semibold"
                href={formatHandle(post?.author ?? session?.account)}
              >
                <div className="">
                  {formatHandle(post?.author ?? session?.account)}
                </div>
              </Link>
              {premium && <VerifiedBadge />}
            </div>
            {/* dot */}
            <div className={clsx(!post?.stats?.upvotes && 'hidden')}>
              &middot;
            </div>
            <div className={clsx(!post?.stats?.upvotes && 'hidden')}>
              {post?.stats?.upvotes} likes
            </div>
            <div className="">&middot;</div>
            <div className="">
              {timeAgo(post?.timestamp ?? session?.createdAt)}
            </div>
          </div>
        </div>

        {/* @ts-ignore */}
        {!post?.metadata?.title &&
          isAuthenticated &&
          account?.address === session?.account?.address && (
            <Tooltip
              title="You can create a lens post for your untitled streams from content page"
              arrow
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                push('/dashboard/content')
              }}
            >
              <IconButton
                size="medium"
                href="/dashboard/content"
                style={{
                  backgroundColor: '#1976d2'
                }}
              >
                <ArrowOutwardIcon className="text-white" />
              </IconButton>
            </Tooltip>
          )}
      </div>
    </Link>
  )
}

export default HomeVideoCard
