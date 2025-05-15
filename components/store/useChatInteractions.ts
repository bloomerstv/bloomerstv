import { create } from 'zustand'
import { SendMessageType } from '../common/LiveChat/LiveChatType'

type SendMessagePayloadFunction = (message: SendMessageType) => void

interface ChatInteractionsState {
  sendMessagePayload: SendMessagePayloadFunction | null
  setSendMessagePayload: (fn: SendMessagePayloadFunction | null) => void
}

export const useChatInteractions = create<ChatInteractionsState>((set) => ({
  sendMessagePayload: null,
  setSendMessagePayload: (fn) => set({ sendMessagePayload: fn })
}))
