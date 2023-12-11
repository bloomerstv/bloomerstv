import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MyPreferencesStore {
  liveChatPopUpSound: boolean
  setLiveChatPopUpSound: (liveChatPopUpSound: boolean) => void
}

export const useMyPreferences = create<MyPreferencesStore>(
  persist(
    (set) => ({
      liveChatPopUpSound: true,
      setLiveChatPopUpSound: (liveChatPopUpSound) =>
        set(() => ({ liveChatPopUpSound }))
    }),

    {
      name: 'myPreferences',
      partialize: (state: MyPreferencesStore) => {
        // allow persisting only the `liveChatPopUpSound` state
        return { liveChatPopUpSound: state.liveChatPopUpSound }
      }
    }
  ) as any
)
