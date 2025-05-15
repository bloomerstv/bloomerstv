'use client'
import Link from 'next/link'
import React from 'react'
import {
  ALERT_BOX_PREVIEW_VIDEO,
  CHAT_BOX_PREVIEW_VIDEO,
  HOW_TO_ADD_WIDGETS_VIDEO
} from '../../../utils/config'
import ModalWrapper from '../../../components/ui/Modal/ModalWrapper'
import InfoIcon from '@mui/icons-material/Info'
import { Button } from '@mui/material'

const Widgets = () => {
  const [open, setOpen] = React.useState(false)
  return (
    <div>
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
        <video
          src={HOW_TO_ADD_WIDGETS_VIDEO}
          autoPlay
          muted
          loop
          controls={true}
          className="w-full rounded-xl shadow-sm"
        />
        <div className="font-bold space-y-2 ">
          <div className="flex flex-row items-start">
            <div className="mr-2">1.</div>
            <div>Copy Source URl of the widget</div>
          </div>
          <div className="flex flex-row items-start">
            <div className="mr-2">2.</div>
            <div>
              Add browser source on your obs or streaming software and paste the
              source url.
            </div>
          </div>
          <div className="flex flex-row items-start">
            <div className="mr-2">3.</div>
            <div>
              Place and adjust the widget on your stream as per your preference.
            </div>
          </div>
          <div className="flex flex-row items-start text-s-text text-sm px-6">
            <div>
              Don't forget to copy & update source url if you change values
              other than width & height.
            </div>
          </div>
        </div>
      </ModalWrapper>
      <div className="">
        <div className="text-3xl font-bold">Stream Widgets</div>
        <div className="text-sm font-semibold text-s-text">
          Widgets are a great way to engage with your audience and make your
          stream more interactive.{' '}
          <span
            className="text-brand cursor-pointer"
            onClick={() => setOpen(true)}
          >
            How to add?
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 mt-6">
        <div className="">
          <Link
            href="/dashboard/widgets/chat-box"
            className="text-p-text no-underline"
          >
            <div className="shadow-sm bg-p-bg hover:shadow-md rounded-xl cursor-pointer overflow-hidden transition-all ease-in-out duration-250">
              <video
                autoPlay
                muted
                loop
                controls={false}
                src={CHAT_BOX_PREVIEW_VIDEO}
                className="w-full"
              />
              {/* <img src={'/banner.png'} alt="banner" className="w-full" /> */}
              <div className="text-lg pt-2 px-4 font-bold">Chat Box</div>
              <div className="text-sm pb-4 px-4 font-semibold text-s-text">
                The chat box allows you to display your live chat on your stream
              </div>
            </div>
          </Link>
        </div>
        <div className="">
          {/* <Link
            href="/dashboard/widgets/alert-box"
            className="text-p-text no-underline"
          >
            <div className="shadow-sm bg-p-bg hover:shadow-md rounded-xl cursor-pointer overflow-hidden transition-all ease-in-out duration-250">
              <video
                autoPlay
                muted
                loop
                controls={false}
                src={ALERT_BOX_PREVIEW_VIDEO}
                className="w-full"
              />
              <div className="text-lg pt-2 px-4 font-bold">
                Alert Box (Comming Soon)
              </div>
              <div className="text-sm pb-4 px-4 font-semibold text-s-text">
                Use the alert box to display alerts, such as notifications for
                new followers and new collects.
              </div>
            </div>
          </Link> */}

          <div className="text-p-text no-underline">
            <div className="shadow-sm bg-p-bg hover:shadow-md rounded-xl cursor-pointer overflow-hidden transition-all ease-in-out duration-250">
              <video
                autoPlay
                muted
                loop
                controls={false}
                src={ALERT_BOX_PREVIEW_VIDEO}
                className="w-full"
              />
              <div className="text-lg pt-2 px-4 font-bold">
                Alert Box (Comming Soon)
              </div>
              <div className="text-sm pb-4 px-4 font-semibold text-s-text">
                Use the alert box to display alerts, such as notifications for
                new followers and new collects.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Widgets
