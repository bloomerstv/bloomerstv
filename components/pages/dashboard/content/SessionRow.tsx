import React, { useEffect } from 'react'
import {
  RecordedSession,
  useUpdateLensStreamSessionMutation
} from '../../../../graphql/generated'

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
import { HEY_APP_LINK } from '../../../../utils/config'
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
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { MediaImageMimeType } from '@lens-protocol/metadata'
import uploadToIPFS from '../../../../utils/uploadToIPFS'
import getIPFSLink from '../../../../utils/getIPFSLink'
import { usePost } from '@lens-protocol/react'
import useDeletePost from '../../../../utils/hooks/lens/useDeletePost'
// import Player from '../../../common/Player'

const SessionRow = ({ session }: { session: RecordedSession }) => {
  const [newPostId, setNewPostId] = React.useState<string | null>(null)
  const imageFileInputRef = React.useRef<HTMLInputElement>(null)
  const [thumbnail, setThumbnail] = React.useState<string | null>(null)
  const [updateThumbnail] = useUpdateLensStreamSessionMutation()

  const [openDeleteConfirmation, setOpenDeleteConfirmation] =
    React.useState<boolean>(false)
  const { data } = usePost({
    post: newPostId || session?.postId
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

  const { execute } = useDeletePost()

  const handleDeletePost = async () => {
    if (!data?.id) return
    const res = await execute({
      post: data?.id
    })

    if (res.isOk()) {
      toast.success('Post deleted')
    } else if (res.isErr()) {
      toast.error(`Error deleting post: ${res.error.message}`)
    }
  }

  const totalMirrors =
    // @ts-ignore
    Number(data?.stats?.mirrors ?? 0) + Number(data?.stats?.quotes ?? 0)

  const checkImageAspectRatio = (file) => {
    return new Promise<boolean>((resolve, reject) => {
      const image = new Image()
      image.src = URL.createObjectURL(file)
      image.onload = () => {
        if (image.width / image.height !== 16 / 9) {
          toast.error(
            'Invalid image aspect ratio. Please upload an image with 16:9 aspect ratio'
          )
          resolve(false)
        } else {
          resolve(true)
        }
      }
      image.onerror = () => {
        reject(new Error('Error loading image'))
      }
    })
  }

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const mediaImageMimeTypes = Object.values(MediaImageMimeType)

    const files = e.target.files
    if (!files?.length) return

    const file = files[0]

    // check if file type is in mediaImageMimeTypes
    // @ts-ignore
    if (!mediaImageMimeTypes.includes(file.type)) {
      toast.error('Invalid image file type. Please upload a valid image file')
      return
    }

    try {
      // check if image file is of ratio 16:9
      const isOk = await checkImageAspectRatio(file)

      if (!isOk) return
    } catch {
      return
    }

    // upload to IPFS
    const ipfsResult = await toast.promise(uploadToIPFS(file), {
      error: 'Error uploading image',
      loading: 'Uploading image...',
      success: 'Image uploaded'
    })

    if (!ipfsResult) return

    const newThumbnailUrl = getIPFSLink(ipfsResult.url)

    const res = await toast.promise(
      updateThumbnail({
        variables: {
          sessionId: String(session?.sessionId),
          customThumbnail: newThumbnailUrl
        }
      }),
      {
        error: 'Error updating thumbnail',
        loading: 'Updating thumbnail...',
        success: 'Thumbnail updated'
      }
    )

    if (!res) return

    // set as preview
    setThumbnail(newThumbnailUrl)
  }

  useEffect(() => {
    if (!session?.recordingUrl) return
    setThumbnail(
      session?.customThumbnail ??
        // @ts-ignore
        data?.metadata?.marketplace?.image?.optimized?.uri ??
        getThumbnailFromRecordingUrl(session?.recordingUrl)
    )
  }, [data?.id, session?.recordingUrl])

  if (data && data?.__typename !== 'Post')
    // const [watching, setWatching] = React.useState(false)

    return null

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

      {data?.id && !data?.isDeleted && (
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
        post={data}
        Icon={<CreateIcon />}
        modalTitle={postAsVideoProps.modalTitle ?? undefined}
        open={postAsVideoProps.open}
        defaultMode={postAsVideoProps.defaultMode}
        setNewPostId={setNewPostId}
        setOpen={(open) => setPostAsVideoProps((prev) => ({ ...prev, open }))}
      />
      {/* video */}
      <TableCell>
        <div className="flex flex-row items-start gap-x-4 w-[450px]">
          {/* thumbnail */}
          <div className="relative">
            <LoadingImage
              src={
                // @ts-ignore
                thumbnail ?? '/icons/placeholder.png'
              }
              className="w-[120px] h-[67.5px] rounded-sm"
              loaderClassName="w-[120px] h-[67.5px]"
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
                  ? `/watch/${data?.id}`
                  : `/watch/session/${session?.sessionId}`
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
                : 'Untitled Stream'}{' '}
              {data?.isDeleted && (
                <span className="text-red-500">
                  Post Deleted & hidden from homepage.
                </span>
              )}
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
                        ? `/watch/${data?.id}`
                        : `/watch/session/${session?.sessionId}`,
                      '_blank'
                    )
                  }}
                >
                  <RemoveRedEyeIcon />
                </IconButton>
              </Tooltip>

              {data?.id && (
                <Tooltip title="Upload thumbnail image with 16:9 ratio">
                  <IconButton
                    size="large"
                    onClick={() => {
                      // Programmatically click the file input when the button is clicked
                      if (!imageFileInputRef.current) return
                      // @ts-ignore
                      imageFileInputRef.current.click()
                    }}
                  >
                    <AddPhotoAlternateIcon />
                  </IconButton>
                </Tooltip>
              )}

              <input
                type="file"
                ref={imageFileInputRef}
                style={{ display: 'none' }} // Hide the file input
                onChange={handleImageFileChange}
                accept="image/*" // Optional: limit the file chooser to only image files
              />

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

              {(!data?.id || data?.isDeleted) && (
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

              {data?.id && !data?.isDeleted && (
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
        {data?.id && data?.isDeleted ? (
          <span className="text-2xl">-</span>
        ) : (
          <ContentVisibiltyButton session={session} />
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

      {/* reposts */}
      <TableCell>
        {typeof data?.stats?.reposts === 'number' ? (
          totalMirrors
        ) : (
          <span className="text-2xl">-</span>
        )}
      </TableCell>
    </TableRow>
  )
}

export default SessionRow
