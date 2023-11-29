import { HandleInfo, Profile } from '@lens-protocol/react-web'

/**
 *
 * @param handle - Complete handle
 * @param keepSuffix - Keep .lens or .test suffix
 * @returns formatted handle without .lens or .test suffix
 */
const formatHandle = (profile?: Profile, keepSuffix = false): string => {
  const handleInfo = profile?.handle

  if (!handleInfo) {
    return ''
  }
  if (keepSuffix) {
    return handleInfo?.fullHandle
  }

  return handleInfo?.localName
}

export default formatHandle
