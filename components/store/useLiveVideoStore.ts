import { create } from 'zustand'

interface LiveVideoStore {
  showLiveVideoEditor: boolean
  setShowLiveVideoEditor: (showLiveVideoEditor: boolean) => void
  liveVideoConfig: {
    id: string
    streamKey: string
    playbackId: string
  }
  setLiveVideoConfig: (liveVideoConfig: {
    id: string
    streamKey: string
    playbackId: string
  }) => void
  resetLiveVideoConfig: () => void
}

export const useLiveVideoStore = create<LiveVideoStore>((set) => ({
  showLiveVideoEditor: false,
  setShowLiveVideoEditor: (showLiveVideoEditor) =>
    set(() => ({ showLiveVideoEditor })),
  liveVideoConfig: { id: '', streamKey: '', playbackId: '' },
  setLiveVideoConfig: (liveVideoConfig) => set(() => ({ liveVideoConfig })),
  resetLiveVideoConfig: () =>
    set(() => ({ liveVideoConfig: { id: '', streamKey: '', playbackId: '' } }))
}))
