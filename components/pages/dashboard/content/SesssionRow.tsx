import React from 'react'
import { RecordedSession } from '../../../../graphql/generated'
import { usePublication } from '@lens-protocol/react-web'
import { getThumbnailFromRecordingUrl } from '../../../../utils/lib/getThumbnailFromRecordingUrl'
import { localDateAndTime, secondsToTime } from '../../../../utils/helpers'
import { Button } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import DownloadIcon from '@mui/icons-material/Download'
import PauseIcon from '@mui/icons-material/Pause'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Markup from '../../../common/Lexical/Markup'
import PostStreamAsVideo from './PostStreamAsVideo'
import ContentVisibiltyButton from './ContentVisibilty'
import Player from '../../../common/Player'

const SessionRow = ({ session }: { session: RecordedSession }) => {
  const { data } = usePublication({
    // @ts-ignore
    forId: session?.publicationId
  })

  const [watching, setWatching] = React.useState(false)

  if (!data || data?.__typename !== 'Post') return null

  if (!session?.mp4Url) {
    return (
      <div className=" border-b border-p-border py-4">
        Your latest Stream is currently being Recorded. Please wait for few
        minutes after the stream is ended.
      </div>
    )
  }

  // @ts-ignore
  return (
    <div className=" border-b border-p-border py-4">
      <div className="flex flex-row items-start justify-between w-full">
        <div className="flex flex-row space-x-4">
          <div
            className="relative cursor-pointer h-fit w-fit"
            onClick={() => setWatching((prev) => !prev)}
          >
            <img
              src={getThumbnailFromRecordingUrl(session?.mp4Url)}
              className="w-[240px] "
            />

            {watching ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <PauseIcon className="text-white" />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayArrowIcon className="text-white" />
              </div>
            )}

            {session?.sourceSegmentsDuration && (
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-80 px-1.5 rounded">
                <div className="text-xs text-white">
                  {secondsToTime(session?.sourceSegmentsDuration)}
                </div>
              </div>
            )}
          </div>
          {/* @ts-ignore */}
          <div className="start-col gap-y-1.5">
            <a
              href={`/watch/${session?.publicationId}`}
              target="_blank"
              rel="noreferrer"
              className="text-p-text no-underline start-row gap-x-1.5"
            >
              <div className="text-sm font-semibold">
                {/* @ts-ignore */}
                <Markup>{data?.metadata?.title}</Markup>
              </div>

              <OpenInNewIcon
                fontSize="inherit"
                className="text-s-text text-xs"
              />
            </a>
            <div className="text-s-text text-sm">
              Streamed on {localDateAndTime(data?.createdAt)}
            </div>

            {/* stats */}
            <div className="start-row gap-x-2 mb-3">
              <div className="bg-s-bg rounded-full px-2 py-1 text-s-text text-xs font-semibold">
                {data?.stats?.upvotes} Likes
              </div>
              <div className="bg-s-bg rounded-full px-2 py-1 text-s-text text-xs font-semibold">
                {data?.stats?.comments} Comments
              </div>
              <div className="bg-s-bg rounded-full px-2 py-1 text-s-text text-xs font-semibold">
                {data?.stats?.mirrors} Mirrors
              </div>
              {Boolean(data?.stats?.collects) && (
                <div className="bg-s-bg rounded-full px-2 py-1 text-s-text text-xs font-semibold">
                  {data?.stats?.collects} Comments
                </div>
              )}
            </div>
            <ContentVisibiltyButton session={session} />
          </div>
        </div>

        <div className="start-row gap-x-4 shrink-0">
          {data && <PostStreamAsVideo publication={data} session={session} />}
          {/* download button */}
          <Button
            size="small"
            variant="contained"
            color="secondary"
            startIcon={<DownloadIcon />}
            onClick={() => {
              // @ts-ignore
              window.open(session?.mp4Url, '_blank')
            }}
          >
            Download
          </Button>
        </div>
      </div>

      {watching && session?.recordingUrl && (
        <div className="mt-4">
          <Player src={session?.recordingUrl} className="rounded-2xl" />
        </div>
      )}
    </div>
  )
}

export default SessionRow
