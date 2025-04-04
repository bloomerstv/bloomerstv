import React, { useEffect, useState } from 'react'
import { getCoin } from '@zoralabs/coins-sdk'
import { CircularProgress, Tooltip, Button } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import LaunchIcon from '@mui/icons-material/Launch'
import { motion, AnimatePresence } from 'framer-motion'

interface ZoraCoin {
  id: string
  name: string
  symbol: string
  description?: string
  address: string
  totalSupply?: string
  marketCap?: string
  volume24h?: string
  marketCapDelta24h?: string
  createdAt?: string
  creatorAddress?: string
  uniqueHolders?: number
  mediaContent?: {
    mimeType?: string
    originalUri?: string
    previewImage?: {
      small?: string
      medium?: string
      blurhash?: string
    }
  }
}

interface ZoraFeaturedCoinProps {
  coinAddress?: string
  className?: string
}

const DEFAULT_COIN_ADDRESS = '0xf331483ed4158d6d3b0d75264fe74cbe40402175'

const ZoraFeaturedCoin: React.FC<ZoraFeaturedCoinProps> = ({
  coinAddress = DEFAULT_COIN_ADDRESS,
  className = ''
}) => {
  const [coin, setCoin] = useState<ZoraCoin | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)

  // Format large numbers with abbreviations
  const formatNumber = (value?: string) => {
    if (!value) return 'N/A'
    const num = parseFloat(value)
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(2)}B`
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`
    }
    return num.toLocaleString()
  }

  // Format percentage change
  const formatPercentage = (value?: string) => {
    if (!value) return '0.00%'
    const num = parseFloat(value)
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`
  }

  // Is price change positive?
  const isPriceChangePositive = (value?: string) => {
    if (!value) return true
    return parseFloat(value) >= 0
  }

  // Open Zora coin URL in new tab
  const openCoinUrl = () => {
    if (coin?.address) {
      const url = `https://zora.co/coin/base:${coin.address}`
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  useEffect(() => {
    const fetchCoin = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getCoin({
          address: coinAddress,
          chain: 8453 // Base chain
        })

        // The API response structure may have zora20Token
        const coinData = response.data?.zora20Token
        if (coinData) {
          // @ts-ignore
          setCoin(coinData)
        } else {
          setError('Coin not found')
        }
      } catch (err) {
        console.error('Error fetching coin:', err)
        setError('Failed to fetch coin details')
      } finally {
        setLoading(false)
      }
    }

    fetchCoin()
  }, [coinAddress])

  // Animation variants
  const containerVariants = {
    collapsed: {
      borderRadius: 12
    },
    expanded: {
      borderRadius: 12
    }
  }

  const contentVariants = {
    collapsed: {
      opacity: 0,
      height: 0,
      padding: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    expanded: {
      opacity: 1,
      height: 'auto',
      padding: '12px',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  }

  const arrowVariants = {
    collapsed: { rotate: 0 },
    expanded: { rotate: 180 }
  }

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center p-4 bg-p-hover lg:bg-s-bg rounded-xl ${className}`}
      >
        <CircularProgress size={24} />
      </div>
    )
  }

  if (error || !coin) {
    return (
      <div
        className={`text-s-text text-center p-4 bg-p-hover lg:bg-s-bg rounded-xl ${className}`}
      >
        {error || 'No coin data available'}
      </div>
    )
  }

  const priceChangePositive = isPriceChangePositive(coin.marketCapDelta24h)

  return (
    <motion.div
      className={`bg-p-hover rounded-xl shadow-sm overflow-hidden ${className}`}
      initial="collapsed"
      animate={expanded ? 'expanded' : 'collapsed'}
      variants={containerVariants}
      layout
    >
      {/* Always visible section */}
      <div
        className="p-3 flex items-center justify-between cursor-pointer hover:bg-opacity-70 transition-colors"
        onClick={() => setExpanded(!expanded)}
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
              Market Cap: {formatNumber(coin.marketCap)}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="text-right mr-2">
            <div className="font-medium text-p-text">
              ${parseFloat(coin.marketCap || '0').toFixed(2)}
            </div>
            <div
              className={`text-xs flex items-center ${priceChangePositive ? 'text-green-500' : 'text-red-500'}`}
            >
              {priceChangePositive ? (
                <TrendingUpIcon sx={{ fontSize: 14, marginRight: '2px' }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 14, marginRight: '2px' }} />
              )}
              {formatPercentage(coin.marketCapDelta24h)}
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

      {/* Expandable section with AnimatePresence */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={contentVariants}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <div className="mb-3">
              <div className="text-p-text font-semibold">{coin.name}</div>
              {coin.description && (
                <div className="text-xs text-s-text mt-1">
                  {coin.description}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="text-xs">
                <div className="text-s-text">Volume 24h</div>
                <div className="text-p-text font-medium">
                  {formatNumber(coin.volume24h)}
                </div>
              </div>
              <div className="text-xs">
                <div className="text-s-text">Total Supply</div>
                <div className="text-p-text font-medium">
                  {formatNumber(coin.totalSupply)}
                </div>
              </div>
              <div className="text-xs">
                <div className="text-s-text">Holders</div>
                <div className="text-p-text font-medium">
                  {coin.uniqueHolders?.toLocaleString() || 'N/A'}
                </div>
              </div>
              <div className="text-xs">
                <div className="text-s-text">Created</div>
                <div className="text-p-text font-medium">
                  {coin.createdAt
                    ? new Date(coin.createdAt).toLocaleDateString()
                    : 'N/A'}
                </div>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                onClick={openCoinUrl}
                endIcon={<LaunchIcon fontSize="small" />}
                sx={{
                  textTransform: 'none',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  mt: 1
                }}
              >
                View on Zora
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ZoraFeaturedCoin
