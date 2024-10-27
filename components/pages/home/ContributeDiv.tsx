import React from 'react'
import { GITCOIN_ROUND_LINK } from '../../../utils/config'
import { motion } from 'framer-motion'
import Countdown from 'react-countdown'
const ContributeDiv = () => {
  return (
    <div
      className="lg:w-1/3 2xl:w-1/4"
      onClick={() => {
        window.open(GITCOIN_ROUND_LINK, '_blank')
      }}
    >
      <div className="w-full aspect-auto relative overflow-hidden sm:rounded-xl">
        <motion.img
          src={'/placeholders/blue-grad.png'}
          className="w-full h-full sm:rounded-xl object-cover"
          alt="thumbnail"
          initial={{
            rotate: 90,
            scale: 3
          }}
          animate={{
            rotate: 0,
            scale: 1.1
          }}
          transition={{
            duration: 5, // Duration of each loop
            repeatDelay: 5,
            repeat: Infinity, // Infinite looping
            repeatType: 'reverse' // Type of repeat (options: 'loop', 'mirror', 'reverse')
          }}
        />

        <motion.img
          animate={{
            rotate: [0, 360]
          }}
          transition={{
            duration: 20, // Duration of each loop
            ease: 'linear',
            repeat: Infinity, // Infinite looping
            repeatDelay: 0,
            repeatType: 'loop' // Type of repeat (options: 'loop', 'mirror', 'reverse')
          }}
          src="/images/blue-flower.png"
          className="absolute -top-16 -right-16 z-10 w-36"
        />
        <motion.img
          animate={{
            rotate: [0, 360]
          }}
          transition={{
            duration: 20, // Duration of each loop
            ease: 'linear',
            repeat: Infinity, // Infinite looping
            repeatDelay: 0,
            repeatType: 'loop' // Type of repeat (options: 'loop', 'mirror', 'reverse')
          }}
          src="/images/blue-flower.png"
          className="absolute -bottom-4 -left-12 z-10 w-28"
        />
        <div className="absolute z-20 top-0 right-0 left-0 bottom-0 flex flex-col bg-transparent text-white items-center justify-between p-3">
          <div className="px-3 centered-col gap-y-2">
            <div className="text-lg font-extrabold">
              Support BloomersTV on Gitcion Grants Round 22
            </div>
            <div className="text-xs font-normal">
              Your contribution of even just $1 will be matched, helping to
              create a greater impact in the development of this open-source
              project.
            </div>
          </div>

          <div className="w-full centered-col gap-y-1">
            <div className="text-xs text-white">
              <Countdown
                renderer={({ days, hours, minutes, seconds, completed }) => {
                  if (completed) {
                    return null
                  } else if (days > 0) {
                    return <div>{`${days} days till round closes`}</div>
                  } else if (hours > 0) {
                    return <div>{`${hours} hours till round closes`}</div>
                  } else {
                    return <div>{`${minutes} minutes till round closes`}</div>
                  }
                }}
                date={1730941140000}
              />
            </div>
            <a
              href={GITCOIN_ROUND_LINK}
              target="_blank"
              className="centered-row mx-2 font-bold text-white no-underline bg-white/20 w-full p-2 backdrop-blur-md rounded-md hover:bg-white/50 duration-300 ease-in-out transition-all"
            >
              Contribute Now
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContributeDiv
