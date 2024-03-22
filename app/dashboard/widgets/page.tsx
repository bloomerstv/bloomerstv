'use client'
import Link from 'next/link'
import React from 'react'

const Widgets = () => {
  return (
    <div>
      <div className="">
        <div className="text-3xl font-bold">Stream Widgets</div>
        <div className="text-sm font-semibold text-s-text">
          Widgets are a great way to engage with your audience and make your
          stream more interactive.{' '}
          <span className="text-brand cursor-pointer">How to add?</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 mt-6">
        <div className="">
          <Link
            href="/dashboard/widgets/chat-box"
            className="text-p-text no-underline"
          >
            <div className="shadow-sm bg-p-bg hover:shadow-md rounded-xl cursor-pointer overflow-hidden transition-all ease-in-out duration-250">
              <img src={'/banner.png'} alt="banner" className="w-full" />
              <div className="text-lg pt-2 px-4 font-bold">Chat Box</div>
              <div className="text-sm pb-4 px-4 font-semibold text-s-text">
                The chat box allows you to display your live chat on your stream
              </div>
            </div>
          </Link>
        </div>
        <div className="">
          <Link
            href="/dashboard/widgets/alert-box"
            className="text-p-text no-underline"
          >
            <div className="shadow-sm bg-p-bg hover:shadow-md rounded-xl cursor-pointer overflow-hidden transition-all ease-in-out duration-250">
              <img src={'/banner.png'} alt="banner" className="w-full" />
              <div className="text-lg pt-2 px-4 font-bold">Alert Box</div>
              <div className="text-sm pb-4 px-4 font-semibold text-s-text">
                Use the alert box to display alerts, such as notifications for
                new followers and new collects.
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Widgets
