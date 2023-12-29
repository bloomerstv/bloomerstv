import {
  Post,
  Profile,
  PublicationReactionType,
  SessionType,
  useCreateMirror,
  useFollow,
  usePublication,
  useReactionToggle,
  useSession,
  useUnfollow
} from '@lens-protocol/react-web'
import React, { useEffect, useState } from 'react'
import { SingleStreamer } from '../../../graphql/generated'
import getAvatar from '../../../utils/lib/getAvatar'
import formatHandle from '../../../utils/lib/formatHandle'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import { toast } from 'react-toastify'
import LoadingButton from '@mui/lab/LoadingButton'
import StarIcon from '@mui/icons-material/Star'
import {
  Button,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  MenuList,
  Tooltip
} from '@mui/material'
import { APP_LINK, APP_NAME, defaultSponsored } from '../../../utils/config'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import MobileChatButton from './MobileChatButton'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ReplyIcon from '@mui/icons-material/Reply'
import ModalWrapper from '../../ui/Modal/ModalWrapper'
import LoginComponent from '../../common/LoginComponent'

import LoginIcon from '@mui/icons-material/Login'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import Markup from '../../common/Lexical/Markup'
import MobileCommentButton from '../watch/MobileCommentButton'
import clsx from 'clsx'
import LiveCount from './LiveCount'
const ProfileBar = ({
  profile,
  streamer,
  post
}: {
  profile: Profile
  streamer?: SingleStreamer
  post?: Post
}) => {
  const [isFollowing, setIsFollowing] = React.useState<boolean>(
    profile?.operations?.isFollowedByMe?.value
  )
  const { execute, loading: followLoading } = useFollow()
  const { execute: unFollow, loading: unFollowing } = useUnfollow()

  const { data: mySession } = useSession()

  const { data } = usePublication({
    // @ts-ignore
    forId: streamer?.latestStreamPublicationId
  })

  const [publication, setPublication] = useState<Post | null | undefined>(post)

  const [liked, setLiked] = React.useState(false)
  const [isMirrored, setIsMirrored] = React.useState(false)
  const [upvotes, setUpvotes] = React.useState(0)
  const [mirrors, setMirrors] = React.useState(0)

  const { execute: toggleReaction } = useReactionToggle()
  const { execute: createMirror, loading: mirroring } = useCreateMirror()

  const isMobile = useIsMobile()

  const [open, setOpen] = useState(false)

  const [anchorEl, setAnchorEl] = React.useState(null)
  const isMenuOpen = Boolean(anchorEl)
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if (data?.__typename === 'Post' && !post) {
      setPublication(data)
      setLiked(data?.operations?.hasUpvoted)
      setIsMirrored(data?.operations?.hasMirrored)
    }
  }, [data?.id])

  useEffect(() => {
    if (post) {
      setPublication(post)
      setLiked(post?.operations?.hasUpvoted)
      setIsMirrored(post?.operations?.hasMirrored)
    }
  }, [post])

  useEffect(() => {
    if (publication?.stats?.upvotes) {
      setUpvotes(publication?.stats?.upvotes)
    }
  }, [publication?.stats?.upvotes])

  useEffect(() => {
    if (publication?.stats?.mirrors) {
      setMirrors(publication?.stats?.mirrors)
    }
  }, [publication?.stats?.mirrors])

  const handleFollow = async () => {
    try {
      if (!mustLogin('Must Login to follow')) return

      const result = await execute({
        profile: profile,
        sponsored: defaultSponsored
      })

      if (result.isSuccess()) {
        setIsFollowing(true)
        toast.success(`Following ${formatHandle(profile)}`)
      } else if (result.isFailure()) {
        toast.error(result.error.message)
      }
    } catch (e) {
      console.log(e)
      toast.error(String(e))
    }
  }

  const handleUnFollow = async () => {
    try {
      if (!mustLogin('Must Login to unfollow')) return
      const result = await unFollow({
        profile: profile
      })

      if (result.isSuccess()) {
        setIsFollowing(false)
        toast.success(`Unfollowed ${formatHandle(profile)}`)
      } else if (result.isFailure()) {
        toast.error(result.error.message)
      }
    } catch (e) {
      console.log(e)
      // @ts-ignore
      toast.error(String(e))
    }
  }

  const mustLogin = (infoMsg: string = 'Must Login'): Boolean => {
    if (mySession?.type !== SessionType.WithProfile) {
      setOpen(true)
      toast.info(infoMsg)
      return false
    }
    return true
  }

  const handleLike = async () => {
    try {
      if (!mustLogin('Must Login to like')) return
      const result = await toggleReaction({
        // @ts-ignore
        publication: publication,
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

  const handleMirror = async () => {
    try {
      if (!mustLogin('Must Login to mirror')) return
      const result = await createMirror({
        // @ts-ignore
        mirrorOn: publication?.id,
        sponsored: defaultSponsored
      })

      if (result.isFailure()) {
        toast.error(result?.error?.message)
      }

      setIsMirrored(true)
      setMirrors(mirrors + 1)
    } catch (error) {
      console.log(error)
      // @ts-ignore
      toast.error(error?.message ?? error)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      if (!streamer && publication) {
        // share publication instead
        navigator
          .share({
            title: APP_NAME,
            // @ts-ignore
            text: publication?.metadata?.title,
            url: `${APP_LINK}/watch/${publication?.id}`
          })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error))
        return
      }

      navigator
        .share({
          title: APP_NAME,
          text: `Check out ${formatHandle(profile)} on ${APP_NAME}`,
          url: `${APP_LINK}/${formatHandle(profile)}`
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error))
    }
  }

  return (
    <div className="w-full">
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={isMenuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuList>
          <MenuItem
            onClick={async () => {
              await handleUnFollow()
              handleMenuClose()
            }}
            disabled={unFollowing}
          >
            <ListItemIcon>
              <PersonRemoveIcon fontSize="small" />
            </ListItemIcon>
            Unfollow
          </MenuItem>
        </MenuList>
      </Menu>
      <ModalWrapper
        open={open}
        title="login"
        Icon={<LoginIcon fontSize="small" />}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <LoginComponent onClose={() => setOpen(false)} />
      </ModalWrapper>
      {/* @ts-ignore   */}
      {(streamer?.streamName || publication?.metadata?.title) && (
        <div className="m-2 sm:mx-8 sm:mt-6 ">
          <Markup className="font-bold text-lg break-words whitespace-pre-wrap">
            {/* @ts-ignore   */}
            {streamer?.streamName || publication?.metadata?.title}
          </Markup>
        </div>
      )}

      <div className="m-2 sm:m-4 sm:mx-8 between-row text-p-text">
        <div className="centered-row space-x-2 sm:space-x-5">
          <div className="sm:w-12 sm:h-12 w-8 h-8 rounded-full relative">
            <img
              src={getAvatar(profile)}
              className="sm:w-12 sm:h-12 w-8 h-8 rounded-full"
            />
          </div>
          <div className="start-col sm:pr-3">
            <div className="font-semibold sm:text-xl">
              {formatHandle(profile)}
            </div>

            <div className="start-row space-x-1 text-sm">
              <div className="">{profile?.stats?.followers}</div>
              <div className="text-s-text">followers</div>
            </div>
          </div>
          {!isFollowing &&
            mySession?.type === SessionType.WithProfile &&
            mySession.profile?.id !== profile?.id && (
              <Tooltip title="Follow this streamer" arrow>
                <LoadingButton
                  loading={followLoading}
                  onClick={handleFollow}
                  variant="contained"
                  autoCapitalize="none"
                  size="small"
                  color="primary"
                  startIcon={<StarIcon />}
                  loadingPosition="start"
                  disabled={followLoading || isFollowing}
                  title="Follow this streamer"
                  sx={{
                    borderRadius: isMobile ? '20px' : '4px',
                    boxShadow: 'none'
                  }}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </LoadingButton>
              </Tooltip>
            )}
        </div>

        <div className="start-row space-x-4">
          {profile?.id && streamer?.isActive && (
            <LiveCount profileId={profile?.id} />
          )}

          {/* like button  */}
          {!isMobile && publication?.id && (
            <Tooltip title="Like" arrow>
              <Button
                size="small"
                color="secondary"
                variant="contained"
                onClick={handleLike}
                startIcon={
                  liked ? (
                    <FavoriteIcon className="text-brand" />
                  ) : (
                    <FavoriteBorderIcon />
                  )
                }
                sx={{
                  boxShadow: 'none'
                }}
              >
                {upvotes}
              </Button>
            </Tooltip>
          )}

          {/* mirror button */}

          {!isMobile && publication?.id && (
            <Tooltip title="Boost the stream" arrow>
              <Button
                size="small"
                color="secondary"
                variant="contained"
                onClick={handleMirror}
                startIcon={
                  <AutorenewIcon
                    className={clsx(
                      isMirrored && 'text-brand',
                      mirroring && 'animate-spin'
                    )}
                  />
                }
                sx={{
                  boxShadow: 'none'
                }}
              >
                {mirrors}
              </Button>
            </Tooltip>
          )}

          {/* share button */}
          {!isMobile && (
            <div className="sm:ml-2">
              <Button
                size="small"
                color="secondary"
                variant="contained"
                onClick={handleShare}
                startIcon={
                  <ReplyIcon
                    style={{
                      transform: 'scaleX(-1)'
                    }}
                  />
                }
                sx={{
                  boxShadow: 'none'
                }}
              >
                Share
              </Button>
            </div>
          )}

          {isFollowing && (
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon className="text-s-text" />
            </IconButton>
          )}
        </div>
      </div>

      {isMobile && (
        <div className="py-3 w-full">
          <div className="start-row gap-x-3 px-2 py-1 w-full no-scrollbar  overflow-x-auto">
            {/* like button */}
            {publication?.id && (
              <Button
                size="small"
                color="secondary"
                variant="contained"
                onClick={handleLike}
                startIcon={
                  liked ? (
                    <FavoriteIcon className="text-brand" />
                  ) : (
                    <FavoriteBorderIcon />
                  )
                }
                sx={{
                  borderRadius: '20px',
                  boxShadow: 'none'
                }}
              >
                {upvotes}
              </Button>
            )}
            {/* mirror button */}

            {publication?.id && (
              <Button
                size="small"
                color="secondary"
                variant="contained"
                onClick={handleMirror}
                startIcon={
                  <AutorenewIcon
                    className={clsx(
                      isMirrored && 'text-brand',
                      mirroring && 'animate-spin'
                    )}
                  />
                }
                sx={{
                  borderRadius: '20px',
                  boxShadow: 'none'
                }}
              >
                {mirrors}
              </Button>
            )}

            {/* live chat button */}
            {profile?.id && !post && streamer?.isActive && (
              <div className="shrink-0">
                <MobileChatButton profileId={profile?.id} />
              </div>
            )}

            {publication?.id && (
              <MobileCommentButton postId={publication?.id} />
            )}

            {/* share button */}
            <Button
              size="small"
              color="secondary"
              variant="contained"
              onClick={handleShare}
              sx={{
                borderRadius: '20px',
                boxShadow: 'none'
              }}
              className="shrink-0"
              startIcon={
                <ReplyIcon
                  style={{
                    transform: 'scaleX(-1)'
                  }}
                />
              }
            >
              Share
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileBar
