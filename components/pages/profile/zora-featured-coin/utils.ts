import { formatEther } from 'viem'

// Format the balance for display
export const formatBalance = (balance: string) => {
  // Remove leading zeros and convert to numeric representation
  const trimmed = balance.replace(/^0+/, '')
  if (trimmed.length > 18) {
    const intPart = trimmed.slice(0, trimmed.length - 18)
    const decPart = trimmed.slice(trimmed.length - 18, trimmed.length - 18 + 6)
    // Format to max 2 decimal places
    const formattedDecimal = parseFloat(`0.${decPart}`).toFixed(2).substring(2)
    return `${intPart || '0'}.${formattedDecimal}`
  }
  return '0.00'
}

// Format ETH balance for display
export const formatEthBalance = (value: bigint | undefined): string => {
  if (!value) return '0.00'
  return parseFloat(formatEther(value)).toFixed(4)
}

// Calculate percentage change properly - using the same approach as CoinTable
export const calculateMarketCapPercentageChange = (
  marketCap?: string,
  marketCapDelta24h?: string
) => {
  const currentMarketCap = parseFloat(marketCap || '0')
  const deltaValue = parseFloat(marketCapDelta24h || '0')

  if (isNaN(currentMarketCap) || isNaN(deltaValue) || currentMarketCap === 0) {
    return '0.00'
  }

  // Calculate the previous market cap
  const previousMarketCap = currentMarketCap - deltaValue

  if (previousMarketCap === 0) return '0.00'

  // Calculate the percentage change
  const percentageChange = (deltaValue / previousMarketCap) * 100

  return percentageChange.toFixed(2)
}

// Format percentage change with "+" prefix for positive values
export const formatPercentage = (value: string) => {
  const num = parseFloat(value)
  return `${num >= 0 ? '+' : ''}${num}%`
}

// Determine if price change is positive
export const isPriceChangePositive = (value: string) => {
  return parseFloat(value) >= 0
}

// Calculate price per token with smart precision
export const calculateTokenPrice = (
  marketCap?: string,
  totalSupply?: string
) => {
  const marketCapValue = parseFloat(marketCap || '0')
  const totalSupplyValue = parseFloat(totalSupply || '1')

  if (
    isNaN(marketCapValue) ||
    isNaN(totalSupplyValue) ||
    totalSupplyValue === 0
  ) {
    return '0.00'
  }

  const price = marketCapValue / totalSupplyValue

  // If price is >= 1, show only 2 decimal places
  if (price >= 1) {
    return price.toFixed(2)
  }

  // For prices < 1, check if they start with "0.00" (very small)
  const priceString = price.toString()
  if (priceString.startsWith('0.00')) {
    // For very small prices like 0.0001234, show up to 6 significant digits
    return price.toPrecision(2)
  }

  // For prices like 0.1234, 0.5678, etc., show 4 decimal places
  return price.toFixed(4)
}
