import React from 'react'
import ModalWrapper from '../../ui/Modal/ModalWrapper'
import EditIcon from '@mui/icons-material/Edit'
import { Button, MenuItem, Select, TextField } from '@mui/material'
import { v4 as uuid } from 'uuid'
import getUserLocale from '../../../utils/getUserLocale'
import { MediaVideoMimeType, shortVideo } from '@lens-protocol/metadata'
import formatHandle from '../../../utils/lib/formatHandle'
import toast from 'react-hot-toast'
import { CATEGORIES_LIST, getTagsForCategory } from '../../../utils/categories'
import { useMyPreferences } from '../../store/useMyPreferences'
import { getThumbnailFromRecordingUrl } from '../../../utils/lib/getThumbnailFromRecordingUrl'
import { usePostsStore } from '../../store/usePosts'
import { Account, useCreatePost } from '@lens-protocol/react'
import useSession from '../../../utils/hooks/useSession'
import { handleOperationWith } from '@lens-protocol/react/viem'
import { useWalletClient } from 'wagmi'
import { acl, storageClient } from '../../../utils/lib/lens/storageClient'

const PostClipOnLens = ({
  open,
  setOpen,
  url,
  account,
  sessionId
}: {
  open: boolean
  setOpen: (open: boolean) => void
  url: string
  account?: Account
  sessionId?: string | null
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
  const setClipPost = usePostsStore((state) => state.setClipPost)
  const { isAuthenticated } = useSession()
  const { category, setCategory } = useMyPreferences((state) => {
    return {
      category: state.category,
      setCategory: state.setCategory
    }
  })
  const [title, setTitle] = React.useState(
    `Clip from @${account?.username?.value} 's stream`
  )
  const { data: walletClient } = useWalletClient()
  const { execute } = useCreatePost(handleOperationWith(walletClient))

  const createLensPost = async () => {
    // @ts-ignore
    if (title.trim().length === 0) {
      toast.error('Please enter a title')
      return
    }

    if (!isAuthenticated) {
      toast.error('Please login to create a post')
      return
    }

    const id = uuid()
    const locale = getUserLocale()

    // generate thumbnail from video

    const tags = [
      `clip-${formatHandle(account)}`,
      ...getTagsForCategory(category)
    ]
    if (sessionId) {
      tags.push(`sessionId-${sessionId}`)
    }

    // const coverThumbnailFile = await getThumbnailFromVideoUrl(url)

    // let coverImageUrl = ''

    // if (coverThumbnailFile) {
    //   const d = await uploadToIPFS(coverThumbnailFile)
    //   coverImageUrl = d?.url || ''
    // }

    const coverImageUrl = getThumbnailFromRecordingUrl(url!)

    const metadata = shortVideo({
      title: title,
      content: title,
      video: {
        item: url,
        cover: coverImageUrl,
        duration: 30,
        type: MediaVideoMimeType.MP4,
        altTag: title
      },
      tags: tags,
      id,
      locale
    })

    const response = await storageClient.uploadAsJson(metadata, {
      acl: acl,
      name: `clip-${formatHandle(account)}-${id}`
    })

    if (!response?.uri) {
      throw new Error('Error uploading metadata to AR')
    }

    // let actions: OpenActionConfig[] | undefined = undefined

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

    // if (isMainnet) {
    //   actions?.push({
    //     type: OpenActionType.UNKNOWN_OPEN_ACTION,
    //     address: VerifiedOpenActionModules.Tip,
    //     // @ts-ignore
    //     data: encodeAbiParameters(
    //       [{ name: 'tipReceiver', type: 'address' }],
    //       [data?.profile?.handle?.ownedBy as Address]
    //     )
    //   })
    // }

    // invoke the `execute` function to create the post
    const result = await execute({
      contentUri: response.uri
      // actions: actions
    })

    if (result.isErr()) {
      toast.error(result.error.message)
      // handle failure scenarios
      throw new Error('Error creating post')
    }

    if (result?.isOk()) {
      setClipPost(result?.value)
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
        keepOpenOnBgClick
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

          {/* <div className="space-y-1">
            <div className="text-sm font-semibold text-s-text">
              Collect Settings
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

          <video
            controls
            src={url}
            className="w-full rounded-xl"
            autoPlay
            muted
          />
        </div>
      </ModalWrapper>
    </>
  )
}

export default PostClipOnLens
