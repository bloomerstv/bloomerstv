import React from 'react'
import Markup from '../../../common/Lexical/Markup'

const OBSSetupGuide = () => {
  return (
    <div>
      <video
        src="/HowToStream.mp4"
        autoPlay
        muted
        loop
        className="w-full rounded-xl shadow-sm"
      />
      <div className="font-bold space-y-2 ">
        <div className="flex flex-row items-start">
          <div className="mr-2">1.</div>
          <div> Select Stream settings</div>
        </div>
        <div className="flex flex-row items-start">
          <div className="mr-2">2.</div>
          <div>Select Show All… and then Livepeer Studio for the service.</div>
        </div>
        <div className="flex flex-row items-start">
          <div className="mr-2">3.</div>
          <div>
            Keep the Default Server and paste the Stream Key from go-live page
            into the “Stream Key” field of OBS.
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
    </div>
  )
}

export default OBSSetupGuide
