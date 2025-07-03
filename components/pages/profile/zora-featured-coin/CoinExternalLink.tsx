import React from 'react'
import { motion } from 'framer-motion'
import { ExternalLinkIcon } from 'lucide-react'
import { ZoraCoin } from './types'

interface CoinExternalLinkProps {
  coin: ZoraCoin
}

const CoinExternalLink: React.FC<CoinExternalLinkProps> = ({ coin }) => {
  // Open coin URL in new tab
  const openCoinUrl = () => {
    if (coin?.address) {
      const url = `https://zora.co/coin/base:${coin.address.toLowerCase()}`
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="mb-3"
    >
      <div
        onClick={openCoinUrl}
        className="flex items-center text-blue-500 hover:text-blue-600 cursor-pointer text-xs py-1"
      >
        <ExternalLinkIcon size={14} className="mr-1" />
        <span>View on Zora</span>
      </div>
    </motion.div>
  )
}

export default CoinExternalLink
