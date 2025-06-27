import { Button, IconButton } from '@mui/material'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import {
  // APP_ID,
  APP_LINK,
  LIVE_CHAT_WEB_SOCKET_URL
} from '../../../utils/config'
import io from 'socket.io-client'
import {
  image,
  textOnly,
  MediaImageMimeType,
  MetadataLicenseType
} from '@lens-protocol/metadata'
import ModalWrapper from '../../ui/Modal/ModalWrapper'
import LoginComponent from '../LoginComponent'
import LoginIcon from '@mui/icons-material/Login'
import Markup from '../Lexical/Markup'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import CloseIcon from '@mui/icons-material/Close'
import { useMyPreferences } from '../../store/useMyPreferences'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import { useStreamChatsQuery } from '../../../graphql/generated'
import LiveCount from '../../pages/profile/LiveCount'
import getUserLocale from '../../../utils/getUserLocale'
import { v4 as uuid } from 'uuid'
import { getLastStreamPostId } from '../../../utils/lib/lensApi'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { getIdentityTokenAsync } from '../../../utils/lib/getIdentityTokenAsync'
import {
  ContentType,
  Message,
  AccountMessage,
  SendMessageType,
  MessageType
} from './LiveChatType'
import ChatOptionsButton from './ChatOptionsButton'
import LiveChatInput from './LiveChatInput'
import LoadingImage from '../../ui/LoadingImage'
import { stringToLength } from '../../../utils/stringToLength'
import sanitizeDStorageUrl from '../../../utils/lib/sanitizeDStorageUrl'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import Link from 'next/link'
import { useChatInteractions } from '../../store/useChatInteractions'
import useSession from '../../../utils/hooks/useSession'
import { useCreatePost, usePublicClient } from '@lens-protocol/react'
import { useWalletClient } from 'wagmi'
import { handleOperationWith } from '@lens-protocol/react/viem'
import { acl, storageClient } from '../../../utils/lib/lens/storageClient'
import ClipThumbnail from './ClipThumbnail'

export type SendMessageInput = {
  txHash?: string
  clip?: {
    clipPostId: string
    image: string
    content: string
  }
}

export type ImageAttachment = {
  imageUrl?: string
  imagePreviewUrl?: string
  imageMimeType?: MediaImageMimeType
}

const LiveChat = ({
  accountAddress,
  title = 'Live Chat',
  onClose,
  showPopOutChat = false,
  preMessages = [],
  showLiveCount = false
}: {
  accountAddress: string
  title?: string
  onClose?: () => void
  showPopOutChat?: boolean
  preMessages?: AccountMessage[]
  showLiveCount?: boolean
}) => {
  const [imageAttachment, setImageAttachment] = useState<ImageAttachment>({
    imageUrl: undefined,
    imagePreviewUrl: undefined
  })
  const [streamerHasBlockedMe, setStreamerHasBlockedMe] = React.useState(false)
  const audioRef = useRef(new Audio('/sounds/liveChatPopSound.mp3'))
  useEffect(() => {
    audioRef.current.volume = 0.5
  }, [])

  const [messages, setMessages] = useState<Message[]>(preMessages)
  const [inputMessage, setInputMessage] = useState('')
  const [socket, setSocket] = useState<any>(null)
  // const [isSocketWithAuthToken, setIsSocketWithAuthToken] = useState(false)
  const { isAuthenticated, account } = useSession()
  const [open, setOpen] = React.useState(false)
  const [popedOut, setPopedOut] = React.useState(false)
  const isMobile = useIsMobile()
  const { data: wallet } = useWalletClient()
  const { execute } = useCreatePost(handleOperationWith(wallet))
  const [verifiedToSend, setVerifiedToSend] = useState(false)

  const { currentSession } = usePublicClient()

  const { data: chats } = useStreamChatsQuery({
    variables: {
      accountAddress
    },
    skip: !accountAddress,
    fetchPolicy: 'no-cache'
  })

  useEffect(() => {
    if (
      chats &&
      !preMessages.length &&
      messages?.filter((m) => m.type === MessageType.Account).length === 0
    ) {
      // @ts-ignore
      const chatsFromDB: AccountMessage[] = chats.streamChats
      setMessages((prev) => {
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
  const [uniqueMessages, setUniqueMessages] = useState<Message[]>([])

  const messagesEndRef = React.useRef(null)

  useEffect(() => {
    liveChatPopUpSoundRef.current = liveChatPopUpSound
  }, [liveChatPopUpSound])

  const scrollToBottom = () => {
    // @ts-ignore
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isAuthenticated) {
      setOpen(false)
    }
  }, [isAuthenticated])

  const joinChatWithAccount = useCallback(async () => {
    if (!account?.address || !socket) return
    const idToken = await getIdentityTokenAsync()

    if (!idToken) {
      return
    }

    socket.on('verified-to-send', () => {
      setVerifiedToSend(true)
    })

    socket.on('error', (error: any) => {
      toast.error(String(error))
      if (error === 'You are blocked by the streamer') {
        setStreamerHasBlockedMe(true)
      }
    })
    // emit joined chat room
    socket.emit('joined-chat', idToken)
  }, [Boolean(socket), account?.address])

  useEffect(() => {
    joinChatWithAccount()
  }, [socket, account?.address])

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

  useEffect(() => {
    // const listenToSocket = async () => {
    // const authorToken = await getAccessToken()
    const newSocket = io(LIVE_CHAT_WEB_SOCKET_URL, {
      // auth: {
      //   token: authorToken
      // },
      // withCredentials: true
    })

    newSocket.on('connect', () => {
      newSocket.emit('join', accountAddress)
      setSocket(newSocket)

      // setTimeout(() => {
      //   newSocket.emit('join', profileId)
      //   // if (!isSocketWithAuthToken && authorToken) {
      //   //   setIsSocketWithAuthToken(true)
      //   // }
      //   // @ts-ignore
      //   setSocket(newSocket)
      // }, 1000) // Wait for 1 second before joining the room
    })
    newSocket.on('ping', () => {
      newSocket.emit('pong') // Respond with pong
    })

    newSocket.on('message', (receivedData) => {
      const receivedMessage: Message = receivedData

      // run pop up sound
      if (liveChatPopUpSoundRef.current) {
        audioRef?.current.play()
      }

      setMessages((prev: Message[]) => [...prev, receivedMessage as Message])
    })

    newSocket.on('remove-messages', (accountAddress: string) => {
      setMessages((prev) =>
        prev.filter((msg) => {
          if (msg.type === 'System') return true

          return msg.authorAccountAddress !== accountAddress
        })
      )
    })
    // }

    // listenToSocket()

    return () => {
      if (newSocket) {
        newSocket?.disconnect()
        newSocket?.close()
        newSocket?.removeAllListeners()
        setSocket(null)
      }
    }
    // @ts-ignore
  }, [])

  const sendMessage = async (messageInput?: SendMessageInput) => {
    if (!isAuthenticated) {
      return
    }

    if (socket) {
      let sendMessagePayload: SendMessageType

      // Handle the type logic for Clip vs Comment
      if (messageInput?.clip) {
        sendMessagePayload = {
          id: uuid(),
          type: ContentType.Clip,
          content: messageInput.clip.content,
          image: messageInput.clip.image,
          clipPostId: messageInput.clip.clipPostId
        }
      } else {
        if (inputMessage.trim() === '') return

        sendMessagePayload = {
          id: uuid(),
          type: ContentType.Comment,
          content: inputMessage,
          image: sanitizeDStorageUrl(imageAttachment?.imageUrl), // No image for Comment
          txHash: messageInput?.txHash
        }
      }

      // the send-message will be listened to server only if the joined-chat event is emitted with accesstoken
      // the joined-chat event is listed on the server side to verify the profile and information like handle & avatarUrl are already stored for this socket there,
      // so just need to send the message content from here
      socket.emit('send-message', sendMessagePayload)

      if (isAuthenticated) {
        createComment(
          inputMessage,
          imageAttachment?.imageUrl,
          imageAttachment?.imageMimeType
        )
      }
      setInputMessage('')

      setImageAttachment({
        imagePreviewUrl: undefined,
        imageUrl: undefined,
        imageMimeType: undefined
      })
    }
  }

  const sendMessagePayload = useCallback(
    (message: SendMessageType) => {
      if (!socket) return
      socket.emit('send-message', message)
    },
    [socket]
  )

  // Add this effect to register the function with our store
  const setSendMessagePayload = useChatInteractions(
    (state) => state.setSendMessagePayload
  )

  useEffect(() => {
    setSendMessagePayload(sendMessagePayload)

    return () => {
      setSendMessagePayload(null)
    }
  }, [sendMessagePayload, setSendMessagePayload])

  const createComment = async (
    inputMessage: string,
    imageUrl?: string,
    imageMimeType?: MediaImageMimeType
  ) => {
    try {
      // create a comment under live stream publication
      const lastStreamPostId = await getLastStreamPostId(
        accountAddress,
        currentSession
      )
      if (!lastStreamPostId) return
      const id = uuid()
      const locale = getUserLocale()

      const metadata = imageUrl
        ? image({
            content: inputMessage,
            image: {
              item: imageUrl,
              type: imageMimeType || MediaImageMimeType.JPEG,
              altTag: inputMessage,
              license: MetadataLicenseType.CCO
            },
            id: id,
            locale: locale,
            attachments: [],
            attributes: [],
            tags: [],
            title: ''
          })
        : textOnly({
            content: inputMessage,
            id: id,
            locale: locale
          })

      const response = await storageClient.uploadAsJson(metadata, {
        acl: acl,
        name: `live-chat-${accountAddress}-${id}`
      })

      if (!response?.uri) {
        throw new Error('Error uploading metadata to Grove')
      }
      // invoke the `execute` function to create the post
      const result = await execute({
        contentUri: response?.uri,
        commentOn: {
          post: lastStreamPostId
        }
      })

      if (result?.isErr()) {
        toast.error(result.error.message)
        // handle failure scenarios
        throw new Error('Error creating comment')
      }
    } catch (error) {
      console.error('Error creating comment', error)
    }
  }

  const popOutChat = () => {
    setPopedOut(true)
    const chatWindow = window.open(
      `/live-chat/${accountAddress}`,
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
        <LoginComponent onClose={() => setOpen(false)} />
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

          {showLiveCount && accountAddress && (
            <LiveCount accountAddress={accountAddress} />
          )}
        </div>
        {isMobile && onClose && (
          <IconButton onClick={onClose}>
            <CloseIcon className="text-s-text" />
          </IconButton>
        )}
        {showPopOutChat && (
          <IconButton size="small" onClick={popOutChat} title="Pop out chat">
            <ArrowOutwardIcon className="text-s-text" />
          </IconButton>
        )}
      </div>

      {/* messages section */}
      <div
        style={{ minWidth: 0 }}
        className="h-full flex-grow overflow-y-auto overflow-x-hidden py-1"
        onTouchStart={(e) => e.stopPropagation()}
      >
        {uniqueMessages.map((msg, index) => {
          // this mean its a message from the system
          if (msg.type === 'System') {
            return (
              <div
                key={index}
                className="centered-row text-s-text text-xs my-2"
              >
                <div className="bg-p-bg  rounded-lg px-4 py-1">
                  {msg.content}
                </div>
              </div>
            )
          }

          // treat this as a super chat
          if (msg.amount || msg.formattedAmount) {
            return (
              <div
                key={index}
                className="bg-brand group relative shadow-md m-1.5 text-white rounded-xl p-2 flex flex-row items-start gap-x-2.5"
              >
                <ChatOptionsButton
                  chatAccountAddress={accountAddress}
                  accountAddress={msg.authorAccountAddress}
                  handle={msg.handle}
                  avatarUrl={msg.avatarUrl!}
                  socket={socket}
                  className="bg-brand text-white"
                />
                <img
                  src={msg.avatarUrl}
                  alt="avatar"
                  className="w-7 h-7 rounded-full"
                />

                <div className="text-sm ">
                  <div className="start-center-row gap-x-1.5 mb-1.5">
                    <div
                      className={clsx(
                        'font-semibold bg-white text-brand rounded-md px-1.5 py-0.5'
                      )}
                    >
                      {msg.handle}
                    </div>

                    <div className="font-semibold">
                      {`${msg.amount || parseFloat(msg.formattedAmount!)} ${msg.currencySymbol}`}
                    </div>
                  </div>
                  <Markup
                    style={{
                      whiteSpace: 'pre-wrap', // ensures that text wraps and preserves whitespace
                      overflowWrap: 'break-word', // breaks long words if necessary
                      wordWrap: 'break-word', // adds support for older browsers, same as overflowWrap
                      wordBreak: 'break-word' // breaks words if they are too long to fit
                    }}
                    // className="break-words whitespace-pre-wrap"
                  >
                    {msg.content}
                  </Markup>
                </div>
              </div>
            )
          }

          return (
            <div
              key={index}
              className="flex group relative flex-row  w-full px-3 my-1.5"
            >
              <ChatOptionsButton
                chatAccountAddress={accountAddress}
                accountAddress={msg.authorAccountAddress}
                handle={msg.handle}
                avatarUrl={msg.avatarUrl!}
                socket={socket}
                className="bg-s-bg"
              />

              {/* profile image */}
              <img
                src={msg.avatarUrl}
                alt="avatar"
                className="w-7 h-7 rounded-full"
                style={{ flexShrink: 0 }}
              />
              <div className="w-full">
                {/* handle */}
                <div
                  className="pl-2.5 font-bold text-sm pt-1"
                  style={{ minWidth: 0, flexShrink: 1 }}
                >
                  <span
                    className={clsx(
                      'text-s-text mr-1',
                      msg?.authorAccountAddress &&
                        msg.accountAddress === msg?.authorAccountAddress &&
                        'bg-brand text-white rounded-md px-1.5 py-0.5'
                    )}
                  >
                    {msg.handle}
                  </span>

                  {(!msg?.contentType ||
                    (msg.contentType !== ContentType.Clip &&
                      msg.contentType !== ContentType.Trade)) && (
                    <span>
                      <Markup className="break-words whitespace-pre-wrap">
                        {msg.content}
                      </Markup>
                    </span>
                  )}
                </div>

                {/* show comment */}
                {msg?.contentType === ContentType.Comment && (
                  <>
                    {msg?.image && (
                      <div className="px-1.5 py-1">
                        <LoadingImage
                          src={msg.image}
                          className="max-w-full rounded-lg max-h-40 "
                          alt="image"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* show clip */}
                {msg?.contentType === ContentType.Clip && (
                  <Link
                    target="_blank"
                    href={`${APP_LINK}/watch/${msg.clipPostId}`}
                    className="w-full group flex cursor-pointer box-border  no-underline"
                  >
                    <div className="px-1.5 py-2 w-full">
                      <div className="w-full gap-x-1.5 p-1.5 bg-p-hover start-center-row rounded-lg">
                        {/* poster */}
                        <div className="relative">
                          <div className="absolute z-30 w-full h-full inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <PlayArrowIcon
                              fontSize="large"
                              className="text-white transform transition-transform group-hover:scale-105 duration-300"
                            />
                          </div>
                          <ClipThumbnail
                            clipPostId={msg.clipPostId}
                            imageUrl={msg.image}
                            className="w-24 h-14 rounded-md"
                          />
                        </div>
                        <div>
                          <div className="start-center-row">
                            <Markup className="text-xs break-words whitespace-pre-wrap font-semibold text-s-text group-hover:text-p-text leading-tight">
                              {stringToLength('✂️ ' + msg.content, 100)}
                            </Markup>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {msg?.contentType === ContentType.Trade && (
                  <div className="px-1.5 py-2 w-full">
                    <div className="w-full p-1.5 bg-p-hover rounded-lg">
                      {/* Currency and amount info */}
                      <div className="flex items-center gap-x-2 mb-1.5">
                        {msg.image && (
                          <LoadingImage
                            src={msg.image}
                            className="w-6 h-6 rounded-full"
                            alt="currency"
                          />
                        )}
                        <div className="font-semibold text-s-text">
                          {msg.currencySymbol}
                        </div>
                      </div>

                      {/* Trade content */}
                      <div className="text-sm break-words whitespace-pre-wrap">
                        <Markup className="text-xs break-words whitespace-pre-wrap text-s-text">
                          {msg.content}
                        </Markup>
                      </div>

                      {/* Transaction link */}
                      {/* {msg.txHash && (
                        <div className="mt-1.5">
                          <Link
                            href={`https://etherscan.io/tx/${msg.txHash}`}
                            target="_blank"
                            className="text-xs text-brand hover:underline flex items-center gap-x-1"
                          >
                            View Transaction
                            <ArrowOutwardIcon fontSize="inherit" />
                          </Link>
                        </div>
                      )} */}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* input section */}
      <div className="w-full py-1.5 px-1.5 border-t border-p-border">
        {!isAuthenticated || !socket ? (
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
        ) : streamerHasBlockedMe ? (
          <Button
            variant="contained"
            className="w-full "
            sx={{
              borderRadius: '2rem'
            }}
            disabled
            color="secondary"
          >
            Blocked by streamer
          </Button>
        ) : !verifiedToSend ? (
          <Button
            variant="contained"
            className="w-full "
            sx={{
              borderRadius: '2rem'
            }}
            disabled
            color="secondary"
          >
            Connecting...
          </Button>
        ) : (
          <LiveChatInput
            liveChatAccountAddress={accountAddress}
            inputMessage={inputMessage}
            sendMessage={sendMessage}
            setInputMessage={setInputMessage}
            imageAttachment={imageAttachment}
            setImageAttachment={setImageAttachment}
          />
        )}
      </div>
    </div>
  )
}

export default memo(LiveChat)
