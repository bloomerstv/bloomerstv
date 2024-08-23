import { AnyPublication } from '@lens-protocol/react-web'
import React from 'react'
import LoadingImage from '../../ui/LoadingImage'
import getAvatar from '../../../utils/lib/getAvatar'
import formatHandle from '../../../utils/lib/formatHandle'
import { timeAgo } from '../../../utils/helpers'
import VerifiedBadge from '../../ui/VerifiedBadge'
import Markup from '../../common/Lexical/Markup'
import getPublicationData from '../../../utils/lib/getPublicationData'
import { stringToLength } from '../../../utils/stringToLength'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import Link from 'next/link'
import LikeButton from '../profile/LikeButton'
import MirrorButton from '../profile/MirrorButton'
import { Button, Tooltip } from '@mui/material'
import CommentIcon from '@mui/icons-material/Comment'
import clsx from 'clsx'
import ModalWrapper from '../../ui/Modal/ModalWrapper'
import NotesIcon from '@mui/icons-material/Notes'
import TextAndImagePostPage from './TextAndImagePostPage'

const TextAndImagePostCard = ({
  publication,
  premium,
  className = '',
  isPostPage = false
}: {
  publication: AnyPublication
  premium?: boolean
  className?: string
  isPostPage?: boolean
}) => {
  const [isOpen, setIsOpen] = React.useState(false)

  if (
    publication?.__typename === 'Comment' ||
    publication?.__typename === 'Mirror'
  )
    return null
  if (
    publication?.metadata?.__typename !== 'TextOnlyMetadataV3' &&
    publication?.metadata?.__typename !== 'ImageMetadataV3'
  )
    return null

  const asset = getPublicationData(publication?.metadata)?.asset

  const handleComment = () => {
    if (isPostPage) return
    setIsOpen(true)
  }

  return (
    <div className={className}>
      {!isPostPage && (
        <ModalWrapper
          onClose={() => setIsOpen(false)}
          onOpen={() => setIsOpen(true)}
          open={isOpen}
          Icon={<NotesIcon />}
          title="Post Details"
          classname="w-[500px]"
        >
          <div className="px-2 sm:px-0 w-screen sm:w-full">
            <TextAndImagePostPage publication={publication} premium={premium} />
          </div>
        </ModalWrapper>
      )}
      <div
        className={clsx(
          'flex rounded-xl  shrink-0 w-full h-full ',
          isPostPage
            ? 'flex-col gap-y-2 align-items-start'
            : 'flex-row align-items-stretch cursor-pointer p-2 border-p-border border sm:border-0 shadow-sm bg-s-bg '
        )}
        onClick={handleComment}
      >
        <div className={clsx(isPostPage ? 'w-full' : 'w-[210px]')}>
          <div className="between-row w-full shrink-0">
            <Link
              href={`/${formatHandle(publication?.by)}`}
              className="text-p-text no-underline"
            >
              <div className="start-row gap-x-2 shrink-0 w-full">
                <LoadingImage
                  src={getAvatar(publication?.by)}
                  className="w-10 h-10 rounded-full"
                  alt="avatar"
                />
                <div className="start-col shrink-0 w-full">
                  <div className="font-bold start-center-row text-s-text gap-x-1">
                    <>{formatHandle(publication?.by)}</>
                    {premium && <VerifiedBadge />}
                  </div>
                  <div className="text-xs text-s-text shrink-0">
                    {timeAgo(publication?.createdAt)}
                  </div>
                </div>
              </div>
            </Link>
          </div>
          {/* content */}
          <div
            className={clsx(
              'pl-1 shrink-0',
              !isPostPage ? 'h-[75px] overflow-hidden ' : 'mb-1'
            )}
          >
            <Markup className="text-sm shrink-0">
              {isPostPage
                ? publication?.metadata?.content
                : stringToLength(publication?.metadata?.content, 85)}
            </Markup>
          </div>
          {/* quoted content with link */}
          {publication?.__typename === 'Quote' &&
          (publication?.quoteOn?.metadata?.__typename === 'VideoMetadataV3' ||
            publication?.quoteOn?.metadata?.__typename ===
              'LiveStreamMetadataV3') ? (
            <Link
              href={`/watch/${publication?.quoteOn?.id}`}
              className="text-p-text no-underline shrink-0 w-fit"
            >
              <div
                className={clsx(
                  'bg-p-hover shrink-0 hover:shadow-md p-1 w-full text-xs rounded-lg'
                )}
              >
                <div className="start-center-row text-s-text pb-1 pl-1">
                  <img
                    src={getAvatar(publication?.quoteOn?.by)}
                    className="w-4 h-4 rounded-full"
                    alt="avatar"
                  />
                  <div className="font-semibold ml-1">
                    {formatHandle(publication?.quoteOn?.by)}
                  </div>
                </div>
                <div className="start-center-row">
                  <PlayArrowIcon fontSize="small" />
                  <div className="font-semibold shrink-0">
                    {stringToLength(publication?.quoteOn?.metadata?.title, 28)}
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className={clsx(isPostPage ? 'h-1 ' : 'h-12')}></div>
          )}

          {isPostPage && asset?.type === 'Image' && (
            <LoadingImage
              src={asset?.uri}
              className={clsx(
                'rounded-xl ',
                isPostPage ? 'w-full' : 'h-[205px] -mb-1.5 ml-2'
              )}
              alt="post"
            />
          )}

          {/* buttons */}
          <div
            className="start-center-row gap-x-2 mt-2"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <LikeButton
              likeCount={publication?.stats?.upvotes}
              publication={publication}
              isAutoUpdating={false}
            />
            <MirrorButton
              mirrorsCount={publication?.stats?.mirrors}
              publication={publication}
              isAutoUpdating={false}
            />
            <Tooltip title="Comments" arrow>
              <Button
                size="small"
                color="secondary"
                variant="contained"
                onClick={handleComment}
                startIcon={<CommentIcon />}
                sx={{
                  boxShadow: 'none',
                  borderRadius: '20px'
                }}
              >
                {publication?.stats?.comments}
              </Button>
            </Tooltip>
          </div>
        </div>

        {!isPostPage && asset?.type === 'Image' && (
          <LoadingImage
            src={asset?.uri}
            className={clsx(
              'rounded-xl ',
              isPostPage ? 'w-full' : 'h-[205px] -mb-1.5 ml-2'
            )}
            alt="post"
          />
        )}
      </div>
    </div>
  )
}

export default TextAndImagePostCard
