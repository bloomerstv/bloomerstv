'use client'
import React from 'react'
import MasterWatchPage from '../../../components/pages/watch/MasterWatchPage'

const page = ({
  params
}: {
  params: {
    id: string
  }
}) => {
  return <MasterWatchPage postId={params.id} />
}

export default page
