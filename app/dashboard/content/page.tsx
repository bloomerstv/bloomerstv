'use client'

import React, { useEffect, useState } from 'react'
import {
  RecordedSession,
  useGetMyRecordedStreamSessionsQuery
} from '../../../graphql/generated'
import SessionRow from '../../../components/pages/dashboard/content/SessionRow'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import toast from 'react-hot-toast'
import { Button } from '@mui/material'

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
      <div className="mx-6 my-4 text-3xl leading-0 font-bold">
        Channel Content
      </div>

      <div className="mx-6 mb-4">
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
        {sessions?.length > 0 && (
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: window.innerHeight - 200
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {/* Replace 'Header' with your actual column headers */}
                  <TableCell>Video</TableCell>
                  <TableCell>Visiblity</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Likes</TableCell>
                  <TableCell>Reposts</TableCell>
                  <TableCell>Comments</TableCell>
                  {/* Add more TableCell components as needed */}
                </TableRow>
              </TableHead>
              <TableBody>
                {sessions.map((session, index) => (
                  <SessionRow key={index} session={session} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
      {/* get more button */}
      {sessions?.length !== 0 && (
        <div className="flex justify-center">
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
