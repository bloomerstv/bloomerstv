import { Post, Profile } from '@lens-protocol/react-web'
import React from 'react'
import { SingleStreamer, useIsVerifiedQuery } from '../../../graphql/generated'
import ProfileBar from './ProfileBar'

const ProfileInfoWithStream = ({
  profile,
  streamer,
  post,
  premium
}: {
  profile: Profile
  streamer?: SingleStreamer
  post?: Post
  premium?: boolean | null
}) => {
  console.log('profile', profile)
  const { data } = useIsVerifiedQuery({
    variables: {
      profileIds: [profile?.id]
    },
    skip: !profile?.id || Boolean(streamer) || premium !== null
  })

  if (!profile) return null
  return (
    <div className="w-full">
      <ProfileBar
        premium={premium ?? Boolean(data?.isVerified?.[0]?.isVerified)}
        profile={profile}
        streamer={streamer}
        post={post}
      />
    </div>
  )
}

export default ProfileInfoWithStream
