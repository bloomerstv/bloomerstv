export const shortFormOfLink = (link?: string) => {
  if (!link) {
    return ''
  }
  return link.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
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

export const timeAgo = (time: number | string) => {
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

export const secondsToTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds - hours * 3600) / 60)
  const secondsLeft = Math.floor(seconds - hours * 3600 - minutes * 60)

  return `${hours ? `${hours}:` : ''}${
    minutes ? `${minutes < 10 ? `0${minutes}` : minutes}:` : '00:'
  }${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}`
}
