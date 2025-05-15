import { FullPostMetadata } from '@lens-protocol/react'
import getAttachmentsData from './getAttachmentsData'

export interface MetadataAsset {
  type: 'Image' | 'Video' | 'Audio'
  uri?: string
  cover?: string
  artist?: string
  title?: string
  duration?: number | null
}

const getPublicationData = (
  metadata: FullPostMetadata
): {
  content?: string
  asset?: MetadataAsset
  attachments?: {
    uri: string
    type: 'Image' | 'Video' | 'Audio'
  }[]
} | null => {
  if (!metadata) return null
  switch (metadata.__typename) {
    case 'ArticleMetadata':
      return {
        content: metadata.content,
        attachments: getAttachmentsData(metadata.attachments)
      }
    case 'TextOnlyMetadata':
    case 'LinkMetadata':
      return {
        content: 'content' in metadata ? metadata.content : undefined
      }
    case 'ImageMetadata':
      return {
        content: metadata.content,
        asset: {
          uri: metadata.image.item,
          type: 'Image'
        },
        attachments: getAttachmentsData(metadata.attachments)
      }
    case 'AudioMetadata':
      const audioAttachments = getAttachmentsData(metadata.attachments)[0]

      return {
        content: metadata.content,
        asset: {
          uri: metadata.audio.item || audioAttachments?.uri,
          cover:
            metadata.attachments.find(
              (attachment) => attachment.__typename === 'MediaImage'
            )?.item || audioAttachments?.coverUri,
          title: metadata.title!,
          type: 'Audio'
        }
      }
    case 'VideoMetadata':
      const videoAttachments = getAttachmentsData(metadata.attachments)[0]

      let videoUri = metadata.video.item || videoAttachments?.uri

      const videoFormats = [
        '.mp4',
        '.m4v',
        '.mov',
        '.mpeg',
        '.ogg',
        '.ogv',
        '.webm',
        '.flv',
        '.avi',
        '.wmv',
        '.mkv',
        '.3gp',
        '.3g2',
        '.asf',
        '.ts',
        '.mxf',
        '.vob',
        '.rmvb',
        '.rm',
        '.qt',
        '.divx',
        '.xvid',
        '.gltf',
        '.gltf-binary' // Note: These are not traditional video formats, but rather 3D model formats
      ]

      const hasVideoFormat = videoFormats.some((format) =>
        videoUri.endsWith(format)
      )

      if (!hasVideoFormat) {
        videoUri += '?type=.mp4'
      }

      return {
        content: metadata.content,
        asset: {
          uri: videoUri,
          cover:
            metadata.video.cover ||
            metadata.attachments.find(
              (attachment) => attachment.__typename === 'MediaImage'
            )?.item ||
            videoAttachments?.coverUri,
          type: 'Video',
          duration: metadata?.video?.duration
        }
      }
    case 'MintMetadata':
      return {
        content: metadata.content,
        attachments: getAttachmentsData(metadata.attachments)
      }
    case 'EmbedMetadata':
      return {
        content: metadata.content,
        attachments: getAttachmentsData(metadata.attachments)
      }
    case 'LivestreamMetadata':
      return {
        content: metadata.content,
        attachments: getAttachmentsData(metadata.attachments)
      }
    default:
      return null
  }
}

export default getPublicationData
