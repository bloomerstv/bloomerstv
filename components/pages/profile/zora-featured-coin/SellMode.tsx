import React from 'react'
import { motion } from 'framer-motion'
import { Button, TextField, InputAdornment } from '@mui/material'
import { ConnectKitButton } from 'connectkit'
import { toast } from 'react-hot-toast'
import { parseEther, Address } from 'viem'
import { useWalletClient, usePublicClient } from 'wagmi'
import { v4 as uuid } from 'uuid'
import { base } from 'viem/chains'
import { tradeCoin, TradeParameters } from '@zoralabs/coins-sdk'
import {
  ContentType,
  SendMessageTradeType
} from '@/components/common/LiveChat/LiveChatType'
import { useChatInteractions } from '@/components/store/useChatInteractions'
import useHandleWrongNetwork from '@/utils/hooks/useHandleWrongNetwork'
import { ZoraCoin } from './types'
import { calculateTokenPrice, formatBalance } from './utils'

interface SellModeProps {
  coin: ZoraCoin
  address?: string
  sellAmount: string
  userBalance: string
  onSellAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCancel: () => void
  onSellComplete: () => void
  fetchUserBalance: () => void
  isPending: boolean
  setIsPending: (pending: boolean) => void
}

const SellMode: React.FC<SellModeProps> = ({
  coin,
  address,
  sellAmount,
  userBalance,
  onSellAmountChange,
  onCancel,
  onSellComplete,
  fetchUserBalance,
  isPending,
  setIsPending
}) => {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const handleWrongNetwork = useHandleWrongNetwork(base.id)

  const sendMessagePayload = useChatInteractions(
    (state) => state.sendMessagePayload
  )

  // Use max balance
  const useMaxBalance = () => {
    const event = {
      target: { value: formatBalance(userBalance) }
    } as React.ChangeEvent<HTMLInputElement>
    onSellAmountChange(event)
  }

  // Handle Sell transaction
  const handleSellCoin = async () => {
    if (!coin?.address) return

    if (!sellAmount || parseFloat(sellAmount) <= 0) {
      toast.error('Please enter a valid amount to sell')
      return
    }

    setIsPending(true)
    try {
      await handleWrongNetwork()

      if (!walletClient || !address) {
        toast.error('Wallet not connected')
        setIsPending(false)
        return
      }

      const tradeParameters: TradeParameters = {
        buy: {
          type: 'eth'
        },
        sell: {
          address: coin.address as Address,
          type: 'erc20'
        },
        amountIn: parseEther(sellAmount),
        slippage: 0.05, // 5% slippage tolerance
        sender: address as Address
      }

      // Using tradeCoin function directly with the connected wallet
      const result = await tradeCoin({
        tradeParameters,
        walletClient,
        // Properly structure the publicClient with account
        // @ts-ignore
        publicClient,
        account: address as Address
      })

      // Handle different result formats to extract transaction hash
      let txHash = ''
      if (typeof result === 'string') {
        txHash = result
      } else if (result && typeof result === 'object') {
        // Extract hash from various possible response formats
        txHash =
          result.hash ||
          result.transactionHash ||
          (result.response && result.response.hash) ||
          ''
      }

      if (!txHash) {
        toast.error('Transaction failed')
        setIsPending(false)
        return
      }

      toast.success('Transaction sent!')

      // Calculate estimated ETH received based on token price
      const marketCapValue = parseFloat(coin.marketCap || '0')
      const totalSupplyValue = parseFloat(coin.totalSupply || '1')
      const tokenPrice = marketCapValue / totalSupplyValue
      const estimatedEthReceived = parseFloat(sellAmount) * tokenPrice

      const formatterCurrentPrice = calculateTokenPrice(
        coin.marketCap,
        coin.totalSupply
      )

      const messagePayload: SendMessageTradeType = {
        id: uuid(),
        content: `💰Sold ${sellAmount} $${coin.symbol} for ~$${estimatedEthReceived.toFixed(4)} at $${formatterCurrentPrice}/${coin.symbol} 🎉`,
        type: ContentType.Trade,
        image: coin.mediaContent?.previewImage?.medium!,
        txHash: txHash,
        currencySymbol: coin.symbol,
        formattedBuyAmountEth: estimatedEthReceived.toFixed(4)
      }

      if (sendMessagePayload) {
        sendMessagePayload(messagePayload)
      }

      // Reset UI and fetch updated balance
      onSellComplete()
      fetchUserBalance()
    } catch (error) {
      console.log('Error during transaction:', error)
      toast.error('Transaction failed')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="mb-4">
      <div className="text-p-text font-semibold mb-2">Sell {coin?.symbol}</div>
      <div className="flex items-center">
        <TextField
          fullWidth
          variant="outlined"
          label="Amount"
          value={sellAmount}
          onChange={onSellAmountChange}
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
        <div>
          Balance: {formatBalance(userBalance)} {coin?.symbol}
        </div>
      </div>

      <div className="flex space-x-2 mt-4">
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
              onCancel()
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
          <ConnectKitButton.Custom>
            {({ show, isConnected }) => (
              <Button
                variant="contained"
                size="small"
                fullWidth
                disabled={
                  isPending || !sellAmount || parseFloat(sellAmount) <= 0
                }
                onClick={async (e) => {
                  e.stopPropagation()
                  if (!isConnected) {
                    show?.()
                  } else {
                    await handleSellCoin()
                  }
                }}
                color="secondary"
                sx={{
                  textTransform: 'none',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  '&:hover': {
                    opacity: 0.9
                  }
                }}
              >
                {isPending
                  ? 'Processing...'
                  : isConnected
                    ? 'Sell'
                    : 'Connect Wallet'}
              </Button>
            )}
          </ConnectKitButton.Custom>
        </motion.div>
      </div>
    </div>
  )
}

export default SellMode
