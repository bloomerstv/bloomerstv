import React from 'react'
import getAvatar from '../../../../utils/lib/getAvatar'
import {
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  MenuList,
  SwipeableDrawer
} from '@mui/material'
import { LogOut, ToggleLeft, ToggleRight, ArrowLeftRight, LayoutDashboard, Sun, Moon } from 'lucide-react'
import formatHandle from '../../../../utils/lib/formatHandle'
import { useTheme } from '../../../wrappers/TailwindThemeProvider'
import { useDisconnect } from 'wagmi'
import { useRouter } from 'next/navigation'
import useIsMobile from '../../../../utils/hooks/useIsMobile'
import getStampFyiURL from '../../../../utils/getStampFyiURL'
import useEns from '../../../../utils/hooks/useEns'
import LoadingImage from '../../../ui/LoadingImage'
import AppLinksRow from '../../../common/AppLinksRow'
import useSession from '../../../../utils/hooks/useSession'
import { useLogout } from '@lens-protocol/react'


const AvatarWithOptions = ({ handleOpen }: { handleOpen: () => void }) => {
  const isMobile = useIsMobile()
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const { isAuthenticated, account } = useSession()
  const { ensAvatar } = useEns({
    address: isAuthenticated && !account?.username ? account?.owner : null
  })

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
  if (!isAuthenticated) return null

  const avatar = isAuthenticated
    ? getAvatar(account!)
    : (ensAvatar ?? getStampFyiURL(account?.owner!))

  const handle = account?.username?.localName
  // data?.type === SessionType.WithProfile
  //   ? formatHandle(data?.profile)
  //   : (ensName ?? getShortAddress(data?.address!))

  if (isMobile) {
    return (
      <div>
        <IconButton
          onClick={() => {
            setDrawerOpen(true)
          }}
          size="small"
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <LoadingImage
            src={avatar}
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
        </IconButton>

        <SwipeableDrawer
          anchor="right"
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false)
          }}
          onOpen={() => {
            setDrawerOpen(true)
          }}
          sx={{
            '.MuiDrawer-paper': {
              borderTopLeftRadius: '6px',
              borderBottomLeftRadius: '6px',
              background: theme === 'light' ? '#FFFFFF' : '#1E1E1E',
              overflowX: 'hidden'
            }
          }}
        >
          <div className="w-[200px] pb-4 h-full flex flex-col justify-between">
            <MenuList>
              <MenuItem
                onClick={() => {
                  if (!account) return
                  push(`/${formatHandle(account)}`)
                  handleClose()
                }}
              >
                <LoadingImage
                  src={avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full mr-3"
                />
                {handle}
              </MenuItem>

              {account && (
                <MenuItem onClick={handleSwitchProfile}>
                  <ListItemIcon>
                    <ArrowLeftRight size={16} />
                  </ListItemIcon>
                  Switch Profile
                </MenuItem>
              )}
              {/* <Divider /> */}

              {!isMobile && account && (
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
                      <LayoutDashboard size={16} />
                    </ListItemIcon>
                    Content
                  </MenuItem>
                </>
              )}

              <MenuItem onClick={toggleTheme}>
                <ListItemIcon>
                  {theme === 'light' ? (
                    <ToggleLeft size={16} />
                  ) : (
                    <ToggleRight size={16} />
                  )}
                </ListItemIcon>
                Dark Mode
              </MenuItem>

              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogOut size={16} />
                </ListItemIcon>
                Logout
              </MenuItem>
            </MenuList>
            <AppLinksRow />
          </div>
        </SwipeableDrawer>
      </div>
    )
  }

  return (
    <div>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <LoadingImage
          src={avatar}
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
              if (!account) return
              push(`/${formatHandle(account)}`)
              handleClose()
            }}
          >
            <img
              src={avatar}
              alt="avatar"
              className="w-6 h-6 rounded-full mr-3"
            />
            {handle}
          </MenuItem>

          {account && (
            <MenuItem onClick={handleSwitchProfile}>
              <ListItemIcon>
                <ArrowLeftRight size={16} />
              </ListItemIcon>
              Switch Profile
            </MenuItem>
          )}
          <Divider />

          {!isMobile && account && (
            <>
              <MenuItem
                onClick={() => {
                  push(`/dashboard/content`)
                  handleClose()
                }}
              >
                <ListItemIcon>
                  <LayoutDashboard size={16} />
                </ListItemIcon>
                Content
              </MenuItem>
            </>
          )}

          <MenuItem onClick={toggleTheme}>
            <ListItemIcon>
              {theme === 'light' ? (
                <Sun size={16} />
              ) : (
                <Moon size={16} />
              )}
            </ListItemIcon>
            Dark Mode
          </MenuItem>

          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogOut size={16} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  )
}

export default AvatarWithOptions
