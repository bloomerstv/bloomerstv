import Link from 'next/link'
import React from 'react'
import {
  DISCORD_INVITE_URL,
  DONATE_LINK,
  FEEDBACK_URL,
  GITHUB_URL,
  HEY_URL,
  PRIVACY_POLICY,
  REPORT_URL,
  X_URL
} from '../../utils/config'
import clsx from 'clsx'

const AppLinksRow = ({ className, ...props }: { className?: string }) => {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'start-row flex-wrap gap-y-2 gap-x-3 px-4 text-sm font-semibold'
      )}
    >
      <Link
        href={HEY_URL}
        className="no-underline text-s-text hover:text-p-text"
        target="_blank"
      >
        Hey
      </Link>
      <Link
        href={X_URL}
        className="no-underline text-s-text hover:text-p-text"
        target="_blank"
      >
        X
      </Link>
      <Link
        href={GITHUB_URL}
        className="no-underline text-s-text hover:text-p-text"
        target="_blank"
      >
        Github
      </Link>
      <Link
        href={FEEDBACK_URL}
        className="no-underline text-s-text hover:text-p-text"
        target="_blank"
      >
        Feedback
      </Link>
      <Link
        href={REPORT_URL}
        className="no-underline text-s-text hover:text-p-text"
        target="_blank"
      >
        Report
      </Link>

      <Link
        href={DISCORD_INVITE_URL}
        className="no-underline text-s-text hover:text-p-text"
        target="_blank"
      >
        Discord
      </Link>
      <Link
        href={DONATE_LINK}
        className="no-underline text-s-text hover:text-p-text"
        target="_blank"
      >
        Donate
      </Link>
      <Link
        href={PRIVACY_POLICY}
        className="no-underline text-s-text hover:text-p-text"
        target="_blank"
      >
        Privacy
      </Link>
    </div>
  )
}

export default AppLinksRow
