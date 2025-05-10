export enum ContentType {
  Comment = 'Comment',
  Clip = 'Clip'
}

export enum MessageType {
  System = 'System',
  Account = 'Account'
}

// Base type for common fields
interface MessageBase {
  id: string
  content: string
  type: MessageType
}

// Type for messages of type "System"
export interface SystemMessage extends MessageBase {
  type: MessageType.System
}

// Type for messages of type "Account"
interface AccountMessageBase extends MessageBase {
  type: MessageType.Account
  image?: string
  accountAddress: string
  authorAccountAddress?: string
  avatarUrl?: string
  handle: string
  amount?: number
  formattedAmount?: string
  currencySymbol?: string
  id: string
}

interface AccountCommentMessage extends AccountMessageBase {
  contentType: ContentType.Comment
}

interface AccountClipMessage extends AccountMessageBase {
  contentType: ContentType.Clip
  clipPostId: string
  image: string
}

export type AccountMessage = AccountCommentMessage | AccountClipMessage

export type Message = SystemMessage | AccountMessage

export interface SendMessageBaseType {
  id: string
  type: ContentType
  image?: string
  content: string
}

export interface SendMessageCommentType extends SendMessageBaseType {
  type: ContentType.Comment
  txHash?: string
}

export interface SendMessageClipType extends SendMessageBaseType {
  type: ContentType.Clip
  clipPostId: string
  image: string
}

export type SendMessageType = SendMessageCommentType | SendMessageClipType
