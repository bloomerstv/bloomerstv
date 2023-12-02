import { handlePrefix } from '../config'

export const getHandle = (handle?: string | null): string => {
  if (!handle) {
    return ''
  }
  if (handle.startsWith(handlePrefix)) {
    return handle
  }
  return `${handlePrefix}${handle}`
}
