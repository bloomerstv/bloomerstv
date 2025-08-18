import type { ChildrenNode, MatchResponse, Node } from 'interweave'
import { Matcher } from 'interweave'
import { createElement } from 'react'

import { BLOCKED_TLDS, URL_PATTERN } from './constants'
import { shortFormOfLink } from '../../../../../utils/helpers'

interface UrlProps {
  children: ChildrenNode
  url: string
  host: string
}

const Url = ({ children, url }: UrlProps) => {
  let href = url

  if (!href.match(/^https?:\/\//)) {
    href = `http://${href}`
  }

  return (
    <a
      href={href}
      target="_blank"
      onClick={(event) => event.stopPropagation()}
      className="text-blue-400 hover:underline"
      rel="noopener"
    >
      {/* @ts-ignore */}
      {shortFormOfLink(children)}
    </a>
  )
}

type UrlMatch = Pick<UrlProps, 'url' | 'host'>

export class UrlMatcher extends Matcher<UrlProps> {
  replaceWith(children: ChildrenNode, props: UrlProps): Node {
    return createElement(Url, props, children)
  }

  asTag(): string {
    return 'a'
  }

  match(string: string): MatchResponse<UrlMatch> | null {
    const response = this.doMatch(string, URL_PATTERN, this.handleMatches, true)

    if (response?.valid) {
      const { host } = response
      const tld = host.slice(host.lastIndexOf('.') + 1).toLowerCase()

      if (BLOCKED_TLDS.includes(tld)) {
        response.valid = false
      }
    }

    return response
  }

  handleMatches(matches: string[]): UrlMatch {
    return {
      url: matches[0],
      host: matches[3]
    }
  }
}
