import React, { useEffect, useState } from 'react'
import { getCoin, tradeCoinCall, TradeParams } from '@zoralabs/coins-sdk'
import {
  CircularProgress,
  Tooltip,
  Button,
  TextField,
  InputAdornment
} from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import LaunchIcon from '@mui/icons-material/Launch'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount, useWriteContract } from 'wagmi'
import useHandleWrongNetwork from '../../../utils/hooks/useHandleWrongNetwork'
import { base } from 'viem/chains'
import toast from 'react-hot-toast'
import { Address, parseEther } from 'viem'
import { PROJECT_ADDRESS } from '../../../utils/config'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import {
  ContentType,
  SendMessageTradeType
} from '../../common/LiveChat/LiveChatType'
import { v4 as uuid } from 'uuid'
import { useChatInteractions } from '../../store/useChatInteractions'
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
  coinAddress: string
  className?: string
}

const ZoraFeaturedCoin: React.FC<ZoraFeaturedCoinProps> = ({
  coinAddress,
  className = ''
}) => {
  const [coin, setCoin] = useState<ZoraCoin | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [buyMode, setBuyMode] = useState(false)
  const [ethAmount, setEthAmount] = useState('0.01')

  const { address } = useAccount()
  const { openConnectModal } = useConnectModal()

  const handleWrongNetwork = useHandleWrongNetwork(base.id)

  const { writeContractAsync, status } = useWriteContract()
  const sendMessagePayload = useChatInteractions(
    (state) => state.sendMessagePayload
  )

  const handleBuyCoin = async () => {
    if (!coin?.address) return
    if (!address) {
      toast.error('Please connect your wallet')
      openConnectModal?.()
      return
    }
    try {
      await handleWrongNetwork()

      const tradeParams: TradeParams = {
        direction: 'buy',
        target: coin.address as Address,
        args: {
          orderSize: parseEther(ethAmount), // Use the input value
          recipient: address as Address,
          minAmountOut: 0n,
          tradeReferrer: PROJECT_ADDRESS as Address
        }
      }

      const contractCallParams = tradeCoinCall(tradeParams)

      const tx = await writeContractAsync({
        abi: contractCallParams?.abi,
        address: contractCallParams?.address,
        args: contractCallParams?.args,
        functionName: contractCallParams?.functionName,
        value: tradeParams.args.orderSize
      })

      toast.success('Transaction sent!')

      const messagePayload: SendMessageTradeType = {
        id: uuid(),
        content: `💰Bought $${coin.symbol} for ${ethAmount} ETH at $${
          parseFloat(coin.marketCap || '0') /
          parseFloat(coin.totalSupply || '1')
        } 🎉`,
        type: ContentType.Trade,
        image: coin.mediaContent?.previewImage?.medium!,
        txHash: tx,
        currencySymbol: coin.symbol,
        formattedBuyAmountEth: ethAmount
      }

      if (sendMessagePayload) {
        sendMessagePayload(messagePayload)
      }
      // Reset UI after successful purchase
      setBuyMode(false)
      setExpanded(false)
    } catch (error) {
      console.log('Error during transaction:', error)
      toast.error('Transaction failed')
    }
  }

  // Handle entering buy mode
  const enterBuyMode = () => {
    setBuyMode(true)
  }

  // Handle cancelling buy mode
  const cancelBuyMode = () => {
    setBuyMode(false)
    setEthAmount('0.01') // Reset to default value
  }

  // Handle ETH amount change
  const handleEthAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only valid numeric input with decimal points
    const value = e.target.value
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setEthAmount(value)
    }
  }

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
          chain: base.id // Base chain
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

  const buyModeVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      padding: 0,
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    },
    visible: {
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

  const priceChangePositive = isPriceChangePositive(
    String(parseFloat(coin?.marketCapDelta24h ?? '0') * -1)
  )

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
        onClick={() => !buyMode && setExpanded(!expanded)}
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
              {(() => {
                // Calculate price in USD
                const priceInUsd =
                  parseFloat(coin.marketCap || '0') /
                  parseFloat(coin.totalSupply || '1')
                // Format for display
                const formattedPrice = `$${priceInUsd.toFixed(8)}`
                return formattedPrice
              })()}
            </div>
            <div
              className={`text-xs flex items-center ${priceChangePositive ? 'text-green-500' : 'text-red-500'}`}
            >
              {priceChangePositive ? (
                <TrendingUpIcon sx={{ fontSize: 14, marginRight: '2px' }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 14, marginRight: '2px' }} />
              )}
              {formatPercentage(
                String(parseFloat(coin?.marketCapDelta24h ?? '0') * -1)
              )}
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
        {expanded && !buyMode && (
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

            <div className="flex space-x-2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
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

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation()
                    enterBuyMode()
                  }}
                  endIcon={<ShoppingCartIcon fontSize="small" />}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    mt: 1,
                    bgcolor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark'
                    }
                  }}
                >
                  Buy Tokens
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Buy Mode UI */}
        {expanded && buyMode && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={buyModeVariants}
            className="border-t border-gray-200 dark:border-gray-700 p-3"
          >
            <div className="mb-4">
              <div className="text-p-text font-semibold mb-2">
                Buy {coin?.symbol}
              </div>
              <TextField
                fullWidth
                variant="outlined"
                label="Amount"
                value={ethAmount}
                onChange={handleEthAmountChange}
                autoFocus
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <span className="text-s-text">ETH</span>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '8px' }
                }}
                size="small"
              />
              <div className="text-xs text-s-text mt-1">
                Enter the amount of ETH you want to spend
              </div>
            </div>

            <div className="flex space-x-2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation()
                    cancelBuyMode()
                  }}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '8px',
                    fontSize: '0.75rem'
                  }}
                >
                  Cancel
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation()
                    handleBuyCoin()
                  }}
                  disabled={status === 'pending'}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    bgcolor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark'
                    }
                  }}
                >
                  {status === 'pending' ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    'Confirm Purchase'
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ZoraFeaturedCoin
