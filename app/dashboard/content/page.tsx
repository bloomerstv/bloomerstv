'use client'

import React, { useEffect, useState } from 'react'
import {
  RecordedSession,
  useGetMyRecordedStreamSessionsQuery
} from '../../../graphql/generated'
import SessionRow from '../../../components/pages/dashboard/content/SesssionRow'
import { toast } from 'react-toastify'
import { Button } from '@mui/material'

const ContentPage = () => {
  const [sessions, setSessions] = useState<RecordedSession[]>([]) // Change the type to an array of RecordedSession
  const [skips, setSkips] = useState<number>(0)
  const { loading, error } = useGetMyRecordedStreamSessionsQuery({
    onCompleted: (data) => {
      console.log(data)
      // @ts-ignore
      setSessions((prev) => [
        ...(prev ?? []),
        ...(data?.getMyRecordedStreamSessions ?? [])
      ])
    },
    variables: {
      skip: skips
    }
  })

  const handleFetchMore = () => {
    setSkips(sessions.length)
  }

  useEffect(() => {
    if (error) {
      toast.error('Error fetching sessions')
      console.log(error)
    }
  }, [error])

  return (
    <div className="h-full">
      <div className="m-8 text-3xl font-bold">Channel Content</div>

      <div className="m-8">
        {sessions?.map((session) => {
          return <SessionRow key={session?.publicationId} session={session} />
        })}
      </div>
      {/* get more button */}
      <div className="flex justify-center pb-8">
        <Button
          onClick={handleFetchMore}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Get More'}
        </Button>
      </div>
    </div>
  )
}

export default ContentPage
