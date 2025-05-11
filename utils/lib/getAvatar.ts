import { Account } from '@lens-protocol/react'
import { AVATAR } from '../config'
import { ZERO_ADDRESS } from '../contants'
import getStampFyiURL from './getStampFyiURL'
import imageKit from './imageKit'
import sanitizeDStorageUrl from './sanitizeDStorageUrl'

/**
 * Returns the avatar image URL for a given profile.
 *
 * @param profile The profile object.
 * @param namedTransform The named transform to use.
 * @returns The avatar image URL.
 */
const getAvatar = (
  account?: Account | null,
  namedTransform = AVATAR
): string => {
  if (!account) {
    return getStampFyiURL(ZERO_ADDRESS)
  }
  const avatarUrl =
    account?.metadata?.picture ?? getStampFyiURL(account?.owner ?? ZERO_ADDRESS)

  return imageKit(sanitizeDStorageUrl(avatarUrl), namedTransform)
}

export default getAvatar
