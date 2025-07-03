import React from 'react'
import { Users, Calendar } from 'lucide-react'
import { Tooltip } from '@mui/material'
import { formatNumber } from '@/utils/formatters'
import { ZoraCoin } from './types'
import { formatBalance } from './utils'

interface CoinDetailsProps {
  coin: ZoraCoin
  address?: string
  hasBalance: boolean
  userBalance: string
}

const CoinDetails: React.FC<CoinDetailsProps> = ({
  coin,
  address,
  hasBalance,
  userBalance
}) => {
  return (
    <>
      <div className="mb-3">
        <div className="text-p-text font-semibold">{coin.name}</div>
        {coin.description && (
          <div className="text-xs text-s-text mt-1">{coin.description}</div>
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
          <Tooltip 
            title={`Total number of unique holders: ${coin.uniqueHolders?.toLocaleString() || '0'}`}
            arrow
            placement="top"
          >
            <div className="text-p-text font-medium flex items-center cursor-help">
              <Users size={12} className="mr-1 text-s-text" />
              {coin.uniqueHolders?.toLocaleString() || 'N/A'}
            </div>
          </Tooltip>
        </div>
        <div className="text-xs">
          <Tooltip 
            title={`Created on: ${coin.createdAt ? new Date(coin.createdAt).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'Date not available'}`}
            arrow
            placement="top"
          >
            <div className="text-p-text font-medium flex items-center cursor-help">
              <Calendar size={12} className="mr-1 text-s-text" />
              {coin.createdAt
                ? new Date(coin.createdAt).toLocaleDateString()
                : 'N/A'}
            </div>
          </Tooltip>
        </div>
      </div>
    </>
  )
}

export default CoinDetails
