import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid
} from '@mui/material'
import { MonetizationOn, AddCircleOutline } from '@mui/icons-material'
import CoinTable from './CoinTable'
import FeaturedCoin from './FeaturedCoin'
import { ProfileCoinBalances, CoinBalance } from '../../../../utils/types/zora'
import { getProfileBalances } from '@zoralabs/coins-sdk'
import useSession from '../../../../utils/hooks/useSession'
import {
  useMyStreamQuery,
  useUpdateMyStreamMutation
} from '../../../../graphql/generated'
import { base } from 'viem/chains'
import toast from 'react-hot-toast'
import CreateCoinModal from './CreateCoinModal'

export default function ZoraCoins() {
  const [coinBalances, setCoinBalances] = useState<ProfileCoinBalances | null>(
    null
  )
  const [featuredCoin, setFeaturedCoin] = useState<CoinBalance | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated, authenticatedUser } = useSession()
  const { data: myStream, refetch: refetchMyStream } = useMyStreamQuery()
  const [updateMyStream] = useUpdateMyStreamMutation()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Feature a coin on the user's stream
  const handleFeatureCoin = async (coin: CoinBalance) => {
    // Check if this coin is already featured - if so, we'll unfeature it
    const isAlreadyFeatured =
      featuredCoin?.coin.address.toLowerCase() ===
      coin.coin.address.toLowerCase()

    try {
      const { data } = await updateMyStream({
        variables: {
          request: {
            featuredCoin: isAlreadyFeatured
              ? null
              : {
                  chainId: base.id.toString(),
                  coinAddress: coin.coin.address.toLowerCase(),
                  type: 'zora'
                }
          }
        }
      })

      if (!data?.updateMyStream) {
        toast.error('Failed to update featured coin. Please try again.')
        return
      }

      // If we unfeatured the coin, clear it from state
      if (isAlreadyFeatured) {
        setFeaturedCoin(null)
        toast.success(`${coin.coin.name} is no longer featured on your stream.`)
      } else {
        setFeaturedCoin(coin)
        toast.success(`${coin.coin.name} is now featured on your stream!`)
      }

      // Just refetch myStream, not all coin balances
      refetchMyStream()
    } catch (error: any) {
      console.error('Error updating featured coin:', error)
      toast.error(
        error?.toString() ?? 'Failed to update featured coin. Please try again.'
      )
    }
  }

  // Fetch user's coin balances from Zora API
  const fetchCoinBalances = async () => {
    if (!isAuthenticated || !authenticatedUser?.signer) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      const response = await getProfileBalances({
        identifier: authenticatedUser.signer as string,
        count: 50 // Fetch more coins to avoid pagination issues
      })

      const profile: any = response.data?.profile

      if (profile?.coinBalances) {
        const formattedData: ProfileCoinBalances = {
          count: profile.coinBalances.count || 0,
          edges: profile.coinBalances.edges || [],
          pageInfo: profile.coinBalances.pageInfo || {
            hasNextPage: false,
            endCursor: null
          }
        }

        setCoinBalances(formattedData)

        // Only set the featured coin on initial load or if requested
        const featuredCoinAddress =
          myStream?.myStream?.featuredCoin?.coinAddress?.toLowerCase()
        if (featuredCoinAddress) {
          const featuredCoinData = formattedData.edges.find(
            (edge) =>
              edge.node.coin.address.toLowerCase() === featuredCoinAddress
          )

          if (featuredCoinData) {
            setFeaturedCoin(featuredCoinData.node)
          }
        }
      } else {
        setCoinBalances({
          count: 0,
          edges: [],
          pageInfo: {
            hasNextPage: false,
            endCursor: null
          }
        })
      }
    } catch (err) {
      console.error('Error fetching coin balances:', err)
      toast.error('Failed to fetch your coin balances. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch coin balances only when authentication changes, not when featured coin changes
  useEffect(() => {
    fetchCoinBalances()
  }, [isAuthenticated, authenticatedUser?.signer])

  // Separate effect to update featured coin state when myStream changes
  useEffect(() => {
    if (!coinBalances || !myStream?.myStream?.featuredCoin?.coinAddress) return

    const featuredCoinAddress =
      myStream.myStream.featuredCoin.coinAddress.toLowerCase()
    const featuredCoinData = coinBalances.edges.find(
      (edge) => edge.node.coin.address.toLowerCase() === featuredCoinAddress
    )

    if (
      featuredCoinData &&
      (!featuredCoin ||
        featuredCoin.coin.address.toLowerCase() !== featuredCoinAddress)
    ) {
      setFeaturedCoin(featuredCoinData.node)
    } else if (!featuredCoinData && myStream?.myStream?.featuredCoin) {
      // We have a featured coin in myStream but it's not in our balances
      console.log('Featured coin not found in balances')
    }
  }, [myStream?.myStream?.featuredCoin, coinBalances])

  // Refetch when a new coin is created
  const handleCoinCreated = () => {
    fetchCoinBalances()
    setIsCreateModalOpen(false)
  }

  return (
    <Container maxWidth="lg" className="py-6">
      <Box className="flex justify-between items-center mb-6">
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            className="flex items-center"
          >
            <MonetizationOn fontSize="large" className="mr-2" /> Zora Coins
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create, manage and trade social tokens on the Zora protocol
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutline />}
          size="large"
          onClick={() => setIsCreateModalOpen(true)}
          className="font-bold"
          sx={{ borderRadius: '10px', px: 3 }}
        >
          Create New Coin
        </Button>
      </Box>

      {isLoading ? (
        <Box className="flex justify-center my-8">
          <Typography>Loading your coins...</Typography>
        </Box>
      ) : (
        <Grid container spacing={5}>
          {featuredCoin && (
            <Grid item xs={12}>
              <Box id="featured-coin">
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{
                    mb: 3
                  }}
                >
                  Featured Coin
                </Typography>
                <FeaturedCoin
                  coinBalance={featuredCoin}
                  onFeatureCoin={handleFeatureCoin}
                  isFeatured={true}
                />
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                mb: 3
              }}
            >
              Your Portfolio
            </Typography>
            {coinBalances?.edges.length ? (
              <CoinTable
                coinBalances={coinBalances}
                onFeatureCoin={handleFeatureCoin}
                featuredCoinAddress={featuredCoin?.coin.address || null}
              />
            ) : (
              <Card className="border border-gray-200 text-center p-8 rounded-xl">
                <CardContent>
                  <Typography variant="h6">
                    No coins in your portfolio
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="mt-1 mb-4"
                  >
                    Get started by creating your own coin
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsCreateModalOpen(true)}
                    sx={{ borderRadius: '8px' }}
                  >
                    Create Your First Coin
                  </Button>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      )}

      {/* Create Coin Modal */}
      <CreateCoinModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCoinCreated={handleCoinCreated}
      />
    </Container>
  )
}
