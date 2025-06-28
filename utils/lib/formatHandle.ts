import { Account } from '@lens-protocol/react'
import { stringToLength } from '../stringToLength'

const formatHandle = (account?: Account | null, keepSuffix = false): string => {
  if (!account) {
    return ''
  }
  const handleInfo = account?.username

  if (!handleInfo) {
    return stringToLength(account?.address, 12) || ''
  }
  if (keepSuffix) {
    return handleInfo?.value
  }

  return handleInfo?.localName
}

export default formatHandle
