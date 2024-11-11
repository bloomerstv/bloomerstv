import { Button, IconButton } from '@mui/material'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import {
  APP_ID,
  APP_LINK,
  LIVE_CHAT_WEB_SOCKET_URL,
  defaultSponsored
} from '../../../utils/config'
import io from 'socket.io-client'
import {
  PublicationId,
  SessionType,
  useCreateComment,
  useSession
} from '@lens-protocol/react-web'
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
import {
  useStreamChatsQuery,
  useUploadDataToArMutation
} from '../../../graphql/generated'
import LiveCount from '../../pages/profile/LiveCount'
import getUserLocale from '../../../utils/getUserLocale'
import { textOnly, image } from '@lens-protocol/metadata'
import { v4 as uuid } from 'uuid'
import { getLastStreamPublicationId } from '../../../utils/lib/lensApi'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { getAccessTokenAsync } from '../../../utils/lib/getIdentityTokenAsync'
import {
  ContentType,
  Message,
  ProfileMessage,
  SendMessageClipTyep,
  SendMessageType
} from './LiveChatType'
import ChatOptionsButton from './ChatOptionsButton'
import LiveChatInput from './LiveChatInput'
import LoadingImage from '../../ui/LoadingImage'
import { stringToLength } from '../../../utils/stringToLength'
import sanitizeDStorageUrl from '../../../utils/lib/sanitizeDStorageUrl'
import { usePublicationsStore } from '../../store/usePublications'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import Link from 'next/link'
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
  imageMimeType?: string
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
  preMessages?: ProfileMessage[]
  showLiveCount?: boolean
}) => {
  const { clipPost, setClipPost } = usePublicationsStore((state) => ({
    clipPost: state.clipPost,
    setClipPost: state.setClipPost
  }))
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
  const { data } = useSession()
  const [open, setOpen] = React.useState(false)
  const [popedOut, setPopedOut] = React.useState(false)
  const isMobile = useIsMobile()
  const [uploadDataToAR] = useUploadDataToArMutation()
  const { execute } = useCreateComment()
  const [verifiedToSend, setVerifiedToSend] = useState(false)

  const { data: chats } = useStreamChatsQuery({
    variables: {
      profileId: profileId
    },
    fetchPolicy: 'no-cache'
  })

  useEffect(() => {
    if (chats && !preMessages.length && messages.length === 0) {
      // @ts-ignore
      const chatsFromDB: ProfileMessage[] = chats.streamChats
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
    if (data?.type === SessionType.WithProfile) {
      setOpen(false)
    }
  }, [data?.type])

  const joinChatWithProfile = useCallback(async () => {
    if (data?.type === SessionType.Anonymous || !socket) return
    const accessToken = await getAccessTokenAsync()

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
    socket.emit('joined-chat', accessToken)
  }, [socket, data?.type])

  useEffect(() => {
    joinChatWithProfile()
  }, [socket, data?.type])

  useEffect(() => {
    if (!socket || !clipPost) return
    const id = uuid()
    const sendMessage: SendMessageClipTyep = {
      id,
      clipPostId: clipPost?.id,
      content: clipPost?.metadata?.marketplace?.name!,
      image: sanitizeDStorageUrl(
        clipPost?.metadata?.marketplace?.image?.optimized?.uri!
      ),
      type: ContentType.Clip
    }
    socket.emit('send-message', sendMessage)
    setClipPost(null)
  }, [socket, clipPost])

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
      newSocket.emit('join', profileId)
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

    newSocket.on('remove-messages', (profileId: string) => {
      setMessages((prev) =>
        prev.filter((msg) => {
          if (msg.type === 'System') return true

          return msg.authorProfileId !== profileId
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
    if (data?.type === SessionType.Anonymous) {
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

      if (data?.type === SessionType.WithProfile) {
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
        imageMimeType: ''
      })
    }
  }

  const createComment = async (
    inputMessage: string,
    imageUrl?: string,
    imageMimeType?: string
  ) => {
    try {
      // create a comment under live stream publication
      console.time('createComment')
      const lastStreamPublicationId =
        await getLastStreamPublicationId(profileId)

      if (!lastStreamPublicationId) return
      const id = uuid()
      const locale = getUserLocale()

      console.log('imageUrl', imageUrl)

      const metadata = imageUrl
        ? image({
            content: inputMessage,
            marketplace: {
              name: inputMessage,
              image: imageUrl
            },
            image: {
              item: imageUrl,
              // @ts-ignore
              type: imageMimeType,
              altTag: inputMessage
            },
            appId: APP_ID,
            id: id,
            locale: locale
          })
        : textOnly({
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
      // if (!data?.isSuccess()) return

      // const comment = await data?.value?.waitForCompletion()
      // console.log('comment', comment)
      // console.timeEnd('createComment')
    } catch (error) {
      console.error('Error creating comment', error)
    }
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

          {showLiveCount && profileId && <LiveCount profileId={profileId} />}
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
                  chatProfileId={profileId}
                  profileId={msg.authorProfileId}
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
                  <Markup className="break-words whitespace-pre-wrap">
                    {msg.content}
                  </Markup>
                </div>
              </div>
            )
          }

          return (
            <div
              key={index}
              className="flex group relative flex-row px-3 my-1.5"
            >
              <ChatOptionsButton
                chatProfileId={profileId}
                profileId={msg.authorProfileId}
                handle={msg.handle}
                avatarUrl={msg.avatarUrl!}
                socket={socket}
                className="bg-s-bg"
              />
              <img
                src={msg.avatarUrl}
                alt="avatar"
                className="w-7 h-7 rounded-full"
                style={{ flexShrink: 0 }}
              />
              <div>
                <div
                  className="pl-2.5 font-bold text-sm pt-1"
                  style={{ minWidth: 0, flexShrink: 1 }}
                >
                  <span
                    className={clsx(
                      'text-s-text mr-1',
                      msg?.authorProfileId &&
                        msg.profileId === msg?.authorProfileId &&
                        'bg-brand text-white rounded-md px-1.5 py-0.5'
                    )}
                  >
                    {msg.handle}
                  </span>

                  {(!msg?.contentType ||
                    msg.contentType !== ContentType.Clip) && (
                    <span>
                      <Markup className="break-words whitespace-pre-wrap">
                        {msg.content}
                      </Markup>
                    </span>
                  )}
                </div>

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

                {msg?.contentType === ContentType.Clip && (
                  <Link
                    target="_blank"
                    href={`${APP_LINK}/watch/${msg.clipPostId}`}
                    className="group cursor-pointer box-border no-underline"
                  >
                    <div className="px-1.5 py-2">
                      <div className="w-full gap-x-1.5 p-1.5 bg-p-hover start-center-row rounded-lg">
                        {/* poster */}
                        <div className="relative">
                          <div className="absolute z-30 w-full h-full inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <PlayArrowIcon
                              fontSize="large"
                              className="text-white transform transition-transform group-hover:scale-105 duration-300"
                            />
                          </div>
                          <LoadingImage
                            src={msg.image}
                            className="w-24 h-14 rounded-md"
                          />
                        </div>
                        <div>
                          <div className="start-center-row">
                            <Markup className="text-xs font-semibold text-s-text group-hover:text-p-text leading-tight">
                              {stringToLength('✂️ ' + msg.content, 100)}
                            </Markup>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          )
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* input section */}
      <div className="w-full py-1.5 px-1.5 border-t border-p-border">
        {data?.type === SessionType.Anonymous || !socket ? (
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
            liveChatProfileId={profileId}
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
