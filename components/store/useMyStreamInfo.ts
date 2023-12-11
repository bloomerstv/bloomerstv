import { create } from 'zustand'
import { persist } from 'zustand/middleware'
interface MyStreamStore {
  addLiveChatAt: boolean
  setAddLiveChatAt: (addLiveChatAt: boolean) => void
}

export const useMyStreamInfo = create<MyStreamStore>(
  persist(
    (set) => ({
      addLiveChatAt: true,
      setAddLiveChatAt: (addLiveChatAt) => set(() => ({ addLiveChatAt }))
    }),

    {
      name: 'myStreamInfo',
      partialize: (state: MyStreamStore) => {
        // allow persisting only the `addLiveChatAt` state
        return { addLiveChatAt: state.addLiveChatAt }
      }
    }
  ) as any // Add this line to fix the type error
)
