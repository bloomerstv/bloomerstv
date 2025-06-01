import React, { useEffect, useRef, useState } from 'react'
import { IconButton } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CoinsRowItem from './CoinsRowItem'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import { useGetFeaturedCoins } from '../../../utils/hooks/useGetFeaturedCoins'

const CoinsRow = () => {
  const { featuredCoins, loading, error } = useGetFeaturedCoins()
  const isMobile = useIsMobile()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOverflowingLeft, setIsOverflowingLeft] = useState(false)
  const [isOverflowingRight, setIsOverflowingRight] = useState(false)

  const checkOverflow = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current

      setIsOverflowingLeft(scrollLeft > 0)
      setIsOverflowingRight(scrollLeft + clientWidth + 3 < scrollWidth)
    }
  }

  useEffect(() => {
    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [featuredCoins])

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -600, behavior: 'smooth' })
      setTimeout(checkOverflow, 400)
    }
  }

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 600, behavior: 'smooth' })
      setTimeout(checkOverflow, 400)
    }
  }

  // Skip rendering if there are no featured coins
  if (!loading && (!featuredCoins || featuredCoins.length === 0)) {
    return null
  }

  return (
    <div className="relative w-full overflow-x-hidden mb-6">
      {/* Navigation arrows */}
      {isOverflowingLeft && !isMobile && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-p-bg z-10 px-1">
          <IconButton onClick={scrollLeft} size="medium">
            <ChevronLeftIcon fontSize="medium" />
          </IconButton>
        </div>
      )}

      {/* Scrollable container */}
      <div
        className="sm:w-[calc(100vw-300px)] no-scrollbar overflow-y-auto flex flex-row items-center gap-x-3 gap-y-2 px-2"
        ref={containerRef}
        style={{ scrollBehavior: 'smooth' }}
        onScroll={checkOverflow}
      >
        {loading ? (
          <div className="flex items-center space-x-3">
            {/* Create multiple skeleton items - show 5 skeleton items while loading */}
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 h-10 px-3 py-1.5 sm:h-12 sm:py-2 sm:px-4 bg-p-bg sm:bg-s-bg rounded-md animate-pulse"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                  <div className="w-12 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="w-10 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500 p-2">Failed to load featured coins</div>
        ) : (
          featuredCoins.map((coin, index) => {
            if (!coin || !coin.featuredCoin) {
              return null // Skip rendering if coin or featuredCoin is missing
            }
            return (
              <CoinsRowItem
                key={`${coin.accountAddress}-${index}`}
                accountAddress={coin.accountAddress}
                coinAddress={coin.featuredCoin.coinAddress || ''}
                chainId={coin.featuredCoin.chainId || '8453'} // Base chain ID default
              />
            )
          })
        )}
      </div>

      {/* Right navigation arrow */}
      {isOverflowingRight && !isMobile && (
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-p-bg z-10 px-1">
          <IconButton onClick={scrollRight} size="medium">
            <ChevronRightIcon fontSize="medium" />
          </IconButton>
        </div>
      )}
    </div>
  )
}

export default CoinsRow
