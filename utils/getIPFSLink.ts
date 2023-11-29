import { IPFS_ENDPOINT } from './config'

/**
 *
 * @param hash - IPFS hash
 * @returns IPFS link
 */
const getIPFSLink = (hash?: string): string => {
  if (!hash) {
    return ''
  }
  const gateway = IPFS_ENDPOINT

  return hash
    .replace(/^Qm[1-9A-Za-z]{44}/gm, `${gateway}${hash}`)
    .replace('https://ipfs.io/ipfs/', gateway)
    .replace('ipfs://', gateway)
}

export const isIpfsHashLink = (hash: string): boolean => {
  if (!hash) {
    return false
  }

  if (hash.startsWith('ipfs://')) {
    return true
  }

  let regex =
    /^((ipfs:\/\/|https:\/\/ipfs\.io\/ipfs\/)?)Qm[1-9A-HJKa-km-z]{44}$/

  return regex.test(hash)
}

export default getIPFSLink
