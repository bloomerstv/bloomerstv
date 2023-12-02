import {
  Profile,
  TriStateValue,
  useFollow,
  useUnfollow
} from '@lens-protocol/react-web'
import React from 'react'
import { Streamer } from '../../../graphql/generated'
import getAvatar from '../../../utils/lib/getAvatar'
import formatHandle from '../../../utils/lib/formatHandle'

import { toast } from 'react-toastify'
import LoadingButton from '@mui/lab/LoadingButton'
import StarIcon from '@mui/icons-material/Star'
import { Button, Tooltip } from '@mui/material'
import IosShareIcon from '@mui/icons-material/IosShare'
import { APP_LINK, APP_NAME } from '../../../utils/config'
import LiveDiv from '../../ui/LiveDiv'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import { stringToLength } from '../../../utils/stringToLength'
const ProfileBar = ({
  profile,
  streamer
}: {
  profile: Profile
  streamer?: Streamer
}) => {
  const [isFollowing, setIsFollowing] = React.useState<boolean>(
    profile?.operations?.isFollowedByMe?.value
  )
  const { execute, loading: followLoading } = useFollow()
  const { execute: unFollow, loading: unFollowLoading } = useUnfollow()

  const isMobile = useIsMobile()

  const handleFollow = async () => {
    try {
      const result = await execute({
        profile: profile
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
                  borderRadius: isMobile ? '20px' : '4px'
                }}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </LoadingButton>
            </Tooltip>
          )}

        {profile?.operations?.isFollowedByMe?.value &&
          profile?.operations?.canUnfollow && (
            <Tooltip title="Unfollow this streamer" arrow>
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
                  borderRadius: isMobile ? '20px' : '4px'
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
      {isMobile && (
        <div className="font-bold m-2 text-lg">
          {stringToLength(streamer?.streamName, 200)}
        </div>
      )}
      <div className="m-2 sm:m-8 between-row text-p-text">
        <div className="centered-row space-x-2  sm:space-x-4">
          <div className="sm:w-20 sm:h-20 w-8 h-8 rounded-full relative">
            <img
              src={getAvatar(profile)}
              className="sm:w-20 sm:h-20 w-8 h-8 rounded-full"
            />
            {streamer?.isActive && !isMobile && (
              // centered bottom live div
              <div className="absolute bottom-0 w-full flex justify-center">
                <LiveDiv />
              </div>
            )}
          </div>
          <div className="start-col">
            <div className="font-bold sm:text-lg sm:mb-2">
              {formatHandle(profile)}
            </div>

            {!isMobile && (
              <div className="font-bold">{streamer?.streamName}</div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="end-col sm:start-row space-x-4">
            {/* live button */}
            <FollowUnFollowButton />

            {/* share button */}
            {!isMobile && (
              <div className="sm:ml-2">
                <Tooltip title="Share" arrow>
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
                    startIcon={<IosShareIcon />}
                  >
                    Share
                  </Button>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobile && (
        <div className="space-y-4 m-2">
          <div className="start-row space-x-2 px-2 py-1">
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
                borderRadius: '20px'
              }}
              startIcon={<IosShareIcon />}
            >
              Share
            </Button>
          </div>

          {/* live chat button */}
          {streamer?.isActive && (
            <div className="bg-s-bg rounded-lg p-4 w-full">
              <div className="font-bold text-lg">Live Chat</div>
              <div className="text-sm">
                Coming soon | only available on desktop for now
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProfileBar
