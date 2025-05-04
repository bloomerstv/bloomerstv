export enum ContentType {
  Comment = 'Comment',
  Clip = 'Clip',
  Trade = 'Trade'
}

export enum MessageType {
  System = 'System',
  Profile = 'Profile'
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

// Type for messages of type "Profile"
interface ProfileMessageBase extends MessageBase {
  type: MessageType.Profile
  image?: string
  profileId: string
  authorProfileId?: string
  avatarUrl?: string
  handle: string
  amount?: number
  formattedAmount?: string
  currencySymbol?: string
  id: string
}

interface ProfileCommentMessage extends ProfileMessageBase {
  contentType: ContentType.Comment
}

interface ProfileClipMessage extends ProfileMessageBase {
  contentType: ContentType.Clip
  clipPostId: string
  image: string
}

interface ProfileTradeMessage extends ProfileMessageBase {
  contentType: ContentType.Trade
  txHash: string
  amount?: number
  formattedBuyAmountEth: string
  currencySymbol: string
  image: string
}

export type ProfileMessage =
  | ProfileCommentMessage
  | ProfileClipMessage
  | ProfileTradeMessage

export type Message = SystemMessage | ProfileMessage

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

export interface SendMessageClipTyep extends SendMessageBaseType {
  type: ContentType.Clip
  clipPostId: string
  image: string
}

export interface SendMessageTradeType extends SendMessageBaseType {
  type: ContentType.Trade
  txHash: string
  amount?: number
  formattedBuyAmountEth: string
  currencySymbol: string
  image: string
}

export type SendMessageType =
  | SendMessageCommentType
  | SendMessageClipTyep
  | SendMessageTradeType
