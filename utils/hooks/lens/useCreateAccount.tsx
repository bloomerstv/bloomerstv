import { useState } from 'react'
import {
  CreateAccountWithUsernameRequest,
  never,
  useSessionClient
} from '@lens-protocol/react'
import {
  createAccountWithUsername,
  fetchAccount
} from '@lens-protocol/client/actions'
import { handleOperationWith } from '@lens-protocol/react/viem'
import { useWalletClient } from 'wagmi'

interface UseCreateAccountReturn {
  execute: (request: CreateAccountWithUsernameRequest) => Promise<void>
  loading: boolean
}

const useCreateAccount = (): UseCreateAccountReturn => {
  const { data: sessionClient } = useSessionClient()
  const [loading, setLoading] = useState(false)
  const { data: walletClient } = useWalletClient()

  const execute = async (
    request: CreateAccountWithUsernameRequest
  ): Promise<void> => {
    if (!sessionClient) {
      throw new Error('Session client is not available')
    }
    setLoading(true)

    // @ts-ignore - Handle potential type issues with sessionClient
    const result = await createAccountWithUsername(sessionClient, request)
      // @ts-ignore
      .andThen(handleOperationWith(walletClient))
      .andThen(sessionClient.waitForTransaction)
      // @ts-ignore
      .andThen((txHash) => fetchAccount(sessionClient, { txHash }))
      .andThen((account) =>
        sessionClient.switchAccount({
          account: account?.address ?? never('Account not found')
        })
      )

    if (result.isErr()) {
      throw new Error(result.error.message)
    }

    setLoading(false)

    return
  }

  return {
    execute,
    loading
  }
}

export default useCreateAccount
