import React from 'react'
import { APP_NAME } from '../../../utils/config'

const StartLoadingPage = () => {
  return (
    <div className="flex flex-row justify-center items-center h-full w-full bg-p-bg gap-x-4 ">
      <div className="rounded-full h-12 w-12 bg-brand animate-pulse" />
      <div className="text-4xl text-s-text font-bold"> {APP_NAME} </div>
    </div>
  )
}

export default StartLoadingPage
