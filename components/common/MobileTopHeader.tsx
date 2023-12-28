import React from 'react'
import { APP_NAME } from '../../utils/config'
import LoginButton from '../pages/all/Header/LoginButton'

const MobileTopHeader = () => {
  return (
    <div className="flex flex-row items-center sticky top-0 z-10 justify-between p-2 sm:p-3 bg-s-bg">
      <div className="start-row">
        <div className="bg-brand rounded-full w-6 h-6 mr-2" />
        <div className="font-bold">{APP_NAME}</div>
      </div>
      <LoginButton />
    </div>
  )
}

export default MobileTopHeader
