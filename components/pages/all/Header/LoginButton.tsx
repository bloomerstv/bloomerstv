'use client'
import React from 'react'
import AvatarWithOptions from './AvatarWithOptions'
import { Button } from '@mui/material'
import ModalWrapper from '../../../ui/Modal/ModalWrapper'
import LoginIcon from '@mui/icons-material/Login'
import LoginComponent from '../../../common/LoginComponent'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import SignupComponent from '../../../common/SignupComponent'
import useSession from '../../../../utils/hooks/useSession'

const LoginButton = () => {
  const { isAuthenticated } = useSession()

  const [open, setOpen] = React.useState(false)
  const [openSignup, setOpenSignup] = React.useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <div className="centered-row space-x-3">
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

      {!isAuthenticated && (
        // (!isAuthenticated ||
        //   (isAuthenticated && !authenticatedUser?.sponsored)) && (
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

          {/* todo for some reason sponsored is showing false , while the enable signless shows it is already signleless, wait for fix from lens team meanwhile remove the ability to signless */}
          {!isAuthenticated && (
            // (isAuthenticated && !authenticatedUser?.sponsored)) && (
            <Button
              variant="contained"
              onClick={handleOpen}
              size="small"
              startIcon={
                <img
                  src={`/Lens-Icon-T-White.svg`}
                  className="sm:w-7 sm:h-7 w-6 h-6 rounded-full"
                />
              }
              sx={{
                borderRadius: '12px'
              }}
            >
              {isAuthenticated ? 'Go Signless' : 'Login'}
            </Button>
          )}
          {/* )} */}
        </div>
      )}
      <AvatarWithOptions handleOpen={handleOpen} />
    </div>
  )
}

export default LoginButton
