import { create } from 'zustand'

interface StreamAsVideo {
  startTime: number
  endTime: number
  setStartTime: (startTime: number) => void
  setEndTime: (endTime: number) => void
}

export const useStreamAsVideo = create<StreamAsVideo>((set) => ({
  startTime: 0,
  endTime: 0,
  setStartTime: (startTime) => set(() => ({ startTime })),
  setEndTime: (endTime) => set(() => ({ endTime }))
}))
