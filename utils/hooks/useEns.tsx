import React, { useState } from 'react'
import { viemPublicClient } from '../lib/viemPublicClient'

const useEns = ({
  address
}: {
  address?: string | null
}): {
  ensName: string | null
  ensAvatar: string | null
} => {
  const [ensName, setEnsName] = useState<string | null>(null)
  const [ensAvatar, setEnsAvatar] = useState<string | null>(null)
  React.useEffect(() => {
    if (!address) return
    const foo = async () => {
      const ensName = await viemPublicClient.getEnsName({
        // @ts-ignore
        address: address
      })

      setEnsName(ensName)

      const ensAvatar = await viemPublicClient.getEnsAvatar({
        name: String(ensName),
        gatewayUrls: ['https://cloudflare-ipfs.com']
      })
      setEnsAvatar(ensAvatar)
    }

    foo()
  }, [address])
  return {
    ensName,
    ensAvatar
  }
}

export default useEns
