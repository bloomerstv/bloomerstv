import {
  Button,
  MenuItem,
  Select,
  TextField,
  TextareaAutosize
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import CreateIcon from '@mui/icons-material/Create'
import {
  OpenActionConfig,
  OpenActionType,
  Post,
  SessionType,
  useCreatePost,
  useSession
} from '@lens-protocol/react-web'
import {
  RecordedSession,
  useCreateClipMutation,
  useUploadDataToArMutation
} from '../../../../graphql/generated'
import { v4 as uuid } from 'uuid'
import getUserLocale from '../../../../utils/getUserLocale'
import { MediaVideoMimeType, video } from '@lens-protocol/metadata'
import {
  APP_ID,
  APP_LINK,
  defaultSponsored
  // isMainnet
} from '../../../../utils/config'
import ModalWrapper from '../../../ui/Modal/ModalWrapper'
import EditIcon from '@mui/icons-material/Edit'
import formatHandle from '../../../../utils/lib/formatHandle'
// import { getThumbnailFromRecordingUrl } from '../../../../utils/lib/getThumbnailFromRecordingUrl'
import VideoWithEditors from './VideoWithEditors'
import toast from 'react-hot-toast'
import { useStreamAsVideo } from '../../../store/useStreamAsVideo'
import CollectSettingButton from '../../../common/Collect/CollectSettingButton'
import useCollectSettings from '../../../common/Collect/useCollectSettings'
import {
  CATEGORIES_LIST,
  getTagsForCategory
} from '../../../../utils/categories'
import { getThumbnailFromVideoUrl } from '../../../../utils/generateThumbnail'
import uploadToIPFS from '../../../../utils/uploadToIPFS'
// import { VerifiedOpenActionModules } from '../../../../utils/verified-openaction-modules'
// import { encodeAbiParameters, type Address } from 'viem'

const PostStreamAsVideo = ({
  publication,
  session
}: {
  publication: Post
  session: RecordedSession
}) => {
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

  const [category, setCategory] = useState<string>('Gaming')
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

  const { execute, error } = useCreatePost()

  const [uploadDataToAR] = useUploadDataToArMutation()

  const [showVideoDescription, setShowVideoDescription] = useState(false)

  const startTime = useStreamAsVideo((state) => state.startTime)
  const endTime = useStreamAsVideo((state) => state.endTime)

  const [createClip] = useCreateClipMutation()

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  const createLensPost = async () => {
    if (profile?.type !== SessionType.WithProfile) {
      toast.error('You need to login a profile to post')
      return
    }
    // @ts-ignore
    if (title.trim().length === 0) {
      toast.error('Please enter a title')
      return
    }

    let url = session?.mp4Url
    let duration = session?.sourceSegmentsDuration as number

    // create clip if applicable and set as

    const timeDiffernce = endTime - startTime

    // if difference time difference is 0 (which means, its unmoved) or the difference between timeDifference and duration is less than 5 seconds, then we can use the original video

    if (timeDiffernce !== 0 && Math.abs(timeDiffernce - duration) > 5) {
      // create clip

      const startTimeinMs = Math.floor(startTime * 1000)
      const endTimeinMs = Math.floor(endTime * 1000)
      const startEpochTime = session?.createdAt + startTimeinMs
      const endEpochTime = session?.createdAt + endTimeinMs

      const result = await toast.promise(
        createClip({
          variables: {
            playbackId: session?.playbackId as string,
            startTime: startEpochTime,
            endTime: endEpochTime,
            name: title,
            sessionId: session?.sessionId as string
          }
        }),
        {
          error: 'Error processing clip',
          loading:
            'Processing clip... (this may take a few minutes, the longer the clip, the longer it will take to process)',
          success: 'Clip processed!'
        }
      )

      if (result?.data?.createClip?.downloadUrl) {
        url = result?.data?.createClip?.downloadUrl
        duration = Math.round(timeDiffernce)
      } else {
        toast.error('Something went wrong creating clip')
        return
      }
    }

    // return

    const id = uuid()
    const locale = getUserLocale()
    const tags = [
      `clip-${formatHandle(profile?.profile)}`,
      `sessionId-${session?.sessionId}`,
      ...getTagsForCategory(category)
    ]

    const coverThumbnailFile = await getThumbnailFromVideoUrl(url!)

    let ipfsImageUrl = ''

    if (coverThumbnailFile) {
      const d = await uploadToIPFS(coverThumbnailFile)
      ipfsImageUrl = d?.url || ''
    }

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
        animation_url: url,
        // @ts-ignore
        image: ipfsImageUrl
      },
      video: {
        // @ts-ignore
        item: url,
        // @ts-ignore
        cover: ipfsImageUrl,
        // @ts-ignore
        duration: Math.round(duration),
        type: MediaVideoMimeType.MP4,
        // @ts-ignore
        altTag: title
      },
      tags: tags,
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

    // if (isMainnet) {
    //   actions?.push({
    //     type: OpenActionType.UNKNOWN_OPEN_ACTION,
    //     address: VerifiedOpenActionModules.Tip,
    //     // @ts-ignore
    //     data: encodeAbiParameters(
    //       [{ name: 'tipReceiver', type: 'address' }],
    //       [profile?.profile?.handle?.ownedBy as Address]
    //     )
    //   })
    // }

    // invoke the `execute` function to create the post
    const result = await execute({
      metadata: `ar://${transactionID}`,
      sponsored: defaultSponsored,
      actions: actions
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
        classname="w-[60vw] h-[80vh] max-h-[80vh]"
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
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-row items-start gap-x-8">
            <TextField
              label="Video Title"
              variant="outlined"
              size="small"
              className="w-full"
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
          </div>

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

          <div className="start-row gap-x-10 px-1 pb-1">
            <div className="space-y-1">
              <div className="text-s-text font-bold text-md">
                Collect Preview
              </div>
              <CollectSettingButton />
            </div>
            <div className="space-y-1">
              <div className="text-s-text font-bold text-md">Category</div>
              <Select
                value={category}
                onChange={(e) => {
                  if (!e.target.value) return
                  setCategory(e.target.value as string)
                }}
                variant="outlined"
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
          </div>

          <div className="rounded-md overflow-hidden">
            {open && (
              <VideoWithEditors
                recordingUrl={session?.recordingUrl!}
                src={session?.mp4Url?.toString()!}
              />
            )}
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
