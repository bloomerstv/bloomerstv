import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ViewType } from '../../graphql/generated'

interface MyPreferencesStore {
  liveChatPopUpSound: boolean
  setLiveChatPopUpSound: (liveChatPopUpSound: boolean) => void
  streamReplayViewType: ViewType
  setStreamReplayViewType: (viewType: ViewType) => void
  category: string
  setCategory: (category: string) => void
}

export const useMyPreferences = create<MyPreferencesStore>(
  persist(
    (set) => ({
      liveChatPopUpSound: true,
      setLiveChatPopUpSound: (liveChatPopUpSound) =>
        set(() => ({ liveChatPopUpSound })),
      streamReplayViewType: ViewType.Public,
      setStreamReplayViewType: (viewType) =>
        set(() => ({ streamReplayViewType: viewType })),
      category: 'Gaming',
      setCategory: (category) => set(() => ({ category }))
    }),
    {
      name: 'myPreferences',
      partialize: (state: MyPreferencesStore) => {
        // allow persisting only the `liveChatPopUpSound` state
        return {
          liveChatPopUpSound: state.liveChatPopUpSound,
          streamReplayViewType: state.streamReplayViewType,
          category: state.category
        }
      }
    }
  ) as any
)
