import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
  Avatar,
  Paper,
  IconButton,
  Tooltip,
  Stack
} from '@mui/material'
import {
  ContentCopy,
  MonetizationOn,
  Star,
  StarBorder,
  LinkOutlined,
  People,
  SwapHoriz,
  CalendarToday,
  BarChart
} from '@mui/icons-material'
import { CoinBalance } from '../../../../utils/types/zora'
import {
  truncateAddress,
  formatNumber,
  formatTimeAgo
} from '../../../../utils/formatters'
import toast from 'react-hot-toast'

interface FeaturedCoinProps {
  coinBalance: CoinBalance
  onFeatureCoin?: (coin: CoinBalance) => void
  isFeatured?: boolean
}

export default function FeaturedCoin({
  coinBalance,
  onFeatureCoin,
  isFeatured = false
}: FeaturedCoinProps) {
  const { coin } = coinBalance

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(coin.address)
    toast.success('Address copied to clipboard')
  }

  // Calculate percentage change properly
  const calculateMarketCapPercentageChange = () => {
    const currentMarketCap = parseFloat(coin.marketCap)
    const deltaValue = parseFloat(coin.marketCapDelta24h)

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

  const marketCapPercentageChange = calculateMarketCapPercentageChange()
  const isPositiveTrend = parseFloat(marketCapPercentageChange) >= 0

  const formatBalance = (balance: string) => {
    // Remove leading zeros and convert to numeric representation
    const trimmed = balance.replace(/^0+/, '')
    if (trimmed.length > 18) {
      const intPart = trimmed.slice(0, trimmed.length - 18)
      const decPart = trimmed.slice(
        trimmed.length - 18,
        trimmed.length - 18 + 6
      )
      // Format to max 2 decimal places
      const formattedDecimal = parseFloat(`0.${decPart}`)
        .toFixed(2)
        .substring(2)
      return `${intPart || '0'}.${formattedDecimal}`
    }
    return '0.00'
  }

  const isVideo = coin.mediaContent.mimeType.includes('video')

  // Open coin URL in Zora
  const openOnZora = () => {
    window.open(
      `https://zora.co/coin/base:${coin.address.toLowerCase()}`,
      '_blank'
    )
  }

  // Calculate price per token
  const calculateTokenPrice = () => {
    const marketCapValue = parseFloat(coin.marketCap)
    const totalSupplyValue = parseFloat(coin.totalSupply)

    if (
      isNaN(marketCapValue) ||
      isNaN(totalSupplyValue) ||
      totalSupplyValue === 0
    ) {
      return '0.0000'
    }

    const price = marketCapValue / totalSupplyValue
    // Format to appropriate decimal places depending on value
    if (price < 0.0001) return price.toFixed(8)
    if (price < 0.01) return price.toFixed(6)
    if (price < 1) return price.toFixed(4)
    return price.toFixed(2)
  }

  const tokenPrice = calculateTokenPrice()

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: '16px',
        overflow: 'hidden',
        border: isFeatured ? '2px solid' : '1px solid',
        borderColor: isFeatured ? 'primary.main' : 'divider',
        bgcolor: 'background.paper',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }
      }}
    >
      <Grid container>
        {/* Content */}
        <Grid item xs={12} md={8} sx={{ order: { xs: 2, md: 1 } }}>
          <CardContent
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header with name and actions */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              mb={2}
            >
              <Box>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1
                  }}
                >
                  {coin.name}
                  <Chip
                    label={coin.symbol}
                    size="small"
                    color="secondary"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Typography>
                <Box display="flex" alignItems="center" mt={0.5}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {truncateAddress(coin.address)}
                    <Tooltip title="Copy Address">
                      <IconButton size="small" onClick={handleCopyAddress}>
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                </Box>
              </Box>

              <Stack direction="row" spacing={1}>
                {onFeatureCoin && (
                  <Button
                    variant={isFeatured ? 'contained' : 'outlined'}
                    color={isFeatured ? 'primary' : 'inherit'}
                    onClick={() => onFeatureCoin(coinBalance)}
                    startIcon={isFeatured ? <Star /> : <StarBorder />}
                    size="small"
                    sx={{ borderRadius: '8px' }}
                  >
                    {isFeatured ? 'Featured' : 'Feature'}
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<MonetizationOn />}
                  sx={{ borderRadius: '8px' }}
                  onClick={openOnZora}
                >
                  Trade
                </Button>
              </Stack>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Stats Grid */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '8px',
                    height: '100%',
                    bgcolor: 'background.neutral',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="overline" color="text.secondary">
                    Your Balance
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {formatBalance(coinBalance.balance)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ≈ $
                    {(
                      (parseFloat(formatBalance(coinBalance.balance)) *
                        parseFloat(coin.marketCap)) /
                      parseFloat(coin.totalSupply)
                    ).toFixed(2)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '8px',
                    height: '100%',
                    bgcolor: 'background.neutral',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="overline" color="text.secondary">
                    Price per Coin
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    ${tokenPrice}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip
                      size="small"
                      label={`${isPositiveTrend ? '+' : ''}${marketCapPercentageChange}%`}
                      color={isPositiveTrend ? 'success' : 'error'}
                      sx={{ height: 24 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      24h
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '8px',
                    height: '100%',
                    bgcolor: 'background.neutral',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="overline" color="text.secondary">
                    Market Cap
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    ${coin.marketCap}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Supply: {formatNumber(parseFloat(coin.totalSupply))}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '8px',
                    height: '100%',
                    bgcolor: 'background.neutral',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="overline" color="text.secondary">
                    Volume
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    ${coin.totalVolume}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    24h: ${coin.volume24h}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Key Stats Section */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                borderRadius: '8px',
                bgcolor: 'background.neutral',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Typography variant="subtitle1" fontWeight="medium" mb={1.5}>
                <BarChart
                  fontSize="small"
                  sx={{ mr: 1, verticalAlign: 'middle' }}
                />
                Key Statistics
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Supply
                    </Typography>
                    <Typography fontWeight="medium">
                      {formatNumber(parseFloat(coin.totalSupply))}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Holders
                    </Typography>
                    <Typography
                      fontWeight="medium"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <People
                        fontSize="small"
                        sx={{ mr: 0.5, color: 'text.secondary' }}
                      />
                      {coin.uniqueHolders}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Transfers
                    </Typography>
                    <Typography
                      fontWeight="medium"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <SwapHoriz
                        fontSize="small"
                        sx={{ mr: 0.5, color: 'text.secondary' }}
                      />
                      {coin.transfers.count}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Created
                    </Typography>
                    <Typography
                      fontWeight="medium"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <CalendarToday
                        fontSize="small"
                        sx={{ mr: 0.5, color: 'text.secondary' }}
                      />
                      {formatTimeAgo(new Date(coin.createdAt))}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Chain
                    </Typography>
                    <Typography fontWeight="medium">
                      Base #{coin.chainId}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Creator
                    </Typography>
                    <Typography fontWeight="medium">
                      @{coin.creatorProfile.handle}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Description */}
            <Box mb={3} flexGrow={1}>
              <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                About
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  maxHeight: '80px',
                  overflow: 'auto'
                }}
              >
                {coin.description}
              </Typography>
            </Box>

            {/* External Links */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Links
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<LinkOutlined />}
                  href={`https://basescan.org/address/${coin.address}`}
                  target="_blank"
                  sx={{ borderRadius: '8px' }}
                >
                  BaseScan
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<MonetizationOn />}
                  href={`https://zora.co/coin/base:${coin.address.toLowerCase()}`}
                  target="_blank"
                  sx={{ borderRadius: '8px' }}
                >
                  Zora
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Grid>

        {/* Media Content */}
        <Grid item xs={12} md={4} sx={{ order: { xs: 1, md: 2 } }}>
          <Box
            sx={{
              position: 'relative',
              height: { xs: 300, md: '100%' },
              minHeight: { xs: 300, md: '400px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'black'
            }}
          >
            {isVideo ? (
              <video
                autoPlay
                muted
                loop
                src={coin.mediaContent.originalUri.replace(
                  'ipfs://',
                  'https://ipfs.io/ipfs/'
                )}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            ) : (
              <img
                src={coin.mediaContent.previewImage.medium}
                alt={coin.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            )}
            {/* Creator info overlay */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 2,
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Avatar
                src={coin.creatorProfile.avatar.previewImage.medium}
                sx={{ border: '2px solid white' }}
              />
              <Box>
                <Typography variant="caption" color="white">
                  Created by
                </Typography>
                <Typography variant="body2" color="white" fontWeight="bold">
                  @{coin.creatorProfile.handle}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Card>
  )
}
