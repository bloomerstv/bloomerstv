import { create } from 'zustand'
import { persist } from 'zustand/middleware'
// import { SettingRecipientType } from '../common/Collect/CollectSettingPopUp'
import { Erc20Amount } from '@lens-protocol/react'

interface CollectPreferencesStore {
  amount?: Erc20Amount
  collectLimit?: number
  referalFee?: number
  disableCollect: boolean
  followerOnly: boolean
  numberOfDays?: number
  // recipients?: RecipientWithSplit[]
  // settingRecipients?: SettingRecipientType[]
  setAmount: (amount?: Erc20Amount) => void
  setCollectLimit: (collectLimit?: number) => void
  setReferalFee: (referalFee?: number) => void
  setDisableCollect: (disableCollect: boolean) => void
  setFollowerOnly: (followerOnly: boolean) => void
  setNumberOfDays: (numberOfDays?: number) => void
  // setRecipients: (recipients?: RecipientWithSplit[]) => void
  // setSettingRecipients: (settingRecipients: SettingRecipientType[]) => void
}

export const useCollectPreferences = create<CollectPreferencesStore>(
  persist(
    (set) => ({
      amount: undefined,
      collectLimit: undefined,
      referalFee: undefined,
      disableCollect: false,
      numberOfDays: undefined,
      followerOnly: true,
      // recipients: undefined,
      // settingRecipients: [],
      setAmount: (amount?: Erc20Amount) => set(() => ({ amount })),
      setCollectLimit: (collectLimit?: number) => set(() => ({ collectLimit })),
      setReferalFee: (referalFee?: number) => set(() => ({ referalFee })),
      setDisableCollect: (disableCollect: boolean) =>
        set(() => ({ disableCollect })),
      setNumberOfDays: (numberOfDays?: number) => set(() => ({ numberOfDays })),
      setFollowerOnly: (followerOnly: boolean) => set(() => ({ followerOnly }))
      // setRecipients: (recipients?: RecipientWithSplit[]) =>
      //   set(() => ({ recipients })),
      // setSettingRecipients: (settingRecipients: SettingRecipientType[]) =>
      //   set(() => ({ settingRecipients }))
    }),
    {
      name: 'collectPreferences',
      partialize: (state: CollectPreferencesStore) => {
        return {
          amount: state.amount,
          collectLimit: state.collectLimit,
          referalFee: state.referalFee,
          disableCollect: state.disableCollect,
          followerOnly: state.followerOnly,
          numberOfDays: state.numberOfDays
          // recipients: state.recipients,
          // settingRecipients: state.settingRecipients
        }
      }
    }
  ) as any
)
