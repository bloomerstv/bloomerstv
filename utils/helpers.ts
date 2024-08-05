export const shortFormOfLink = (link?: string) => {
  if (!link) {
    return ''
  }
  return link.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
}

export const humanReadableNumber = (num?: number) => {
  console.log('num', num)
  if (!num) {
    return '0'
  }
  if (num < 1000) {
    return num
  }
  if (num < 1000000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return `${(num / 1000000).toFixed(1)}m`
}

export const numberWithCommas = (num?: number) => {
  if (!num) {
    return '0'
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const simpleTime = (time: number) => {
  const date = new Date(time)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 || 12
  const minutes12 = minutes < 10 ? `0${minutes}` : minutes
  const seconds12 = seconds < 10 ? `0${seconds}` : seconds
  return `${hours12}:${minutes12}:${seconds12} ${ampm}`
}

export const timeToGo = (futureTime: number): string | null => {
  const now = new Date().getTime()
  const futureTimeDate = new Date(futureTime).getTime()

  const timeDifference = futureTimeDate - now

  if (timeDifference <= 0) {
    return null
  }

  const seconds = Math.floor((timeDifference / 1000) % 60)
  const minutes = Math.floor((timeDifference / (1000 * 60)) % 60)
  const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24)
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

  const daysStr = days > 0 ? `${days}d ` : ''
  const hoursStr = hours > 0 ? `${hours}h ` : ''
  const minutesStr = minutes > 0 ? `${minutes}m ` : ''
  const secondsStr = seconds > 0 ? `${seconds}s` : ''

  return `${daysStr}${hoursStr}${minutesStr}${secondsStr}`.trim()
}

// Function to format the date
export const formatDate = (dateString: string): string => {
  console.log('dateString', dateString)
  const date = new Date(dateString)

  console.log('date', date)
  const day = date.getDate()
  const month = date.toLocaleString('default', { month: 'short' })
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

export const timeAgo = (time?: number | string) => {
  if (!time) return 'just now'
  const now = new Date().getTime()

  if (typeof time === 'string') {
    time = new Date(time).getTime()
  }
  const diff = now - time
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  }
  if (seconds > 0) {
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`
  }
  return 'just now'
}

export const timeAgoShort = (time: number | string) => {
  const now = new Date().getTime()

  if (typeof time === 'string') {
    time = new Date(time).getTime()
  }
  const diff = now - time
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}d`
  }
  if (hours > 0) {
    return `${hours}h`
  }
  if (minutes > 0) {
    return `${minutes}m`
  }
  if (seconds > 0) {
    return `${seconds}s`
  }
  return 'now'
}

export const localDateAndTime = (dataTime: string) => {
  const date = new Date(dataTime)
  const year = date.getFullYear()
  const month = date.toLocaleString('default', { month: 'short' }) // Get short month name
  const day = date.getDate()
  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return `${day} ${month} ${year} ${time}`
}

export const localDate = (dateTime: string) => {
  const date = new Date(dateTime)
  const year = date.getFullYear()
  const month = date.toLocaleString('default', { month: 'short' }) // Get short month name
  const day = date.getDate()

  return `${month} ${day}, ${year}`
}

export const secondsToTime = (seconds?: number) => {
  if (!seconds) {
    return '00:00'
  }
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds - hours * 3600) / 60)
  const secondsLeft = Math.floor(seconds - hours * 3600 - minutes * 60)

  return `${hours ? `${hours}:` : ''}${
    minutes ? `${minutes < 10 ? `0${minutes}` : minutes}:` : '00:'
  }${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}`
}

export const getRemainingTime = (
  endsAt: Date | null | string
): string | null => {
  if (!endsAt) {
    return null
  }

  if (typeof endsAt === 'string') {
    endsAt = new Date(endsAt)
  }

  const now = new Date()
  const diffInMilliseconds = endsAt.getTime() - now.getTime()

  if (diffInMilliseconds <= 0) {
    return null
  }

  const diffInMinutes = Math.round(diffInMilliseconds / 60000)
  const diffInHours = Math.round(diffInMinutes / 60)
  const diffInDays = Math.round(diffInHours / 24)

  if (diffInDays > 0) {
    return `${diffInDays}d`
  } else if (diffInHours > 0) {
    return `${diffInHours}h`
  } else {
    return `${diffInMinutes}m`
  }
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
