import React, { useEffect, useState } from 'react'
import { getCoin, getProfileBalances } from '@zoralabs/coins-sdk'
import { CircularProgress } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount, useChainId } from 'wagmi'
import { base } from 'viem/chains'
import { ZoraCoin, ZoraFeaturedCoinProps } from './types'
import CoinHeader from './CoinHeader'
import CoinDetails from './CoinDetails'
import CoinExternalLink from './CoinExternalLink'
import CoinActionButtons from './CoinActionButtons'
import BuyMode from './BuyMode'
import SellMode from './SellMode'
import PriceChart from './PriceChart'

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
  const [isPending, setIsPending] = useState(false)

  const { address } = useAccount()
  const chainId = useChainId()

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

  // Handle ETH amount change
  const handleEthAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only valid numeric input with decimal points
    const value = e.target.value
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setEthAmount(value)
    }
  }

  // Handle sell amount change
  const handleSellAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only valid numeric input with decimal points
    const value = e.target.value
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setSellAmount(value)
    }
  }

  // Mode handlers
  const enterBuyMode = () => setBuyMode(true)
  const cancelBuyMode = () => {
    setBuyMode(false)
    setEthAmount('0.01')
  }
  const enterSellMode = () => {
    setSellMode(true)
    setSellAmount('')
  }
  const cancelSellMode = () => {
    setSellMode(false)
    setSellAmount('')
  }

  const handleBuyComplete = () => {
    setBuyMode(false)
    setExpanded(false)
  }

  const handleSellComplete = () => {
    setSellMode(false)
    setExpanded(false)
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
    collapsed: { borderRadius: 12 },
    expanded: { borderRadius: 12 }
  }

  const contentVariants = {
    collapsed: {
      opacity: 0,
      height: 0,
      padding: 0,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    expanded: {
      opacity: 1,
      height: 'auto',
      padding: '12px',
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  }

  const buyModeVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      padding: 0,
      transition: { duration: 0.2, ease: 'easeInOut' }
    },
    visible: {
      opacity: 1,
      height: 'auto',
      padding: '12px',
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
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

  return (
    <motion.div
      className={`bg-p-hover rounded-xl shadow-sm overflow-hidden ${className}`}
      initial="collapsed"
      animate={expanded ? 'expanded' : 'collapsed'}
      variants={containerVariants}
      layout
    >
      {/* Always visible section */}
      <CoinHeader
        coin={coin}
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
        buyMode={buyMode}
        sellMode={sellMode}
      />

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
            <CoinDetails
              coin={coin}
              address={address}
              hasBalance={hasBalance}
              userBalance={userBalance}
            />

            <PriceChart coin={coin} className="mb-4" />

            <CoinExternalLink coin={coin} />

            <CoinActionButtons
              address={address}
              chainId={chainId}
              hasBalance={hasBalance}
              onEnterBuyMode={enterBuyMode}
              onEnterSellMode={enterSellMode}
            />
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
            <BuyMode
              coin={coin}
              address={address}
              ethAmount={ethAmount}
              onEthAmountChange={handleEthAmountChange}
              onCancel={cancelBuyMode}
              onBuyComplete={handleBuyComplete}
              isPending={isPending}
              setIsPending={setIsPending}
            />
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
            <SellMode
              coin={coin}
              address={address}
              sellAmount={sellAmount}
              userBalance={userBalance}
              onSellAmountChange={handleSellAmountChange}
              onCancel={cancelSellMode}
              onSellComplete={handleSellComplete}
              fetchUserBalance={fetchUserBalance}
              isPending={isPending}
              setIsPending={setIsPending}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ZoraFeaturedCoin
