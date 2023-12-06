import { Button, TextareaAutosize } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CreateIcon from '@mui/icons-material/Create'
import { toast } from 'react-toastify'
import { Post, useCreatePost, useSession } from '@lens-protocol/react-web'
import {
  RecordedSession,
  useUploadDataToIpfsMutation
} from '../../../../graphql/generated'
import { v4 as uuid } from 'uuid'
import getUserLocale from '../../../../utils/getUserLocale'
import { video } from '@lens-protocol/metadata'
import { APP_ID, APP_LINK, defaultSponsored } from '../../../../utils/config'
import ModalWrapper from '../../../ui/Modal/ModalWrapper'
import EditIcon from '@mui/icons-material/Edit'
import getPublicationData from '../../../../utils/lib/getPublicationData'
import formatHandle from '../../../../utils/lib/formatHandle'
import { getThumbnailFromRecordingUrl } from '../../../../utils/lib/getThumbnailFromRecordingUrl'

const PostStreamAsVideo = ({
  publication,
  session
}: {
  publication: Post
  session: RecordedSession
}) => {
  // @ts-ignore
  const [content, setContent] = React.useState(
    getPublicationData(publication?.metadata)?.content
  )

  useEffect(() => {
    // @ts-ignore
    setContent(getPublicationData(publication?.metadata)?.content)
  }, [])
  const [open, setOpen] = useState(false)

  const { data: profile } = useSession()

  const { execute } = useCreatePost()

  const [uploadDataToIpfs] = useUploadDataToIpfsMutation()

  const createLensPost = async () => {
    // @ts-ignore
    const streamTitle = publication?.metadata?.title

    const id = uuid()
    const locale = getUserLocale()

    const metadata = video({
      // @ts-ignore
      title: streamTitle,
      // @ts-ignore
      content: streamTitle,
      marketplace: {
        name: streamTitle,
        description: streamTitle,
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
        // @ts-ignore
        type: 'video/mp4',
        // @ts-ignore
        altTag: streamTitle
      },
      appId: APP_ID,
      id: id,
      locale: locale
    })

    const { data: resultIpfs } = await uploadDataToIpfs({
      variables: {
        data: JSON.stringify(metadata)
      }
    })

    const cid = resultIpfs?.uploadDataToIpfs?.cid

    if (!cid) {
      throw new Error('Error uploading metadata to IPFS')
    }

    // invoke the `execute` function to create the post
    const result = await execute({
      metadata: `ipfs://${cid}`,
      sponsored: defaultSponsored
    })

    if (!result.isSuccess()) {
      toast.error(result.error.message)
      // handle failure scenarios
      throw new Error('Error creating post')
    }
  }

  const handleCreatePost = async () => {
    await toast.promise(createLensPost(), {
      pending: 'Creating Post...',
      success: 'Post Created',
      error: 'Error creating post'
    })

    setOpen(false)
  }

  return (
    <>
      <ModalWrapper
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        title="Post this stream recording as a Video"
        Icon={<EditIcon />}
        classname="w-[600px]"
        BotttomComponent={
          <div className="flex flex-row justify-end">
            {/* cancle button & save button */}
            <Button variant="text" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="text" onClick={handleCreatePost}>
              Post
            </Button>
          </div>
        }
      >
        <div className="flex flex-col space-y-4">
          <TextareaAutosize
            className="text-base text-p-text border-p-border outline-none bg-s-bg w-full font-normal font-sans leading-normal px-3 py-1.5 mb-0.5 rounded-xl "
            aria-label="empty textarea"
            placeholder="Post Content..."
            style={{
              resize: 'none',
              margin: 0
            }}
            maxRows={10}
            minRows={3}
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />

          <video
            src={session?.mp4Url?.toString()}
            controls
            className="rounded-xl"
          />
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
