import React, { useState } from 'react'
import { viemPublicClient } from '../lib/viemPublicClient'

const useEns = ({
  address
}: {
  address?: string | null
}): {
  ensName: string
  ensAvatar: string
} => {
  const [ensName, setEnsName] = useState('')
  const [ensAvatar, setEnsAvatar] = useState('')
  React.useEffect(() => {
    if (!address) return
    const foo = async () => {
      const ensName = await viemPublicClient.getEnsName({
        // @ts-ignore
        address: address
      })

      setEnsName(ensName as string)

      const ensAvatar = await viemPublicClient.getEnsAvatar({
        name: String(ensName),
        gatewayUrls: ['https://cloudflare-ipfs.com']
      })
      setEnsAvatar(ensAvatar as string)
    }

    foo()
  }, [address])
  return {
    ensName,
    ensAvatar
  }
}

export default useEns
