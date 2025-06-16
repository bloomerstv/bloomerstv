import React, { useState, useEffect } from 'react'
import {
  Button,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Box,
  Tooltip
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { AnimatePresence, motion } from 'framer-motion'
import { useAccount, useWriteContract } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { getProfileBalances } from '@zoralabs/coins-sdk'
import toast from 'react-hot-toast'
import { Address } from 'viem'
import { base } from 'viem/chains'
import LoadingButton from '@mui/lab/LoadingButton'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import useHandleWrongNetwork from '../../../utils/hooks/useHandleWrongNetwork'
import { Erc20TokenABI } from '../../../utils/lib/erc20'
import { v4 as uuid } from 'uuid'
import { ContentType, SendMessageTradeType } from '../LiveChat/LiveChatType'
import { useChatInteractions } from '../../store/useChatInteractions'
import { MonetizationOnOutlined, CurrencyExchange } from '@mui/icons-material'
import { formatNumber } from '../../../utils/formatters'

interface TipZoraCoinsProps {
  isOpen: boolean
  onClose: () => void
  liveChatAccountAddress: string
}

interface CoinBalance {
  coin: {
    name: string
    symbol: string
    address: string
    marketCap: string
    totalSupply: string
    marketCapDelta24h?: string
    mediaContent?: {
      previewImage?: {
        small?: string
        medium?: string
      }
    }
  }
  balance: string
}

const TipZoraCoins: React.FC<TipZoraCoinsProps> = ({
  isOpen,
  onClose,
  liveChatAccountAddress
}) => {
  const [coinBalances, setCoinBalances] = useState<CoinBalance[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCoin, setSelectedCoin] = useState<CoinBalance | null>(null)
  const [tipAmount, setTipAmount] = useState('')
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [isTipping, setIsTipping] = useState(false)

  const { address, isConnected, isConnecting, isReconnecting } = useAccount()
  const { openConnectModal } = useConnectModal()
  const handleWrongNetwork = useHandleWrongNetwork(base.id)
  const { writeContractAsync, status } = useWriteContract()
  const sendMessage = useChatInteractions((state) => state.sendMessagePayload)

  // Format balance for display
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

  // Calculate token price
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

  // Calculate percentage change
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

  // Fetch user's coin balances
  const fetchCoinBalances = async () => {
    if (!address) return

    setIsLoading(true)
    try {
      const response = await getProfileBalances({
        identifier: address as string,
        count: 50 // Fetch more coins to avoid pagination issues
      })
      console.log('Fetched coin balances:', response.data)

      const profile: any = response.data?.profile
      if (profile?.coinBalances) {
        const edges = profile.coinBalances.edges || []
        const balances = edges
          .map((edge) => edge.node)
          .filter((node) => parseFloat(formatBalance(node.balance)) > 0)
        setCoinBalances(balances)
      } else {
        setCoinBalances([])
      }
    } catch (err) {
      console.error('Error fetching coin balances:', err)
      toast.error('Failed to fetch your coin balances')
    } finally {
      setIsLoading(false)
    }
  }

  // Use max balance
  const useMaxBalance = () => {
    if (selectedCoin) {
      setTipAmount(formatBalance(selectedCoin.balance))
    }
  }

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setTipAmount(value)
    }
  }

  // Handle coin selection
  const handleSelectCoin = (coin: CoinBalance) => {
    setSelectedCoin(coin)
    setTipAmount('') // Reset amount when selecting a new coin
  }

  // Handle coin transfer
  const handleTipCoin = async () => {
    if (!selectedCoin || !liveChatAccountAddress || !address) return

    if (!tipAmount || parseFloat(tipAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    try {
      setIsTipping(true)
      await handleWrongNetwork()

      // Convert amount to token units (most tokens use 18 decimals)
      const tipAmountInWei = BigInt(
        Math.floor(parseFloat(tipAmount) * 10 ** 18)
      )

      // Execute the transfer
      const tx = await writeContractAsync({
        abi: Erc20TokenABI,
        address: selectedCoin.coin.address as Address,
        functionName: 'transfer',
        args: [liveChatAccountAddress as Address, tipAmountInWei]
      })

      toast.success('Coins sent successfully!')

      // Send message to chat
      if (sendMessage) {
        const tokenPrice = calculateTokenPrice(
          selectedCoin.coin.marketCap,
          selectedCoin.coin.totalSupply
        )

        const messagePayload: SendMessageTradeType = {
          id: uuid(),
          content: `💰 Tipped ${tipAmount} $${selectedCoin.coin.symbol} (≈$${(
            parseFloat(tipAmount) * parseFloat(tokenPrice)
          ).toFixed(2)}) 🎉`,
          type: ContentType.Trade,
          image: selectedCoin.coin.mediaContent?.previewImage?.medium,
          txHash: tx,
          currencySymbol: selectedCoin.coin.symbol,
          formattedBuyAmountEth: tipAmount
        }

        sendMessage(messagePayload)
      }

      // Reset and close
      setSelectedCoin(null)
      setTipAmount('')
      onClose()
    } catch (error) {
      console.error('Error during transaction:', error)
      toast.error('Transaction failed')
    } finally {
      setIsTipping(false)
    }
  }

  // Fetch balances when wallet is connected and component is opened
  useEffect(() => {
    if (isOpen && address) {
      fetchCoinBalances()
    }
  }, [isOpen, address])

  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      transition: {
        duration: 0.2
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  }

  // If not open, don't render anything
  if (!isOpen) return null

  return (
    <motion.div
      className="space-y-3 px-1 pb-2"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={containerVariants}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <IconButton onClick={onClose} className="rounded-full" size="small">
            <CloseIcon />
          </IconButton>
          <Typography className="font-semibold text-p-text">
            Tip Zora Coins
          </Typography>
        </div>

        <Tooltip
          title="Support the streamer with your Zora coins"
          placement="top"
          open={tooltipOpen}
          onClose={() => setTooltipOpen(false)}
          onOpen={() => setTooltipOpen(true)}
        >
          <InfoOutlinedIcon className="text-s-text cursor-help" />
        </Tooltip>
      </div>

      {/* Main content */}
      {!isConnected ? (
        <div className="p-4 flex flex-col items-center">
          <Typography className="text-p-text text-center mb-4">
            Connect your wallet to tip Zora coins
          </Typography>
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={openConnectModal}
            loading={isConnecting || isReconnecting}
            loadingPosition="start"
            startIcon={<AccountBalanceWalletIcon />}
            style={{
              borderRadius: '20px',
              padding: '8px 16px'
            }}
          >
            Connect Wallet
          </LoadingButton>
        </div>
      ) : isLoading ? (
        <div className="p-4 flex flex-col items-center">
          <CircularProgress size={32} />
          <Typography className="text-s-text mt-2">
            Loading your coins...
          </Typography>
        </div>
      ) : coinBalances.length === 0 ? (
        <div className="p-4 flex flex-col items-center">
          <CurrencyExchange fontSize="large" className="text-s-text mb-2" />
          <Typography className="text-p-text text-center mb-1">
            No Zora coins found
          </Typography>
          <Typography className="text-s-text text-center text-sm">
            You don't have any Zora coins in your wallet
          </Typography>
        </div>
      ) : selectedCoin ? (
        // Coin selected - show amount input
        <div className="space-y-4">
          <div className="flex items-center p-2 bg-p-hover rounded-lg">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3">
              {selectedCoin.coin.mediaContent?.previewImage?.small ? (
                <img
                  src={selectedCoin.coin.mediaContent.previewImage.small}
                  alt={selectedCoin.coin.symbol}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                  {selectedCoin.coin.symbol.substring(0, 2)}
                </div>
              )}
            </div>
            <div>
              <Typography className="font-bold text-p-text">
                {selectedCoin.coin.symbol}
              </Typography>
              <Typography className="text-xs text-s-text">
                {formatBalance(selectedCoin.balance)} · $
                {calculateTokenPrice(
                  selectedCoin.coin.marketCap,
                  selectedCoin.coin.totalSupply
                )}
              </Typography>
            </div>
            <IconButton
              className="ml-auto"
              size="small"
              onClick={() => setSelectedCoin(null)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>

          <div className="space-y-2">
            <Typography className="text-sm text-p-text font-medium">
              Amount to tip:
            </Typography>
            <div className="flex items-center">
              <TextField
                fullWidth
                variant="outlined"
                value={tipAmount}
                onChange={handleAmountChange}
                autoFocus
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <span className="text-s-text">
                        {selectedCoin.coin.symbol}
                      </span>
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
            <Typography className="text-xs text-s-text">
              Available: {formatBalance(selectedCoin.balance)}{' '}
              {selectedCoin.coin.symbol}
              {tipAmount &&
                ` · Value: ~$${(
                  parseFloat(tipAmount || '0') *
                  parseFloat(
                    calculateTokenPrice(
                      selectedCoin.coin.marketCap,
                      selectedCoin.coin.totalSupply
                    )
                  )
                ).toFixed(2)}`}
            </Typography>
          </div>

          <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setSelectedCoin(null)}
              sx={{ borderRadius: '20px' }}
              disabled={isTipping}
            >
              Back
            </Button>

            <LoadingButton
              variant="contained"
              color="primary"
              onClick={handleTipCoin}
              loading={isTipping}
              loadingPosition="start"
              disabled={
                !tipAmount ||
                parseFloat(tipAmount) <= 0 ||
                parseFloat(tipAmount) >
                  parseFloat(formatBalance(selectedCoin.balance))
              }
              startIcon={<SendIcon />}
              fullWidth
              sx={{ borderRadius: '20px' }}
            >
              Tip {selectedCoin.coin.symbol}
            </LoadingButton>
          </Box>
        </div>
      ) : (
        // Coin selection mode
        <div className="space-y-3">
          <Typography className="text-sm text-s-text">
            Select a coin to tip:
          </Typography>

          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
            {coinBalances.map((balance, index) => {
              const tokenPrice = calculateTokenPrice(
                balance.coin.marketCap,
                balance.coin.totalSupply
              )
              const percentChange = calculateMarketCapPercentageChange(
                balance.coin.marketCap,
                balance.coin.marketCapDelta24h
              )
              const isPositive = parseFloat(percentChange) >= 0
              const balanceValue =
                parseFloat(formatBalance(balance.balance)) *
                parseFloat(tokenPrice)

              return (
                <motion.div
                  key={balance.coin.address}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-3 bg-p-hover rounded-lg flex items-center cursor-pointer hover:bg-opacity-80 transition-all"
                  onClick={() => handleSelectCoin(balance)}
                >
                  {/* Coin Image */}
                  <div className="w-10 h-10 min-w-[40px] rounded-full overflow-hidden flex items-center justify-center mr-3 bg-gray-100">
                    {balance.coin.mediaContent?.previewImage?.small ? (
                      <img
                        src={balance.coin.mediaContent.previewImage.small}
                        alt={balance.coin.symbol}
                        className="w-full h-full object-contain" // Fixed stretching issue
                      />
                    ) : (
                      <div className="w-full h-full rounded-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                        {balance.coin.symbol.substring(0, 2)}
                      </div>
                    )}
                  </div>

                  {/* Coin Details */}
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-center">
                      <Typography className="font-semibold text-p-text truncate mr-2">
                        {balance.coin.symbol}
                      </Typography>
                      <Typography className="text-sm font-medium text-p-text whitespace-nowrap">
                        ${tokenPrice}
                      </Typography>
                    </div>

                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center">
                        <Typography className="text-xs font-medium text-p-text">
                          {formatBalance(balance.balance)}
                        </Typography>{' '}
                        <Typography className="text-xs text-s-text ml-2">
                          (${formatNumber(balanceValue)})
                        </Typography>
                      </div>
                      <Typography
                        className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}
                      >
                        {formatPercentage(percentChange)}
                      </Typography>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default TipZoraCoins
