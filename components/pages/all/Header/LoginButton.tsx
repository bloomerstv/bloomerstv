'use client'

import { SessionType, useSession } from '@lens-protocol/react-web'
import React from 'react'
import AvatarWithOptions from './AvatarWithOptions'
import { Button, IconButton } from '@mui/material'
import ModalWrapper from '../../../ui/Modal/ModalWrapper'
import LoginIcon from '@mui/icons-material/Login'
import LoginComponent from '../../../common/LoginComponent'
import useIsMobile from '../../../../utils/hooks/useIsMobile'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

const LoginButton = () => {
  const { data } = useSession()

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const isMobile = useIsMobile()

  return (
    <>
      <ModalWrapper
        open={open}
        title="login"
        Icon={<LoginIcon fontSize="small" />}
        onClose={handleClose}
        onOpen={handleOpen}
      >
        <LoginComponent onClose={handleClose} />
      </ModalWrapper>
      {data?.type === SessionType.Anonymous && (
        <>
          {isMobile ? (
            <IconButton onClick={handleOpen}>
              <AccountCircleIcon />
            </IconButton>
          ) : (
            <Button
              variant="contained"
              onClick={handleOpen}
              startIcon={<AccountCircleIcon />}
            >
              Login
            </Button>
          )}
        </>
      )}
      {data?.type === SessionType.WithProfile && (
        <AvatarWithOptions profile={data.profile} />
      )}
    </>
  )
}

export default LoginButton
