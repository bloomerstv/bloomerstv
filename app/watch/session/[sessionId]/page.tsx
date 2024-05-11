'use client'

import React from 'react'
import MasterWatchPage from '../../../../components/pages/watch/MasterWatchPage'

const page = ({
  params
}: {
  params: {
    sessionId: string
  }
}) => {
  return <MasterWatchPage sessionId={params.sessionId} />
}

export default page
