import React, { useEffect, useState } from 'react'
import { getProfileBalances } from '@zoralabs/coins-sdk'
import {
  Button,
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Pagination,
  Alert
} from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import CreateNewZoraCoinButton from './CreateNewZoraCoinButton'
import { useSession } from '@lens-protocol/react-web'

// Updated interface for coin data structure based on API response
interface CoinBalance {
  id: string
  balance: string
  coin: {
    id: string
    name: string
    symbol: string
    address: string
    totalSupply?: string
    marketCap?: string
    volume24h?: string
    mediaContent?: {
      mimeType?: string
      originalUri?: string
      previewImage?: {
        small?: string
        medium?: string
        blurhash?: string
      }
    }
  }
  amount?: {
    amountRaw: string
    amountDecimal: number
  }
  valueUsd?: string
}

interface PaginationInfo {
  cursor?: string
  hasNextPage: boolean
}

const ZoraCoinSelection = () => {
  const { data: session } = useSession()

  // State for coin balances
  const [coinBalances, setCoinBalances] = useState<CoinBalance[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo>({
    cursor: undefined,
    hasNextPage: false
  })
  const [page, setPage] = useState(1)
  const [featuredCoinId, setFeaturedCoinId] = useState<string | null>(null)
  const pageSize = 5

  // Generate Zora coin URL
  const getZoraCoinUrl = (coinAddress: string) => {
    return `https://zora.co/coin/base:${coinAddress}?referrer=${session?.authenticated ? session?.address : ''}`
  }

  // Open coin URL in a new tab
  const openCoinUrl = (coinAddress: string) => {
    window.open(getZoraCoinUrl(coinAddress), '_blank', 'noopener,noreferrer')
  }

  // Fetch user's coin balances
  const fetchCoinBalances = async (cursor?: string) => {
    if (!session?.authenticated) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await getProfileBalances({
        identifier: session?.address,
        count: pageSize,
        after: cursor
      })

      const profile: any = response.data?.profile

      if (profile && profile.coinBalances) {
        // Map the nodes from the edges to get the coin balances
        const balances = profile.coinBalances.edges.map((edge: any) => {
          const node = edge.node
          // Add calculated amount for consistency with existing UI
          return {
            ...node,
            amount: {
              amountRaw: node.balance,
              amountDecimal: parseInt(node.balance) / 1e20 // Approximate conversion
            },
            valueUsd: node.coin.marketCap
              ? (
                  (parseInt(node.balance) / 1e20) *
                  (parseFloat(node.coin.marketCap) / 1e6)
                ).toString()
              : undefined
          }
        })

        setCoinBalances(balances)

        setPagination({
          cursor: profile.coinBalances.pageInfo.endCursor,
          hasNextPage: profile.coinBalances.pageInfo.hasNextPage
        })
      } else {
        setCoinBalances([])
      }
    } catch (err) {
      console.error('Error fetching coin balances:', err)
      setError('Failed to fetch your coin balances. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle pagination
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value)
    if (value > page && pagination.hasNextPage) {
      fetchCoinBalances(pagination.cursor)
    } else if (value < page) {
      // To implement previous page, we would need to store previous cursors
      // For simplicity, we'll reload from the beginning
      fetchCoinBalances()
    }
  }

  // Handler for featuring a coin
  const handleFeatureCoin = (coinId: string) => {
    setFeaturedCoinId(coinId === featuredCoinId ? null : coinId)
  }

  useEffect(() => {
    if (session?.authenticated && session?.address) {
      fetchCoinBalances()
    }
  }, [session?.authenticated])

  // Refetch balances when a new coin is created
  const handleCoinCreated = () => {
    fetchCoinBalances()
  }

  // Calculate USD value if available
  const formatUsdValue = (valueUsd?: string) => {
    if (!valueUsd) return 'N/A'
    const value = parseFloat(valueUsd)
    return `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
  }

  // Format large numbers with abbreviations
  const formatNumber = (value?: string) => {
    if (!value) return 'N/A'
    const num = parseFloat(value)
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(2)}B`
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`
    }
    return num.toLocaleString()
  }

  return (
    <div className="mt-4 2xl:mt-6 p-6 bg-s-bg lg:gap-x-12 2xl:gap-x-20 start-col shadow-sm rounded-xl">
      <div className="font-bold text-lg text-p-text">Zora Coins</div>
      <div className="text-s-text text-sm font-semibold mb-4">
        Select one of your Zora coins to feature on your stream, or create a new
        one to showcase on your live page.
      </div>

      <CreateNewZoraCoinButton onCoinCreated={handleCoinCreated} />

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{ fontWeight: 'bold', mr: 1 }}
        >
          Your Coin Holdings
        </Typography>
        <Tooltip title="Click on a coin to feature it on your stream">
          <InfoOutlinedIcon
            sx={{ fontSize: 18, color: 'text.secondary', cursor: 'help' }}
          />
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : coinBalances.length > 0 ? (
        <>
          <TableContainer
            component={Paper}
            sx={{
              mb: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              borderRadius: '12px'
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Coin</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Symbol</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Balance</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>USD Value</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Volume</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Market Cap</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coinBalances.map((coin) => {
                  const isFeatured = coin.id === featuredCoinId
                  return (
                    <TableRow
                      key={coin.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        bgcolor: isFeatured
                          ? 'rgba(99, 102, 241, 0.05)'
                          : 'transparent',
                        '&:hover': {
                          bgcolor: isFeatured
                            ? 'rgba(99, 102, 241, 0.08)'
                            : 'rgba(0,0,0,0.02)'
                        },
                        transition: 'background-color 0.2s',
                        position: 'relative'
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              bgcolor: 'rgba(99, 102, 241, 0.1)',
                              mr: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: isFeatured ? '2px solid #6366F1' : 'none',
                              cursor: 'pointer'
                            }}
                            onClick={() => openCoinUrl(coin.coin.address)}
                          >
                            {coin.coin.mediaContent?.previewImage?.small ? (
                              <img
                                src={coin.coin.mediaContent.previewImage.small}
                                alt={coin.coin.symbol}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  borderRadius: '50%'
                                }}
                              />
                            ) : (
                              <Typography
                                sx={{ fontWeight: 'bold', color: '#6366F1' }}
                              >
                                {coin.coin.symbol.substring(0, 2)}
                              </Typography>
                            )}
                          </Box>
                          <Typography
                            variant="body1"
                            component="div"
                            sx={{
                              fontWeight: isFeatured ? 'bold' : 'normal',
                              cursor: 'pointer',
                              '&:hover': {
                                textDecoration: 'underline',
                                color: '#6366F1'
                              }
                            }}
                            onClick={() => openCoinUrl(coin.coin.address)}
                          >
                            {coin.coin.name}
                            {isFeatured && (
                              <Chip
                                label="Featured"
                                size="small"
                                color="primary"
                                sx={{ ml: 1, fontSize: '0.7rem', height: 20 }}
                              />
                            )}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{coin.coin.symbol}</TableCell>
                      <TableCell>
                        {coin.amount?.amountDecimal.toLocaleString() || 'N/A'}
                      </TableCell>
                      <TableCell>{formatUsdValue(coin.valueUsd)}</TableCell>
                      <TableCell>{formatNumber(coin.coin.volume24h)}</TableCell>
                      <TableCell>{formatNumber(coin.coin.marketCap)}</TableCell>
                      <TableCell>
                        <Button
                          variant={isFeatured ? 'contained' : 'outlined'}
                          size="small"
                          color="primary"
                          onClick={() => handleFeatureCoin(coin.id)}
                          startIcon={
                            isFeatured ? <StarIcon /> : <StarBorderIcon />
                          }
                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none'
                          }}
                        >
                          {isFeatured ? 'Featured' : 'Feature'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
            <Pagination
              count={pagination.hasNextPage ? page + 1 : page}
              page={page}
              onChange={handlePageChange}
              color="primary"
              disabled={isLoading}
            />
          </Box>
        </>
      ) : (
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            bgcolor: 'rgba(0,0,0,0.02)',
            borderRadius: '12px'
          }}
        >
          <Typography variant="body1" sx={{ mb: 2 }}>
            You don't have any Zora coins yet.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your first coin to get started!
          </Typography>
        </Box>
      )}

      {/* Display featured coin separately if needed */}
      {featuredCoinId && (
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="subtitle1"
            component="h3"
            sx={{ fontWeight: 'bold', mb: 2 }}
          >
            Featured Coin
          </Typography>
          <Paper
            sx={{
              p: 3,
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.2)'
            }}
          >
            {coinBalances
              .filter((coin) => coin.id === featuredCoinId)
              .map((coin) => (
                <Box
                  key={coin.id}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: 'rgba(99, 102, 241, 0.1)',
                      mr: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #6366F1',
                      cursor: 'pointer'
                    }}
                    onClick={() => openCoinUrl(coin.coin.address)}
                  >
                    {coin.coin.mediaContent?.previewImage?.small ? (
                      <img
                        src={coin.coin.mediaContent.previewImage.small}
                        alt={coin.coin.symbol}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%'
                        }}
                      />
                    ) : (
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          color: '#6366F1',
                          fontSize: '1.2rem'
                        }}
                      >
                        {coin.coin.symbol.substring(0, 2)}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        fontWeight: 'bold',
                        color: '#6366F1',
                        cursor: 'pointer',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                      onClick={() => openCoinUrl(coin.coin.address)}
                    >
                      {coin.coin.name} ({coin.coin.symbol})
                    </Typography>
                    <Typography variant="body1">
                      Balance:{' '}
                      {coin.amount?.amountDecimal.toLocaleString() || 'N/A'} •
                      Value: {formatUsdValue(coin.valueUsd)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This coin will be featured prominently on your stream
                    </Typography>
                  </Box>
                </Box>
              ))}
          </Paper>
        </Box>
      )}
    </div>
  )
}

export default ZoraCoinSelection
