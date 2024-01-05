import { Profile } from '@lens-protocol/react-web'

// returns an object with website link, twitter link and instagram link from the profile object
export const getWebsiteLinksFromProfile = (
  profile: Profile
): {
  websiteLink: string | null
  twitterLink: string | null
  instagramLink: string | null
  githubLink: string | null
  linkedInLink: string | null
} => {
  if (!profile)
    return {
      websiteLink: null,
      twitterLink: null,
      instagramLink: null,
      githubLink: null,
      linkedInLink: null
    }
  const attributes = profile?.metadata?.attributes
  if (!attributes)
    return {
      websiteLink: null,
      twitterLink: null,
      instagramLink: null,
      githubLink: null,
      linkedInLink: null
    }
  const websiteLink = attributes.find(
    (attribute) => attribute.key === 'website'
  )
  const twitterHandle = attributes.find((attribute) => attribute.key === 'x')
  const instagramHandle = attributes.find(
    (attribute) => attribute.key === 'instagram'
  )

  const githubHandle = attributes.find(
    (attribute) => attribute.key === 'github'
  )

  const linkdInHandle = attributes.find(
    (attribute) => attribute.key === 'linkedin'
  )

  const githubLink = githubHandle
    ? `https://github.com/${githubHandle.value}`
    : null

  const linkedInLink = linkdInHandle
    ? `https://linkedin.com/in/${linkdInHandle.value}`
    : null

  const twitterLink = twitterHandle
    ? `https://twitter.com/${twitterHandle.value}`
    : null
  const instagramLink = instagramHandle
    ? `https://instagram.com/${instagramHandle.value}`
    : null

  return {
    websiteLink: websiteLink ? websiteLink.value : null,
    twitterLink,
    instagramLink,
    githubLink,
    linkedInLink
  }
}
