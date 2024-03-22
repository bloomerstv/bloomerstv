'use client'
import React from 'react'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full overflow-x-hidden overflow-y-auto p-8 relative">
      <div className="rounded-xl h-full bg-s-bg p-6 px-8">{children}</div>
    </div>
  )
}

export default RootLayout
