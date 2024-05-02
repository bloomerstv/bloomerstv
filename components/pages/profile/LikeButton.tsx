import {
  AnyPublication,
  PublicationReactionType,
  SessionType,
  useReactionToggle,
  useSession
} from '@lens-protocol/react-web'
import { Button, Tooltip } from '@mui/material'
import React, { useEffect } from 'react'
import { useModal } from '../../common/ModalContext'
import toast from 'react-hot-toast'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'

const LikeButton = ({ publication }: { publication: AnyPublication }) => {
  const [liked, setLiked] = React.useState(false)
  const { data: mySession } = useSession()
  const { openModal } = useModal()
  const [upvotes, setUpvotes] = React.useState(
    publication?.__typename !== 'Mirror' ? publication?.stats?.upvotes : 0
  )
  const { execute: toggleReaction, error } = useReactionToggle()

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleLike = async () => {
    try {
      if (!mustLogin('Must Login to like')) return
      const result = await toggleReaction({
        // @ts-ignore
        publication:
          publication?.__typename === 'Mirror'
            ? null
            : {
                ...publication,
                stats: {
                  ...publication.stats,
                  upvotes: liked ? upvotes + 1 : upvotes - 1
                },
                operations: {
                  ...publication.operations,
                  hasUpvoted: liked
                }
              },
        reaction: PublicationReactionType.Upvote
      })

      if (result.isFailure()) {
        toast.error(result.error)
      }

      setLiked(!liked)
      setUpvotes(liked ? upvotes - 1 : upvotes + 1)
    } catch (error) {
      console.log(error)
      // @ts-ignore
      toast.error(error?.message ?? error)
    }
  }

  useEffect(() => {
    if (publication?.__typename !== 'Mirror' && publication?.stats?.upvotes) {
      setUpvotes(publication?.stats?.upvotes)
    }
    if (publication?.__typename !== 'Mirror') {
      setLiked(publication?.operations?.hasUpvoted)
    }
  }, [publication?.__typename !== 'Mirror' && publication])

  const mustLogin = (infoMsg: string = 'Must Login'): Boolean => {
    if (mySession?.type !== SessionType.WithProfile) {
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
            <FavoriteIcon fontSize="small" className="text-brand" />
          ) : (
            <FavoriteBorderIcon fontSize="small" />
          )
        }
        sx={{
          boxShadow: 'none',
          borderRadius: '20px'
        }}
      >
        {upvotes}
      </Button>
    </Tooltip>
  )
}

export default LikeButton
