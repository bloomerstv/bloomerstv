import React from 'react'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import {
  Backdrop,
  Box,
  Fade,
  IconButton,
  Modal,
  SwipeableDrawer
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
// todo: show available profiles modal and allow user to select profile to login
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
}

const ModalWrapper = ({
  children,
  title,
  Icon,
  onClose,
  onOpen,
  open
}: {
  children: React.ReactNode
  title?: string
  Icon?: React.ReactNode
  onClose: () => void
  onOpen: () => void
  open: boolean
}) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        onOpen={onOpen}
        sx={{
          '.MuiDrawer-paper': {
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px'
          }
        }}
      >
        {/* show a drawer handle here*/}
        <div className="centered-row w-full p-3">
          <div className="w-16 h-1.5 bg-s-text rounded-full"></div>
        </div>
        <div className="p-4 rounded-t-lg">{children}</div>
      </SwipeableDrawer>
    )
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500
        }
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <div className="min-w-[400px] bg-p-bg rounded-xl shadow-xl">
            <div className="between-row p-4 border-b border-s-text">
              <div className="start-row space-x-4">
                <div className="centered-row">{Icon}</div>
                <div className="text-p-text font-bold">{title}</div>
              </div>

              {/* close button */}

              <IconButton aria-label="close" size="small" onClick={onClose}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </div>
            <div className="p-4">{children}</div>
          </div>
        </Box>
      </Fade>
    </Modal>
  )
}

export default ModalWrapper
