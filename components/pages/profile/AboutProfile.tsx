import { Profile } from '@lens-protocol/react-web'
import React from 'react'
import formatHandle from '../../../utils/lib/formatHandle'
import Markup from '../../common/Lexical/Markup'
import { getWebsiteLinksFromProfile } from './getWebsiteLinksFromProfile'
import { shortFormOfLink } from '../../../utils/helpers'
import InsertLinkIcon from '@mui/icons-material/InsertLink'
import TwitterIcon from '@mui/icons-material/Twitter'
import GitHubIcon from '@mui/icons-material/GitHub'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
const ProfileLink = ({ link, icon }: { link: string; icon: any }) => (
  <a
    href={link.startsWith('http') ? link : `https://${link}`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-s-text cursor-pointer no-underline rounded-full hover:bg-p-hover active:bg-s-hover pl-1 pr-2"
  >
    <div className="centered-row gap-x-1">
      <div className="h-fit mt-1">{icon}</div>
      <div className="">{shortFormOfLink(link)}</div>
    </div>
  </a>
)

const AboutProfile = ({ profile }: { profile: Profile }) => {
  const { websiteLink, twitterLink, instagramLink, githubLink, linkedInLink } =
    getWebsiteLinksFromProfile(profile)

  return (
    <div className="sm:m-8 sm:p-6 m-2 p-4 rounded-xl shadow-sm bg-s-bg">
      <div className="text-2xl font-bold mb-4">
        About {formatHandle(profile)}
      </div>
      {profile?.metadata?.bio && (
        <Markup className="mt-4">{String(profile?.metadata?.bio)}</Markup>
      )}
      {/* links */}
      <div className="flex flex-row gap-x-4 mt-2 flex-wrap break-words w-full">
        {websiteLink && (
          <ProfileLink
            link={websiteLink}
            icon={<InsertLinkIcon fontSize="small" />}
          />
        )}
        {twitterLink && (
          <ProfileLink
            link={twitterLink}
            icon={<TwitterIcon fontSize="small" />}
          />
        )}
        {instagramLink && (
          <ProfileLink
            link={instagramLink}
            icon={<InstagramIcon fontSize="small" />}
          />
        )}
        {githubLink && (
          <ProfileLink
            link={githubLink}
            icon={<GitHubIcon fontSize="small" />}
          />
        )}
        {linkedInLink && (
          <ProfileLink
            link={linkedInLink}
            icon={<LinkedInIcon fontSize="small" />}
          />
        )}
      </div>
    </div>
  )
}

export default AboutProfile
