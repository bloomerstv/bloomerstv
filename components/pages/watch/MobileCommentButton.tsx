import { Button } from '@mui/material'
import React, { useState } from 'react'
import CommentIcon from '@mui/icons-material/Comment'
import ModalWrapper from '../../ui/Modal/ModalWrapper'
import CommentSection from './CommentSection'
const MobileCommentButton = ({ postId }: { postId: string }) => {
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
        <div style={{ height: `${heightOfChat}px` }} className="w-screen ">
          <div className="text-lg font-semibold px-3 py-1 border-b border-p-border">
            Comments
          </div>
          <CommentSection publicationId={postId} />
        </div>
      </ModalWrapper>
    </>
  )
}

export default MobileCommentButton
