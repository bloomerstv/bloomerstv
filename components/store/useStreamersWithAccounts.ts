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
    setStreamersWithAccounts: (newStreamers) =>
      set({ streamersWithAccounts: newStreamers }),
    resetStreamersWithAccounts: () => set({ streamersWithAccounts: [] }),
    accountsFromPublicReplays: [],
    setAccountsFromPublicReplays: (newAccounts) =>
      set((state) => {
        // Only update if the accounts have actually changed
        // Compare by checking length and addresses
        const hasChanged =
          state.accountsFromPublicReplays.length !== newAccounts.length ||
          !state.accountsFromPublicReplays.every(
            (account, index) => account.address === newAccounts[index]?.address
          )

        return hasChanged ? { accountsFromPublicReplays: newAccounts } : state
      }),
    resetAccountsFromPublicReplays: () =>
      set({ accountsFromPublicReplays: [] }),
    loading: true,
    setLoading: (loading) => set({ loading })
  })
)
