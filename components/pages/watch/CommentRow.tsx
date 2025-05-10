import React, { useEffect, useState } from 'react'
import getAvatar from '../../../utils/lib/getAvatar'
import formatHandle from '../../../utils/lib/formatHandle'
import Markup from '../../common/Lexical/Markup'
import CommentSection from './CommentSection'
import { Button, Tooltip } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CommentIcon from '@mui/icons-material/Comment'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import clsx from 'clsx'
import { humanReadableDateTime, timeAgo } from '../../../utils/helpers'
import useSession from '../../../utils/hooks/useSession'
import { Post, PostReactionType } from '@lens-protocol/react'
import useAddReaction from '../../../utils/hooks/lens/useAddReaction'
import useUndoReaction from '../../../utils/hooks/lens/useUndoReaction'

const CommentRow = ({
  comment,
  level,
  className
}: {
  comment: Post
  level: number
  className?: string
}) => {
  const { isAuthenticated, account } = useSession()
  const [showComments, setShowComments] = useState(false)
  const [liked, setLiked] = useState<Boolean>(false)
  const [likesCount, setLikeCount] = useState<number>(comment?.stats?.upvotes)
  const isMobile = useIsMobile()

  useEffect(() => {
    setLiked(comment?.operations?.hasUpvoted ?? false)
    setLikeCount(comment?.stats?.upvotes)
  }, [comment?.stats?.upvotes, comment?.operations?.hasUpvoted])
  // @ts-ignore
  const content = comment?.metadata?.content

  const { execute: addReaction } = useAddReaction()
  const { execute: undoReaction } = useUndoReaction()

  const handleLike = async () => {
    try {
      if (!isAuthenticated) return

      if (liked) {
        await addReaction({
          post: comment?.id,
          reaction: PostReactionType.Upvote
        })
      } else {
        await undoReaction({
          post: comment?.id,
          reaction: PostReactionType.Upvote
        })
      }

      setLiked(!liked)
    } catch (e) {
      console.log(e)
    }
  }

  const showReply = () => {
    if (isMobile) {
      return level < 1
    } else {
      return level < 3
    }
  }

  return (
    <div
      className={clsx('flex flex-row pl-2.5 py-3 gap-x-3 w-full', className)}
    >
      <img src={getAvatar(comment?.author)} className="w-8 h-8 rounded-full" />
      <div className="flex flex-col w-full">
        <div className="start-center-row gap-x-2">
          <div className="text-sm sm:text-base font-semibold">
            {formatHandle(comment?.author)}
          </div>
          <Tooltip title={humanReadableDateTime(comment?.timestamp)} arrow>
            <div className="text-sm sm:text-base font-semibold text-s-text cursor-pointer">
              {timeAgo(comment?.timestamp)}
            </div>
          </Tooltip>
        </div>
        <Markup className="text-sm sm:text-base font-semibold text-s-text">
          {content!}
        </Markup>

        {comment?.id && (
          <div className="start-center-row pt-1 gap-x-3 ml-[-10px]">
            {/* like button */}
            <Button
              size="small"
              color="inherit"
              variant="text"
              onClick={handleLike}
              startIcon={
                liked ? (
                  <FavoriteIcon className="text-brand" />
                ) : (
                  <FavoriteBorderIcon className="" />
                )
              }
              sx={{
                boxShadow: 'none'
              }}
            >
              {likesCount}
            </Button>

            {showReply() && (
              <Button
                size="small"
                color="inherit"
                variant="text"
                sx={{
                  boxShadow: 'none'
                }}
                startIcon={<CommentIcon />}
                onClick={() => setShowComments(!showComments)}
              >
                {comment?.stats?.comments}
              </Button>
            )}
          </div>
        )}

        {showComments && (
          <CommentSection
            // @ts-ignore
            publication={comment}
            className="ml-[-10px]"
            level={level + 1}
          />
        )}
      </div>
    </div>
  )
}

export default CommentRow
