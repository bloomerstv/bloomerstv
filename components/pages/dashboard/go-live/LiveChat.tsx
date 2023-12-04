import { Button, CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'

// import { WebSocket } from 'ws'
// import { createClient } from 'graphql-ws'
// import { wsLensGraphEndpoint } from '../../../../utils/config'
import formatHandle from '../../../../utils/lib/formatHandle'
import getPublicationData from '../../../../utils/lib/getPublicationData'
import { timeAgo } from '../../../../utils/helpers'
import { getAccessToken } from '../../../../utils/lib/getAccessTokenAsync'
import { toast } from 'react-toastify'
import { LIVE_CHAT_WEB_SOCKET_URL } from '../../../../utils/config'
import io from 'socket.io-client'
import { SessionType, useSession } from '@lens-protocol/react-web'

interface MessageType {
  content: string
  authorProfileId: string
  time: string
}

const LiveChat = ({
  profileId,
  title = 'Live Chat'
}: {
  profileId: string
  title?: string
}) => {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [socket, setSocket] = useState<any>()
  const [isSocketWithAuthToken, setIsSocketWithAuthToken] = useState(false)
  const { data } = useSession()

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
        authorProfileId
      } = receivedData

      if (chatProfileId === profileId) {
        setMessages((prev) => {
          return [
            ...prev,
            {
              content,
              authorProfileId,
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
    if (socket && inputMessage.trim() !== '') {
      socket.emit('message', {
        profileId,
        content: inputMessage
      })
      setInputMessage('')
    }
  }
  return (
    <div className="h-full w-full bg-s-bg">
      <div className="px-4 py-3 font-semibold border-b borde-s-text">
        {title}
      </div>
      <div className="flex-grow overflow-auto p-2">
        <div>LiveChat: {profileId}</div>
      </div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <p>User: {msg.authorProfileId}</p>
            <p>Message: {msg.content}</p>
            <p>Time : {msg.time}</p>
          </div>
        ))}
      </div>

      {data?.type === SessionType.WithProfile ? (
        <>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </>
      ) : (
        <Button
          variant="contained"
          onClick={() => toast.error('You need to be logged in to chat')}
        >
          Login to chat
        </Button>
      )}
    </div>
  )
}

export default LiveChat
