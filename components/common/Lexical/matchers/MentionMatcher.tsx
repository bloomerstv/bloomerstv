import { Matcher } from 'interweave'
import Link from 'next/link'
import { createElement } from 'react'

// import { UrlMatcher } from './UrlMatcher'

export const Mention = ({ ...props }: any) => {
  const profile = {
    __typename: 'Profile',
    handle: props?.display.slice(6),
    name: null,
    id: null
  }

  return (
    <span
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <Link prefetch href={`/${profile?.handle}`} className="no-underline">
        <span className="hover:underline text-blue-400 cursor-pointer">
          {profile?.handle && `${profile?.handle}`}
        </span>
      </Link>
    </span>
  )
}

export class MentionMatcher extends Matcher {
  replaceWith(match: string, props: any) {
    return createElement(Mention, props, match)
  }

  asTag(): string {
    return 'a'
  }

  match(value: string) {
    // const urlMatcher = new UrlMatcher('url')
    // const urlResponse = urlMatcher.match(value)
    // if (urlResponse) {
    //   const { host } = urlResponse
    //   const tld = host.slice(host.lastIndexOf('.') + 1).toLowerCase()
    //   const ALLOWED_MENTIONS = ['lens', 'test']
    //   if (!ALLOWED_MENTIONS.includes(tld)) {
    //     return null
    //   }
    // }

    const matcher = /@lens\/[^.\s]*/

    return this.doMatch(value, matcher, (matches) => {
      return { display: matches[0] }
    })
  }
}
