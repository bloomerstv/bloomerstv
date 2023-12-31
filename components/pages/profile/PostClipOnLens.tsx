import React from 'react'
import ModalWrapper from '../../ui/Modal/ModalWrapper'
import EditIcon from '@mui/icons-material/Edit'
import { Button, TextField } from '@mui/material'
import Video from '../../common/Video'
import { v4 as uuid } from 'uuid'
import getUserLocale from '../../../utils/getUserLocale'
import { MediaVideoMimeType, shortVideo } from '@lens-protocol/metadata'
import { Profile, useCreatePost } from '@lens-protocol/react-web'
import { getThumbnailFromRecordingUrl } from '../../../utils/lib/getThumbnailFromRecordingUrl'
import { APP_ID, APP_LINK, defaultSponsored } from '../../../utils/config'
import { useUploadDataToIpfsMutation } from '../../../graphql/generated'
import formatHandle from '../../../utils/lib/formatHandle'
import toast from 'react-hot-toast'

const PostClipOnLens = ({
  open,
  setOpen,
  url,
  profile
}: {
  open: boolean
  setOpen: (open: boolean) => void
  url: string
  profile?: Profile
}) => {
  const [title, setTitle] = React.useState(
    `Clip from @${profile?.handle?.fullHandle} 's stream`
  )
  const { execute } = useCreatePost()

  const [uploadDataToIpfs] = useUploadDataToIpfsMutation()

  const createLensPost = async () => {
    // @ts-ignore
    if (title.trim().length === 0) {
      toast.error('Please enter a title')
      return
    }

    const id = uuid()
    const locale = getUserLocale()

    const metadata = shortVideo({
      title: title,
      content: title,
      marketplace: {
        name: title,
        description: title,
        external_url: APP_LINK,
        animation_url: url,
        image: getThumbnailFromRecordingUrl(url)
      },
      video: {
        item: url,
        cover: getThumbnailFromRecordingUrl(url),
        duration: 30,
        type: MediaVideoMimeType.MP4,
        altTag: title
      },
      tags: [`clip-${formatHandle(profile)}`],
      appId: APP_ID,
      id,
      locale
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
    setOpen(false)

    await toast.promise(createLensPost(), {
      error: 'Error creating post',
      loading: 'Creating post for clip...',
      success: 'Post created!'
    })
  }

  return (
    <>
      <ModalWrapper
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        title="Post Clip on Lens"
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
        <div className="flex flex-col gap-y-4 px-3 sm:px-0">
          <TextField
            label="Clip Title"
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

          <div className="rounded-md overflow-hidden">
            <Video src={url} autoPlay={false} showPipButton={false} />
          </div>
        </div>
      </ModalWrapper>
    </>
  )
}

export default PostClipOnLens
