import React, { useEffect, useState } from 'react'
import { getCoin } from '@zoralabs/coins-sdk'
import { useAccount } from '@lens-protocol/react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { base } from 'viem/chains'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import Link from 'next/link'
import { stringToLength } from '../../../utils/stringToLength'

interface CoinsRowItemProps {
  accountAddress: string
  coinAddress: string
  chainId: string
}

interface CoinData {
  name: string
  symbol: string
  marketCap?: string
  marketCapDelta24h?: string
  mediaContent?: {
    previewImage?: {
      small?: string
    }
  }
}

const CoinsRowItem: React.FC<CoinsRowItemProps> = ({
  accountAddress,
  coinAddress,
  chainId
}) => {
  const [coinData, setCoinData] = useState<CoinData | null>(null)
  const [loading, setLoading] = useState(true)

  const { data: accountData } = useAccount({
    address: accountAddress
  })

  useEffect(() => {
    const fetchCoinData = async () => {
      if (!coinAddress) return

      setLoading(true)
      try {
        const response = await getCoin({
          address: coinAddress,
          chain: parseInt(chainId) || base.id
        })

        const data = response.data?.zora20Token
        if (data) {
          setCoinData(data)
        }
      } catch (error) {
        console.error('Error fetching coin data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCoinData()
  }, [coinAddress, chainId])

  // Calculate percentage change
  const calculatePercentChange = () => {
    if (!coinData?.marketCap || !coinData?.marketCapDelta24h) return '0.00'

    const currentMarketCap = parseFloat(coinData.marketCap)
    const deltaValue = parseFloat(coinData.marketCapDelta24h)

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

  const percentChange = calculatePercentChange()
  const isPriceChangePositive = parseFloat(percentChange) >= 0
  const formattedPercentChange = `${isPriceChangePositive ? '+' : ''}${percentChange}%`

  if (loading) {
    return (
      <div className="flex-shrink-0 cursor-pointer h-10 px-3 py-1.5 sm:h-12 sm:py-2 sm:px-4 bg-p-bg sm:bg-s-bg rounded-md flex items-center">
        <div className="flex items-center gap-2 animate-pulse">
          <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          <div className="w-12 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="w-10 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (!coinData) return null

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className="flex-shrink-0 cursor-pointer border-none py-1.5 px-3 sm:py-2 sm:px-4 font-semibold text-sm outline-none shadow-sm transition duration-300 ease-in-out transform rounded-md bg-p-bg sm:bg-s-bg text-p-text hover:bg-p-hover"
    >
      <Link
        href={`/${accountData?.username?.localName}`}
        className="no-underline text-p-text"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full overflow-hidden">
            {coinData.mediaContent?.previewImage?.small ? (
              <img
                src={coinData.mediaContent.previewImage.small}
                alt={coinData.symbol}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
                <span className="text-xs font-bold text-indigo-600">
                  {coinData.symbol.substring(0, 2)}
                </span>
              </div>
            )}
          </div>
          <span className="font-medium">
            ${stringToLength(coinData.symbol, 10)}
          </span>
          <span
            className={clsx(
              'flex items-center text-xs',
              isPriceChangePositive ? 'text-green-500' : 'text-red-500'
            )}
          >
            {isPriceChangePositive ? (
              <TrendingUp size={14} className="mr-0.5" />
            ) : (
              <TrendingDown size={14} className="mr-0.5" />
            )}
            {formattedPercentChange}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

export default CoinsRowItem
