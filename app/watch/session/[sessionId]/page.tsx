'use client'

import React, { use } from 'react'
import MasterWatchPage from '../../../../components/pages/watch/MasterWatchPage'

const page = (props: {
  params: Promise<{
    sessionId: string
  }>
}) => {
  const params = use(props.params)
  return <MasterWatchPage sessionId={params.sessionId} />
}

export default page
