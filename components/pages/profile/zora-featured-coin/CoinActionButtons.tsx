import React from 'react'
import { motion } from 'framer-motion'
import { Button, Box } from '@mui/material'
import { ConnectKitButton } from 'connectkit'
import { ShoppingCartIcon, WalletIcon } from 'lucide-react'
import { ShoppingBag } from '@mui/icons-material'
import { toast } from 'react-hot-toast'
import { base } from 'viem/chains'
import useHandleWrongNetwork from '@/utils/hooks/useHandleWrongNetwork'

interface CoinActionButtonsProps {
  address?: string
  chainId: number
  hasBalance: boolean
  onEnterBuyMode: () => void
  onEnterSellMode: () => void
}

const CoinActionButtons: React.FC<CoinActionButtonsProps> = ({
  address,
  chainId,
  hasBalance,
  onEnterBuyMode,
  onEnterSellMode
}) => {
  const handleWrongNetwork = useHandleWrongNetwork(base.id)

  return (
    <>
      {address && chainId === base.id ? (
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
                onEnterBuyMode()
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
                  onEnterSellMode()
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
          <ConnectKitButton.Custom>
            {({ show, isConnected }) => (
              <Button
                variant="contained"
                size="small"
                fullWidth
                onClick={async (e) => {
                  e.stopPropagation()
                  if (!isConnected) {
                    show?.()
                  } else if (chainId !== base.id) {
                    // If connected but not on Base network, switch to Base
                    try {
                      await handleWrongNetwork()
                    } catch (error) {
                      console.error('Network switching failed:', error)
                      toast.error('Failed to switch to Base network')
                    }
                  }
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
                {!isConnected
                  ? 'Connect Wallet'
                  : chainId !== base.id
                    ? 'Switch to Base'
                    : 'Connected'}
              </Button>
            )}
          </ConnectKitButton.Custom>
        </motion.div>
      )}
    </>
  )
}

export default CoinActionButtons
