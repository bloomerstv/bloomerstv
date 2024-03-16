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
import ModalWrapper from '../../ui/Modal/ModalWrapper'
import LoginComponent from '../../common/LoginComponent'
import IosShareIcon from '@mui/icons-material/IosShare'
import LoginIcon from '@mui/icons-material/Login'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import Markup from '../../common/Lexical/Markup'
import MobileCommentButton from '../watch/MobileCommentButton'
import clsx from 'clsx'
import LiveCount from './LiveCount'
import toast from 'react-hot-toast'
import Link from 'next/link'
import CollectButton from './CollectButton'
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
      toast.error(infoMsg)
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
          {isFollowing && (
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
          )}

          <MenuItem onClick={handleShare}>
            <ListItemIcon>
              <IosShareIcon fontSize="small" />
            </ListItemIcon>
            Share
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
        <div className="m-2 sm:mx-8 sm:mt-6 sm:hidden">
          <Markup className="font-bold text-lg sm:text-xl break-words whitespace-pre-wrap">
            {/* @ts-ignore   */}
            {streamer?.streamName || publication?.metadata?.title}
          </Markup>
        </div>
      )}
      <div className="m-2 sm:mt-5 sm:mx-8 flex flex-row justify-between items-start text-p-text">
        <div className="start-center-row gap-x-2 sm:gap-x-4 w-full">
          <div className="">
            <Link
              href={`/${formatHandle(profile)}`}
              prefetch
              className="no-underline text-p-text"
            >
              <img
                src={getAvatar(profile)}
                className="sm:w-16 sm:h-16 w-8 h-8 rounded-full"
              />
            </Link>
          </div>
          <div className="sm:pr-3 w-full">
            {/* @ts-ignore   */}
            {(streamer?.streamName || publication?.metadata?.title) &&
              !isMobile && (
                <Markup className="font-bold text-lg break-words whitespace-pre-wrap">
                  {/* @ts-ignore   */}
                  {streamer?.streamName || publication?.metadata?.title}
                </Markup>
              )}

            <div className="flex flex-row items-center justify-between w-full space-x-6 ">
              <div className="centered-row gap-x-4">
                <div>
                  <Link
                    href={`/${formatHandle(profile)}`}
                    prefetch
                    className="no-underline text-p-text"
                  >
                    <div className="font-semibold sm:text-sm">
                      {formatHandle(profile)}
                    </div>
                  </Link>

                  <div className="start-center-row space-x-1 sm:text-sm text-xs">
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
                          borderRadius: isMobile ? '20px' : '15px',
                          boxShadow: 'none'
                        }}
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </LoadingButton>
                    </Tooltip>
                  )}
              </div>

              {isMobile && (
                <div className="centered-row gap-x-2">
                  {profile?.id && !post && (
                    <LiveCount profileId={profile?.id} />
                  )}

                  <IconButton onClick={handleMenuClick}>
                    <MoreVertIcon className="text-s-text" />
                  </IconButton>
                </div>
              )}
            </div>
          </div>
        </div>

        {!isMobile && (
          <div className="start-center-row gap-x-3 shrink-0">
            {profile?.id && !post && <LiveCount profileId={profile?.id} />}

            {/* like button  */}
            {publication?.id && (
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
                    boxShadow: 'none',
                    borderRadius: '20px'
                  }}
                >
                  {upvotes}
                </Button>
              </Tooltip>
            )}

            {/* mirror button */}

            {publication?.id && (
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
                    boxShadow: 'none',
                    borderRadius: '20px'
                  }}
                >
                  {mirrors}
                </Button>
              </Tooltip>
            )}

            {publication && (
              <CollectButton post={publication} isFollowing={isFollowing} />
            )}

            <div className="-mx-2.5">
              <IconButton onClick={handleMenuClick}>
                <MoreVertIcon className="text-s-text" />
              </IconButton>
            </div>
          </div>
        )}
      </div>

      {isMobile && (
        <div className="w-full">
          <div className="start-center-row gap-x-2 px-2 w-full no-scrollbar  overflow-x-auto">
            {publication && (
              <CollectButton post={publication} isFollowing={isFollowing} />
            )}
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
            {profile?.id && !post && (
              <div className="shrink-0">
                <MobileChatButton profileId={profile?.id} />
              </div>
            )}

            {publication?.id && !streamer?.isActive && (
              <MobileCommentButton postId={publication?.id} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileBar
