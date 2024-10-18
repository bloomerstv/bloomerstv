import { IconButton } from '@mui/material'
import clsx from 'clsx'
import React from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ChatOptions from './ChatOptions'

const ChatOptionsButton = ({
  handle,
  avatarUrl,
  profileId,
  chatProfileId,
  socket,
  className
}: {
  chatProfileId?: string
  profileId?: string
  handle: string
  avatarUrl: string
  socket: any
  className?: string
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [keepShowingMoreIcon, setKeepShowingMoreIcon] = React.useState(false)

  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setKeepShowingMoreIcon(true)
    setAnchorEl(event.currentTarget)
  }
  return (
    <div
      className={clsx(
        'absolute top-0 -translate-y-1 right-0',
        !keepShowingMoreIcon && 'group-hover:block hidden'
      )}
    >
      <div className={clsx('rounded-full', className)}>
        <IconButton
          size="small"
          aria-controls={open ? 'options' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          color="inherit"
        >
          <MoreVertIcon color="inherit" />
        </IconButton>
      </div>
      {open && (
        <ChatOptions
          chatProfileId={chatProfileId}
          profileId={profileId}
          handle={handle}
          avatarUrl={avatarUrl}
          socket={socket}
          setAnchorEl={setAnchorEl}
          anchorEl={anchorEl}
          onClose={() => setKeepShowingMoreIcon(false)}
        />
      )}
    </div>
  )
}

export default ChatOptionsButton
