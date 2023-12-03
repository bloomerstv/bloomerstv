'use client'
import React from 'react'
import LiveStreamEditor from './LiveStreamEditor'
import LiveChat from './LiveChat'
import useIsMobile from '../../../../utils/hooks/useIsMobile'
import WorkingOnIt from '../../../common/WorkingOnIt'
import { CircularProgress } from '@mui/material'

const GoLivePage = () => {
  const isMobile = useIsMobile()
  const [createdPublicationId, setCreatedPublicationId] = React.useState<
    string | null
  >(null)

  if (isMobile) {
    return <WorkingOnIt subtitle="This page is live on Desktop" />
  }
  return (
    <div className="flex flex-row h-full">
      <div className="w-full flex-grow overflow-auto h-full">
        <LiveStreamEditor
          createdPublicationId={createdPublicationId}
          setCreatedPublicationId={setCreatedPublicationId}
        />
      </div>
      <div className="w-[400px] flex-none h-full">
        {createdPublicationId ? (
          <LiveChat publicationId={createdPublicationId} />
        ) : (
          <div className="flex bg-s-bg flex-col gap-y-8 items-center justify-center h-full">
            <CircularProgress color="secondary" />
            <div className="text-s-text font-semibold">
              Chat will be available after post is created
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GoLivePage
