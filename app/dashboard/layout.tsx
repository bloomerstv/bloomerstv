'use client'

import useIsMobile from '../../utils/hooks/useIsMobile'
import WorkingOnIt from '../../components/common/WorkingOnIt'
import useSession from '../../utils/hooks/useSession'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useSession()
  const isMobile = useIsMobile()
  if (isMobile) {
    return <WorkingOnIt subtitle="This page is only on Desktop for now" />
  }

  if (!isAuthenticated) {
    return (
      <div className="h-full w-full bg-s-bg centered-col">
        <div className="text-s-text font-semibold">
          You need to be logged in to go view this page
        </div>
      </div>
    )
  }
  return <div className="h-full w-full">{children}</div>
}
