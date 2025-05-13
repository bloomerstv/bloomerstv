import {
  Button,
  MenuItem,
  Select,
  TextField,
  TextareaAutosize
} from '@mui/material'
import React, { useEffect, useState } from 'react'

import {
  RecordedSession,
  useCreateClipMutation,
  useCreateMyLensStreamSessionMutation
} from '../../../../graphql/generated'
import { v4 as uuid } from 'uuid'
import getUserLocale from '../../../../utils/getUserLocale'
import {
  MediaVideoMimeType,
  MetadataAttributeType,
  liveStream,
  video
} from '@lens-protocol/metadata'
import {
  APP_ID,
  APP_LINK,
  REDIRECTOR_URL,
  defaultSponsored
  // isMainnet
} from '../../../../utils/config'
import ModalWrapper from '../../../ui/Modal/ModalWrapper'
import formatHandle from '../../../../utils/lib/formatHandle'
import { getThumbnailFromRecordingUrl } from '../../../../utils/lib/getThumbnailFromRecordingUrl'
import VideoWithEditors from './VideoWithEditors'
import toast from 'react-hot-toast'
import { useStreamAsVideo } from '../../../store/useStreamAsVideo'
// import CollectSettingButton from '../../../common/Collect/CollectSettingButton'
// import useCollectSettings from '../../../common/Collect/useCollectSettings'
import {
  CATEGORIES_LIST,
  getTagsForCategory,
  getTagsForSymbol
} from '../../../../utils/categories'
// import { getThumbnailFromVideoUrl } from '../../../../utils/generateThumbnail'
// import uploadToIPFS from '../../../../utils/uploadToIPFS'
// import { VerifiedOpenActionModules } from '../../../../utils/verified-openaction-modules'
// import { encodeAbiParameters, type Address } from 'viem'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import Player from '../../../common/Player/Player'
import clsx from 'clsx'
import { useMyPreferences } from '../../../store/useMyPreferences'
import { Post, useCreatePost } from '@lens-protocol/react'
import useSession from '../../../../utils/hooks/useSession'
import { handleOperationWith } from '@lens-protocol/react/viem'
import { useWalletClient } from 'wagmi'
import { acl, storageClient } from '../../../../utils/lib/lens/storageClient'

const PostStreamAsVideo = ({
  post,
  session,
  modalTitle = 'Create Clip',
  Icon = <ContentCutIcon />,
  open = false,
  defaultMode = 'Clip',
  setNewPostId,
  setOpen
}: {
  post?: Post | null
  session: RecordedSession
  modalTitle?: string | null
  Icon?: React.ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  defaultMode?: 'Clip' | 'Video'
  setNewPostId: (id: string) => void
}) => {
  // const {
  //   type,
  //   amount,
  //   collectLimit,
  //   endsAt,
  //   followerOnly,
  //   recipients,
  //   referralFee,
  //   recipient
  // } = useCollectSettings()
  const [createMyLensStreamSession] = useCreateMyLensStreamSessionMutation({
    fetchPolicy: 'no-cache'
  })
  const { category, setCategory } = useMyPreferences((state) => {
    return {
      category: state.category,
      setCategory: state.setCategory
    }
  })
  // @ts-ignore
  const [content, setContent] = React.useState('')

  const [title, setTitle] = React.useState(
    // @ts-ignore
    publication?.metadata?.title ?? 'Untitled Video'
  )

  useEffect(() => {
    // @ts-ignore
    setTitle(
      // @ts-ignore
      publication?.metadata?.title ?? 'Untitled Video'
    )
    // @ts-ignore
  }, [publication?.metadata?.title])

  const { account, isAuthenticated } = useSession()

  const { data: walletClient } = useWalletClient()

  const { execute, error } = useCreatePost(handleOperationWith(walletClient))

  const [showVideoDescription, setShowVideoDescription] = useState(false)

  const startTime = useStreamAsVideo((state) => state.startTime)
  const endTime = useStreamAsVideo((state) => state.endTime)

  const [createClip] = useCreateClipMutation()

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  const createClipLensPost = async () => {
    if (!isAuthenticated) {
      toast.error('You need to login a profile to post')
      return
    }
    // @ts-ignore
    if (!title || title.trim().length === 0) {
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
      `clip-${formatHandle(account)}`,
      `sessionId-${session?.sessionId}`,
      ...getTagsForCategory(category)
      // ...getTagsForSymbol(
      //   type && amount?.asset?.symbol ? amount.asset.symbol : ''
      // )
    ]

    // const coverThumbnailFile = await getThumbnailFromVideoUrl(url!)

    // let coverImageUrl = ''

    // if (coverThumbnailFile) {
    //   const d = await uploadToIPFS(coverThumbnailFile)
    //   coverImageUrl = d?.url || ''
    // }

    const coverImageUrl = getThumbnailFromRecordingUrl(url!)

    const metadata = video({
      title: title,
      content: `${title}\n\n${content}`,
      video: {
        item: url!,
        cover: coverImageUrl,
        duration: Math.round(duration),
        type: MediaVideoMimeType.MP4,
        altTag: title
      },
      tags: tags,
      id: id,
      locale: locale
    })

    const response = await storageClient.uploadAsJson(metadata, {
      acl: acl,
      name: `clip-video-${formatHandle(account)}-${id}`
    })

    if (!response?.uri) {
      throw new Error('Error uploading metadata to Grove')
    }

    // invoke the `execute` function to create the post
    const result = await execute({
      contentUri: response.uri
    })

    if (result.isErr()) {
      toast.error(result.error.message)
      // handle failure scenarios
      throw new Error('Error creating post')
    }
  }

  const createVideoLensPost = async () => {
    try {
      if (!isAuthenticated) {
        toast.error('You need to login a profile to post')
        return
      }

      if (!title || title.trim().length === 0) {
        toast.error('Please enter a title')
        return
      }
      const sessionId = session?.sessionId
      const m3u8Url = `${REDIRECTOR_URL}/livestream?sessionId=${sessionId}&format=.m3u8`
      const mp4Url = `${REDIRECTOR_URL}/livestream?sessionId=${sessionId}&format=.mp4`
      const thumbnail = `${REDIRECTOR_URL}/livestream?sessionId=${sessionId}&format=.png`
      const duration = `${REDIRECTOR_URL}/livestream?sessionId=${sessionId}&format=seconds`

      const streamerHandle = formatHandle(account)
      const profileLink = `${APP_LINK}/${streamerHandle}`
      const id = uuid()
      const locale = getUserLocale()

      const metadataContent = `${title}\n\n${content}`

      const tags = [
        ...getTagsForCategory(category)
        // ...getTagsForSymbol(
        //   type && amount?.asset?.symbol ? amount.asset.symbol : ''
        // )
      ]

      const metadata = liveStream({
        title: title,
        content: metadataContent,
        attachments: [
          {
            type: MediaVideoMimeType.MP4,
            item: mp4Url,
            cover: thumbnail
          }
        ],
        attributes: [
          {
            key: 'livestream-duration',
            value: duration,
            type: MetadataAttributeType.STRING
          }
        ],
        id: id,
        locale: locale,
        liveUrl: m3u8Url,
        playbackUrl: m3u8Url,
        tags: tags,
        startsAt: new Date(session?.createdAt).toISOString()
      })

      const response = await storageClient.uploadAsJson(metadata, {
        acl: acl,
        name: `livestream-video-${formatHandle(account)}-${id}`
      })

      if (!response?.uri) {
        toast.error('Error uploading metadata to Arweave')
        throw new Error('Error uploading metadata to Arweave')
      }

      // let actions: OpenActionConfig[] | undefined = []

      // if (type) {
      //   actions = [
      //     // @ts-ignore
      //     {
      //       type,
      //       // @ts-ignore
      //       amount,
      //       collectLimit,
      //       endsAt,
      //       followerOnly,
      //       referralFee: amount ? referralFee : undefined
      //     }
      //   ]

      //   if (type === OpenActionType.MULTIRECIPIENT_COLLECT) {
      //     // @ts-ignore
      //     actions[0]['recipients'] = recipients
      //   }
      //   if (type === OpenActionType.SIMPLE_COLLECT) {
      //     // @ts-ignore
      //     actions[0]['recipient'] = recipient
      //   }
      // }

      const result = await execute({
        contentUri: response.uri
      })

      if (result.isErr()) {
        toast.error(result.error.message)
        throw new Error('Error creating post')
      }

      const post = result.value
      const postId = post?.id

      if (!postId) {
        throw new Error('Error creating post')
      }

      setNewPostId(postId)

      const { data: lensStreamSessionResult, errors: lensStreamSessionErrors } =
        await createMyLensStreamSession({
          variables: {
            postId: postId,
            sessionId: sessionId
          },
          fetchPolicy: 'no-cache'
        })

      if (
        lensStreamSessionErrors?.[0] &&
        !lensStreamSessionResult?.createMyLensStreamSession
      ) {
        toast.error(
          lensStreamSessionErrors?.[0]?.message || 'Error attaching post'
        )

        throw new Error('Error attaching post to stream')
      }
    } catch (e) {
      // @ts-ignore
      toast.error(e?.message || e)
      throw new Error('Error creating post')
    }
  }

  const handleCreatePost = async () => {
    if (defaultMode === 'Clip') {
      setOpen(false)

      await toast.promise(createClipLensPost(), {
        loading: 'Creating Post...',
        success: 'Post Created',
        error: 'Error creating post'
      })
    } else {
      if (post?.id && !post?.isDeleted) {
        toast.error('Lens Post already created for this video')
      } else {
        setOpen(false)

        await toast.promise(createVideoLensPost(), {
          loading: 'Creating Post...',
          success: 'Post Created',
          error: 'Error creating post'
        })
      }
    }
  }

  return (
    <>
      <ModalWrapper
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        title={modalTitle!}
        Icon={Icon}
        classname={clsx(
          'max-h-[80vh]',
          defaultMode === 'Clip' ? 'w-[80vw]' : 'w-[40vw]'
        )}
        BotttomComponent={
          <div className="flex flex-row justify-end">
            {/* cancle button & save button */}
            <Button variant="text" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="text"
              onClick={handleCreatePost}
              disabled={!title || title.trim().length === 0}
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
            {/* <div className="space-y-1">
              <div className="text-s-text font-bold text-md">
                Collect Preview
              </div>
              <CollectSettingButton />
            </div> */}
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
            {open && defaultMode === 'Clip' && (
              <VideoWithEditors recordingUrl={session?.recordingUrl!} />
            )}
            {open && defaultMode === 'Video' && session?.recordingUrl && (
              <Player
                src={session?.recordingUrl}
                showPipButton={false}
                autoHide={0}
              />
            )}
          </div>
        </div>
      </ModalWrapper>
    </>
  )
}

export default PostStreamAsVideo
