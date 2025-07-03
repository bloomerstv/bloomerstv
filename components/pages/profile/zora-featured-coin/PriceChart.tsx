import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import {
  cacheExchange,
  createClient,
  fetchExchange,
  useQuery,
  Provider
} from 'urql'
import { CircularProgress } from '@mui/material'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts'
import { motion } from 'framer-motion'
import { ZoraCoin } from './types'

interface PriceChartProps {
  coin: ZoraCoin
  className?: string
}

type TimeFrame = '1D' | '1W' | '1M' | '1Y'

interface PriceData {
  timestamp: number
  price: number
  date: string
  periodStartUnix?: number
}

const client = createClient({
  url: 'https://gateway.thegraph.com/api/subgraphs/id/HMuAwufqZ1YCRmzL2SfHTVkzZovC9VL2UAKhjvRqKiR1',
  fetchOptions: {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_THE_GRAPH_KEY}`
    }
  },
  exchanges: [cacheExchange, fetchExchange]
})

const PriceChartComponent: React.FC<PriceChartProps> = ({
  coin,
  className = ''
}) => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('1D')
  const [isChangingTimeFrame, setIsChangingTimeFrame] = useState(false)
  const hasInitialData = useRef(false)

  const poolAddress = coin.uniswapV3PoolAddress

  // Format ETH values to show appropriate precision (minimum 2 decimal places, maximum 11 decimal places)
  const formatEthValue = useCallback((value: number) => {
    if (value === 0) return '0.00'
    if (value >= 1) return value.toFixed(2)
    if (value >= 0.01) return value.toFixed(4)
    if (value >= 0.0001) return value.toFixed(6)
    if (value >= 0.000001) return value.toFixed(8)
    if (value >= 0.00000001) return value.toFixed(10)
    // For extremely small values, limit to 11 decimal places maximum
    return value.toFixed(11).replace(/\.?0+$/, '')
  }, [])

  // Build query based on timeframe
  const { query, variables } = useMemo(() => {
    if (!poolAddress) return { query: '', variables: {} }

    const now = Math.floor(Date.now() / 1000)
    let timeThreshold: number
    let queryType: 'hourly' | 'daily'

    switch (selectedTimeFrame) {
      case '1D':
        timeThreshold = now - 24 * 60 * 60
        queryType = 'hourly'
        break
      case '1W':
        timeThreshold = now - 7 * 24 * 60 * 60
        queryType = 'daily'
        break
      case '1M':
        timeThreshold = now - 30 * 24 * 60 * 60
        queryType = 'daily'
        break
      case '1Y':
        timeThreshold = now - 365 * 24 * 60 * 60
        queryType = 'daily'
        break
      default:
        timeThreshold = now - 24 * 60 * 60
        queryType = 'hourly'
    }

    if (queryType === 'hourly') {
      return {
        query: `
          query($pool: String!, $timeThreshold: Int!) {
            poolHourDatas(
              where: { 
                pool: $pool, 
                periodStartUnix_gte: $timeThreshold 
              }, 
              orderBy: periodStartUnix, 
              orderDirection: asc
            ) {
              token0Price
              periodStartUnix
            }
          }
        `,
        variables: { pool: poolAddress.toLowerCase(), timeThreshold }
      }
    } else {
      return {
        query: `
          query($pool: String!, $timeThreshold: Int!) {
            poolDayDatas(
              where: { 
                pool: $pool, 
                date_gte: $timeThreshold 
              }, 
              orderBy: date, 
              orderDirection: asc
            ) {
              token0Price
              date
            }
          }
        `,
        variables: { pool: poolAddress.toLowerCase(), timeThreshold }
      }
    }
  }, [poolAddress, selectedTimeFrame])

  // Always call useQuery hook - never conditionally
  const [result] = useQuery({
    query,
    variables,
    pause: !poolAddress || !query // Use pause instead of conditional calling
  })

  const { data, fetching, error } = result

  // Track when we have initial data
  useEffect(() => {
    if (data && !hasInitialData.current) {
      hasInitialData.current = true
    }
  }, [data])

  // Handle timeframe changes with loading state
  const handleTimeFrameChange = useCallback((timeFrame: TimeFrame) => {
    if (timeFrame !== selectedTimeFrame) {
      setIsChangingTimeFrame(true)
      setSelectedTimeFrame(timeFrame)
    }
  }, [selectedTimeFrame])

  // Clear loading state when fetch completes
  useEffect(() => {
    if (!fetching && isChangingTimeFrame) {
      const timer = setTimeout(() => setIsChangingTimeFrame(false), 100)
      return () => clearTimeout(timer)
    }
  }, [fetching, isChangingTimeFrame])

  // Process the data for the chart - always call this hook
  const chartData = useMemo(() => {
    if (!data) return []

    const rawData =
      selectedTimeFrame === '1D' ? data.poolHourDatas : data.poolDayDatas

    if (!rawData || !Array.isArray(rawData)) return []

    return rawData
      .map((item: any) => {
        const timestamp =
          selectedTimeFrame === '1D'
            ? item.periodStartUnix * 1000
            : item.date * 1000

        const price = parseFloat(item.token0Price || '0')

        return {
          timestamp,
          price,
          date: new Date(timestamp).toISOString(),
          periodStartUnix: item.periodStartUnix
        }
      })
      .filter((item) => item.price > 0)
  }, [data, selectedTimeFrame])

  const formatTooltipDate = useCallback(
    (timestamp: number) => {
      const date = new Date(timestamp)
      if (selectedTimeFrame === '1D') {
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: selectedTimeFrame === '1Y' ? 'numeric' : undefined
      })
    },
    [selectedTimeFrame]
  )

  const formatDateRange = useCallback(
    (timestamp: number) => {
      const date = new Date(timestamp)
      if (selectedTimeFrame === '1D') {
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      }
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: selectedTimeFrame === '1Y' ? '2-digit' : undefined
      })
    },
    [selectedTimeFrame]
  )

  const priceChange = useMemo(() => {
    if (chartData.length < 1)
      return { percentage: 0, isPositive: true, startPrice: 0, endPrice: 0 }

    // For single point, show 0% change
    if (chartData.length === 1) {
      const price = chartData[0].price
      return {
        percentage: 0,
        isPositive: true,
        startPrice: price,
        endPrice: price
      }
    }

    const firstPrice = chartData[0].price
    const lastPrice = chartData[chartData.length - 1].price
    const percentage =
      firstPrice > 0 ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0

    return {
      percentage,
      isPositive: percentage >= 0,
      startPrice: firstPrice,
      endPrice: lastPrice
    }
  }, [chartData])

  // For single point data, create a simple horizontal line
  const displayData = useMemo(() => {
    if (chartData.length === 0) return []
    if (chartData.length === 1) {
      // Create a horizontal line for single point
      const singlePoint = chartData[0]
      return [
        { ...singlePoint, timestamp: singlePoint.timestamp - 3600000 }, // 1 hour before
        { ...singlePoint },
        { ...singlePoint, timestamp: singlePoint.timestamp + 3600000 } // 1 hour after
      ]
    }
    return chartData
  }, [chartData])

  const timeFrameButtons: TimeFrame[] = ['1D', '1W', '1M', '1Y']

  // Determine loading states
  const isInitialLoad = !hasInitialData.current && fetching
  const isRefreshing = hasInitialData.current && (fetching || isChangingTimeFrame)

  // Only show early returns for true initial states
  if (!poolAddress) {
    return (
      <div className={`p-3 bg-s-bg rounded-lg ${className}`} style={{ minHeight: '200px' }}>
        <p className="text-s-text text-center text-sm">
          No pool data available
        </p>
      </div>
    )
  }

  if (error && !hasInitialData.current) {
    return (
      <div className={`p-3 bg-s-bg rounded-lg ${className}`} style={{ minHeight: '200px' }}>
        <p className="text-red-400 text-center text-sm">Error loading data</p>
      </div>
    )
  }

  if (isInitialLoad) {
    return (
      <div className={`p-3 bg-s-bg rounded-lg ${className}`} style={{ minHeight: '200px' }}>
        <div className="flex justify-center items-center h-full">
          <CircularProgress size={20} />
        </div>
      </div>
    )
  }

  const lineColor = priceChange.isPositive ? '#10b981' : '#ef4444' // green-500 / red-500

  return (
    <div className={`bg-s-bg rounded-lg p-3 ${className}`}>
      {/* Price change indicator */}
      <div className="flex justify-between items-center mb-3">
        <div
          className={`text-sm font-medium transition-opacity duration-200 ${
            isRefreshing ? 'opacity-60' : 'opacity-100'
          } ${priceChange.isPositive ? 'text-green-500' : 'text-red-500'}`}
        >
          {priceChange.isPositive ? '+' : ''}
          {priceChange.percentage.toFixed(2)}%
        </div>

        {/* Time frame selector */}
        <div className="relative flex bg-s-bg rounded-md p-0.5 gap-1">
          {timeFrameButtons.map((timeFrame) => (
            <motion.button
              key={timeFrame}
              className={`relative border-none px-2 py-0.5 rounded-sm text-xs font-medium transition-all duration-200 z-10 ${
                selectedTimeFrame === timeFrame
                  ? 'text-p-text bg-brand'
                  : 'text-p-text hover:text-p-text bg-p-bg'
              }`}
              onClick={() => handleTimeFrameChange(timeFrame)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <span className="relative z-10">{timeFrame}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chart with consistent height and loading overlay */}
      <div className="relative h-28 w-full mb-3">
        {/* Loading overlay */}
        {isRefreshing && (
          <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-[1px] flex items-center justify-center z-10 rounded">
            <CircularProgress size={16} sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
          </div>
        )}

        {/* Chart content */}
        <div className={`h-full w-full transition-opacity duration-200 ${
          isRefreshing ? 'opacity-50' : 'opacity-100'
        }`}>
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-s-text text-center text-sm">No data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={displayData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <XAxis
                  dataKey="timestamp"
                  type="number"
                  scale="time"
                  domain={['dataMin', 'dataMax']}
                  hide
                />
                <YAxis domain={['dataMin', 'dataMax']} hide />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as PriceData
                      return (
                        <div className="bg-p-bg border border-p-border rounded px-2 py-1 shadow-lg text-xs">
                          <p className="text-s-text">
                            {formatTooltipDate(data.timestamp)}
                          </p>
                          <p className="text-p-text font-medium">
                            {formatEthValue(data.price)} ETH
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                  cursor={{
                    stroke: '#64748b',
                    strokeWidth: 1,
                    strokeDasharray: '2 2'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={lineColor}
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{
                    r: 3,
                    fill: lineColor,
                    stroke: 'var(--primary-background)',
                    strokeWidth: 1
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Price range info */}
      {chartData.length > 0 && (
        <div className={`flex justify-between items-center text-xs text-s-text transition-opacity duration-200 ${
          isRefreshing ? 'opacity-60' : 'opacity-100'
        }`}>
          <div className="flex flex-col">
            <span>{formatDateRange(chartData[0].timestamp)}</span>
            <span className="font-medium text-p-text">
              {formatEthValue(priceChange.startPrice)} ETH
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span>
              {formatDateRange(chartData[chartData.length - 1].timestamp)}
            </span>
            <span className="font-medium text-p-text">
              {formatEthValue(priceChange.endPrice)} ETH
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

const PriceChart: React.FC<PriceChartProps> = (props) => {
  return (
    <Provider value={client}>
      <PriceChartComponent {...props} />
    </Provider>
  )
}

export default PriceChart
