import React from 'react'
import { APP_NAME } from '../../../../utils/config'
import LoginButton from './LoginButton'
import { SessionType, useSession } from '@lens-protocol/react-web'
import CreatePostButton from './CreatePostButton'

const MobileTopHeader = () => {
  const { data } = useSession()

  return (
    <>
      <div className="flex flex-row items-center sticky top-0 z-10 justify-between p-2 sm:p-3 bg-s-bg">
        <div className="centered-row unselectable">
          <img
            className="rounded-full w-8 h-8 mr-2"
            src="/icon-192x192.png"
            alt="logo"
          />
          <div className="font-bold">{APP_NAME}</div>
        </div>

        <div className="centered-row gap-x-1">
          {data?.type === SessionType.WithProfile && <CreatePostButton />}

          <LoginButton />
        </div>
      </div>
    </>
  )
}

export default MobileTopHeader
