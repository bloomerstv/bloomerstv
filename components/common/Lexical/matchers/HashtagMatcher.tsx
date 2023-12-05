import { Matcher } from 'interweave'
// import Link from 'next/link'
import { createElement } from 'react'
import Link from 'next/link'

export const Hashtag = ({ ...props }: any) => {
  // todo make own hastag page
  return (
    <span
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      className="inline-flex text-blue-400 items-center space-x-1"
    >
      <Link
        prefetch
        href={`/search?q=${props.display.slice(1)}&type=publication`}
      >
        {props.display}
      </Link>
    </span>
  )
}

export class HashtagMatcher extends Matcher {
  replaceWith(match: string, props: any) {
    return createElement(Hashtag, props, match)
  }

  asTag(): string {
    return 'a'
  }

  match(value: string) {
    return this.doMatch(value, /\B(#\w*[A-Za-z]+\w*\b)(?!;)/, (matches) => {
      return {
        display: matches[0]
      }
    })
  }
}
