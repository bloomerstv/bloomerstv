import { APP_ID, SHARE_LENS_URL } from '../config'

export const getPublicationShareLink = (publicationId: string) => {
  return `${SHARE_LENS_URL}/p/${publicationId}?by=${APP_ID}`
}
