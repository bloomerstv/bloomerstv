import type { ChildrenNode } from 'interweave'
import { Matcher } from 'interweave'

export class MDItalicMatcher extends Matcher {
  replaceWith(children: ChildrenNode) {
    return <i>{children}</i>
  }

  asTag(): string {
    return 'i'
  }

  match(value: string) {
    return this.doMatch(value, /\*([^**]*?)\*/, (matches) => ({
      match: matches[1]
    }))
  }
}
