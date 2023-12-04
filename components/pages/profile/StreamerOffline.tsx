import { Profile } from '@lens-protocol/react-web'
import React from 'react'
import { Streamer } from '../../../graphql/generated'
import { getBanner } from '../../../utils/lib/getBannner'
import { timeAgo } from '../../../utils/helpers'
import formatHandle from '../../../utils/lib/formatHandle'
import getAvatar from '../../../utils/lib/getAvatar'

const StreamerOffline = ({
  profile,
  streamer
}: {
  profile: Profile
  streamer?: Streamer
}) => {
  const banner = getBanner(profile)
  return (
    <div className="w-full h-full relative">
      <div className="absolute w-full h-full z-10 flex flex-col items-center justify-center w-full h-full z-20">
        <div className="p-4 sm:p-8 bg-s-bg">
          <img
            src={getAvatar(profile)}
            className="sm:w-16 sm:h-16 w-8 h-8 rounded-full"
          />
          <div className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">
            {`${formatHandle(profile)} is offline.`}
          </div>

          <div className="text-s-text font-bold">
            {streamer?.lastSeen
              ? `Last streamed ${timeAgo(streamer?.lastSeen)}`
              : 'Never streamed before'}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 bg-black left-0 right-0 h-full w-full">
        {banner ? (
          <>
            <img
              className="h-full w-full object-contain"
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
