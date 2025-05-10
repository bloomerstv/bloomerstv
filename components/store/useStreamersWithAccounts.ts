import { create } from 'zustand'
import { Streamer } from '../../graphql/generated'
import { Account } from '@lens-protocol/react'

export interface StreamerWithAccount extends Streamer {
  account: Account
}

interface StreamerWithAccountStore {
  streamersWithAccounts: StreamerWithAccount[]
  setStreamersWithAccounts: (
    streamersWithAccounts: StreamerWithAccount[]
  ) => void
  accountsFromPublicReplays: Account[]
  setAccountsFromPublicReplays: (accountsFromPublicReplays: Account[]) => void
  resetStreamersWithAccounts: () => void
  resetAccountsFromPublicReplays: () => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

export const useStreamersWithAccounts = create<StreamerWithAccountStore>(
  (set) => ({
    streamersWithAccounts: [],
    setStreamersWithAccounts: (streamersWithAccounts) =>
      set(() => ({ streamersWithAccounts })),
    resetStreamersWithAccounts: () =>
      set(() => ({ streamersWithAccounts: [] })),
    accountsFromPublicReplays: [],
    setAccountsFromPublicReplays: (accountsFromPublicReplays) =>
      set(() => ({ accountsFromPublicReplays })),
    resetAccountsFromPublicReplays: () =>
      set(() => ({ accountsFromPublicReplays: [] })),
    loading: true,
    setLoading: (loading) => set(() => ({ loading }))
  })
)
