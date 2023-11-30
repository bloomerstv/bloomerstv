'use client'
import { SessionType, useSession } from '@lens-protocol/react-web'
import React, { useEffect } from 'react'
import { useStreamIdQuery } from '../../../../graphql/generated'
import { toast } from 'react-toastify'
import { useStream } from '@livepeer/react'

const LiveStreamEditor = () => {
  const { data } = useSession()
  const { data: streamData, error } = useStreamIdQuery({
    skip: data?.type !== SessionType.WithProfile
  })

  const { data: streamInfo } = useStream(streamData?.streamId || '')

  console.log('streamData', streamData)
  console.log('error', error)
  console.log('streamInfo', streamInfo)

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  return <div>LiveStreamEditor</div>
}

export default LiveStreamEditor
