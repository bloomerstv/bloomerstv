import { Profile } from '@lens-protocol/react-web'
import React from 'react'
import formatHandle from '../../../utils/lib/formatHandle'
import Markup from '../../common/Lexical/Markup'

const AboutProfile = ({ profile }: { profile: Profile }) => {
  return (
    <div className="sm:m-8 sm:p-8 m-2 p-4 rounded-lg shadow-sm bg-s-bg">
      <div className="text-2xl font-bold mb-4">
        About {formatHandle(profile)}
      </div>
      <div className="start-row space-x-1">
        <div className="font-bold">{profile?.stats?.followers}</div>
        <div className="text-s-text">followers</div>
      </div>
      {profile?.metadata?.bio && (
        <Markup className="mt-4">{String(profile?.metadata?.bio)}</Markup>
      )}
      {/* links */}
    </div>
  )
}

export default AboutProfile
