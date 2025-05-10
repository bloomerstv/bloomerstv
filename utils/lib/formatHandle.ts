import { Account } from '@lens-protocol/react'

const formatHandle = (account?: Account | null, keepSuffix = false): string => {
  if (!account) {
    return ''
  }
  const handleInfo = account?.username

  if (!handleInfo) {
    return account?.address || ''
  }
  if (keepSuffix) {
    return handleInfo?.localName
  }

  return handleInfo?.localName
}

export default formatHandle
