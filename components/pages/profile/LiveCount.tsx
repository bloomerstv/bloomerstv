import React, { memo } from 'react'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import { useEffectOnce } from 'usehooks-ts'
import io from 'socket.io-client'
import { LIVE_CHAT_WEB_SOCKET_URL } from '../../../utils/config'
import clsx from 'clsx'
const LiveCount = ({
  profileId,
  className
}: {
  profileId: string
  className?: string
}) => {
  const [count, setCount] = React.useState(0)

  useEffectOnce(() => {
    const newSocket = io(LIVE_CHAT_WEB_SOCKET_URL)

    newSocket.on('connect', () => {
      setTimeout(() => {
        newSocket.emit('join-liveCount', profileId)
      }, 1000) // Wait for 1 second before joining the room
    })

    newSocket.on('liveCountUpdate', ({ count, profileId: liveProfileId }) => {
      console.log('liveCountUpdate', { count, profileId: liveProfileId })
      if (liveProfileId === profileId) {
        setCount(count)
      }
    })

    // newSocket.on('connect', () => {
    //   setTimeout(() => {
    //     newSocket.emit('join', profileId)
    //   }, 1000) // Wait for 1 second before joining the room
    // })

    return () => {
      newSocket?.disconnect()
      newSocket?.removeAllListeners()
    }
  })

  return (
    <div className={clsx('start-row gap-x-1 text-xl text-brand', className)}>
      <PermIdentityIcon fontSize="inherit" />
      <div className="text-base font-semibold">{count}</div>
    </div>
  )
}

export default memo(LiveCount)
