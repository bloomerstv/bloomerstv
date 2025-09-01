import React from 'react'
import { APP_NAME } from '../../../../utils/config'
import LoginButton from './LoginButton'
import CreatePostButton from './CreatePostButton'
import useSession from '../../../../utils/hooks/useSession'

const MobileTopHeader = () => {
  const { isLensAuthenticated } = useSession()

  return (
    <>
      <div className="flex flex-row items-center sticky top-0 left-0 right-0 w-full z-50 justify-between p-2 sm:p-3 bg-s-bg">
        <div className="centered-row unselectable">
          <img
            className="rounded-full w-8 h-8 mr-2"
            src="/icon-192x192.png"
            alt="logo"
          />
          <div className="font-bold">{APP_NAME}</div>
        </div>

        <div className="centered-row gap-x-1">
          {isLensAuthenticated && <CreatePostButton />}

          <LoginButton />
        </div>
      </div>
    </>
  )
}

export default MobileTopHeader
