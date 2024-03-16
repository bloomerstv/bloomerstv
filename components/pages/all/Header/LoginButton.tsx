'use client'

import { SessionType, useSession } from '@lens-protocol/react-web'
import React from 'react'
import AvatarWithOptions from './AvatarWithOptions'
import { Button } from '@mui/material'
import ModalWrapper from '../../../ui/Modal/ModalWrapper'
import LoginIcon from '@mui/icons-material/Login'
import LoginComponent from '../../../common/LoginComponent'
import { useTheme } from '../../../wrappers/TailwindThemeProvider'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import SignupComponent from '../../../common/SignupComponent'

const LoginButton = () => {
  const { data } = useSession()

  const [open, setOpen] = React.useState(false)
  const [openSignup, setOpenSignup] = React.useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const { theme } = useTheme()

  return (
    <>
      <ModalWrapper
        open={openSignup}
        title="Sign up"
        Icon={<PersonAddIcon fontSize="small" />}
        onClose={() => setOpenSignup(false)}
        onOpen={() => setOpenSignup(true)}
        classname="w-[450px]"
      >
        <SignupComponent
          openSignup={openSignup}
          setOpen={setOpen}
          setOpenSignup={setOpenSignup}
        />
      </ModalWrapper>
      <ModalWrapper
        open={open}
        title="login"
        Icon={<LoginIcon fontSize="small" />}
        onClose={handleClose}
        onOpen={handleOpen}
        classname="w-[450px]"
      >
        <LoginComponent open={open} onClose={handleClose} />
      </ModalWrapper>
      {data?.type === SessionType.Anonymous && (
        <div className="centered-row gap-x-2 sm:gap-x-4">
          <Button
            variant="outlined"
            onClick={() => setOpenSignup(true)}
            size="small"
            startIcon={
              <div className="sm:w-7 sm:h-7 h-6 w-6">
                <PersonAddIcon fontSize="inherit" />
              </div>
            }
            sx={{
              borderRadius: '12px'
            }}
          >
            Signup
          </Button>
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
                className="sm:w-7 sm:h-7 w-6 h-6 rounded-full"
              />
            }
            sx={{
              borderRadius: '12px'
            }}
          >
            Login
          </Button>
          {/* )} */}
        </div>
      )}
      {/* @ts-ignore */}
      <AvatarWithOptions profile={data?.profile} handleOpen={handleOpen} />
    </>
  )
}

export default LoginButton
