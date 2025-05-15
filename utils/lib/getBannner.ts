import { Account } from '@lens-protocol/react'

export const getBanner = (account?: Account | null): string | undefined => {
  if (!account) {
    return ''
  }
  return account?.metadata?.coverPicture
}
