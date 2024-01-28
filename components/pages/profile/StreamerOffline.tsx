import { Profile, usePublication } from '@lens-protocol/react-web'
import React from 'react'
import { StreamReplayRecording, Streamer } from '../../../graphql/generated'
import { getBanner } from '../../../utils/lib/getBannner'
import { timeAgo } from '../../../utils/helpers'
import formatHandle from '../../../utils/lib/formatHandle'
import getAvatar from '../../../utils/lib/getAvatar'
import Video from '../../common/Video'
import { getThumbnailFromRecordingUrl } from '../../../utils/lib/getThumbnailFromRecordingUrl'

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
  return (
    <div className="w-full h-full relative">
      <div className="absolute w-full h-full sm:px-8 flex flex-row items-center justify-between z-20">
        <div className="py-4 px-10 sm:p-8 bg-s-bg flex sm:flex-row flex-col sm:space-x-8">
          <div className="flex flex-row sm:items-start items-center  sm:space-y-4 sm:space-x-0 space-x-2 sm:flex-col pb-1">
            <img
              src={getAvatar(profile)}
              className="sm:w-16 sm:h-16 w-4 h-4 rounded-full hidden sm:block"
            />
            <div className="text-xs sm:text-2xl font-bold">
              {`${formatHandle(profile)} is offline.`}
            </div>

            <div className="text-s-text text-xs sm:text-base font-bold">
              {streamer?.lastSeen
                ? `Last streamed ${timeAgo(streamer?.lastSeen)}`
                : 'Never streamed before'}
            </div>
          </div>
          {streamReplayRecording?.recordingUrl && (
            <div className="sm:rounded-xl rounded-md overflow-hidden w-fit">
              <Video
                src={streamReplayRecording?.recordingUrl}
                className="w-full"
                muted={false}
                poster={getThumbnailFromRecordingUrl(
                  streamReplayRecording?.recordingUrl
                )}
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
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </>
        ) : (
          <div className="h-full w-full bg-black" />
        )}
      </div>
    </div>
  )
}

export default StreamerOffline
