'use client'

import { SessionType, useSession } from '@lens-protocol/react-web'
import React from 'react'
import AvatarWithOptions from './AvatarWithOptions'
import { Button } from '@mui/material'
import ModalWrapper from '../../../ui/Modal/ModalWrapper'
import LoginIcon from '@mui/icons-material/Login'
import LoginComponent from '../../../common/LoginComponent'
import { useTheme } from '../../../wrappers/TailwindThemeProvider'

const LoginButton = () => {
  const { data } = useSession()

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const { theme } = useTheme()

  return (
    <>
      <ModalWrapper
        open={open}
        title="login"
        Icon={<LoginIcon fontSize="small" />}
        onClose={handleClose}
        onOpen={handleOpen}
      >
        <LoginComponent open={open} onClose={handleClose} />
      </ModalWrapper>
      {data?.type === SessionType.Anonymous && (
        <>
          {/* {isMobile ? (
            <IconButton onClick={handleOpen}>
              <img
                src={`/Lens-Icon-T-${theme === 'dark' ? 'Black' : 'White'}.svg`}
                className="w-8 h-8 rounded-full"
              />
            </IconButton>
          ) : ( */}
          <Button
            variant="contained"
            onClick={handleOpen}
            size="small"
            startIcon={
              <img
                src={`/Lens-Icon-T-${theme === 'dark' ? 'Black' : 'White'}.svg`}
                className="w-8 h-8 rounded-full"
              />
            }
          >
            Login
          </Button>
          {/* )} */}
        </>
      )}
      {/* @ts-ignore */}
      <AvatarWithOptions profile={data?.profile} handleOpen={handleOpen} />
    </>
  )
}

export default LoginButton
