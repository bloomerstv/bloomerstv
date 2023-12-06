'use client'

import { SessionType, useSession } from '@lens-protocol/react-web'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { data } = useSession()

  if (data?.type !== SessionType.WithProfile) {
    return (
      <div className="h-full w-full bg-s-bg centered-col">
        <div className="text-s-text font-semibold">
          You need to be logged in to go view your content
        </div>
      </div>
    )
  }
  return <div className="h-full w-full">{children}</div>
}
