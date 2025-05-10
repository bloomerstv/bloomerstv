import { Button } from '@mui/material'
import React, { useState } from 'react'
import CommentIcon from '@mui/icons-material/Comment'
import ModalWrapper from '../../ui/Modal/ModalWrapper'
import CommentSection from './CommentSection'
import { AnyPost } from '@lens-protocol/react'

const MobileCommentButton = ({ post }: { post: AnyPost }) => {
  const [open, setOpen] = useState(false)
  const [heightOfChat, setHeightOfChat] = useState<string>('500')

  const getHeightOfChat = () => {
    // get the width of the screen in px
    const width = window.innerWidth

    const heightOfLiveVideo = width * (9 / 16)

    const heightOfChat = window.innerHeight - heightOfLiveVideo - 30

    return heightOfChat.toFixed(0)
  }

  React.useEffect(() => {
    setHeightOfChat(getHeightOfChat())
  }, [])

  if (post.__typename === 'Repost') return null

  return (
    <>
      <Button
        size="small"
        color="secondary"
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
          borderRadius: '20px',
          boxShadow: 'none'
        }}
        className="shrink-0"
        startIcon={<CommentIcon />}
      >
        Commments
      </Button>
      <ModalWrapper
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        hideBackdrop
      >
        <div
          style={{ height: `${heightOfChat}px` }}
          className="w-screen overflow-y-auto"
        >
          <div className="text-lg font-semibold px-3 py-1 border-b border-p-border">
            {`${post?.stats?.comments} Comment${post?.stats?.comments > 1 ? 's' : ''}`}
          </div>
          <CommentSection post={post} />
        </div>
      </ModalWrapper>
    </>
  )
}

export default MobileCommentButton
