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
import clsx from 'clsx'
import { useTheme } from '../../wrappers/TailwindThemeProvider'
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
  open,
  classname,
  BotttomComponent,
  hideBackdrop = false,
  keepOpenOnBgClick = false
}: {
  children: React.ReactNode
  title?: string
  Icon?: React.ReactNode
  onClose: () => void
  onOpen: () => void
  open: boolean
  classname?: string
  BotttomComponent?: React.ReactNode
  hideBackdrop?: boolean
  keepOpenOnBgClick?: boolean
}) => {
  const isMobile = useIsMobile()
  const { theme } = useTheme()

  if (isMobile) {
    return (
      <SwipeableDrawer
        hideBackdrop={hideBackdrop}
        anchor="bottom"
        open={open}
        onClose={(e) => {
          if (keepOpenOnBgClick && Boolean(e)) return
          onClose()
        }}
        onOpen={onOpen}
        disableSwipeToOpen
        sx={{
          '.MuiDrawer-paper': {
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            background: theme === 'light' ? '#FFFFFF' : '#1E1E1E',
            overflowX: 'hidden'
          }
        }}
      >
        {/* show a drawer handle here*/}
        <div className="centered-row w-full p-3">
          <div className="w-16 h-1.5 bg-s-text rounded-full"></div>
        </div>
        <div className="rounded-t-lg">{children}</div>

        {/* show a bottom component here */}
        {BotttomComponent && (
          <div className="p-4 rounded-t-lg">{BotttomComponent}</div>
        )}
      </SwipeableDrawer>
    )
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={keepOpenOnBgClick ? undefined : onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500
        }
      }}
      sx={{}}
      hideBackdrop={hideBackdrop}
    >
      <Fade in={open}>
        <Box sx={style}>
          <div className="min-w-[400px] bg-s-bg rounded-xl shadow-xl">
            <div className="between-row p-4 border-b border-p-border">
              <div className="start-center-row space-x-2">
                <div className="centered-row">{Icon}</div>
                <div className="text-p-text font-bold">{title}</div>
              </div>

              {/* close button */}

              <IconButton aria-label="close" size="small" onClick={onClose}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </div>
            <div className={clsx('max-h-[650px] overflow-auto ', classname)}>
              <div className="p-4">{children}</div>
            </div>

            {/* show a bottom component here */}
            {BotttomComponent && (
              <div
                className="px-4 py-2
              border-t border-p-border
              "
              >
                {BotttomComponent}
              </div>
            )}
          </div>
        </Box>
      </Fade>
    </Modal>
  )
}

export default React.memo(ModalWrapper)
