import React from 'react'
import {
  StreamReplayRecording,
  Streamer,
  useAddNotificationSubscriberToStreamerMutation,
  useIsSubscribedNotificationForStreamerQuery
} from '../../../graphql/generated'
import { getBanner } from '../../../utils/lib/getBannner'
import { timeAgo } from '../../../utils/helpers'
import formatHandle from '../../../utils/lib/formatHandle'
import getAvatar from '../../../utils/lib/getAvatar'
import { getThumbnailFromRecordingUrl } from '../../../utils/lib/getThumbnailFromRecordingUrl'
import Player from '../../common/Player/Player'
import clsx from 'clsx'
import { getWebsiteLinksFromProfile } from './getWebsiteLinksFromProfile'
import InsertLinkIcon from '@mui/icons-material/InsertLink'
import TwitterIcon from '@mui/icons-material/Twitter'
import GitHubIcon from '@mui/icons-material/GitHub'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import { ProfileLink } from './AboutProfile'
import toast from 'react-hot-toast'
import { Button } from '@mui/material'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import NotificationsIcon from '@mui/icons-material/Notifications'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import Countdown from 'react-countdown'
import { Account, usePost } from '@lens-protocol/react'
import useSession from '../../../utils/hooks/useSession'

const StreamerOffline = ({
  account,
  streamReplayRecording,
  streamer
}: {
  account: Account
  streamer?: Streamer
  streamReplayRecording?: StreamReplayRecording
}) => {
  const banner = getBanner(account)
  const { data } = usePost({
    post: streamReplayRecording?.postId
  })

  const isMobile = useIsMobile()
  const { isAuthenticated, account: sessionAccount } = useSession()
  const { websiteLink, twitterLink, instagramLink, githubLink, linkedInLink } =
    getWebsiteLinksFromProfile(account)

  const { data: isSubscribed, refetch } =
    useIsSubscribedNotificationForStreamerQuery({
      variables: {
        accountAddress: account.address
      },
      skip: !isAuthenticated || !account.address
    })

  const [addSubscriber] = useAddNotificationSubscriberToStreamerMutation({
    variables: {
      accountAddress: account.address
    },
    onCompleted: async () => {
      await refetch()
      toast.success(
        `You will receive notification when ${formatHandle(account)} goes live!`
      )
    }
  })

  return (
    <div className="w-full h-full relative">
      <div className="absolute w-full h-full sm:px-8 flex flex-row items-center justify-between z-20">
        <div
          className={clsx(
            streamReplayRecording?.recordingUrl && 'w-full',
            'py-4 px-6 sm:p-8 bg-s-bg flex sm:flex-row flex-col sm:space-x-8 rounded-xl'
          )}
        >
          <div className="flex shrink-0 w-[300px]  flex-row sm:items-start items-center sm:space-y-4 sm:space-x-0 space-x-2 sm:flex-col pb-1">
            <img
              src={getAvatar(account)}
              className="sm:w-16 sm:h-16 w-4 h-4 rounded-full hidden sm:block"
            />

            <div className="text-xs sm:text-2xl font-bold text-p-text text-left">
              {`${formatHandle(account)} is offline.`}
            </div>

            {(!isMobile ||
              !streamer?.nextStreamTime ||
              new Date(streamer?.nextStreamTime) < new Date()) && (
              <div className="text-s-text text-xs sm:text-base font-bold">
                {streamer?.lastSeen
                  ? `Streamed ${timeAgo(streamer?.lastSeen)}`
                  : 'Never streamed before'}
              </div>
            )}

            {streamer?.nextStreamTime &&
              new Date(streamer?.nextStreamTime) > new Date() && (
                <div className="text-s-text text-xs sm:text-base font-bold start-col">
                  <Countdown
                    renderer={({
                      days,
                      hours,
                      minutes,
                      seconds,
                      completed
                    }) => {
                      if (completed) {
                        return (
                          <div>{`Waiting for ${formatHandle(account)} `}</div>
                        )
                      } else {
                        return (
                          <div>
                            Next stream in{' '}
                            <span className="text-brand">{`${days ? `${days}d ` : ''} ${hours ? `${hours}h` : ''} ${minutes ? `${minutes}m` : ''} ${seconds ? `${seconds}s` : ''}`}</span>
                          </div>
                        )
                      }
                    }}
                    date={streamer?.nextStreamTime}
                  />
                </div>
              )}

            {!isMobile && (
              <div className="flex flex-col items-start gap-y-0.5">
                {websiteLink && (
                  <ProfileLink
                    link={websiteLink}
                    icon={<InsertLinkIcon fontSize="small" />}
                    className="pl-2 -ml-2"
                  />
                )}
                {twitterLink && (
                  <ProfileLink
                    link={twitterLink}
                    icon={<TwitterIcon fontSize="small" />}
                    alias="Twitter"
                    className="pl-2 -ml-2"
                  />
                )}
                {instagramLink && (
                  <ProfileLink
                    link={instagramLink}
                    icon={<InstagramIcon fontSize="small" />}
                    alias="Instagram"
                    className="pl-2 -ml-2"
                  />
                )}
                {githubLink && (
                  <ProfileLink
                    link={githubLink}
                    icon={<GitHubIcon fontSize="small" />}
                    alias="GitHub"
                    className="pl-2 -ml-2"
                  />
                )}
                {linkedInLink && (
                  <ProfileLink
                    link={linkedInLink}
                    icon={<LinkedInIcon fontSize="small" />}
                    alias="LinkedIn"
                    className="pl-2 -ml-2"
                  />
                )}
                {isAuthenticated &&
                  sessionAccount?.address !== account?.address && (
                    <>
                      {isSubscribed?.isSubscribedNotificationForStreamer ? (
                        <div className="flex flex-row gap-x-1 py-1.5 -ml-0.5 text-s-text">
                          <NotificationsIcon fontSize="medium" />
                          <div className="text-left">
                            You will be notified when {formatHandle(account)}{' '}
                            goes live.
                          </div>
                        </div>
                      ) : (
                        <div className="-ml-1">
                          <Button
                            onClick={async () => {
                              await addSubscriber()
                            }}
                            color="primary"
                            variant="text"
                            startIcon={<NotificationsNoneIcon />}
                            sx={{
                              textTransform: 'none',
                              borderRadius: '20px'
                            }}
                          >
                            <div className="text-base -ml-1">
                              Turn on notifications
                            </div>
                          </Button>
                        </div>
                      )}
                    </>
                  )}
              </div>
            )}
          </div>
          {streamReplayRecording?.recordingUrl && (
            <div className="sm:rounded-xl rounded-md overflow-hidden w-full">
              <Player
                // @ts-ignore
                src={streamReplayRecording?.recordingUrl}
                poster={getThumbnailFromRecordingUrl(
                  streamReplayRecording?.recordingUrl
                )}
                // @ts-ignore
                title={
                  // @ts-ignore
                  data?.metadata?.title ?? 'Untitled'
                }
              />
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 right-0 bg-black left-0 h-full w-full">
        {banner ? (
          <>
            <img
              className="h-full w-full object-cover"
              src={banner}
              alt="logo"
            />
            <div className="absolute inset-0 bg-black bg-opacity-70" />
          </>
        ) : (
          <div className="h-full w-full bg-black" />
        )}
      </div>
    </div>
  )
}

export default StreamerOffline
