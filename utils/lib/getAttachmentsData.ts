import { Maybe } from '../../graphql/generated'
import { AnyMedia } from '@lens-protocol/react'

const getAttachmentsData = (attachments?: Maybe<AnyMedia[]>): any => {
  if (!attachments) {
    return []
  }

  return attachments.map((attachment) => {
    switch (attachment.__typename) {
      case 'MediaImage':
        return {
          uri: attachment.item,
          type: 'Image'
        }
      case 'MediaVideo':
        return {
          uri: attachment.item,
          coverUri: attachment.cover,
          type: 'Video'
        }
      case 'MediaAudio':
        return {
          uri: attachment.item,
          coverUri: attachment.cover,
          artist: attachment.artist,
          type: 'Audio'
        }
      default:
        return []
    }
  })
}

export default getAttachmentsData
