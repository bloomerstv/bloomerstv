import React from 'react'
import { RecordedSession } from '../../../../graphql/generated'
import { useHidePublication, usePublication } from '@lens-protocol/react-web'
import { getThumbnailFromRecordingUrl } from '../../../../utils/lib/getThumbnailFromRecordingUrl'
import {
  localDate,
  secondsToTime
  // localDateAndTime,
  // secondsToTime
} from '../../../../utils/helpers'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
// import PlayArrowIcon from '@mui/icons-material/PlayArrow'
// import DownloadIcon from '@mui/icons-material/Download'
// import PauseIcon from '@mui/icons-material/Pause'
// import OpenInNewIcon from '@mui/icons-material/OpenInNew'
// import Markup from '../../../common/Lexical/Markup'
// import PostStreamAsVideo from './PostStreamAsVideo'
import ContentVisibiltyButton from './ContentVisibilty'
import { getSenitizedContent } from '../../../../utils/lib/getSenitizedContent'
import { stringToLength } from '../../../../utils/stringToLength'
import Link from 'next/link'
import { APP_LINK, HEY_APP_LINK } from '../../../../utils/config'
import { Button, IconButton, Tooltip } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import PostStreamAsVideo from './PostStreamAsVideo'
import CreateIcon from '@mui/icons-material/Create'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import DeleteIcon from '@mui/icons-material/Delete'
import toast from 'react-hot-toast'
import ModalWrapper from '../../../ui/Modal/ModalWrapper'
import LoadingImage from '../../../ui/LoadingImage'
// import Player from '../../../common/Player'

const SessionRow = ({ session }: { session: RecordedSession }) => {
  const [newPublicationId, setNewPublicationId] = React.useState<string | null>(
    null
  )

  const [openDeleteConfirmation, setOpenDeleteConfirmation] =
    React.useState<boolean>(false)
  const { data } = usePublication({
    // @ts-ignore
    forId: session?.publicationId || newPublicationId
  })

  const [postAsVideoProps, setPostAsVideoProps] = React.useState<{
    open: boolean
    modalTitle: string | null
    Icon: React.ReactNode | null
    defaultMode: 'Clip' | 'Video'
  }>({
    open: false,
    modalTitle: null,
    Icon: null,
    defaultMode: 'Clip'
  })

  const { execute } = useHidePublication()

  const handleDeletePost = async () => {
    if (!data?.id) return
    const res = await execute({
      publication: data
    })

    if (res.isSuccess()) {
      toast.success('Post deleted')
    } else {
      toast.error('Error deleting post : ', res.error)
    }
  }

  const totalMirrors =
    // @ts-ignore
    Number(data?.stats?.mirrors ?? 0) + Number(data?.stats?.quotes ?? 0)

  // const [watching, setWatching] = React.useState(false)

  if (data && data?.__typename !== 'Post') return null

  if (!session?.recordingUrl) {
    return null
    // return (
    //   <div className=" border-b border-p-border py-4">
    //     Your latest Stream is currently being Recorded. Please wait for few
    //     minutes after the stream is ended.
    //   </div>
    // )
  }

  return (
    <TableRow className="hover:bg-p-hover group">
      {/* delete confirmation */}

      {data?.id && !data?.isHidden && (
        <ModalWrapper
          onClose={() => setOpenDeleteConfirmation(false)}
          open={openDeleteConfirmation}
          onOpen={() => setOpenDeleteConfirmation(true)}
          BotttomComponent={
            <div className="flex flex-row justify-end gap-x-4">
              <Button
                onClick={() => setOpenDeleteConfirmation(false)}
                className="text-p-text text-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeletePost}
                className="text-red-500 text-lg"
                variant="contained"
              >
                Delete
              </Button>
            </div>
          }
          Icon={<DeleteIcon />}
          title="Delete Post"
        >
          <div className="text-lg">
            Are you sure you want to delete this post?
          </div>
        </ModalWrapper>
      )}

      <PostStreamAsVideo
        session={session}
        publication={data}
        Icon={<CreateIcon />}
        modalTitle={postAsVideoProps.modalTitle ?? undefined}
        open={postAsVideoProps.open}
        defaultMode={postAsVideoProps.defaultMode}
        setNewPublicationId={setNewPublicationId}
        setOpen={(open) => setPostAsVideoProps((prev) => ({ ...prev, open }))}
      />
      {/* video */}
      <TableCell>
        <div className="flex flex-row items-start gap-x-4 w-[450px]">
          <div className="relative">
            <LoadingImage
              src={
                data?.metadata?.marketplace?.image?.optimized?.uri ??
                getThumbnailFromRecordingUrl(session?.recordingUrl)
              }
              className="w-[120px] rounded-sm"
            />
            {session?.sourceSegmentsDuration && (
              <div className="absolute bottom-3 right-2 bg-black bg-opacity-80 px-1.5 rounded">
                <div className="text-xs text-white">
                  {/* @ts-ignore */}
                  {secondsToTime(session?.sourceSegmentsDuration)}
                </div>
              </div>
            )}
          </div>
          <div>
            <Link
              href={
                data?.id
                  ? `${APP_LINK}/watch/${data?.id}`
                  : `${APP_LINK}/watch/session/${session?.sessionId}`
              }
              className="font-bold no-underline hover:underline text-p-text text-base"
            >
              {/* @ts-ignore */}
              {data?.metadata?.title
                ? // @ts-ignore
                  stringToLength(data?.metadata?.title, 40)
                : 'Untitled Stream'}
            </Link>
            <div className="text-s-text text-xs font-semibold block group-hover:hidden">
              {data?.id
                ? stringToLength(
                    getSenitizedContent(
                      // @ts-ignore
                      data?.metadata?.content,
                      // @ts-ignore
                      data?.metadata?.title
                    ),
                    120
                  )
                : 'Untitled Stream'}
            </div>
            {/* show only on hover of the row */}
            <div className="hidden -ml-3 group-hover:block start-center-row shrink-0">
              {data?.id && (
                <Tooltip title="Open in hey.xyz">
                  <IconButton
                    size="large"
                    onClick={() => {
                      // @ts-ignore
                      window.open(`${HEY_APP_LINK}/posts/${data?.id}`, '_blank')
                    }}
                  >
                    <img
                      src={'/icons/heyIcon.png'}
                      className="w-6 h-6"
                      alt="hey"
                    />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Watch in bloomers.tv">
                <IconButton
                  size="large"
                  onClick={() => {
                    // @ts-ignore
                    window.open(
                      data?.id
                        ? `${APP_LINK}/watch/${data?.id}`
                        : `${APP_LINK}/watch/session/${session?.sessionId}`,
                      '_blank'
                    )
                  }}
                >
                  <RemoveRedEyeIcon />
                </IconButton>
              </Tooltip>

              {session?.mp4Url && (
                <Tooltip title="Download the video">
                  <IconButton
                    size="large"
                    onClick={() => {
                      // @ts-ignore
                      window.open(session?.mp4Url, '_blank')
                    }}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              )}

              {!data?.id && (
                <Tooltip title={'Create a post for this stream'}>
                  <IconButton
                    size="large"
                    onClick={() => {
                      // @ts-ignore
                      setPostAsVideoProps((prev) => ({
                        ...prev,
                        open: true,
                        defaultMode: 'Video',
                        modalTitle: 'Create Post for this Stream',
                        Icon: <CreateIcon />
                      }))
                    }}
                  >
                    <CreateIcon />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Create a Clip">
                <IconButton
                  size="large"
                  onClick={() => {
                    // @ts-ignore
                    setPostAsVideoProps((prev) => ({
                      ...prev,
                      open: true,
                      defaultMode: 'Clip',
                      modalTitle: 'Create Clip',
                      Icon: <ContentCutIcon />
                    }))
                  }}
                >
                  <ContentCutIcon />
                </IconButton>
              </Tooltip>

              {data?.id && !data?.isHidden && (
                <Tooltip title="Delete the post">
                  <IconButton
                    size="large"
                    onClick={() => {
                      setOpenDeleteConfirmation(true)
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </TableCell>
      {/* Visiblity */}
      <TableCell>
        {session.viewType ? (
          <ContentVisibiltyButton session={session} />
        ) : (
          <span className="text-2xl">-</span>
        )}
      </TableCell>

      {/* date */}
      <TableCell>{localDate(session?.createdAt)}</TableCell>

      {/* likes */}
      <TableCell>
        {data?.stats?.upvotes ?? <span className="text-2xl">-</span>}
      </TableCell>

      {/* comments */}
      <TableCell>
        {data?.stats?.comments ?? <span className="text-2xl">-</span>}
      </TableCell>

      {/* mirrors */}
      <TableCell>
        {typeof data?.stats?.mirrors === 'number' ? (
          totalMirrors
        ) : (
          <span className="text-2xl">-</span>
        )}
      </TableCell>
    </TableRow>
  )
}

export default SessionRow
