import { Post, Profile } from '@lens-protocol/react-web'
import React from 'react'
import { SingleStreamer } from '../../../graphql/generated'
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
  return (
    <div className="w-full">
      <ProfileBar profile={profile} streamer={streamer} post={post} />
    </div>
  )
}

export default ProfileInfoWithStream
