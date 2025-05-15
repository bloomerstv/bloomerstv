import React from 'react'
import formatHandle from '../../../utils/lib/formatHandle'
import toast from 'react-hot-toast'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Button,
  ListItemIcon,
  Menu,
  MenuItem,
  MenuList,
  Tooltip
} from '@mui/material'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  useAddNotificationSubscriberToStreamerMutation,
  useIsSubscribedNotificationForStreamerQuery,
  useRemoveNotificationSubscriberFromStreamerMutation
} from '../../../graphql/generated'
import { useTheme } from '../../wrappers/TailwindThemeProvider'
import { Account } from '@lens-protocol/react'
import useSession from '../../../utils/hooks/useSession'

const FollowingButton = ({
  account,
  isFollowing,
  followLoading,
  unFollowing,
  handleFollow,
  handleUnFollow
}: {
  account: Account
  isFollowing: boolean
  followLoading: boolean
  unFollowing: boolean
  handleFollow: () => Promise<void>
  handleUnFollow: () => Promise<void>
}) => {
  const { isAuthenticated, account: sessionAccount } = useSession()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const isMenuOpen = Boolean(anchorEl)
  const { theme } = useTheme()
  const { data: isSubscribed, refetch } =
    useIsSubscribedNotificationForStreamerQuery({
      variables: {
        accountAddress: account.address
      },
      skip: !isAuthenticated || !account.address
    })

  const [addSubscriber] = useAddNotificationSubscriberToStreamerMutation({
    variables: {
      accountAddress: account.address
    },
    onCompleted: () => {
      toast.success(
        `You will recieve notification when ${formatHandle(account)} goes live!`
      )
      refetch()
    }
  })

  const [removeSubscriber] =
    useRemoveNotificationSubscriberFromStreamerMutation({
      variables: {
        accountAddress: account.address
      },
      onCompleted: () => {
        toast.success(
          `You will no longer recieve notifications from ${formatHandle(account)}`
        )
        refetch()
      }
    })

  const handleOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleOptionsClicked = (e) => {
    e.stopPropagation()
    setAnchorEl(e.currentTarget)
  }

  if (!isAuthenticated || sessionAccount?.address === account.address) {
    return null
  }

  return (
    <div>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={isMenuOpen}
        onClose={handleOptionsClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))',
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            borderRadius: '10px',
            width: '140px',
            padding: '0px',
            '& .MuiList-root': {
              padding: '5px 0px'
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuList className=" rounded-xl">
          <MenuItem
            onClick={async () => {
              if (isSubscribed?.isSubscribedNotificationForStreamer) return
              await addSubscriber()

              handleOptionsClose()
            }}
            sx={{
              backgroundColor: isSubscribed?.isSubscribedNotificationForStreamer
                ? theme === 'light'
                  ? 'rgba(0,0,0,0.1)'
                  : 'rgba(255,255,255,0.1)'
                : undefined
            }}
          >
            <ListItemIcon>
              <NotificationsActiveIcon fontSize="small" />
            </ListItemIcon>
            All
          </MenuItem>
          <MenuItem
            onClick={async () => {
              if (!isSubscribed?.isSubscribedNotificationForStreamer) return
              await removeSubscriber()
              handleOptionsClose()
            }}
            sx={{
              backgroundColor:
                !isSubscribed?.isSubscribedNotificationForStreamer
                  ? theme === 'light'
                    ? 'rgba(0,0,0,0.1)'
                    : 'rgba(255,255,255,0.1)'
                  : undefined
            }}
          >
            <ListItemIcon>
              <NotificationsOffIcon fontSize="small" />
            </ListItemIcon>
            None
          </MenuItem>
          <MenuItem
            onClick={async () => {
              await handleUnFollow()
              handleOptionsClose()
            }}
            disabled={unFollowing}
          >
            <ListItemIcon>
              <PersonRemoveIcon fontSize="small" />
            </ListItemIcon>
            Unfollow
          </MenuItem>
        </MenuList>
      </Menu>
      {isFollowing ? (
        <Button
          onClick={handleOptionsClicked}
          color="secondary"
          size="small"
          variant="contained"
          sx={{
            borderRadius: '20px',
            boxShadow: 'none',
            padding: '8px 16px',
            textTransform: 'none'
          }}
          className="font-semibold"
          startIcon={
            isSubscribed?.isSubscribedNotificationForStreamer ? (
              <NotificationsActiveIcon fontSize="large" />
            ) : (
              <NotificationsOffIcon fontSize="large" />
            )
          }
          endIcon={
            <KeyboardArrowDownIcon
              sx={{
                transform: isMenuOpen ? 'rotate(180deg)' : undefined
              }}
              fontSize="large"
              className="-mx-1"
            />
          }
          disableElevation
          autoCapitalize="none"
        >
          <div className="font-semibold text-sm">Following</div>
        </Button>
      ) : (
        <>
          <Tooltip title="Follow this streamer" arrow>
            <LoadingButton
              loading={followLoading}
              onClick={handleFollow}
              variant="contained"
              autoCapitalize="none"
              size="small"
              color="primary"
              disabled={followLoading}
              sx={{
                borderRadius: '20px',
                boxShadow: 'none',
                padding: '8px 20px',
                textTransform: 'none'
              }}
            >
              <div className="font-semibold text-sm">
                {isFollowing ? 'Following' : 'Follow'}
              </div>
            </LoadingButton>
          </Tooltip>
        </>
      )}
    </div>
  )
}

export default FollowingButton
