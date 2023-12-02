import { Profile } from '@lens-protocol/react-web'

export const getBanner = (profile?: Profile | null): string | undefined => {
  if (!profile) {
    return ''
  }
  return profile?.metadata?.coverPicture?.optimized?.uri
}
