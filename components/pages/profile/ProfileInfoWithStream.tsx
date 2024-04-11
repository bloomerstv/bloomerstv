import { Post, Profile } from '@lens-protocol/react-web'
import React from 'react'
import { SingleStreamer, useIsVerifiedQuery } from '../../../graphql/generated'
import ProfileBar from './ProfileBar'

const ProfileInfoWithStream = ({
  profile,
  streamer,
  post
}: {
  profile: Profile
  streamer?: SingleStreamer
  post?: Post
}) => {
  const { data } = useIsVerifiedQuery({
    variables: {
      profileIds: [profile?.id]
    },
    skip: !profile?.id || Boolean(streamer)
  })

  return (
    <div className="w-full">
      <ProfileBar
        premium={Boolean(data?.isVerified?.[0]?.isVerified)}
        profile={profile}
        streamer={streamer}
        post={post}
      />
    </div>
  )
}

export default ProfileInfoWithStream
