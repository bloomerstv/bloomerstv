import {
  SessionType,
  useCreatePost,
  useSession
} from '@lens-protocol/react-web'
import {
  Button,
  IconButton,
  MenuItem,
  Select,
  TextareaAutosize,
  Tooltip
} from '@mui/material'
import React from 'react'
import EditNoteIcon from '@mui/icons-material/EditNote'
import ModalWrapper from '../../../ui/Modal/ModalWrapper'
import getAvatar from '../../../../utils/lib/getAvatar'
import formatHandle from '../../../../utils/lib/formatHandle'
import LoadingButton from '@mui/lab/LoadingButton'
import ImageIcon from '@mui/icons-material/Image'
import CloseIcon from '@mui/icons-material/Close'
import { v4 as uuid } from 'uuid'
import getUserLocale from '../../../../utils/getUserLocale'
import {
  CATEGORIES_LIST,
  getTagsForCategory
} from '../../../../utils/categories'
import { APP_ID, defaultSponsored } from '../../../../utils/config'
import uploadToIPFS from '../../../../utils/uploadToIPFS'
import { image, textOnly } from '@lens-protocol/metadata'
import { useUploadDataToArMutation } from '../../../../graphql/generated'
import toast from 'react-hot-toast'

const CreatePostButton = () => {
  const { data } = useSession()
  const [open, setOpen] = React.useState(false)
  const [content, setContent] = React.useState('')
  const fileInputRef = React.useRef(null)
  const [previewImageFile, setPreviewImageFile] = React.useState<File | null>(
    null
  )
  const [category, setCategory] = React.useState<string>('None')
  const [uploadDataToAR] = useUploadDataToArMutation()
  const { execute } = useCreatePost()
  const [loading, setLoading] = React.useState(false)

  const handleAddImageClick = () => {
    // Programmatically click the file input when the button is clicked
    if (!fileInputRef.current) return
    // @ts-ignore
    fileInputRef.current.click()
  }

  const handleFileChange = async (event) => {
    const files = event.target.files
    if (!files?.length) return

    const file = files[0]

    // get local file url link
    setPreviewImageFile(file)
  }

  const handleCreatePost = async () => {
    const id = uuid()
    const locale = getUserLocale()
    const tags = getTagsForCategory(category) || []

    const commonMetadata = {
      title: content.slice(0, 100),
      content: content,
      tags: tags,
      appId: APP_ID,
      id: id,
      locale: locale
    }

    const ipfsImage = previewImageFile
      ? await uploadToIPFS(previewImageFile)
      : null

    const metadata = ipfsImage
      ? image({
          ...commonMetadata,
          image: {
            item: ipfsImage.url,
            // @ts-ignore
            type: previewImageFile.type,
            altTag: content.slice(0, 100)
          },
          marketplace: {
            name: content.slice(0, 100),
            description: content,
            image: ipfsImage.url
          }
        })
      : textOnly({
          ...commonMetadata
        })

    const { data: arResult } = await uploadDataToAR({
      variables: {
        data: JSON.stringify(metadata)
      }
    })

    const transactionID = arResult?.uploadDataToAR

    if (!transactionID) {
      throw new Error('Error uploading metadata to IPFS')
    }

    const result = await execute({
      metadata: `ar://${transactionID}`,
      sponsored: defaultSponsored
    })

    if (!result.isSuccess()) {
      toast.error(result.error.message)
      // handle failure scenarios
      throw new Error('Error creating post')
    } else {
      setContent('')
      toast.success('Post created!')
      setOpen(false)
    }
  }

  if (data?.type !== SessionType.WithProfile) return null
  return (
    <>
      <Tooltip
        onClick={() => {
          setOpen(true)
        }}
        title="Create a Post"
      >
        <IconButton>
          <EditNoteIcon />
        </IconButton>
      </Tooltip>
      <ModalWrapper
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        title="Create a Post"
        Icon={<EditNoteIcon />}
        classname="w-[500px]"
        BotttomComponent={
          <div className="flex flex-row gap-x-3 justify-end">
            {/* cancle button & save button */}
            <Button variant="text" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <LoadingButton
              disabled={content.trim().length === 0 || loading}
              variant="contained"
              onClick={async () => {
                try {
                  setLoading(true)
                  await handleCreatePost()
                } catch (error) {
                  console.error('Error creating post', error)
                } finally {
                  setLoading(false)
                }
              }}
              loading={loading}
            >
              Post
            </LoadingButton>
          </div>
        }
      >
        <div className="flex flex-col gap-y-3 px-3 sm:px-0">
          <div className="start-center-row gap-x-3">
            <img
              src={getAvatar(data?.profile)}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <div className="font-bold">{formatHandle(data?.profile)}</div>
          </div>
          <TextareaAutosize
            className="text-base text-p-text resize-none border-none outline-none w-full font-semibold font-sans leading-normal"
            aria-label="empty textarea"
            placeholder="Write a message..."
            style={{
              resize: 'none'
            }}
            disabled={loading}
            minRows={1}
            maxRows={5}
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />

          <div className="start-center-row gap-x-3">
            <div className="text-s-text font-bold text-md">Category</div>
            <Select
              value={category}
              onChange={(e) => {
                if (!e.target.value) return
                setCategory(e.target.value as string)
              }}
              variant="standard"
              size="small"
              sx={{
                borderRadius: '100px'
              }}
            >
              {CATEGORIES_LIST.map((category) => (
                <MenuItem value={category} key={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </div>

          {previewImageFile ? (
            <div className="relative">
              <img
                src={URL.createObjectURL(previewImageFile)}
                alt="preview"
                className="w-full rounded-xl"
              />
              <div className="absolute top-2 right-2 bg-black/60 rounded-full">
                <IconButton
                  color="secondary"
                  size="small"
                  onClick={() => setPreviewImageFile(null)}
                >
                  <CloseIcon className="text-white rounded-full" />
                </IconButton>
              </div>
            </div>
          ) : (
            <div className="start-center-row gap-x-3">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }} // Hide the file input
                onChange={handleFileChange}
                accept="image/*" // Optional: limit the file chooser to only image files
              />
              <Button
                startIcon={<ImageIcon />}
                sx={{
                  textTransform: 'none'
                }}
                variant="text"
                color="inherit"
                onClick={handleAddImageClick}
              >
                Add a Image
              </Button>
            </div>
          )}
        </div>
      </ModalWrapper>
    </>
  )
}

export default CreatePostButton
