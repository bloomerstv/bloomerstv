import React from 'react'
import { motion } from 'framer-motion'
import { Tooltip } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { formatNumber } from '@/utils/formatters'
import { ZoraCoin } from './types'
import {
  calculateMarketCapPercentageChange,
  formatPercentage,
  isPriceChangePositive,
  calculateTokenPrice
} from './utils'

interface CoinHeaderProps {
  coin: ZoraCoin
  expanded: boolean
  onToggle: () => void
  buyMode: boolean
  sellMode: boolean
}

const CoinHeader: React.FC<CoinHeaderProps> = ({
  coin,
  expanded,
  onToggle,
  buyMode,
  sellMode
}) => {
  const marketCapPercentageChange = calculateMarketCapPercentageChange(
    coin.marketCap,
    coin.marketCapDelta24h
  )
  const priceChangePositive = isPriceChangePositive(marketCapPercentageChange)
  const tokenPrice = calculateTokenPrice(coin.marketCap, coin.totalSupply)

  const arrowVariants = {
    collapsed: { rotate: 0 },
    expanded: { rotate: 180 }
  }

  return (
    <div
      className="p-3 flex items-center justify-between cursor-pointer hover:bg-opacity-70 transition-colors"
      onClick={() => !buyMode && !sellMode && onToggle()}
    >
      <div className="flex items-center space-x-3">
        <motion.div
          className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 border-2 border-indigo-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {coin.mediaContent?.previewImage?.small ? (
            <img
              src={coin.mediaContent.previewImage.small}
              alt={coin.symbol}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="font-bold text-indigo-600">
              {coin.symbol.substring(0, 2)}
            </span>
          )}
        </motion.div>
        <div>
          <div className="flex items-center">
            <span className="font-bold text-p-text">{coin.symbol}</span>
            <Tooltip title="Featured Zora coin">
              <InfoOutlinedIcon
                sx={{
                  fontSize: 14,
                  marginLeft: '4px',
                  color: 'text.secondary',
                  cursor: 'help'
                }}
              />
            </Tooltip>
          </div>
          <div className="text-xs text-s-text">
            Market Cap: ${formatNumber(Number(coin.marketCap))}
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <div className="text-right mr-2">
          <div className="font-medium text-p-text">${tokenPrice}</div>
          <div
            className={`text-xs flex items-center ${priceChangePositive ? 'text-green-500' : 'text-red-500'}`}
          >
            {priceChangePositive ? (
              <TrendingUpIcon sx={{ fontSize: 14, marginRight: '2px' }} />
            ) : (
              <TrendingDownIcon sx={{ fontSize: 14, marginRight: '2px' }} />
            )}
            {formatPercentage(marketCapPercentageChange)}
          </div>
        </div>
        <motion.div
          variants={arrowVariants}
          initial="collapsed"
          animate={expanded ? 'expanded' : 'collapsed'}
          transition={{ duration: 0.3 }}
        >
          <KeyboardArrowDownIcon color="action" />
        </motion.div>
      </div>
    </div>
  )
}

export default CoinHeader
