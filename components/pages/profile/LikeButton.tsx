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
import { AnimatedCounter } from 'react-animated-counter'
import { useTheme } from '../../wrappers/TailwindThemeProvider'

const LikeButton = ({
  publication,
  likeCount
}: {
  publication: AnyPublication
  likeCount: number
}) => {
  const { theme } = useTheme()
  const [liked, setLiked] = React.useState(false)
  const { data: mySession } = useSession()
  const { openModal } = useModal()

  const { execute: toggleReaction } = useReactionToggle()

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
                  upvotes: likeCount
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
    } catch (error) {
      console.log(error)
      // @ts-ignore
      toast.error(error?.message ?? error)
    }
  }

  useEffect(() => {
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
          borderRadius: '20px',
          paddingLeft: '14px'
        }}
      >
        <AnimatedCounter
          value={likeCount}
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
