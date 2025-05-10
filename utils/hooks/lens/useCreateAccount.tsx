import { useState } from 'react'
import {
  CreateAccountWithUsernameRequest,
  CreateAccountWithUsernameResult,
  ResultAsync,
  UnauthenticatedError,
  UnexpectedError,
  useSessionClient
} from '@lens-protocol/react'
import { createAccountWithUsername } from '@lens-protocol/client/actions'

interface UseCreateAccountReturn {
  execute: (
    request: CreateAccountWithUsernameRequest
  ) => Promise<
    ResultAsync<
      CreateAccountWithUsernameResult,
      UnexpectedError | UnauthenticatedError
    >
  >
  loading: boolean
  data: CreateAccountWithUsernameResult | null
}

const useCreateAccount = (): UseCreateAccountReturn => {
  const { data: sessionClient } = useSessionClient()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<CreateAccountWithUsernameResult | null>(null)

  const execute = async (
    request: CreateAccountWithUsernameRequest
  ): Promise<
    ResultAsync<
      CreateAccountWithUsernameResult,
      UnexpectedError | UnauthenticatedError
    >
  > => {
    setLoading(true)

    // @ts-ignore - Handle potential type issues with sessionClient
    const result = await createAccountWithUsername(sessionClient, request)

    setData(result?.isOk() ? result.value : null)
    setLoading(false)

    return result
  }

  return {
    execute,
    loading,
    data
  }
}

export default useCreateAccount
