import React, { memo, useEffect } from 'react'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import io from 'socket.io-client'
import { LIVE_CHAT_WEB_SOCKET_URL } from '../../../utils/config'
import clsx from 'clsx'
import { AnimatedCounter } from 'react-animated-counter'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import { useTheme } from '../../wrappers/TailwindThemeProvider'
const LiveCount = ({ profileId }: { profileId: string }) => {
  const [count, setCount] = React.useState(0)
  const isMobile = useIsMobile()
  const { theme } = useTheme()

  useEffect(() => {
    const newSocket = io(LIVE_CHAT_WEB_SOCKET_URL)

    newSocket.on('connect', () => {
      setTimeout(() => {
        newSocket.emit('join-liveCount', profileId)
      }, 1000) // Wait for 1 second before joining the room
    })

    newSocket.on('liveCountUpdate', ({ count, profileId: liveProfileId }) => {
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
  }, [])

  return (
    <div
      className={clsx(
        'centered-row sm:gap-x-1 text-xl sm:text-2xl text-p-text'
      )}
    >
      <PermIdentityIcon fontSize="inherit" />

      <AnimatedCounter
        value={count}
        includeDecimals={false}
        includeCommas={true}
        digitStyles={{
          fontWeight: 500
        }}
        color={theme === 'dark' ? '#ceced3' : '#1f1f23'}
        fontSize={isMobile ? '16px' : '18px'}
        incrementColor="#1976d2"
      />
      {/* <div className="text-base sm:text-lg font-semibold">{count}</div> */}
    </div>
  )
}

export default memo(LiveCount)
