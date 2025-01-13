'use client'
import React, { use } from 'react';
import MasterWatchPage from '../../../components/pages/watch/MasterWatchPage'

const page = (
  props: {
    params: Promise<{
      id: string
    }>
  }
) => {
  const params = use(props.params);
  return <MasterWatchPage postId={params.id} />
}

export default page
