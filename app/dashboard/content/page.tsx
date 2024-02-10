'use client'

import React, { useEffect, useState } from 'react'
import {
  RecordedSession,
  useGetMyRecordedStreamSessionsQuery
} from '../../../graphql/generated'
import SessionRow from '../../../components/pages/dashboard/content/SesssionRow'
import { Button } from '@mui/material'
import toast from 'react-hot-toast'

const ContentPage = () => {
  const [sessions, setSessions] = useState<RecordedSession[]>([]) // Change the type to an array of RecordedSession
  const [skips, setSkips] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const { loading, error } = useGetMyRecordedStreamSessionsQuery({
    onCompleted: (data) => {
      // @ts-ignore
      setSessions((prev) => [
        ...(prev ?? []),
        ...(data?.getMyRecordedStreamSessions ?? [])
      ])

      setHasMore(data?.getMyRecordedStreamSessions?.length === 10)
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
    <div className="h-full overflow-y-auto">
      <div className="m-8 text-3xl font-bold">Channel Content</div>

      <div className="m-8">
        {!sessions?.length && !loading && (
          <div className="flex flex-col space-y-4 items-center justify-center">
            <div className="text-2xl font-bold">
              You have no recorded streams.
            </div>
            <div className="text-p-text text-lg">
              Once you start streaming, your streaming sessions will appear
              here.
            </div>
          </div>
        )}
        {sessions?.map((session) => {
          return <SessionRow key={session?.publicationId} session={session} />
        })}
      </div>
      {/* get more button */}
      {sessions?.length !== 0 && (
        <div className="flex justify-center pb-8">
          <Button
            onClick={handleFetchMore}
            variant="contained"
            color="primary"
            disabled={loading || !hasMore}
          >
            {loading ? 'Loading...' : hasMore ? 'Get More' : 'No More Sessions'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default ContentPage
