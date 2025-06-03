import React, { useState } from 'react'
import { Button } from '@mui/material'
import ModalWrapper from '../../ui/Modal/ModalWrapper'
import LiveChat from '../../common/LiveChat/LiveChat'
import { MessageCircle } from 'lucide-react'

const MobileChatButton = ({ accountAddress }: { accountAddress: string }) => {
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
        startIcon={<MessageCircle />}
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
          <LiveChat
            accountAddress={accountAddress}
            onClose={() => setOpen(false)}
          />
        </div>
      </ModalWrapper>
    </>
  )
}

export default MobileChatButton
