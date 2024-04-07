import {
  Profile,
  SessionType,
  usePublication,
  useSession
} from '@lens-protocol/react-web'
import React from 'react'
import {
  StreamReplayRecording,
  Streamer,
  useAddNotificationSubscriberToStreamerMutation,
  useIsSubcribedNotificationForStreamerQuery
} from '../../../graphql/generated'
import { getBanner } from '../../../utils/lib/getBannner'
import { timeAgo } from '../../../utils/helpers'
import formatHandle from '../../../utils/lib/formatHandle'
import getAvatar from '../../../utils/lib/getAvatar'
import { getThumbnailFromRecordingUrl } from '../../../utils/lib/getThumbnailFromRecordingUrl'
import Player from '../../common/Player'
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

const StreamerOffline = ({
  profile,
  streamReplayRecording,
  streamer
}: {
  profile: Profile
  streamer?: Streamer
  streamReplayRecording?: StreamReplayRecording
}) => {
  const banner = getBanner(profile)
  const { data } = usePublication({
    // @ts-ignore
    forId: streamReplayRecording?.publicationId
  })
  const isMobile = useIsMobile()
  const { data: mySession } = useSession()
  const { websiteLink, twitterLink, instagramLink, githubLink, linkedInLink } =
    getWebsiteLinksFromProfile(profile)

  const { data: isSubscribed, refetch } =
    useIsSubcribedNotificationForStreamerQuery({
      variables: {
        profileId: profile.id
      },
      skip: mySession?.type !== SessionType.WithProfile || !profile.id
    })

  const [addSubscriber] = useAddNotificationSubscriberToStreamerMutation({
    variables: {
      profileId: profile.id
    },
    onCompleted: async () => {
      await refetch()
      toast.success(
        `You will recieve notification when ${formatHandle(profile)} goes live!`
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
              src={getAvatar(profile)}
              className="sm:w-16 sm:h-16 w-4 h-4 rounded-full hidden sm:block"
            />
            <div className="text-xs sm:text-2xl font-bold text-p-text text-left">
              {`${formatHandle(profile)} is offline.`}
            </div>

            <div className="text-s-text text-xs sm:text-base font-bold">
              {streamer?.lastSeen
                ? `Streamed ${timeAgo(streamer?.lastSeen)}`
                : 'Never streamed before'}
            </div>

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
                {mySession?.type === SessionType.WithProfile && (
                  <>
                    {isSubscribed?.isSubcribedNotificationForStreamer ? (
                      <div className="flex flex-row gap-x-1 py-1.5 -ml-0.5 text-p-text text-s-text">
                        <NotificationsIcon fontSize="medium" />
                        <div className="text-left">
                          You will be notified when {formatHandle(profile)} goes
                          live.
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
                  data?.__typename === 'Post'
                    ? data?.metadata?.marketplace?.name
                    : undefined
                }
              />
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 right-0 bg-black left-0 right-0 h-full w-full">
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
