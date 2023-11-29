import React from 'react'
import { APP_NAME } from '@/utils/config'
import { Button } from '@mui/material'
import { useTheme } from '../../../wrappers/TailwindThemeProvider'
import LoginButton from './LoginButton'

const TopHeader = () => {
  return (
    <div className="flex flex-row items-center justify-between p-5 bg-s-bg">
      <div className="font-bold">{APP_NAME}</div>
      <LoginButton />
    </div>
  )
}

export default TopHeader
