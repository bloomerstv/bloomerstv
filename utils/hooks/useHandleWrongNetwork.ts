import { useConnections, useSwitchChain } from 'wagmi'
import { LENS_CHAIN_ID } from '../config'

const useHandleWrongNetwork = () => {
  const activeConnection = useConnections()
  const { switchChainAsync } = useSwitchChain()

  const handleWrongNetwork = async () => {
    if (!activeConnection[0]) {
      return
    }

    if (activeConnection[0]?.chainId !== LENS_CHAIN_ID) {
      return await switchChainAsync({ chainId: LENS_CHAIN_ID })
    }

    return
  }

  return handleWrongNetwork
}

export default useHandleWrongNetwork
