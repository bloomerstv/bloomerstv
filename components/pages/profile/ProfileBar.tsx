import {
  Profile,
  PublicationReactionType,
  SessionType,
  TriStateValue,
  useCreateMirror,
  useFollow,
  usePublication,
  useReactionToggle,
  useSession,
  useUnfollow
} from '@lens-protocol/react-web'
import React, { useEffect } from 'react'
import { SingleStreamer } from '../../../graphql/generated'
import getAvatar from '../../../utils/lib/getAvatar'
import formatHandle from '../../../utils/lib/formatHandle'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import { toast } from 'react-toastify'
import LoadingButton from '@mui/lab/LoadingButton'
import StarIcon from '@mui/icons-material/Star'
import { Button, Tooltip } from '@mui/material'
import { APP_LINK, APP_NAME, defaultSponsored } from '../../../utils/config'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import { stringToLength } from '../../../utils/stringToLength'
import MobileChatButton from './MobileChatButton'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'

import ReplyIcon from '@mui/icons-material/Reply'

const ProfileBar = ({
  profile,
  streamer
}: {
  profile: Profile
  streamer?: SingleStreamer
}) => {
  const [isFollowing, setIsFollowing] = React.useState<boolean>(
    profile?.operations?.isFollowedByMe?.value
  )
  const { execute, loading: followLoading } = useFollow()
  const { execute: unFollow, loading: unFollowLoading } = useUnfollow()

  const { data: mySession } = useSession()

  const { data } = usePublication({
    // @ts-ignore
    forId: streamer?.latestStreamPublicationId
  })

  const [liked, setLiked] = React.useState(false)
  const [isMirrored, setIsMirrored] = React.useState(false)

  const { execute: toggleReaction } = useReactionToggle()
  const { execute: createMirror } = useCreateMirror()

  const isMobile = useIsMobile()

  useEffect(() => {
    if (data?.__typename === 'Post') {
      setLiked(data?.operations?.hasUpvoted)
      setIsMirrored(data?.operations?.hasMirrored)
    }
  }, [data?.id])

  const handleFollow = async () => {
    try {
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
    }
  }

  const handleUnFollow = async () => {
    try {
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
    }
  }

  const handleLike = async () => {
    try {
      const result = await toggleReaction({
        // @ts-ignore
        publication: data,
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

  const handleMirror = async () => {
    try {
      const result = await createMirror({
        // @ts-ignore
        mirrorOn: data?.id,
        sponsored: true
      })

      if (result.isFailure()) {
        toast.error(result?.error?.message)
      }

      setIsMirrored(true)
    } catch (error) {
      console.log(error)
      // @ts-ignore
      toast.error(error?.message ?? error)
    }
  }

  const FollowUnFollowButton = () => {
    return (
      <>
        {!profile?.operations?.isFollowedByMe?.value &&
          profile?.operations?.canFollow === TriStateValue.Yes && (
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

        {profile?.operations?.isFollowedByMe?.value &&
          profile?.operations?.canUnfollow && (
            <Tooltip title="Unfollow" arrow>
              <LoadingButton
                loading={unFollowLoading}
                onClick={handleUnFollow}
                variant="contained"
                autoCapitalize="none"
                size="small"
                color="secondary"
                startIcon={<StarIcon />}
                loadingPosition="start"
                disabled={!isFollowing}
                sx={{
                  borderRadius: isMobile ? '20px' : '4px',
                  boxShadow: 'none'
                }}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </LoadingButton>
            </Tooltip>
          )}
      </>
    )
  }

  return (
    <div className="w-full">
      {streamer?.streamName && (
        <div className="font-bold m-2 sm:mx-8 sm:mt-6 text-lg">
          {stringToLength(streamer?.streamName, 200)}
        </div>
      )}

      <div className="m-2 sm:m-4 sm:mx-8 between-row text-p-text">
        <div className="centered-row space-x-2  sm:space-x-4">
          <div className="sm:w-16 sm:h-16 w-8 h-8 rounded-full relative">
            <img
              src={getAvatar(profile)}
              className="sm:w-16 sm:h-16 w-8 h-8 rounded-full"
            />
          </div>
          <div className="start-col">
            <div className="font-semibold sm:text-xl">
              {formatHandle(profile)}
            </div>

            <div className="start-row space-x-1 text-sm">
              <div className="">{profile?.stats?.followers}</div>
              <div className="text-s-text">followers</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="end-col sm:start-row space-x-4">
            {/* like button  */}
            {!isMobile && data?.__typename === 'Post' && data?.id && (
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
                  {data?.stats?.upvotes}
                </Button>
              </Tooltip>
            )}

            {/* mirror button */}

            {!isMobile && data?.__typename === 'Post' && data?.id && (
              <Tooltip title="Boost the stream" arrow>
                <Button
                  size="small"
                  color="secondary"
                  variant="contained"
                  onClick={handleMirror}
                  startIcon={
                    <AutorenewIcon className={isMirrored ? 'text-brand' : ''} />
                  }
                  sx={{
                    boxShadow: 'none'
                  }}
                >
                  {data?.stats?.mirrors}
                </Button>
              </Tooltip>
            )}

            <FollowUnFollowButton />

            {/* share button */}
            {!isMobile && (
              <div className="sm:ml-2">
                <Button
                  size="small"
                  color="secondary"
                  variant="contained"
                  onClick={() => {
                    if (navigator.share) {
                      navigator
                        .share({
                          title: APP_NAME,
                          text: `Check out ${formatHandle(
                            profile
                          )} on ${APP_NAME}`,
                          url: `${APP_LINK}/${formatHandle(profile)}`
                        })
                        .then(() => console.log('Successful share'))
                        .catch((error) => console.log('Error sharing', error))
                    }
                  }}
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
          </div>
        </div>
      </div>

      {isMobile && (
        <div className="mx-2 my-3">
          <div className="start-row gap-x-3 px-2 py-1">
            {/* like button */}
            {data?.__typename === 'Post' &&
              data?.id &&
              mySession?.type === SessionType.WithProfile && (
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
                  {data?.stats?.upvotes}
                </Button>
              )}
            {/* mirror button */}

            {data?.__typename === 'Post' &&
              data?.id &&
              mySession?.type === SessionType.WithProfile && (
                <Button
                  size="small"
                  color="secondary"
                  variant="contained"
                  onClick={handleMirror}
                  startIcon={
                    <AutorenewIcon className={isMirrored ? 'text-brand' : ''} />
                  }
                  sx={{
                    borderRadius: '20px',
                    boxShadow: 'none'
                  }}
                >
                  {data?.stats?.mirrors}
                </Button>
              )}

            {/* live chat button */}
            <MobileChatButton profileId={profile?.id} />

            {/* share button */}
            <Button
              size="small"
              color="secondary"
              variant="contained"
              onClick={() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: APP_NAME,
                      text: `Check out ${formatHandle(profile)} on ${APP_NAME}`,
                      url: `${APP_LINK}/${formatHandle(profile)}`
                    })
                    .then(() => console.log('Successful share'))
                    .catch((error) => console.log('Error sharing', error))
                }
              }}
              sx={{
                borderRadius: '20px',
                boxShadow: 'none'
              }}
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
