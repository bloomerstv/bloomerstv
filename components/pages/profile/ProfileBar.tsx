import {
  Post,
  Profile,
  SessionType,
  useFollow,
  usePublication,
  useSession,
  useUnfollow
} from '@lens-protocol/react-web'
import React, { useEffect, useState } from 'react'
import { SingleStreamer } from '../../../graphql/generated'
import getAvatar from '../../../utils/lib/getAvatar'
import formatHandle from '../../../utils/lib/formatHandle'

import {
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  MenuList
} from '@mui/material'
import { APP_LINK, APP_NAME, defaultSponsored } from '../../../utils/config'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import MobileChatButton from './MobileChatButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import IosShareIcon from '@mui/icons-material/IosShare'
import Markup from '../../common/Lexical/Markup'
import MobileCommentButton from '../watch/MobileCommentButton'
import LiveCount from './LiveCount'
import toast from 'react-hot-toast'
import Link from 'next/link'
import CollectButton from './CollectButton'
import FollowingButton from './FollowingButton'
import { humanReadableNumber } from '../../../utils/helpers'
import VerifiedBadge from '../../ui/VerifiedBadge'
import QuoteButton from './QuoteButton'
import { useModal } from '../../common/ModalContext'
import LikeButton from './LikeButton'
import MirrorButton from './MirrorButton'

const ProfileBar = ({
  profile,
  streamer,
  post,
  premium = false
}: {
  profile: Profile
  streamer?: SingleStreamer
  post?: Post
  premium?: boolean
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
  const isMobile = useIsMobile()
  const { openModal } = useModal()

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
    }
  }, [data?.id])

  useEffect(() => {
    if (post) {
      setPublication(post)
    }
  }, [post])

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
      openModal('login')
      toast.error(infoMsg)
      return false
    }
    return true
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
          <MenuItem onClick={handleShare}>
            <ListItemIcon>
              <IosShareIcon fontSize="small" />
            </ListItemIcon>
            Share
          </MenuItem>
        </MenuList>
      </Menu>
      {/* @ts-ignore   */}
      <div className="m-2 sm:mx-8 sm:mt-6 sm:hidden">
        <Markup className="font-bold text-lg sm:text-xl break-words whitespace-pre-wrap">
          {streamer?.streamName ||
            // @ts-ignore
            publication?.metadata?.title ||
            'Untitled Stream'}
        </Markup>
      </div>
      <div className="m-2 sm:mt-5 sm:mx-8 flex flex-row justify-between items-start text-p-text">
        <div className="start-center-row gap-x-2 sm:gap-x-4 w-full">
          <Link
            href={`/${formatHandle(profile)}`}
            prefetch
            className="no-underline text-p-text centered-col"
          >
            <img
              src={getAvatar(profile)}
              className="sm:w-16 sm:h-16 w-8 h-8 rounded-full"
            />
          </Link>
          <div className="sm:pr-3 w-full">
            {/* @ts-ignore   */}
            {!isMobile && (
              <Markup className="font-bold text-lg break-words whitespace-pre-wrap">
                {streamer?.streamName ||
                  // @ts-ignore
                  publication?.metadata?.title ||
                  'Untitled Stream'}
              </Markup>
            )}

            <div className="flex flex-row items-center justify-between w-full">
              <div className="centered-row gap-x-2 sm:gap-x-4">
                {/* followes */}
                <div>
                  <Link
                    href={`/${formatHandle(profile)}`}
                    prefetch
                    className="no-underline text-p-text"
                  >
                    <div className="start-center-row gap-x-1">
                      <div className="font-semibold sm:text-sm">
                        {formatHandle(profile)}
                      </div>
                      {(premium || streamer?.premium) && <VerifiedBadge />}
                    </div>
                  </Link>

                  <div className="start-center-row space-x-1 sm:text-sm text-xs">
                    <div className="">
                      {humanReadableNumber(profile?.stats?.followers)}
                    </div>
                    <div className="text-s-text">followers</div>
                  </div>
                </div>

                <FollowingButton
                  followLoading={followLoading}
                  handleFollow={handleFollow}
                  handleUnFollow={handleUnFollow}
                  isFollowing={isFollowing}
                  profile={profile}
                  unFollowing={unFollowing}
                />
              </div>

              {isMobile && (
                <div className="centered-row">
                  {profile?.id && !post && (
                    <LiveCount className="-mr-2" profileId={profile?.id} />
                  )}
                  <div className="-mr-3">
                    <IconButton onClick={handleMenuClick}>
                      <MoreVertIcon className="text-s-text" fontSize="small" />
                    </IconButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {!isMobile && (
          <div className="start-center-row gap-x-3 shrink-0">
            {profile?.id && !post && streamer && (
              <LiveCount profileId={profile?.id} />
            )}

            {/* like button  */}
            {publication?.id && <LikeButton publication={publication} />}

            {/* mirror button */}

            {publication?.id && <MirrorButton publication={publication} />}

            {publication && (
              <QuoteButton
                quoteOn={publication.id}
                quotingOnProfileHandle={formatHandle(publication?.by)}
                // @ts-ignore
                quotingTitle={
                  streamer?.streamName
                    ? streamer?.streamName
                    : // @ts-ignore
                      publication?.metadata?.title ?? // @ts-ignore
                      publication?.metadata?.content
                }
                numberOfQuotes={publication?.stats?.quotes}
              />
            )}

            {publication && (
              <CollectButton
                handleFollow={handleFollow}
                followLoading={followLoading}
                post={publication}
                isFollowing={isFollowing}
              />
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
              <CollectButton
                handleFollow={handleFollow}
                followLoading={followLoading}
                post={publication}
                isFollowing={isFollowing}
              />
            )}
            {/* like button */}
            {publication?.id && <LikeButton publication={publication} />}
            {/* mirror button */}

            {publication?.id && <MirrorButton publication={publication} />}

            {publication && (
              <QuoteButton
                quoteOn={publication.id}
                quotingOnProfileHandle={formatHandle(publication?.by)}
                // @ts-ignore
                quotingTitle={
                  streamer?.streamName
                    ? streamer?.streamName
                    : // @ts-ignore
                      publication?.metadata?.title ?? // @ts-ignore
                      publication?.metadata?.content
                }
                numberOfQuotes={publication?.stats?.quotes}
              />
            )}

            {/* live chat button */}
            {profile?.id && !post && streamer && (
              <div className="shrink-0">
                <MobileChatButton profileId={profile?.id} />
              </div>
            )}

            {publication?.id && !streamer?.isActive && (
              <MobileCommentButton post={publication} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileBar
