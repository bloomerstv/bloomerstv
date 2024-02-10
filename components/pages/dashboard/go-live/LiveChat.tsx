import { Button, IconButton, TextareaAutosize } from '@mui/material'
import React, { memo, useEffect, useRef, useState } from 'react'

// import { WebSocket } from 'ws'
// import { createClient } from 'graphql-ws'
// import { wsLensGraphEndpoint } from '../../../../utils/config'
import formatHandle from '../../../../utils/lib/formatHandle'
import { timeAgo } from '../../../../utils/helpers'
// import { getAccessToken } from '../../../../utils/lib/getAccessTokenAsync'
import {
  APP_ID,
  LIVE_CHAT_WEB_SOCKET_URL,
  defaultSponsored
} from '../../../../utils/config'
import io from 'socket.io-client'
import {
  PublicationId,
  SessionType,
  useCreateComment,
  useSession
} from '@lens-protocol/react-web'
import getAvatar from '../../../../utils/lib/getAvatar'
import SendIcon from '@mui/icons-material/Send'
import ModalWrapper from '../../../ui/Modal/ModalWrapper'
import LoginComponent from '../../../common/LoginComponent'
import LoginIcon from '@mui/icons-material/Login'
import Markup from '../../../common/Lexical/Markup'
import useIsMobile from '../../../../utils/hooks/useIsMobile'
import CloseIcon from '@mui/icons-material/Close'
import { useEffectOnce } from 'usehooks-ts'
import { useMyPreferences } from '../../../store/useMyPreferences'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import {
  Chat,
  useStreamChatsQuery,
  useUploadDataToArMutation
} from '../../../../graphql/generated'
import LiveCount from '../../profile/LiveCount'
import getUserLocale from '../../../../utils/getUserLocale'
import { textOnly } from '@lens-protocol/metadata'
import { v4 as uuid } from 'uuid'
import { getLastStreamPublicationId } from '../../../../utils/lib/lensApi'
interface MessageType {
  content: string
  avatarUrl: string
  handle: string
  time: string
  id: string
}

const LiveChat = ({
  profileId,
  title = 'Live Chat',
  onClose,
  showPopOutChat = false,
  preMessages = [],
  showLiveCount = false
}: {
  profileId: string
  title?: string
  onClose?: () => void
  showPopOutChat?: boolean
  preMessages?: MessageType[]
  showLiveCount?: boolean
}) => {
  const audio = new Audio('/sounds/liveChatPopSound.mp3')
  audio.volume = 0.5
  const [messages, setMessages] = useState<MessageType[]>(preMessages)
  const [inputMessage, setInputMessage] = useState('')
  const [socket, setSocket] = useState<any>(null)
  // const [isSocketWithAuthToken, setIsSocketWithAuthToken] = useState(false)
  const { data } = useSession()
  const [open, setOpen] = React.useState(false)
  const [popedOut, setPopedOut] = React.useState(false)
  const isMobile = useIsMobile()
  const [uploadDataToAR] = useUploadDataToArMutation()
  const { execute } = useCreateComment()

  const { data: chats } = useStreamChatsQuery({
    variables: {
      profileId: profileId
    },
    fetchPolicy: 'no-cache'
  })

  useEffect(() => {
    if (chats && !preMessages.length) {
      const chatsFromDB = chats.streamChats?.map((chat: Chat | null) => {
        if (chat) {
          return {
            content: chat.content ?? '',
            avatarUrl: chat.avatarUrl ?? '',
            handle: chat.handle ?? '',
            time: timeAgo(chat.createdAt),
            id: chat.id ?? ''
          }
        }
        return null
      })
      setMessages((prev) => {
        // @ts-ignore
        return [...chatsFromDB, ...prev]
      })
    }
  }, [chats])

  const liveChatPopUpSound = useMyPreferences(
    (state) => state.liveChatPopUpSound
  )
  const setLiveChatPopUpSound = useMyPreferences(
    (state) => state.setLiveChatPopUpSound
  )

  const liveChatPopUpSoundRef = useRef(liveChatPopUpSound)
  const [uniqueMessages, setUniqueMessages] = useState<MessageType[]>([])

  const messagesEndRef = React.useRef(null)

  useEffect(() => {
    liveChatPopUpSoundRef.current = liveChatPopUpSound
  }, [liveChatPopUpSound])

  const scrollToBottom = () => {
    // @ts-ignore
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (data?.type === SessionType.WithProfile) {
      setOpen(false)
    }
  }, [data?.type])

  useEffect(() => {
    const seen = new Set()
    const filteredArr = messages.filter((el) => {
      const duplicate = seen.has(el.id)
      seen.add(el.id)
      return !duplicate
    })
    setUniqueMessages(filteredArr)
  }, [messages])

  useEffect(() => {
    scrollToBottom()
  }, [uniqueMessages, messagesEndRef.current])

  useEffectOnce(() => {
    // const listenToSocket = async () => {
    // const authorToken = await getAccessToken()
    const newSocket = io(LIVE_CHAT_WEB_SOCKET_URL, {
      // auth: {
      //   token: authorToken
      // },
      // withCredentials: true
    })

    newSocket.on('connect', () => {
      setTimeout(() => {
        newSocket.emit('join', profileId)
        // if (!isSocketWithAuthToken && authorToken) {
        //   setIsSocketWithAuthToken(true)
        // }
        // @ts-ignore
        setSocket(newSocket)
      }, 1000) // Wait for 1 second before joining the room
    })

    newSocket.on('message', (receivedData) => {
      const {
        profileId: chatProfileId,
        content,
        avatarUrl,
        handle,
        id
      } = receivedData

      if (chatProfileId === profileId) {
        // run pop up sound
        if (liveChatPopUpSoundRef.current) {
          console.log('play sound')
          audio.play()
        }

        setMessages((prev) => [
          ...prev,
          {
            content,
            avatarUrl,
            handle,
            time: timeAgo(new Date().getTime()),
            id
          }
        ])
      }
    })
    // }

    // listenToSocket()

    return () => {
      if (newSocket) {
        newSocket?.disconnect()
        newSocket?.close()
        newSocket?.removeAllListeners()
      }
    }
    // @ts-ignore
  }, [])

  const sendMessage = async () => {
    if (data?.type !== SessionType.WithProfile) {
      return
    }

    if (socket && inputMessage.trim() !== '') {
      // @ts-ignore
      socket.emit('message', {
        profileId,
        content: inputMessage,
        avatarUrl: getAvatar(data?.profile),
        handle: formatHandle(data?.profile)
      })

      setInputMessage('')

      createComment(inputMessage)
    }
  }

  const createComment = async (inputMessage: string) => {
    // create a comment under live stream publication

    const lastStreamPublicationId = await getLastStreamPublicationId(profileId)

    if (!lastStreamPublicationId) return
    const id = uuid()
    const locale = getUserLocale()

    const metadata = textOnly({
      content: inputMessage,
      marketplace: {
        name: inputMessage
      },
      appId: APP_ID,
      id: id,
      locale: locale
    })

    const { data: txData } = await uploadDataToAR({
      variables: {
        data: JSON.stringify(metadata)
      }
    })

    const txId = txData?.uploadDataToAR

    if (!txId) {
      throw new Error('Error uploading metadata to IPFS')
    }
    // invoke the `execute` function to create the post
    await execute({
      metadata: `ar://${txId}`,
      sponsored: defaultSponsored,
      commentOn: lastStreamPublicationId as PublicationId
    })
  }

  const popOutChat = () => {
    setPopedOut(true)
    const chatWindow = window.open(
      `/live-chat/${profileId}`,
      '_blank',
      'width=400,height=600,menubar=no,toolbar=no,location=no'
    )
    // @ts-ignore
    chatWindow.chatData = uniqueMessages
    chatWindow?.focus()
  }

  if (popedOut) {
    return (
      <div className="centered-col h-full w-full gap-y-8 bg-s-bg">
        <div className="text-2xl font-bold">Chat popped out</div>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => setPopedOut(false)}
        >
          Restore
        </Button>
      </div>
    )
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
        <LoginComponent onClose={() => setOpen(false)} open={open} />
      </ModalWrapper>
      {/* title section */}

      <div className="between-row w-full pb-1 px-3 sm:px-4 sm:py-3  border-b border-p-border">
        <div className="centered-row space-x-2">
          <div className="font-semibold">{title}</div>
          <IconButton
            onClick={() => setLiveChatPopUpSound(!liveChatPopUpSound)}
            size="small"
          >
            {liveChatPopUpSound ? <VolumeUpIcon /> : <VolumeOffIcon />}
          </IconButton>

          {showLiveCount && profileId && (
            <LiveCount profileId={profileId} className="text-sm text-s-text" />
          )}
        </div>
        {isMobile && onClose && (
          <IconButton onClick={onClose}>
            <CloseIcon className="text-s-text" />
          </IconButton>
        )}
        {showPopOutChat && (
          <IconButton size="small" onClick={popOutChat}>
            <ArrowOutwardIcon className="text-s-text" />
          </IconButton>
        )}
      </div>

      {/* messages section */}
      <div
        style={{ minWidth: 0 }}
        className="h-full flex-grow overflow-y-auto py-1"
      >
        {uniqueMessages.map((msg, index) => (
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
      <div className="w-full py-2 px-3 border-t border-p-border">
        {data?.type === SessionType.WithProfile && socket ? (
          <div className="w-full flex flex-row items-end gap-x-2">
            {inputMessage.trim().length > 0 && (
              <img
                src={getAvatar(data?.profile)}
                alt="avatar"
                className="w-7 h-7 rounded-full mb-1"
              />
            )}
            <TextareaAutosize
              className="text-sm text-p-text border-p-border outline-none bg-s-bg w-full font-normal font-sans leading-normal px-3 py-1.5 mb-0.5 rounded-xl "
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

export default memo(LiveChat)
