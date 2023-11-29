'use client'
import clsx from 'clsx'
import React from 'react'

import { Inter } from 'next/font/google'
import TopHeader from '@/components/pages/all/Header/TopHeader'

interface Props {
  // Define any props that the component will accept
  children: React.ReactNode
}

const inter = Inter({ subsets: ['latin'] })

const UILayout: React.FC<Props> = (props) => {
  // Define the component's logic and rendering here
  return (
    <div className={clsx(inter.className, 'bg-p-bg text-s-text')}>
      <div className="relative z-10 w-screen h-screen overflow-auto">
        <TopHeader />
        <div className="flex flex-col items-center justify-center py-10">
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default UILayout
