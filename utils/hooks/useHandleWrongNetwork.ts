import { useConnections, useSwitchChain } from 'wagmi'
import { LENS_CHAIN_ID } from '../config'

const useHandleWrongNetwork = (customChainId?: number) => {
  const activeConnection = useConnections()
  const { switchChainAsync } = useSwitchChain()
  const targetChainId = customChainId || LENS_CHAIN_ID

  const handleWrongNetwork = async () => {
    if (!activeConnection[0]) {
      return
    }

    if (activeConnection[0]?.chainId !== targetChainId) {
      return await switchChainAsync({ chainId: targetChainId })
    }

    return
  }

  return handleWrongNetwork
}

export default useHandleWrongNetwork
