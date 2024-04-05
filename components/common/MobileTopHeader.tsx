import React from 'react'
import { APP_NAME } from '../../utils/config'
import LoginButton from '../pages/all/Header/LoginButton'

const MobileTopHeader = () => {
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
        <LoginButton />
      </div>
    </>
  )
}

export default MobileTopHeader
