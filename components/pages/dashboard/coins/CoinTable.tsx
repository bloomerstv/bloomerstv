import React from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  ArrowUpward,
  ArrowDownward,
  SwapVert,
  Visibility,
  Star,
  StarBorder
} from '@mui/icons-material'
import { ProfileCoinBalances, CoinBalance } from '../../../../utils/types/zora'
import { formatTimeAgo } from '../../../../utils/formatters'

interface CoinTableProps {
  coinBalances: ProfileCoinBalances
  onViewCoin: (coin: CoinBalance) => void
  onFeatureCoin: (coin: CoinBalance) => void
  featuredCoinAddress: string | null
}

export default function CoinTable({
  coinBalances,
  onViewCoin,
  onFeatureCoin,
  featuredCoinAddress
}: CoinTableProps) {
  const [sortField, setSortField] = React.useState<string>('marketCap')
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>(
    'desc'
  )

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

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

  // Calculate USD equivalent of balance
  const calculateUsdValue = (
    balance: string,
    marketCap: string,
    totalSupply: string
  ) => {
    try {
      const balanceValue = parseFloat(formatBalance(balance))
      const marketCapValue = parseFloat(marketCap)
      const totalSupplyValue = parseFloat(totalSupply)

      if (
        isNaN(balanceValue) ||
        isNaN(marketCapValue) ||
        isNaN(totalSupplyValue) ||
        totalSupplyValue === 0
      ) {
        return '0.00'
      }

      const usdValue = (balanceValue * marketCapValue) / totalSupplyValue
      return usdValue.toFixed(2)
    } catch (e) {
      console.error('Error calculating USD value:', e)
      return '0.00'
    }
  }

  // Calculate price per token
  const calculateTokenPrice = (marketCap: string, totalSupply: string) => {
    const marketCapValue = parseFloat(marketCap)
    const totalSupplyValue = parseFloat(totalSupply)

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

  // Open coin page on Zora
  const openCoinPage = (coinAddress: string) => {
    window.open(
      `https://zora.co/coin/base:${coinAddress.toLowerCase()}`,
      '_blank'
    )
  }

  const sortedCoins = [...coinBalances.edges].sort((a, b) => {
    const fieldA =
      sortField === 'balance'
        ? formatBalance(a.node.balance)
        : a.node.coin[sortField as keyof typeof a.node.coin]

    const fieldB =
      sortField === 'balance'
        ? formatBalance(b.node.balance)
        : b.node.coin[sortField as keyof typeof b.node.coin]

    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      const numA = parseFloat(fieldA) || 0
      const numB = parseFloat(fieldB) || 0

      return sortDirection === 'asc' ? numA - numB : numB - numA
    }

    return 0
  })

  const getSortIcon = (field: string) => {
    if (sortField !== field)
      return <SwapVert fontSize="small" color="disabled" />
    return sortDirection === 'asc' ? (
      <ArrowUpward fontSize="small" />
    ) : (
      <ArrowDownward fontSize="small" />
    )
  }

  return (
    <Paper elevation={2} className="rounded-xl overflow-hidden">
      <TableContainer className="max-h-[500px]">
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className="font-semibold">Coin</TableCell>
              <TableCell
                className="font-semibold cursor-pointer"
                onClick={() => handleSort('balance')}
              >
                <Box display="flex" alignItems="center">
                  Balance {getSortIcon('balance')}
                </Box>
              </TableCell>
              <TableCell
                className="font-semibold cursor-pointer"
                onClick={() => handleSort('marketCap')}
              >
                <Box display="flex" alignItems="center">
                  Price/$ {getSortIcon('marketCap')}
                </Box>
              </TableCell>
              <TableCell
                className="font-semibold cursor-pointer"
                onClick={() => handleSort('marketCap')}
              >
                <Box display="flex" alignItems="center">
                  Market Cap {getSortIcon('marketCap')}
                </Box>
              </TableCell>
              <TableCell
                className="font-semibold cursor-pointer"
                onClick={() => handleSort('totalVolume')}
              >
                <Box display="flex" alignItems="center">
                  Volume {getSortIcon('totalVolume')}
                </Box>
              </TableCell>
              <TableCell className="font-semibold">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCoins.map(({ node }) => {
              const isFeatured =
                featuredCoinAddress &&
                node.coin.address.toLowerCase() ===
                  featuredCoinAddress.toLowerCase()

              // Calculate market cap percentage change
              const calculateMarketCapPercentageChange = () => {
                const currentMarketCap = parseFloat(node.coin.marketCap)
                const deltaValue = parseFloat(node.coin.marketCapDelta24h)

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

              const marketCapPercentageChange =
                calculateMarketCapPercentageChange()
              const isPositiveTrend = parseFloat(marketCapPercentageChange) >= 0
              const usdValue = calculateUsdValue(
                node.balance,
                node.coin.marketCap,
                node.coin.totalSupply
              )
              const tokenPrice = calculateTokenPrice(
                node.coin.marketCap,
                node.coin.totalSupply
              )

              return (
                <TableRow
                  key={node.id}
                  sx={{
                    bgcolor: isFeatured
                      ? 'rgba(99, 102, 241, 0.05)'
                      : 'inherit',
                    borderLeft: isFeatured ? '4px solid #6366F1' : 'none'
                  }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        src={node.coin.mediaContent.previewImage.small}
                        alt={node.coin.name}
                        className="w-10 h-10"
                        sx={{
                          border: isFeatured ? '2px solid #6366F1' : 'none'
                        }}
                      />
                      <Box>
                        <Typography fontWeight={isFeatured ? 'bold' : 'medium'}>
                          {node.coin.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {node.coin.symbol}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography>{formatBalance(node.balance)}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ≈ ${usdValue}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>${tokenPrice}</Typography>
                    <Chip
                      size="small"
                      label={`${isPositiveTrend ? '+' : ''}${marketCapPercentageChange}%`}
                      color={isPositiveTrend ? 'success' : 'error'}
                      sx={{ maxWidth: 'fit-content' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography>${node.coin.marketCap}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="column">
                      <Typography>${node.coin.totalVolume}</Typography>
                      <Typography variant="caption">
                        24h: ${node.coin.volume24h}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="View on Zora">
                        <IconButton
                          onClick={() => openCoinPage(node.coin.address)}
                          size="small"
                          color="primary"
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={
                          isFeatured
                            ? 'Unfeature This Coin'
                            : 'Feature This Coin'
                        }
                      >
                        <IconButton
                          size="small"
                          color={isFeatured ? 'primary' : 'default'}
                          onClick={() => onFeatureCoin(node)}
                        >
                          {isFeatured ? <Star /> : <StarBorder />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
