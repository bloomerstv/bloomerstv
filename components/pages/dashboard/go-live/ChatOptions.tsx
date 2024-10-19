import React from 'react'
import { Button, ListItemIcon, Menu, MenuItem, MenuList } from '@mui/material'
import { useRouter } from 'next/navigation'
import { defaultSponsored, HEY_APP_LINK } from '../../../../utils/config'
import BlockIcon from '@mui/icons-material/Block'
import {
  SessionType,
  useBlockProfiles,
  useProfile,
  useSession
} from '@lens-protocol/react-web'
import ModalWrapper from '../../../ui/Modal/ModalWrapper'
import toast from 'react-hot-toast'
import LoadingButton from '@mui/lab/LoadingButton'

const ChatOptions = ({
  handle,
  avatarUrl,
  profileId,
  chatProfileId,
  socket,
  anchorEl,
  setAnchorEl,
  onClose
}: {
  chatProfileId?: string
  profileId?: string
  handle: string
  avatarUrl: string
  socket: any
  anchorEl?: any
  setAnchorEl: (anchorEl: any) => void
  onClose: () => void
}) => {
  const [isPopUpOpen, setIsPopUpOpen] = React.useState(false)

  const { data } = useSession()
  const handleClose = () => {
    setAnchorEl(null)
    onClose?.()
  }

  const { data: profile, loading: profileLoading } = useProfile({
    // @ts-ignore
    forProfileId: profileId
  })
  const { push } = useRouter()
  const { execute: blockProfiles, loading } = useBlockProfiles()

  const handleBanAndBlock = async () => {
    if (!profileId || profileLoading) return

    if (profile) {
      try {
        // send block request on lens

        const { isFailure } = await blockProfiles({
          profiles: [profile],
          sponsored: defaultSponsored
        })

        if (isFailure()) {
          toast.error(
            'Failed to block profile on lens. But message will be removed from chat.'
          )
        }

        // send block request on ws, after confirmation from ws, user with profileId will be blocked in real time from chatting
        socket.emit('block-profile', profile?.id)

        setIsPopUpOpen(false)
      } catch (error) {
        toast.error(String(error))
      }
    } else {
      socket.emit('block-profile', profileId)

      setIsPopUpOpen(false)
    }
  }

  const openBanAndBlockPopup = () => {
    setIsPopUpOpen(true)
  }

  const open = Boolean(anchorEl)

  const isWalletMsg = profileId && profileId?.length > 20

  return (
    <div>
      <ModalWrapper
        onClose={() => setIsPopUpOpen(false)}
        onOpen={() => setIsPopUpOpen(true)}
        open={isPopUpOpen}
        title="Ban & Block"
        classname="w-[500px]"
        Icon={<BlockIcon />}
        BotttomComponent={
          <div className="flex flex-row justify-end gap-x-4">
            <Button variant="outlined" onClick={() => setIsPopUpOpen(false)}>
              Cancel
            </Button>

            <LoadingButton
              loading={loading}
              loadingPosition="start"
              disabled={loading}
              variant="contained"
              onClick={handleBanAndBlock}
            >
              Block & Remove {handle}'s Chat Messages
            </LoadingButton>
          </div>
        }
      >
        <div className="space-y-2 ">
          <div className="font-bold text-lg">
            Are you sure you want to block and remove all chat messages from{' '}
            {handle}?
          </div>

          {profile && (
            <div className="text-sm text-s-text font-semibold">
              This actions is also a lens block, so you won't be able to see{' '}
              {handle}'s posts from other lens clients.
            </div>
          )}

          {profile && (
            <div className="text-sm text-s-text font-semibold">
              Chat Messages are removed just from this bloomerstv chat and
              corresponding Lens Comments can't be removed.
            </div>
          )}
        </div>
      </ModalWrapper>

      <Menu
        anchorEl={anchorEl}
        id="options"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuList>
          {!isWalletMsg && (
            <MenuItem
              onClick={() => {
                push(`/${handle}`)
                handleClose()
              }}
            >
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-6 h-6 rounded-full mr-3"
              />
              Visit Profile
            </MenuItem>
          )}

          {!isWalletMsg && (
            <MenuItem
              onClick={() => {
                window.open(`${HEY_APP_LINK}/u/${handle}`, '_blank')
              }}
            >
              <img
                src={'/icons/heyIcon.png'}
                className="w-6 h-6 mr-3"
                alt="hey"
              />
              Hey Profile
            </MenuItem>
          )}

          {socket &&
            data?.type === SessionType.WithProfile &&
            profile?.id !== data?.profile?.id &&
            chatProfileId === data?.profile?.id && (
              <MenuItem onClick={openBanAndBlockPopup}>
                <ListItemIcon>
                  <BlockIcon fontSize="small" />
                </ListItemIcon>
                Ban & Block
              </MenuItem>
            )}
        </MenuList>
      </Menu>
    </div>
  )
}

export default ChatOptions
