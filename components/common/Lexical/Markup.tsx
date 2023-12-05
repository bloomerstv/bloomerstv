import { Interweave } from 'interweave'
import type { FC, MouseEvent } from 'react'
// import { MDBoldMatcher } from './matchers/markdown/MDBoldMatcher'
import { MDCodeMatcher } from './matchers/markdown/MDCodeMatcher'
import { MDItalicMatcher } from './matchers/markdown/MDItalicMatcher'
import { MDLinkMatcher } from './matchers/markdown/MDLinkMatcher'
import { MDQuoteMatcher } from './matchers/markdown/MDQuoteMatcher'
import { MDStrikeMatcher } from './matchers/markdown/MDStrikeMatcher'
import { UrlMatcher } from './matchers/UrlMatcher'
import React from 'react'
import trimify from './trimify'
import { MentionMatcher } from './matchers/MentionMatcher'
// import { HashtagMatcher } from './matchers/HashtagMatcher'

interface Props {
  children: string
  style?: React.CSSProperties
  className?: string
  matchOnlyUrl?: boolean
}

const Markup: FC<Props> = ({
  children,
  style,
  className = '',
  matchOnlyUrl
}) => {
  const defaultMatchers = [
    new MDCodeMatcher('mdCode'),
    new MentionMatcher('mention'),
    new MDLinkMatcher('mdLink'),
    new UrlMatcher('url'),
    // new HashtagMatcher('hashtag'),
    // new MDBoldMatcher('mdBold'),
    new MDItalicMatcher('mdItalic'),
    new MDStrikeMatcher('mdStrike'),
    new MDQuoteMatcher('mdQuote')
  ]

  return (
    <Interweave
      className={className}
      style={style}
      content={trimify(children)}
      escapeHtml
      allowList={['b', 'i', 'a', 'br', 'code', 'span']}
      matchers={matchOnlyUrl ? [new UrlMatcher('url')] : defaultMatchers}
      onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
    />
  )
}

export default Markup
