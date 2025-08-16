import React from 'react'
import { motion } from 'framer-motion'
import { Button, TextField, InputAdornment } from '@mui/material'
import { ConnectKitButton } from 'connectkit'
import { toast } from 'react-hot-toast'
import { parseEther, Address, Hex } from 'viem'
import { useWalletClient, useBalance, usePublicClient } from 'wagmi'
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
import { formatEthBalance, calculateTokenPrice } from './utils'

interface BuyModeProps {
  coin: ZoraCoin
  address?: string
  ethAmount: string
  onEthAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCancel: () => void
  onBuyComplete: () => void
  isPending: boolean
  setIsPending: (pending: boolean) => void
}

const BuyMode: React.FC<BuyModeProps> = ({
  coin,
  address,
  ethAmount,
  onEthAmountChange,
  onCancel,
  onBuyComplete,
  isPending,
  setIsPending
}) => {
  const { data: ethBalanceData } = useBalance({ address: address as Address })
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const handleWrongNetwork = useHandleWrongNetwork(base.id)

  const sendMessagePayload = useChatInteractions(
    (state) => state.sendMessagePayload
  )

  // Handle using maximum ETH balance
  const useMaxEthBalance = () => {
    if (ethBalanceData && ethBalanceData.value > 0n) {
      // Leave a small amount for gas
      const maxAmount =
        parseFloat(formatEthBalance(ethBalanceData.value)) - 0.001
      if (maxAmount > 0) {
        const event = {
          target: { value: maxAmount.toFixed(4) }
        } as React.ChangeEvent<HTMLInputElement>
        onEthAmountChange(event)
      }
    }
  }

  // Handle Buy transaction
  const handleBuyCoin = async () => {
    if (!coin?.address) return

    setIsPending(true)
    try {
      await handleWrongNetwork()

      if (!walletClient || !address) {
        toast.error('Wallet not connected')
        setIsPending(false)
        return
      }

      const tradeParameters: TradeParameters = {
        sell: {
          type: 'eth'
        },
        buy: {
          type: 'erc20',
          address: coin.address as Address
        },
        amountIn: parseEther(ethAmount), // Convert ETH amount to wei
        slippage: 0.05, // 5% slippage tolerance
        sender: address as Address
      }

      // Using tradeCoin function directly with the connected wallet
      const result = await tradeCoin({
        tradeParameters,
        walletClient,
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

      const formatterCurrentPrice = calculateTokenPrice(
        coin.marketCap,
        coin.totalSupply
      )

      const messagePayload: SendMessageTradeType = {
        id: uuid(),
        content: `💰Bought $${coin.symbol} for ${ethAmount} ETH at $${formatterCurrentPrice}/${coin.symbol} 🎉`,
        type: ContentType.Trade,
        image: coin.mediaContent?.previewImage?.medium!,
        txHash: txHash,
        currencySymbol: coin.symbol,
        formattedBuyAmountEth: ethAmount
      }

      if (sendMessagePayload) {
        sendMessagePayload(messagePayload)
      }

      onBuyComplete()
    } catch (error) {
      console.log('Error during transaction:', error)
      toast.error('Transaction failed')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="mb-4">
      <div className="text-p-text font-semibold mb-2">Buy {coin?.symbol}</div>
      <div className="flex items-center">
        <TextField
          fullWidth
          variant="outlined"
          label="Amount"
          value={ethAmount}
          onChange={onEthAmountChange}
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
        {ethBalanceData && (
          <div>Balance: {formatEthBalance(ethBalanceData.value)} ETH</div>
        )}
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
                disabled={isPending || !ethAmount || parseFloat(ethAmount) <= 0}
                onClick={async (e) => {
                  e.stopPropagation()
                  if (!isConnected) {
                    show?.()
                  } else {
                    await handleBuyCoin()
                  }
                }}
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
                {isPending
                  ? 'Processing...'
                  : isConnected
                    ? 'Buy'
                    : 'Connect Wallet'}
              </Button>
            )}
          </ConnectKitButton.Custom>
        </motion.div>
      </div>
    </div>
  )
}

export default BuyMode
