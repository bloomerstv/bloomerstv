import React, { useEffect, useState } from 'react'
import {
  getCoin,
  tradeCoinCall,
  TradeParams,
  getProfileBalances
} from '@zoralabs/coins-sdk'
import {
  CircularProgress,
  Tooltip,
  Button,
  TextField,
  InputAdornment,
  Box
} from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import { ShoppingBag } from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount, useWriteContract, useBalance } from 'wagmi'
import useHandleWrongNetwork from '../../../utils/hooks/useHandleWrongNetwork'
import { base } from 'viem/chains'
import toast from 'react-hot-toast'
import { Address, parseEther, formatEther } from 'viem'
import { PROJECT_ADDRESS } from '../../../utils/config'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import {
  ContentType,
  SendMessageTradeType
} from '../../common/LiveChat/LiveChatType'
import { v4 as uuid } from 'uuid'
import { useChatInteractions } from '../../store/useChatInteractions'
import { formatNumber } from '../../../utils/formatters'
import { ShoppingCartIcon, ExternalLinkIcon, WalletIcon } from 'lucide-react'

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
  const [sellMode, setSellMode] = useState(false)
  const [ethAmount, setEthAmount] = useState('0.01')
  const [sellAmount, setSellAmount] = useState('')
  const [userBalance, setUserBalance] = useState('0')
  const [hasBalance, setHasBalance] = useState(false)

  const { address } = useAccount()
  const { openConnectModal } = useConnectModal()

  // Fetch ETH balance using wagmi
  const { data: ethBalanceData } = useBalance({
    address
  })

  const handleWrongNetwork = useHandleWrongNetwork(base.id)

  const { writeContractAsync, status } = useWriteContract()
  const sendMessagePayload = useChatInteractions(
    (state) => state.sendMessagePayload
  )

  // Fetch user's coin balance
  const fetchUserBalance = async () => {
    if (!address || !coinAddress) return

    try {
      const response = await getProfileBalances({
        identifier: address,
        count: 50
      })

      const profile: any = response.data?.profile
      if (profile?.coinBalances) {
        const coinBalances = profile.coinBalances.edges

        // Find this specific coin in user's balances
        const userCoinBalance = coinBalances.find(
          (edge: any) =>
            edge.node.coin.address.toLowerCase() === coinAddress.toLowerCase()
        )

        if (userCoinBalance) {
          setUserBalance(userCoinBalance.node.balance)
          setHasBalance(true)
        } else {
          setUserBalance('0')
          setHasBalance(false)
        }
      }
    } catch (err) {
      console.error('Error fetching user balance:', err)
      setUserBalance('0')
      setHasBalance(false)
    }
  }

  // Format the balance for display
  const formatBalance = (balance: string) => {
    // Remove leading zeros and convert to numeric representation
    const trimmed = balance.replace(/^0+/, '')
    if (trimmed.length > 18) {
      const intPart = trimmed.slice(0, trimmed.length - 18)
      const decPart = trimmed.slice(
        trimmed.length - 18,
        trimmed.length - 18 + 6
      )
      // Format to max 2 decimal places
      const formattedDecimal = parseFloat(`0.${decPart}`)
        .toFixed(2)
        .substring(2)
      return `${intPart || '0'}.${formattedDecimal}`
    }
    return '0.00'
  }

  // Format ETH balance for display
  const formatEthBalance = (value: bigint | undefined): string => {
    if (!value) return '0.00'
    return parseFloat(formatEther(value)).toFixed(4)
  }

  // Handle using maximum ETH balance
  const useMaxEthBalance = () => {
    if (ethBalanceData && ethBalanceData.value > 0n) {
      // Leave a small amount for gas
      const maxAmount = parseFloat(formatEther(ethBalanceData.value)) - 0.001
      if (maxAmount > 0) {
        setEthAmount(maxAmount.toFixed(4))
      }
    }
  }

  // Handle Buy transaction
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

  // Handle Sell transaction
  const handleSellCoin = async () => {
    if (!coin?.address) return
    if (!address) {
      toast.error('Please connect your wallet')
      openConnectModal?.()
      return
    }

    if (!sellAmount || parseFloat(sellAmount) <= 0) {
      toast.error('Please enter a valid amount to sell')
      return
    }

    try {
      await handleWrongNetwork()

      const tradeParams: TradeParams = {
        direction: 'sell',
        target: coin.address as Address,
        args: {
          orderSize: BigInt(Math.floor(parseFloat(sellAmount) * 10 ** 18)), // Convert to token units
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
        functionName: contractCallParams?.functionName
      })

      toast.success('Transaction sent!')

      // Calculate estimated ETH received based on token price
      const marketCapValue = parseFloat(coin.marketCap || '0')
      const totalSupplyValue = parseFloat(coin.totalSupply || '1')
      const tokenPrice = marketCapValue / totalSupplyValue
      const estimatedEthReceived = parseFloat(sellAmount) * tokenPrice

      const messagePayload: SendMessageTradeType = {
        id: uuid(),
        content: `💰Sold ${sellAmount} $${coin.symbol} for ~$${estimatedEthReceived.toFixed(4)} at $${tokenPrice.toFixed(6)}/${coin.symbol} 🎉`,
        type: ContentType.Trade,
        image: coin.mediaContent?.previewImage?.medium!,
        txHash: tx,
        currencySymbol: coin.symbol,
        formattedBuyAmountEth: estimatedEthReceived.toFixed(4)
      }

      if (sendMessagePayload) {
        sendMessagePayload(messagePayload)
      }

      // Reset UI and fetch updated balance
      setSellMode(false)
      setExpanded(false)
      fetchUserBalance()
    } catch (error) {
      console.log('Error during transaction:', error)
      toast.error('Transaction failed')
    }
  }

  // Open coin URL in new tab
  const openCoinUrl = () => {
    if (coin?.address) {
      const url = `https://zora.co/coin/base:${coin.address.toLowerCase()}`
      window.open(url, '_blank', 'noopener,noreferrer')
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

  // Handle entering sell mode
  const enterSellMode = () => {
    setSellMode(true)
    setSellAmount('')
  }

  // Handle cancelling sell mode
  const cancelSellMode = () => {
    setSellMode(false)
    setSellAmount('')
  }

  // Use max balance
  const useMaxBalance = () => {
    setSellAmount(formatBalance(userBalance))
  }

  // Handle sell amount change
  const handleSellAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only valid numeric input with decimal points
    const value = e.target.value
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setSellAmount(value)
    }
  }

  // Calculate percentage change properly - using the same approach as CoinTable
  const calculateMarketCapPercentageChange = (
    marketCap?: string,
    marketCapDelta24h?: string
  ) => {
    const currentMarketCap = parseFloat(marketCap || '0')
    const deltaValue = parseFloat(marketCapDelta24h || '0')

    if (
      isNaN(currentMarketCap) ||
      isNaN(deltaValue) ||
      currentMarketCap === 0
    ) {
      return '0.00'
    }

    // Calculate the previous market cap
    const previousMarketCap = currentMarketCap - deltaValue

    if (previousMarketCap === 0) return '0.00'

    // Calculate the percentage change
    const percentageChange = (deltaValue / previousMarketCap) * 100

    return percentageChange.toFixed(2)
  }

  // Format percentage change with "+" prefix for positive values
  const formatPercentage = (value: string) => {
    const num = parseFloat(value)
    return `${num >= 0 ? '+' : ''}${num}%`
  }

  // Determine if price change is positive
  const isPriceChangePositive = (value: string) => {
    return parseFloat(value) >= 0
  }

  // Calculate price per token
  const calculateTokenPrice = (marketCap?: string, totalSupply?: string) => {
    const marketCapValue = parseFloat(marketCap || '0')
    const totalSupplyValue = parseFloat(totalSupply || '1')

    if (
      isNaN(marketCapValue) ||
      isNaN(totalSupplyValue) ||
      totalSupplyValue === 0
    ) {
      return '0.0000'
    }

    const price = marketCapValue / totalSupplyValue
    // Format to appropriate decimal places depending on value
    if (price < 0.0001) return price.toFixed(8)
    if (price < 0.01) return price.toFixed(6)
    if (price < 1) return price.toFixed(4)
    return price.toFixed(2)
  }

  useEffect(() => {
    fetchUserBalance()
  }, [address, coinAddress])

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

          // Fetch user balance when coin data is available
          if (address) {
            fetchUserBalance()
          }
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
  }, [coinAddress, address])

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

  const marketCapPercentageChange = calculateMarketCapPercentageChange(
    coin.marketCap,
    coin.marketCapDelta24h
  )
  const priceChangePositive = isPriceChangePositive(marketCapPercentageChange)
  const tokenPrice = calculateTokenPrice(coin.marketCap, coin.totalSupply)

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
        onClick={() => !buyMode && !sellMode && setExpanded(!expanded)}
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
              Market Cap: {formatNumber(Number(coin.marketCap))}
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

      {/* Expandable section with AnimatePresence */}
      <AnimatePresence>
        {expanded && !buyMode && !sellMode && (
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

            {/* User balance (if any) */}
            {address && hasBalance && (
              <div className="mb-3 bg-white dark:bg-gray-800 p-2 rounded-lg border border-blue-200 dark:border-blue-800 shadow-sm">
                <div className="text-xs font-bold text-gray-900 dark:text-gray-100">
                  Your Balance
                </div>
                <div className="text-sm font-semibold flex items-center text-gray-800 dark:text-gray-200">
                  {formatBalance(userBalance)} {coin?.symbol}
                  <span className="text-xs ml-1 text-gray-600 dark:text-gray-400">
                    (≈ $
                    {(
                      (parseFloat(formatBalance(userBalance)) *
                        parseFloat(coin?.marketCap || '0')) /
                      parseFloat(coin?.totalSupply || '1')
                    ).toFixed(2)}
                    )
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="text-xs">
                <div className="text-s-text">Volume 24h</div>
                <div className="text-p-text font-medium">
                  {formatNumber(Number(coin.volume24h))}
                </div>
              </div>
              <div className="text-xs">
                <div className="text-s-text">Total Supply</div>
                <div className="text-p-text font-medium">
                  {formatNumber(Number(coin.totalSupply))}
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

            {/* View on Zora link - simplified version */}
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

            {/* Action Buttons */}
            {address ? (
              <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                {/* Buy Tokens */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation()
                      enterBuyMode()
                    }}
                    endIcon={<ShoppingCartIcon size={16} />}
                    sx={{
                      textTransform: 'none',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      p: 1,
                      bgcolor: 'primary.main',
                      '&:hover': {
                        bgcolor: 'primary.dark'
                      }
                    }}
                  >
                    Buy Tokens
                  </Button>
                </motion.div>

                {/* Sell Tokens - Only shown if user has balance */}
                {hasBalance && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      color="secondary"
                      onClick={(e) => {
                        e.stopPropagation()
                        enterSellMode()
                      }}
                      endIcon={<ShoppingBag fontSize="small" />}
                      sx={{
                        textTransform: 'none',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        p: 1,
                        '&:hover': {
                          opacity: 0.9
                        }
                      }}
                    >
                      Sell Tokens
                    </Button>
                  </motion.div>
                )}
              </Box>
            ) : (
              /* Connect Wallet Button - Show when user is not connected */
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation()
                    openConnectModal?.()
                  }}
                  endIcon={<WalletIcon size={16} />}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    p: 1,
                    bgcolor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark'
                    }
                  }}
                >
                  Connect Wallet
                </Button>
              </motion.div>
            )}
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
              <div className="flex items-center">
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
                {ethBalanceData && ethBalanceData.value > 0n && (
                  <Button
                    size="small"
                    onClick={useMaxEthBalance}
                    sx={{ ml: 1, minWidth: 'auto' }}
                  >
                    Max
                  </Button>
                )}
              </div>
              <div className="flex justify-between text-xs text-s-text mt-1">
                <div>Enter the amount of ETH you want to spend</div>
                {ethBalanceData && (
                  <div>
                    Balance: {formatEthBalance(ethBalanceData.value)} ETH
                  </div>
                )}
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
                  disabled={
                    status === 'pending' ||
                    (ethBalanceData &&
                      parseFloat(ethAmount) >
                        parseFloat(formatEther(ethBalanceData.value)))
                  }
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

        {/* Sell Mode UI */}
        {expanded && sellMode && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={buyModeVariants}
            className="border-t border-gray-200 dark:border-gray-700 p-3"
          >
            <div className="mb-4">
              <div className="text-p-text font-semibold mb-2">
                Sell {coin?.symbol}
              </div>
              <div className="flex items-center">
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Amount"
                  value={sellAmount}
                  onChange={handleSellAmountChange}
                  autoFocus
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <span className="text-s-text">{coin?.symbol}</span>
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '8px' }
                  }}
                  size="small"
                />
                <Button
                  size="small"
                  onClick={useMaxBalance}
                  sx={{ ml: 1, minWidth: 'auto' }}
                >
                  Max
                </Button>
              </div>
              <div className="flex justify-between text-xs text-s-text mt-1">
                <div>Enter the amount of tokens you want to sell</div>
                <div>
                  Balance: {formatBalance(userBalance)} {coin?.symbol}
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
                  onClick={(e) => {
                    e.stopPropagation()
                    cancelSellMode()
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
                    handleSellCoin()
                  }}
                  disabled={status === 'pending' || !sellAmount}
                  color="secondary"
                  sx={{
                    textTransform: 'none',
                    borderRadius: '8px',
                    fontSize: '0.75rem'
                  }}
                >
                  {status === 'pending' ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    'Confirm Sale'
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
