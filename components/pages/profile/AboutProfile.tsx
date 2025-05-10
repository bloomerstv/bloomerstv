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
import clsx from 'clsx'
import { Account } from '@lens-protocol/react'

export const ProfileLink = ({
  link,
  icon,
  alias,
  className
}: {
  link: string
  icon: any
  alias?: string
  className?: string
}) => (
  <a
    href={link.startsWith('http') ? link : `https://${link}`}
    target="_blank"
    rel="noopener noreferrer"
    className={clsx(
      'text-s-text start-center-row gap-x-1 cursor-pointer no-underline rounded-full hover:bg-p-hover active:bg-s-hover pl-1 pr-2',
      className
    )}
  >
    <div className="h-fit mt-1">{icon}</div>
    <div className="text-left">{alias ? alias : shortFormOfLink(link)}</div>
  </a>
)

const AboutProfile = ({ account }: { account: Account }) => {
  const { websiteLink, twitterLink, instagramLink, githubLink, linkedInLink } =
    getWebsiteLinksFromProfile(account)

  return (
    <div className="sm:my-6 mx-2 sm:mx-0 sm:p-6 p-3 rounded-xl shadow-sm bg-p-hover sm:bg-s-bg">
      <div className="text-2xl font-bold mb-4">
        About {formatHandle(account)}
      </div>
      {account?.metadata?.bio && (
        <Markup className="mt-4">{String(account?.metadata?.bio)}</Markup>
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
