import { Button } from '@mui/material'
import React, { useState } from 'react'
import ModalWrapper from '../../ui/Modal/ModalWrapper'
import LiveChat from '../dashboard/go-live/LiveChat'
import ChatIcon from '@mui/icons-material/Chat'
const MobileChatButton = ({ profileId }: { profileId: string }) => {
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
        sx={{
          borderRadius: '20px',
          boxShadow: 'none'
        }}
        variant="contained"
        color="secondary"
        onClick={() => setOpen(true)}
        startIcon={<ChatIcon />}
      >
        Live Chat
      </Button>
      <ModalWrapper
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        hideBackdrop
      >
        <div style={{ height: `${heightOfChat}px` }} className="w-screen">
          <LiveChat profileId={profileId} onClose={() => setOpen(false)} />
        </div>
      </ModalWrapper>
    </>
  )
}

export default MobileChatButton
