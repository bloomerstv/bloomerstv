/**
 * Formats a large number with commas as thousands separators
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

/**
 * Truncates an Ethereum address to a shorter form
 */
export const truncateAddress = (
  address: string,
  startChars = 6,
  endChars = 4
): string => {
  if (!address) return ''
  if (address.length <= startChars + endChars) return address
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

/**
 * Formats a currency value with $ prefix and optional decimal places
 */
export const formatCurrency = (
  value: number | string,
  decimals = 2
): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(numValue)) return '$0.00'

  return `$${numValue.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`
}

/**
 * Converts a large raw balance string to a human-readable format
 */
export const formatRawBalance = (balance: string): string => {
  // Remove leading zeros and convert to numeric representation
  const trimmed = balance.replace(/^0+/, '')
  if (trimmed.length > 18) {
    const intPart = trimmed.slice(0, trimmed.length - 18)
    const decPart = trimmed.slice(trimmed.length - 18, trimmed.length - 18 + 6)
    return `${intPart || '0'}.${decPart}`
  }
  return '0'
}

/**
 * Custom implementation to format a date to show how long ago it was
 * This replaces the need for formatDistanceToNow from date-fns
 */
export const formatTimeAgo = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput

  if (isNaN(date.getTime())) {
    return 'Invalid date'
  }

  const now = new Date()
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000)

  // Define time intervals in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  }

  // Handle future dates
  if (secondsAgo < 0) {
    return 'in the future'
  }

  // Find the appropriate interval
  let counter: number
  let unit: string

  if (secondsAgo >= intervals.year) {
    counter = Math.floor(secondsAgo / intervals.year)
    unit = counter === 1 ? 'year' : 'years'
  } else if (secondsAgo >= intervals.month) {
    counter = Math.floor(secondsAgo / intervals.month)
    unit = counter === 1 ? 'month' : 'months'
  } else if (secondsAgo >= intervals.week) {
    counter = Math.floor(secondsAgo / intervals.week)
    unit = counter === 1 ? 'week' : 'weeks'
  } else if (secondsAgo >= intervals.day) {
    counter = Math.floor(secondsAgo / intervals.day)
    unit = counter === 1 ? 'day' : 'days'
  } else if (secondsAgo >= intervals.hour) {
    counter = Math.floor(secondsAgo / intervals.hour)
    unit = counter === 1 ? 'hour' : 'hours'
  } else if (secondsAgo >= intervals.minute) {
    counter = Math.floor(secondsAgo / intervals.minute)
    unit = counter === 1 ? 'minute' : 'minutes'
  } else {
    counter = secondsAgo
    unit = counter === 1 ? 'second' : 'seconds'
  }

  return `${counter} ${unit} ago`
}
