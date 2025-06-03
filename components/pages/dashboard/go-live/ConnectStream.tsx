import { Button, CircularProgress } from '@mui/material'
import React, { memo, useState } from 'react'
import ModalWrapper from '../../../ui/Modal/ModalWrapper'
import OBSSetupGuide from './OBSSetupGuide'
import { Info } from 'lucide-react'
import { Video } from 'lucide-react'
const ConnectStream = ({
  handleGoLiveFromBrowser
}: {
  handleGoLiveFromBrowser: () => void
}) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="font-bold flex flex-col items-center justify-center">
      <CircularProgress
        sx={{
          color: '#7a7a81'
        }}
        className="w-fit"
      />

      <div className="text-sm mt-4 text-[#7a7a81]">
        Connect streaming software to go live
      </div>
      <Button
        variant="text"
        onClick={() => {
          setOpen(true)
        }}
        size="small"
      >
        OBS Setup Guide
      </Button>

      <div className="text-sm font-bold text-[#7a7a81] mb-3">OR</div>

      {/* // button to go live from browser */}

      <Button
        variant="contained"
        className="w-full opacity-90"
        size="small"
        color="secondary"
        onClick={handleGoLiveFromBrowser}
        startIcon={<Video />}
      >
        Go Live from Browser
      </Button>

      {/* obs setup guide */}
      <ModalWrapper
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        Icon={<Info />}
        title="Connect OBS to Livepeer Studio"
        classname="w-[600px]"
        BotttomComponent={
          <div className="flex flex-row justify-end">
            <Button variant="contained" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        }
      >
        <OBSSetupGuide />
      </ModalWrapper>
    </div>
  )
}

export default memo(ConnectStream)
