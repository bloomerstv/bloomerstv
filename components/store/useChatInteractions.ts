import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import { ContentType, SendMessageType } from '../common/LiveChat/LiveChatType'

type SendMessagePayloadFunction = (message: SendMessageType) => void

interface ChatInteractionsState {
  sendMessagePayload: SendMessagePayloadFunction | null
  setSendMessagePayload: (fn: SendMessagePayloadFunction | null) => void
}

export const useChatInteractions = create<ChatInteractionsState>(
  (set, get) => ({
    sendMessagePayload: null,
    setSendMessagePayload: (fn) => set({ sendMessagePayload: fn })
  })
)
