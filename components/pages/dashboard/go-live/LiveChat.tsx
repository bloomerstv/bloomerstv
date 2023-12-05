import { Button, IconButton, TextareaAutosize } from '@mui/material'
import React, { useEffect, useState } from 'react'

// import { WebSocket } from 'ws'
// import { createClient } from 'graphql-ws'
// import { wsLensGraphEndpoint } from '../../../../utils/config'
import formatHandle from '../../../../utils/lib/formatHandle'
import { timeAgo } from '../../../../utils/helpers'
import { getAccessToken } from '../../../../utils/lib/getAccessTokenAsync'
import { LIVE_CHAT_WEB_SOCKET_URL } from '../../../../utils/config'
import io from 'socket.io-client'
import { SessionType, useSession } from '@lens-protocol/react-web'
import getAvatar from '../../../../utils/lib/getAvatar'
import SendIcon from '@mui/icons-material/Send'
import ModalWrapper from '../../../ui/Modal/ModalWrapper'
import LoginComponent from '../../../common/LoginComponent'
import LoginIcon from '@mui/icons-material/Login'
import Markup from '../../../common/Lexical/Markup'
import useIsMobile from '../../../../utils/hooks/useIsMobile'
import CloseIcon from '@mui/icons-material/Close'
interface MessageType {
  content: string
  avatarUrl: string
  handle: string
  authorProfileId: string
  time: string
}

const LiveChat = ({
  profileId,
  title = 'Live Chat',
  onClose
}: {
  profileId: string
  title?: string
  onClose?: () => void
}) => {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [socket, setSocket] = useState<any>()
  const [isSocketWithAuthToken, setIsSocketWithAuthToken] = useState(false)
  const { data } = useSession()
  const [open, setOpen] = React.useState(false)
  const isMobile = useIsMobile()

  const messagesEndRef = React.useRef(null)

  const scrollToBottom = () => {
    // @ts-ignore
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const listenToSocket = async () => {
    if (socket) {
      socket?.removeAllListeners()
      socket?.disconnect()
    }
    const authorToken = await getAccessToken()
    const newSocket = io(LIVE_CHAT_WEB_SOCKET_URL, {
      auth: {
        token: authorToken
      },
      withCredentials: true
    })

    newSocket.on('connect', () => {
      setTimeout(() => {
        newSocket.emit('join', profileId)
      }, 1000) // Wait for 1 second before joining the room

      if (!isSocketWithAuthToken && authorToken) {
        setIsSocketWithAuthToken(true)
      }
      setSocket(newSocket)
    })

    newSocket.on('message', (receivedData) => {
      const {
        profileId: chatProfileId,
        content,
        authorProfileId,
        avatarUrl,
        handle
      } = receivedData

      if (chatProfileId === profileId) {
        setMessages((prev) => {
          return [
            ...prev,
            {
              content,
              authorProfileId,
              avatarUrl,
              handle: handle,
              time: timeAgo(Date.now())
            }
          ]
        })
      }
    })
  }

  useEffect(() => {
    if (profileId && (!socket || !isSocketWithAuthToken)) {
      listenToSocket()
    }
    return () => {
      if (socket) {
        socket.removeAllListeners()
        socket.disconnect()
      }
    }
    // @ts-ignore
  }, [profileId, data?.profile?.id])

  const sendMessage = async () => {
    if (data?.type !== SessionType.WithProfile) {
      return
    }
    if (socket && inputMessage.trim() !== '') {
      socket.emit('message', {
        profileId,
        content: inputMessage,
        avatarUrl: getAvatar(data?.profile),
        handle: formatHandle(data?.profile)
      })
      setInputMessage('')
    }
  }

  return (
    <div className="h-full w-full flex flex-col bg-s-bg">
      <ModalWrapper
        open={open}
        title="login"
        Icon={<LoginIcon fontSize="small" />}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <LoginComponent onClose={() => setOpen(false)} />
      </ModalWrapper>
      {/* title section */}

      <div className="between-row w-full pb-1 px-3 sm:px-4 sm:py-3  border-b border-p-border">
        <div className="font-semibold">{title}</div>
        {isMobile && onClose && (
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        )}
      </div>

      {/* messages section */}
      <div
        style={{ minWidth: 0 }}
        className="h-full flex-grow flex-col justify-end flex overflow-auto py-1"
      >
        {messages.map((msg, index) => (
          <div key={index} className="flex flex-row px-3 my-1.5">
            <img
              src={msg.avatarUrl}
              alt="avatar"
              className="w-7 h-7 rounded-full"
              style={{ flexShrink: 0 }}
            />
            <div
              className="pl-2.5 font-bold text-sm pt-1"
              style={{ minWidth: 0, flexShrink: 1 }}
            >
              <span className="text-s-text mr-1">{msg.handle}</span>
              <span>
                <Markup className="break-words whitespace-pre-wrap">
                  {msg.content}
                </Markup>
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* input section */}
      <div className="w-full py-1.5 px-3 border-t border-p-border">
        {data?.type === SessionType.WithProfile &&
        isSocketWithAuthToken &&
        socket ? (
          <div className="w-full flex flex-row items-end gap-x-2">
            {inputMessage.trim().length > 0 && (
              <img
                src={getAvatar(data?.profile)}
                alt="avatar"
                className="w-7 h-7 rounded-full mb-1"
              />
            )}
            <TextareaAutosize
              className="text-sm outline-none bg-p-bg w-full font-normal font-sans leading-normal px-3 py-1 mb-1 rounded-xl "
              aria-label="empty textarea"
              placeholder="Chat..."
              style={{
                resize: 'none'
              }}
              maxRows={5}
              onChange={(e) => setInputMessage(e.target.value)}
              value={inputMessage}
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' &&
                  !e.shiftKey &&
                  inputMessage.trim().length > 0
                ) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
            />
            <IconButton
              onClick={sendMessage}
              className=" rounded-full"
              size="small"
              disabled={inputMessage.trim().length === 0}
            >
              <SendIcon />
            </IconButton>
          </div>
        ) : (
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            className="w-full "
            sx={{
              borderRadius: '2rem'
            }}
            color="secondary"
          >
            Login to chat
          </Button>
        )}
      </div>
    </div>
  )
}

export default LiveChat
