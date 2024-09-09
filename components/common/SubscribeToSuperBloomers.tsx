import React, { useState } from 'react'
import useIsMobile from '../../utils/hooks/useIsMobile'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { SuperFluidInfo } from '../../utils/config'
import VerifiedBadge from '../ui/VerifiedBadge'

const SubscribeToSuperBloomers = () => {
  const isMobile = useIsMobile()
  const [isHovered, setIsHovered] = useState(false)

  const iconVariants = {
    hidden: { opacity: 0, x: -5, y: 5 },
    visible: { opacity: 1, x: 0, y: 0 }
  }

  if (isMobile) return null

  return (
    <motion.a
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileTap={{ scale: 0.9 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="m-3 rounded-lg bg-p-bg text-s-text p-2 cursor-pointer no-underline"
      href={SuperFluidInfo.checkoutLink}
      target="_blank"
    >
      <div className="font-semibold text-base text-brand mb-2 start-center-row gap-x-1">
        <div>Super Bloomers</div>
        <VerifiedBadge />
        <motion.div
          initial="hidden"
          animate={isHovered ? 'visible' : 'hidden'}
          variants={iconVariants}
          transition={{ duration: 0.3 }}
          className="text-p-text"
        >
          <ArrowUpRight size={16} />
        </motion.div>
      </div>
      <div className="font-semibold text-xs">
        Subscribe at just $5~ per month using Bonsai, WMATIC, or USDC to support
        this project
      </div>
    </motion.a>
  )
}

export default SubscribeToSuperBloomers
