import React from 'react'
import getAvatar from '../../../utils/lib/getAvatar'
import { IconButton } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { v4 as uuid } from 'uuid'
import getUserLocale from '../../../utils/getUserLocale'
import { textOnly } from '@lens-protocol/metadata'
import { NewComment } from './CommentSection'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import useSession from '../../../utils/hooks/useSession'
import { useCreatePost } from '@lens-protocol/react'
import { handleOperationWith } from '@lens-protocol/react/viem'
import { useWalletClient } from 'wagmi'
import { acl, storageClient } from '../../../utils/lib/lens/storageClient'

const CreateCommentRow = ({
  commentOn,
  onCommentCreated,
  className
}: {
  commentOn: any
  onCommentCreated: (comment: NewComment) => void
  className?: string
}) => {
  const { isAuthenticated, account: sessionAccount } = useSession()
  const [content, setContent] = React.useState('')
  const { data: walletClient } = useWalletClient()
  const { execute } = useCreatePost({
    handler: handleOperationWith(walletClient)
  })
  const [creating, setCreating] = React.useState(false)

  const sendComment = async () => {
    try {
      setCreating(true)
      const id = uuid()
      const locale = getUserLocale()

      const metadata = textOnly({
        content: content,
        id: id,
        locale: locale
      })

      const response = await storageClient.uploadAsJson(metadata, {
        acl: acl,
        name: `comment-${id}`
      })

      if (!response?.uri) {
        throw new Error('Error uploading metadata to Grove')
      }

      // invoke the `execute` function to create the post
      const result = await execute({
        contentUri: response.uri,
        commentOn: {
          post: commentOn
        }
      })

      if (!result.isOk()) {
        toast.error(result.error.message)
        // handle failure scenarios
        throw new Error('Error creating post')
      }

      onCommentCreated({
        author: sessionAccount!,
        metadata: {
          content: content
        }
      })
      setContent('')
    } catch (e) {
      toast.error(String(e))
    } finally {
      setCreating(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }
  return (
    <div
      className={clsx(
        'start-center-row w-full gap-x-2 pl-2.5 py-2.5',
        className
      )}
    >
      <img src={getAvatar(sessionAccount)} className="w-8 h-8 rounded-full" />
      <div className="border border-p-border rounded-lg overflow-hidden w-full">
        <input
          className={clsx(
            'flex-1 p-2 sm:px-4 w-full outline-none rounded-lg border-0 bg-s-bg ',
            creating ? 'text-s-text' : 'text-p-text'
          )}
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === 'Enter' && content?.trim().length > 0) {
              await sendComment()
            }
          }}
          disabled={creating}
        />
      </div>
      <IconButton
        onClick={sendComment}
        className=" rounded-full"
        size="small"
        disabled={content?.trim().length === 0 || creating}
      >
        <SendIcon />
      </IconButton>
    </div>
  )
}

export default CreateCommentRow
