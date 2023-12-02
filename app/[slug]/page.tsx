import React from 'react'
import ProfilePage from '../../components/pages/profile/ProfilePage'
import { getHandle } from '../../utils/lib/getHandle'

const page = ({
  params
}: {
  params: {
    slug: string
  }
}) => {
  return (
    <div className="h-full">
      <ProfilePage handle={getHandle(params.slug)} />
    </div>
  )
}

export default page
