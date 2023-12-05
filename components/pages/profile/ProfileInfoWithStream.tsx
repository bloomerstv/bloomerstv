import { Profile } from '@lens-protocol/react-web'
import React from 'react'
import { SingleStreamer } from '../../../graphql/generated'
import ProfileBar from './ProfileBar'
import AboutProfile from './AboutProfile'

const ProfileInfoWithStream = ({
  profile,
  streamer
}: {
  profile: Profile
  streamer?: SingleStreamer
}) => {
  return (
    <div className="w-full">
      <ProfileBar profile={profile} streamer={streamer} />
      <AboutProfile profile={profile} />
    </div>
  )
}

export default ProfileInfoWithStream
