import { Button, CircularProgress } from '@mui/material'
import React, { memo, useState } from 'react'
import ModalWrapper from '../../../ui/Modal/ModalWrapper'
import InfoIcon from '@mui/icons-material/Info'
import Markup from '../../../common/Lexical/Markup'

const ConnectStream = () => {
  const [open, setOpen] = useState(false)
  return (
    <div className="space-y-4 font-bold flex flex-col items-center justify-center">
      <CircularProgress
        sx={{
          color: '#7a7a81'
        }}
        className="w-fit"
      />

      <div className="text-sm text-[#7a7a81]">
        Connect streaming software to go live
      </div>
      <Button
        variant="text"
        onClick={() => {
          setOpen(true)
        }}
      >
        OBS Setup Guide
      </Button>

      <ModalWrapper
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        Icon={<InfoIcon />}
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
        <div className="font-bold space-y-2 ">
          <div className="flex flex-row items-start">
            <div className="mr-2">1.</div>
            <div> Select Stream settings</div>
          </div>
          <div className="flex flex-row items-start">
            <div className="mr-2">2.</div>
            <div>
              Select Show All… and then Livepeer Studio for the service.
            </div>
          </div>
          <div className="flex flex-row items-start">
            <div className="mr-2">3.</div>
            <div>
              Keep the Default Server and paste the Stream Key into the “Stream
              Key” field.
            </div>
          </div>
          <div className="flex flex-row items-start text-s-text text-sm px-6">
            <div>
              It is highly recommended to not ignore the streaming service
              recommendations.
            </div>
          </div>
        </div>
        <div className="centered-row w-full ">
          <img src="/OBS4.png" className="w-[520px]" />
        </div>

        <div className="font-bold space-y-2">
          <div className="flex flex-row items-start">
            <div className="mr-2">4.</div>
            <div className="w-full">
              <div>Recommended OBS Settings</div>
              <div className="centered-row w-full my-2">
                <img
                  src="/OBSRecommendedSettings.png"
                  className="w-[450px] rounded-xl shadow-xl"
                />
              </div>
              <Markup className="font-semibold text-sm text-s-text">
                {`Rate Control: CRF \n CRF: 25 \n Keyframe Interval: 1 \n CPU Usage Preset: Very fast \n Profile: High \n Tune: None \n x264 options: bframes=0 \n Resolution: 1080p
                `}
              </Markup>
            </div>
          </div>
          <div className="flex flex-row items-start">
            <div className="mr-2">5.</div>
            <div>
              Stay on this go-live page and click the “Start Streaming” button.
              Stream will start soon & a Post will be created.
            </div>
          </div>
        </div>
      </ModalWrapper>
    </div>
  )
}

export default memo(ConnectStream)
