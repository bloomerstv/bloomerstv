import {
  Comment,
  PublicationReactionType,
  SessionType,
  useReactionToggle,
  useSession
} from '@lens-protocol/react-web'
import React, { useEffect, useState } from 'react'
import getAvatar from '../../../utils/lib/getAvatar'
import formatHandle from '../../../utils/lib/formatHandle'
import Markup from '../../common/Lexical/Markup'
import CommentSection from './CommentSection'
import { Button } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CommentIcon from '@mui/icons-material/Comment'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import clsx from 'clsx'

const CommentRow = ({
  comment,
  level,
  className
}: {
  comment: Comment
  level: number
  className?: string
}) => {
  const { data } = useSession()
  const [showComments, setShowComments] = useState(false)
  const [liked, setLiked] = useState<Boolean>(false)
  const [likesCount, setLikeCount] = useState<number>(comment?.stats?.upvotes)
  const isMobile = useIsMobile()

  useEffect(() => {
    setLiked(comment?.operations?.hasUpvoted)
    setLikeCount(comment?.stats?.upvotes)
  }, [comment?.stats?.upvotes, comment?.operations?.hasUpvoted])
  // @ts-ignore
  const content = comment?.metadata?.content

  const { execute } = useReactionToggle()
  const handleLike = async () => {
    try {
      if (data?.type !== SessionType.WithProfile) return
      setLiked(!liked)
      await execute({
        publication: comment,
        reaction: PublicationReactionType.Upvote
      })
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
      <img src={getAvatar(comment?.by)} className="w-8 h-8 rounded-full" />
      <div className="flex flex-col w-full">
        <div className="start-col">
          <div className="text-sm sm:text-base font-semibold">
            {formatHandle(comment?.by)}
          </div>
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
