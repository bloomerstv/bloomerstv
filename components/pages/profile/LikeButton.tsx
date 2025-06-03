import { Button, Tooltip } from '@mui/material'
import React, { useEffect } from 'react'
import { useModal } from '../../common/ModalContext'
import toast from 'react-hot-toast'
import { Heart } from 'lucide-react'
import { AnimatedCounter } from 'react-animated-counter'
import { useTheme } from '../../wrappers/TailwindThemeProvider'
import { AnyPost, PostReactionType } from '@lens-protocol/react'
import useSession from '../../../utils/hooks/useSession'
import useAddReaction from '../../../utils/hooks/lens/useAddReaction'
import useUndoReaction from '../../../utils/hooks/lens/useUndoReaction'

const LikeButton = ({
  post,
  likeCount
}: {
  post: AnyPost
  likeCount: number
}) => {
  const { theme } = useTheme()
  const [liked, setLiked] = React.useState(false)
  const { isAuthenticated } = useSession()
  const { openModal } = useModal()
  const [newLikeCount, setNewLikeCount] = React.useState(likeCount)

  const { execute: addReaction } = useAddReaction()
  const { execute: undoReaction } = useUndoReaction()

  const handleLike = async () => {
    try {
      if (!mustLogin('Must Login to like')) return

      if (liked) {
        setNewLikeCount(newLikeCount - 1)
        setLiked(false)
        await undoReaction({
          post: post?.id,
          reaction: PostReactionType.Upvote
        })
      } else {
        setNewLikeCount(newLikeCount + 1)
        setLiked(true)
        await addReaction({
          post: post?.id,
          reaction: PostReactionType.Upvote
        })
      }
    } catch (error) {
      console.log(error)
      // @ts-ignore
      toast.error(error?.message ?? error)
    }
  }

  useEffect(() => {
    setNewLikeCount(likeCount)
  }, [likeCount])

  useEffect(() => {
    if (post?.__typename !== 'Repost') {
      setLiked(!!post?.operations?.hasUpvoted)
    }
  }, [post?.__typename !== 'Repost' && post])

  const mustLogin = (infoMsg: string = 'Must Login'): Boolean => {
    if (!isAuthenticated) {
      openModal('login')
      toast.error(infoMsg)
      return false
    }
    return true
  }
  return (
    <Tooltip title="Like" arrow>
      <Button
        size="small"
        color="secondary"
        variant="contained"
        onClick={handleLike}
        startIcon={
          liked ? (
            <Heart size={18} className="text-brand" />
          ) : (
            <Heart size={18} />
          )
        }
        sx={{
          boxShadow: 'none',
          borderRadius: '20px',
          paddingLeft: '14px'
        }}
      >
        <AnimatedCounter
          value={newLikeCount}
          includeDecimals={false}
          includeCommas={true}
          color={theme === 'dark' ? '#ceced3' : '#1f1f23'}
          incrementColor="#1976d2"
          fontSize="15px"
          containerStyles={{
            marginTop: '4px',
            marginBottom: '4px'
          }}
        />
      </Button>
    </Tooltip>
  )
}

export default LikeButton
