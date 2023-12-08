import React from 'react'
import { APP_NAME } from '@/utils/config'
import LoginButton from './LoginButton'
import HeaderSearch from './HeaderSearch'
import Link from 'next/link'
import { useTheme } from '../../../wrappers/TailwindThemeProvider'
import clsx from 'clsx'
const TopHeader = () => {
  const { theme } = useTheme()
  return (
    <div
      className={clsx(
        'flex flex-row items-center justify-between p-2 px-4 shadow-sm bg-s-bg h-[60px]',
        theme === 'dark' && 'border-b border-p-border'
      )}
    >
      <Link prefetch href="/" className="no-underline start-row">
        <div className="bg-brand rounded-full w-6 h-6 mr-2" />
        <div className="transition-all duration-200 ease-in-out font-bold text-s-text hover:text-p-text no-underline cursor-pointer">
          {APP_NAME}
        </div>
      </Link>
      <HeaderSearch />
      <div className="centered-row space-x-2">
        <LoginButton />
      </div>
    </div>
  )
}

export default TopHeader
