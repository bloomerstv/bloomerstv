import {
  OpenActionConfig,
  OpenActionType,
  SessionType,
  useCreatePost,
  useCreateQuote,
  useSession
} from '@lens-protocol/react-web'
import {
  Button,
  IconButton,
  MenuItem,
  Select,
  TextField,
  TextareaAutosize
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
import { APP_ID, APP_LINK, defaultSponsored } from '../../../../utils/config'
import uploadToIPFS from '../../../../utils/uploadToIPFS'
import {
  MediaImageMimeType,
  MediaVideoMimeType,
  image,
  textOnly,
  video
} from '@lens-protocol/metadata'
import { useUploadDataToArMutation } from '../../../../graphql/generated'
import toast from 'react-hot-toast'
import useIsMobile from '../../../../utils/hooks/useIsMobile'
import CollectSettingButton from '../../../common/Collect/CollectSettingButton'
import useCollectSettings from '../../../common/Collect/useCollectSettings'
import VideocamIcon from '@mui/icons-material/Videocam'
import { generateVideoThumbnails } from '../../../../utils/generateThumbnail'
import clsx from 'clsx'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { getVideoDuration } from '../../../../utils/getVideoDuration'
import { getFileFromDataURL } from '../../../../utils/getImageFileFromDataURL'
import { stringToLength } from '../../../../utils/stringToLength'
import EditIcon from '@mui/icons-material/Edit'

interface previewFileType {
  url: string
  file: File
}
const CreatePostPopUp = ({
  open,
  setOpen,
  quoteOn,
  quotingTitle,
  quotingOnProfileHandle
}: {
  open: boolean
  setOpen: (open: boolean) => void
  quoteOn?: string
  quotingTitle?: string
  quotingOnProfileHandle?: string
}) => {
  const { data } = useSession()
  const [content, setContent] = React.useState('')
  const imageFileInputRef = React.useRef(null)
  const videoFileInputRef = React.useRef(null)
  const [previewImageFile, setPreviewImageFile] =
    React.useState<previewFileType | null>(null)
  const [previewVideoFile, setPreviewVideoFile] =
    React.useState<previewFileType | null>(null)
  const [videoTitle, setVideoTitle] = React.useState<string>('')
  const [videoProgress, setVideoProgress] = React.useState<number>(0)

  const [previewCustomThumbnail, setPreviewCustomThumbnail] =
    React.useState<previewFileType | null>(null)
  const [generatedThumbnails, setGeneratedThumbnails] = React.useState<
    string[]
  >([])
  // 0, 1, ... onwards for generated thumbnails & -1 for custom thumbnail
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] =
    React.useState<number>(0)

  const [category, setCategory] = React.useState<string>('None')
  const [uploadDataToAR] = useUploadDataToArMutation()
  const { execute: createPost } = useCreatePost()
  const { execute: createQuote } = useCreateQuote()
  const [loading, setLoading] = React.useState(false)
  const isMobile = useIsMobile()
  const {
    type,
    amount,
    collectLimit,
    endsAt,
    followerOnly,
    recipients,
    referralFee,
    recipient
  } = useCollectSettings()

  const mediaImageMimeTypes = Object.values(MediaImageMimeType)
  const mediaVideoMimeTypes = Object.values(MediaVideoMimeType)

  const handleImageFileChange = async (event) => {
    const files = event.target.files
    if (!files?.length) return

    const file = files[0]

    // check if file type is in mediaImageMimeTypes
    if (!mediaImageMimeTypes.includes(file.type)) {
      toast.error('Invalid image file type. Please upload a valid image file')
      return
    }

    if (previewVideoFile) {
      setPreviewCustomThumbnail({
        file,
        url: URL.createObjectURL(file)
      })
      return
    }

    setPreviewVideoFile(null)
    setPreviewCustomThumbnail(null)
    setSelectedThumbnailIndex(0)

    // get local file url link
    const url = URL.createObjectURL(file)
    setPreviewImageFile({
      url,
      file
    })
  }

  const handleVideoFileChange = async (event) => {
    const files = event.target.files
    if (!files?.length) return

    const file = files[0]

    // check if file type is in mediaVideoMimeTypes
    if (!mediaVideoMimeTypes.includes(file.type)) {
      toast.error('Invalid video file type. Please upload a valid video file')
      return
    }

    // size should be less than 500MB
    if (file.size > 500 * 1024 * 1024) {
      toast.error('Video file size should be less than 500MB')
      return
    }

    setPreviewImageFile(null)

    // get local file url link
    const url = URL.createObjectURL(file)

    setPreviewVideoFile({
      url,
      file
    })

    const thumbnails = await generateVideoThumbnails(file, 4)

    setGeneratedThumbnails(thumbnails)
  }

  const handleCreatePost = async () => {
    const id = uuid()
    const locale = getUserLocale()
    const tags = getTagsForCategory(category) || []

    const commonMetadata = {
      title: videoTitle ? videoTitle : content.slice(0, 100),
      content: videoTitle ? `${videoTitle}\n${content}` : content,
      tags: tags,
      appId: APP_ID,
      id: id,
      locale: locale
    }

    const isVideo = !!previewVideoFile
    const isImage = !!previewImageFile && !isVideo

    let imageFile = previewImageFile?.file || null
    let imageMimeType = previewImageFile?.file.type

    if (isVideo) {
      if (selectedThumbnailIndex === -1 && previewCustomThumbnail) {
        imageFile = previewCustomThumbnail.file
        imageMimeType = previewCustomThumbnail.file.type
      } else {
        imageFile = await getFileFromDataURL(
          generatedThumbnails[selectedThumbnailIndex],
          'thumbnail.jpeg'
        )
        imageMimeType = MediaImageMimeType.JPEG
      }
    }

    const ipfsImage = imageFile ? await uploadToIPFS(imageFile) : null

    const ipfsVideo = isVideo
      ? await uploadToIPFS(previewVideoFile.file, (progress) => {
          console.log('progress: ', progress)
          setVideoProgress(progress)
        })
      : null
    const duration = isVideo
      ? await getVideoDuration(previewVideoFile.url).then((num) =>
          Math.round(num)
        )
      : 0

    const metadata = isVideo
      ? video({
          ...commonMetadata,
          marketplace: {
            name: videoTitle,
            description: videoTitle + '\n' + content,
            external_url: APP_LINK,
            animation_url: previewVideoFile.url,
            image: ipfsImage?.url!
          },
          video: {
            item: ipfsVideo?.url!,
            cover: ipfsImage?.url,
            duration: duration,
            // @ts-ignore
            type: previewVideoFile.file.type
          }
        })
      : isImage
        ? image({
            ...commonMetadata,
            image: {
              item: ipfsImage?.url!,
              // @ts-ignore
              type: imageMimeType,
              altTag: content.slice(0, 100)
            },
            marketplace: {
              name: content.slice(0, 100),
              description: content,
              image: ipfsImage?.url!
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

    let actions: OpenActionConfig[] | undefined = undefined

    if (type) {
      actions = [
        {
          type,
          // @ts-ignore
          amount,
          collectLimit,
          endsAt,
          followerOnly,
          referralFee: amount ? referralFee : undefined
        }
      ]

      if (type === OpenActionType.MULTIRECIPIENT_COLLECT) {
        // @ts-ignore
        actions[0]['recipients'] = recipients
      }

      if (type === OpenActionType.SIMPLE_COLLECT) {
        // @ts-ignore
        actions[0]['recipient'] = recipient
      }
    }

    if (!transactionID) {
      throw new Error('Error uploading metadata to IPFS')
    }

    const result = quoteOn
      ? await createQuote({
          metadata: `ar://${transactionID}`,
          // @ts-ignore
          quoteOn: quoteOn,
          sponsored: defaultSponsored,
          actions: actions
        })
      : await createPost({
          metadata: `ar://${transactionID}`,
          sponsored: defaultSponsored,
          actions: actions
        })

    if (!result.isSuccess()) {
      toast.error(result.error.message)
      // handle failure scenarios
      throw new Error('Error creating post')
    } else {
      setLoading(false)
      toast.success('Post created!')
      setOpen(false)
      setContent('')
      setPreviewImageFile(null)
      setPreviewCustomThumbnail(null)
      setPreviewVideoFile(null)
      setGeneratedThumbnails([])
      setSelectedThumbnailIndex(0)
    }
  }

  if (data?.type !== SessionType.WithProfile) return null
  return (
    <>
      <ModalWrapper
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        title="Create a Post"
        Icon={<EditNoteIcon />}
        classname="w-[600px]"
        BotttomComponent={
          <div className="flex flex-row gap-x-3 justify-end">
            {/* cancle button & save button */}
            <Button
              variant="text"
              onClick={() => setOpen(false)}
              size={isMobile ? 'small' : 'medium'}
            >
              Cancel
            </Button>
            <LoadingButton
              disabled={
                (!previewVideoFile && content.trim().length === 0) ||
                (previewVideoFile && videoTitle.trim().length === 0) ||
                loading
              }
              startIcon={<EditIcon />}
              variant="contained"
              size={isMobile ? 'small' : 'medium'}
              onClick={async () => {
                try {
                  setLoading(true)
                  await handleCreatePost()
                } catch (error) {
                  toast.error('Error creating post')
                  console.error('Error creating post', error)
                } finally {
                  setLoading(false)
                }
              }}
              loading={loading}
              loadingPosition="start"
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
          {previewVideoFile && (
            <TextField
              label="Video Title"
              variant="outlined"
              onChange={(e) => setVideoTitle(e.target.value)}
              value={videoTitle}
              inputProps={{
                maxLength: 100
              }}
              disabled={loading}
              size="small"
              helperText={`${100 - videoTitle.length} / 100 characters remaining`}
            />
          )}
          <TextareaAutosize
            className={clsx(
              'text-base bg-s-bg  resize-none border-none outline-none w-full font-semibold font-sans leading-normal',
              loading ? 'text-s-text' : 'text-p-text'
            )}
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

          <input
            type="file"
            ref={imageFileInputRef}
            style={{ display: 'none' }} // Hide the file input
            onChange={handleImageFileChange}
            accept="image/*" // Optional: limit the file chooser to only image files
          />
          {previewImageFile || previewVideoFile ? (
            <div className="relative">
              {previewImageFile && (
                <img
                  src={previewImageFile.url}
                  alt="preview"
                  className="w-full rounded-xl"
                />
              )}

              {previewVideoFile && (
                <>
                  <video
                    src={previewVideoFile.url}
                    controls
                    className="w-full rounded-xl"
                  />
                  <div
                    className={clsx(
                      'flex flex-row flex-wrap gap-2 py-2',
                      loading && 'hidden'
                    )}
                  >
                    {/* upload custom thumbnail */}
                    <div
                      className="h-[90px] centered-col text-center w-[160px] bg-p-hover rounded-xl cursor-pointer"
                      onClick={() => {
                        // Programmatically click the file input when the button is clicked
                        if (!imageFileInputRef.current) return
                        // @ts-ignore
                        imageFileInputRef.current.click()
                      }}
                    >
                      <div className="space-y-2">
                        <div className="centered-row gap-x-1  text-xs">
                          <FileUploadIcon fontSize="inherit" />
                          <div className="text-s-text font-semibold">
                            Choose Thumbnail
                          </div>
                        </div>
                        <div className="text-xs text-s-text">
                          Click to upload a custom thumbnail
                        </div>
                      </div>
                    </div>

                    {previewCustomThumbnail && (
                      <div className="relative">
                        <img
                          src={previewCustomThumbnail.url}
                          alt="thumbnail"
                          className={clsx(
                            'h-[90px] rounded-xl unselectable cursor-pointer'
                          )}
                          onClick={() => setSelectedThumbnailIndex(-1)}
                        />
                        {selectedThumbnailIndex === -1 && (
                          <div
                            className="absolute shadow-inner z-30 top-0 right-0 left-0 right-0 h-[90px] w-full rounded-xl"
                            style={{
                              border: '4px solid #1976d2'
                            }}
                          />
                        )}
                      </div>
                    )}
                    {generatedThumbnails.map((thumbnail, index) => (
                      <div key={index} className="relative">
                        <img
                          src={thumbnail}
                          alt="thumbnail"
                          className={clsx(
                            'h-[90px] unselectable rounded-xl cursor-pointer'
                          )}
                          onClick={() => setSelectedThumbnailIndex(index)}
                        />
                        {selectedThumbnailIndex === index && (
                          <div
                            className="absolute shadow-inner z-30 top-0 right-0 left-0 right-0 h-[90px] w-full rounded-xl"
                            style={{
                              border: '4px solid #1976d2'
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div
                className={clsx(
                  'absolute top-2 right-2 bg-black/60',
                  loading ? 'rounded-sm' : 'rounded-full'
                )}
              >
                {!loading && (
                  <IconButton
                    color="secondary"
                    size="small"
                    onClick={() => {
                      setPreviewImageFile(null)
                      setPreviewVideoFile(null)
                      setPreviewCustomThumbnail(null)
                      setSelectedThumbnailIndex(0)
                    }}
                    disabled={loading}
                  >
                    <CloseIcon className="text-white rounded-full" />
                  </IconButton>
                )}
                {loading && previewVideoFile && (
                  // show loading with percentage
                  <div className="text-white rounded-full p-2 px-3 font-semibold">
                    {videoProgress}%
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="start-center-row gap-x-3">
              <Button
                startIcon={<ImageIcon />}
                sx={{
                  textTransform: 'none'
                }}
                variant="text"
                color="inherit"
                onClick={() => {
                  // Programmatically click the file input when the button is clicked
                  if (!imageFileInputRef.current) return
                  // @ts-ignore
                  imageFileInputRef.current.click()
                }}
              >
                Image
              </Button>

              <input
                type="file"
                ref={videoFileInputRef}
                style={{ display: 'none' }} // Hide the file input
                onChange={handleVideoFileChange}
                accept="video/*" // Optional: limit the file chooser to only video files
              />

              {/* video button */}
              <Button
                startIcon={<VideocamIcon />}
                sx={{
                  textTransform: 'none'
                }}
                variant="text"
                color="inherit"
                onClick={() => {
                  // Programmatically click the file input when the button is clicked
                  if (!videoFileInputRef.current) return
                  // @ts-ignore
                  videoFileInputRef.current.click()
                }}
              >
                Video
              </Button>
            </div>
          )}

          {quoteOn && quotingTitle && (
            <div className="bg-p-hover text-sm p-2 rounded-lg">
              <div>
                Quoting a post by{' '}
                <span className="text-brand">{quotingOnProfileHandle}</span>
              </div>
              <div className="font-semibold">
                {stringToLength(quotingTitle, 50)}
              </div>
            </div>
          )}

          <div className="start-row gap-x-4 sm:gap-x-10 w-full overflow-auto no-scrollbar">
            <div className="start-col gap-y-1 w-fit shrink-0">
              <div className="text-s-text font-semibold text-sm">
                Collect Preview
              </div>
              <CollectSettingButton disabled={loading} />
            </div>

            <div className="start-col gap-y-1 w-fit">
              <div className="text-s-text font-semibold text-sm">Category</div>
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
                disabled={loading}
              >
                {CATEGORIES_LIST.map((category) => (
                  <MenuItem value={category} key={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </ModalWrapper>
    </>
  )
}

export default CreatePostPopUp
