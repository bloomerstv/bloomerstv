import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import type { QueryMatch } from '@lexical/react/LexicalTypeaheadMenuPlugin'
import {
  LexicalTypeaheadMenuPlugin,
  TypeaheadOption
  // useBasicTypeaheadTriggerMatch
} from '@lexical/react/LexicalTypeaheadMenuPlugin'
import type { TextNode } from 'lexical'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import * as ReactDOM from 'react-dom'
import {
  LimitType,
  Profile,
  useSearchProfilesQuery
} from '../../../graphql/generated'
import ImageWithPulsingLoader from '../../Common/UI/ImageWithPulsingLoader'
import formatHandle from '../../User/lib/formatHandle'
import getIPFSLink from '../../User/lib/getIPFSLink'

import { useDevice } from '../../Common/DeviceWrapper'
import { $createMentionNode } from '../Nodes/MentionsNode'
import getAvatar from '../../User/lib/getAvatar'

const PUNCTUATION =
  '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;'
const NAME = '\\b[A-Z][^\\s' + PUNCTUATION + ']'

const DocumentMentionsRegex = {
  NAME,
  PUNCTUATION
}

const PUNC = DocumentMentionsRegex.PUNCTUATION
const TRIGGERS = ['@'].join('')
const VALID_CHARS = '[^' + TRIGGERS + PUNC + '\\s]'
const VALID_JOINS = '(?:' + '\\.[ |$]|' + ' |' + '[' + PUNC + ']|' + ')'
const LENGTH_LIMIT = 75
const ALIAS_LENGTH_LIMIT = 50
const SUGGESTION_LIST_LENGTH_LIMIT = 5

const AtSignMentionsRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    VALID_JOINS +
    '){0,' +
    LENGTH_LIMIT +
    '})' +
    ')$'
)

const AtSignMentionsRegexAliasRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    '){0,' +
    ALIAS_LENGTH_LIMIT +
    '})' +
    ')$'
)

const checkForAtSignMentions = (
  text: string,
  minMatchLength: number
): QueryMatch | null => {
  let match = AtSignMentionsRegex.exec(text)

  if (match === null) {
    match = AtSignMentionsRegexAliasRegex.exec(text)
  }

  if (match !== null) {
    const maybeLeadingWhitespace = match[1]
    const matchingString = match[3]
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2]
      }
    }
  }

  return null
}

const getPossibleQueryMatch = (text: string): QueryMatch | null => {
  const match = checkForAtSignMentions(text, 1)
  return match
}

class MentionTypeaheadOption extends TypeaheadOption {
  name: string
  picture: string
  handle: string

  constructor(name: string, picture: string, handle: string) {
    super(name)
    this.name = name
    this.handle = handle
    this.picture = picture
  }
}

interface Props {
  index: number
  isSelected: boolean
  onClick: () => void
  onMouseEnter: () => void
  option: MentionTypeaheadOption
}

const MentionsTypeaheadMenuItem: FC<Props> = ({
  isSelected,
  onClick,
  onMouseEnter,
  option
}) => {
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className="cursor-pointer"
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <div className="text-p-text hover:bg-s-hover bg-s-bg flex items-center space-x-2 m-1.5 px-3 py-1 rounded-xl">
        <ImageWithPulsingLoader
          className="rounded-full w-7 h-7"
          src={option.picture}
          alt={option.handle}
        />
        <div className="flex flex-col truncate">
          <div className="text-sm truncate">{option.name}</div>
          <span className="text-xs">{option.handle}</span>
        </div>
      </div>
    </li>
  )
}

const NewMentionsPlugin: FC = () => {
  const [queryString, setQueryString] = useState<string | null>(null)
  const [results, setResults] = useState<Array<Record<string, string>>>([])
  const [editor] = useLexicalComposerContext()
  const { isMobile } = useDevice()

  const { data } = useSearchProfilesQuery(
    {
      request: {
        query: queryString ?? null,
        limit: LimitType.Ten
      }
    },
    {
      enabled: !!queryString && queryString.length > 0
    }
  )

  useEffect(() => {
    if (data) {
      const search = data?.searchProfiles
      const profileSearchResult = search
      const profiles =
        search && search.hasOwnProperty('items')
          ? profileSearchResult?.items
          : []
      const profilesResults = profiles.map(
        (user: Profile) =>
          ({
            name: user?.metadata?.displayName,
            handle: formatHandle(user?.handle),
            picture: getAvatar(user)
          } as Record<string, string>)
      )
      setResults(profilesResults)
    }
  }, [data])

  // const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
  //   minLength: 0
  // })

  const options = useMemo(
    () =>
      results
        .map(({ name, picture, handle }) => {
          return new MentionTypeaheadOption(
            name ?? handle,
            getIPFSLink(picture),
            handle
          )
        })
        .slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
    [results]
  )

  const onSelectOption = useCallback(
    (
      selectedOption: MentionTypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const mentionNode = $createMentionNode(selectedOption.handle)
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode)
        }
        mentionNode.select().insertText(' ')
        closeMenu()
      })
    },
    [editor]
  )

  const checkForMentionMatch = useCallback(
    (text: string) => {
      const mentionMatch = getPossibleQueryMatch(text)
      // const slashMatch = checkForSlashTriggerMatch(text, editor)
      // return !slashMatch && mentionMatch ? mentionMatch : null
      return mentionMatch ? mentionMatch : null
    },
    [editor]
  )

  return (
    <LexicalTypeaheadMenuPlugin<MentionTypeaheadOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) =>
        anchorElementRef.current && results.length
          ? ReactDOM.createPortal(
              <div>
                {isMobile ? (
                  <div
                    className={`fixed mt-8 mx-2 rounded-xl border border-s-border left-0 right-0 shadow-sm text-p-text bg-s-bg`}
                    style={{ zIndex: 80 }}
                  >
                    <ul className="">
                      {options.map((option, i: number) => (
                        <MentionsTypeaheadMenuItem
                          index={i}
                          isSelected={selectedIndex === i}
                          onClick={() => {
                            setHighlightedIndex(i)
                            selectOptionAndCleanUp(option)
                          }}
                          onMouseEnter={() => {
                            setHighlightedIndex(i)
                          }}
                          key={option.key}
                          option={option}
                        />
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div
                    className=" border-s-border mt-8 border rounded-xl shadow-sm w-52 sticky text-p-text bg-s-bg min-w-full"
                    style={{ zIndex: 70 }}
                  >
                    <ul className="">
                      {options.map((option, i: number) => (
                        <MentionsTypeaheadMenuItem
                          index={i}
                          isSelected={selectedIndex === i}
                          onClick={() => {
                            setHighlightedIndex(i)
                            selectOptionAndCleanUp(option)
                          }}
                          onMouseEnter={() => {
                            setHighlightedIndex(i)
                          }}
                          key={option.key}
                          option={option}
                        />
                      ))}
                    </ul>
                  </div>
                )}
              </div>,
              anchorElementRef.current
            )
          : null
      }
    />
  )
}

export default NewMentionsPlugin
