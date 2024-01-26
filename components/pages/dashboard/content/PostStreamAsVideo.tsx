import { Button, TextField, TextareaAutosize } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CreateIcon from '@mui/icons-material/Create'
import { Post, useCreatePost, useSession } from '@lens-protocol/react-web'
import {
  RecordedSession,
  useUploadDataToArMutation
} from '../../../../graphql/generated'
import { v4 as uuid } from 'uuid'
import getUserLocale from '../../../../utils/getUserLocale'
import { MediaVideoMimeType, video } from '@lens-protocol/metadata'
import { APP_ID, APP_LINK, defaultSponsored } from '../../../../utils/config'
import ModalWrapper from '../../../ui/Modal/ModalWrapper'
import EditIcon from '@mui/icons-material/Edit'
import formatHandle from '../../../../utils/lib/formatHandle'
import { getThumbnailFromRecordingUrl } from '../../../../utils/lib/getThumbnailFromRecordingUrl'
import VideoWithEditors from './VideoWithEditors'
import toast from 'react-hot-toast'

const PostStreamAsVideo = ({
  publication,
  session
}: {
  publication: Post
  session: RecordedSession
}) => {
  // @ts-ignore
  const [content, setContent] = React.useState('')

  const [title, setTitle] = React.useState(
    // @ts-ignore
    publication?.metadata?.title
  )

  useEffect(() => {
    // @ts-ignore
    setTitle(
      // @ts-ignore
      publication?.metadata?.title
    )
    // @ts-ignore
  }, [publication?.metadata?.title])
  const [open, setOpen] = useState(false)

  const { data: profile } = useSession()

  const { execute } = useCreatePost()

  const [uploadDataToAR] = useUploadDataToArMutation()

  const [showVideoDescription, setShowVideoDescription] = useState(false)

  const createLensPost = async () => {
    // @ts-ignore
    if (title.trim().length === 0) {
      toast.error('Please enter a title')
      return
    }

    const id = uuid()
    const locale = getUserLocale()

    const metadata = video({
      // @ts-ignore
      title: title,
      // @ts-ignore
      content: `**${title}**\n\n${content}`,
      marketplace: {
        name: title,
        description: `**${title}**\n\n${content}`,
        // @ts-ignore
        external_url: `${APP_LINK}/${formatHandle(profile?.profile)}`,
        // @ts-ignore
        animation_url: session?.mp4Url,
        // @ts-ignore
        image: getThumbnailFromRecordingUrl(session?.mp4Url)
      },
      video: {
        // @ts-ignore
        item: session?.mp4Url,
        // @ts-ignore
        cover: getThumbnailFromRecordingUrl(session?.mp4Url),
        // @ts-ignore
        duration: session?.sourceSegmentsDuration,
        type: MediaVideoMimeType.MP4,
        // @ts-ignore
        altTag: title
      },
      appId: APP_ID,
      id: id,
      locale: locale
    })

    const { data: resultIpfs } = await uploadDataToAR({
      variables: {
        data: JSON.stringify(metadata)
      }
    })

    const transactionID = resultIpfs?.uploadDataToAR

    if (!transactionID) {
      throw new Error('Error uploading metadata to IPFS')
    }

    // invoke the `execute` function to create the post
    const result = await execute({
      metadata: `ar://${transactionID}`,
      sponsored: defaultSponsored
    })

    if (!result.isSuccess()) {
      toast.error(result.error.message)
      // handle failure scenarios
      throw new Error('Error creating post')
    }
  }

  const handleCreatePost = async () => {
    setOpen(false)

    await toast.promise(createLensPost(), {
      loading: 'Creating Post...',
      success: 'Post Created',
      error: 'Error creating post'
    })
  }

  return (
    <>
      <ModalWrapper
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        title="Post as Video"
        Icon={<EditIcon />}
        classname="w-[600px]"
        BotttomComponent={
          <div className="flex flex-row justify-end">
            {/* cancle button & save button */}
            <Button variant="text" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="text"
              onClick={handleCreatePost}
              disabled={title.trim().length === 0}
            >
              Post
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-y-4">
          <TextField
            label="Video Title"
            variant="outlined"
            onChange={
              // @ts-ignore
              (e) => setTitle(e.target.value)
            }
            value={title}
            inputProps={{
              maxLength: 100
            }}
            helperText={`${100 - title.length} / 100 characters remaining`}
          />

          {showVideoDescription ? (
            <TextareaAutosize
              className="text-base text-p-text border-p-border outline-none bg-s-bg w-full font-normal font-sans leading-normal px-3 py-1.5 rounded-md "
              aria-label="empty textarea"
              placeholder="Video Description... (optional)"
              style={{
                resize: 'none',
                margin: 0
              }}
              maxRows={10}
              minRows={2}
              onChange={(e) => setContent(e.target.value)}
              value={content}
            />
          ) : (
            <div
              className="text-xs text-s-text cursor-pointer hover:text-p-text px-1 font-bold"
              onClick={() => {
                setShowVideoDescription(true)
              }}
            >
              {`Add a description to your video >`}
            </div>
          )}

          <div className="rounded-md overflow-hidden">
            <VideoWithEditors src={session?.mp4Url?.toString()!} />
          </div>
        </div>
      </ModalWrapper>
      <Button
        size="small"
        variant="contained"
        color="secondary"
        startIcon={<CreateIcon />}
        onClick={() => {
          setOpen(true)
        }}
      >
        Post as Video
      </Button>
    </>
  )
}

export default PostStreamAsVideo
