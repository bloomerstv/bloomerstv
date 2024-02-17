import { Profile, useLogout } from '@lens-protocol/react-web'
import React from 'react'
import getAvatar from '../../../../utils/lib/getAvatar'
import {
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  MenuList
} from '@mui/material'
import Logout from '@mui/icons-material/Logout'
import formatHandle from '../../../../utils/lib/formatHandle'
import { useTheme } from '../../../wrappers/TailwindThemeProvider'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import { useDisconnect } from 'wagmi'
import { useRouter } from 'next/navigation'
import Settings from '@mui/icons-material/Settings'
// import CircleIcon from '@mui/icons-material/Circle'
import useIsMobile from '../../../../utils/hooks/useIsMobile'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'

const AvatarWithOptions = ({
  profile,
  handleOpen
}: {
  profile?: Profile
  handleOpen: () => void
}) => {
  const isMobile = useIsMobile()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const { theme, toggleTheme } = useTheme()

  const { disconnectAsync } = useDisconnect()
  const { execute } = useLogout()

  const handleLogout = async () => {
    await disconnectAsync()
    await execute()
    handleClose()
  }

  const handleSwitchProfile = async () => {
    await execute()
    handleOpen()
    handleClose()
  }

  const { push } = useRouter()
  if (!profile) return null
  return (
    <div>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <img
          src={getAvatar(profile)}
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              push(`/${formatHandle(profile)}`)
              handleClose()
            }}
          >
            <img
              src={getAvatar(profile)}
              alt="avatar"
              className="w-6 h-6 rounded-full mr-3"
            />
            {formatHandle(profile)}
          </MenuItem>
          <MenuItem onClick={handleSwitchProfile}>
            <ListItemIcon>
              <SwapHorizIcon fontSize="small" />
            </ListItemIcon>
            Switch Profile
          </MenuItem>
          <Divider />

          {!isMobile && (
            <>
              {/* <MenuItem
                onClick={() => {
                  push(`/dashboard/go-live`)
                  handleClose()
                }}
              >
                <ListItemIcon>
                  <CircleIcon fontSize="small" />
                </ListItemIcon>
                Go live
              </MenuItem> */}

              <MenuItem
                onClick={() => {
                  push(`/dashboard/content`)
                  handleClose()
                }}
              >
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Dashboard
              </MenuItem>
            </>
          )}

          <MenuItem onClick={toggleTheme}>
            <ListItemIcon>
              {theme === 'light' ? (
                <ToggleOffIcon fontSize="small" />
              ) : (
                <ToggleOnIcon fontSize="small" />
              )}
            </ListItemIcon>
            Dark Mode
          </MenuItem>

          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  )
}

export default AvatarWithOptions
