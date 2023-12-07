import React from 'react'
import { RecordedSession } from '../../../../graphql/generated'
import { usePublication } from '@lens-protocol/react-web'
import { getThumbnailFromRecordingUrl } from '../../../../utils/lib/getThumbnailFromRecordingUrl'
import { localDateAndTime } from '../../../../utils/helpers'
import { Button } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import DownloadIcon from '@mui/icons-material/Download'
import PauseIcon from '@mui/icons-material/Pause'

import Markup from '../../../common/Lexical/Markup'
import PostStreamAsVideo from './PostStreamAsVideo'
import Video from '../../../common/Video'
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
            className="relative cursor-pointer"
            onClick={() => setWatching((prev) => !prev)}
          >
            <img
              src={getThumbnailFromRecordingUrl(session?.mp4Url)}
              className="w-[200px] "
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
          </div>
          {/* @ts-ignore */}
          <div className="start-col gap-y-1">
            <div className="text-sm font-semibold">
              {/* @ts-ignore */}
              <Markup>{data?.metadata?.title}</Markup>
            </div>
            <div className="text-s-text text-sm">
              Streamed on {localDateAndTime(data?.createdAt)}
            </div>

            {/* stats */}
            <div className="start-row gap-x-2 my-1">
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
          </div>
        </div>

        <div className="start-row gap-x-4 shrink-0">
          {/* repost button */}

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
          <Video src={session?.recordingUrl} className="w-[640px]" />
        </div>
      )}
    </div>
  )
}

export default SessionRow
