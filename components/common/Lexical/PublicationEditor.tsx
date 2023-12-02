import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import {
  $convertToMarkdownString,
  TEXT_FORMAT_TRANSFORMERS
} from '@lexical/markdown'
import React from 'react'
// import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin'
import LexicalAutoLinkPlugin from './Plugins/LexicalAutoLinkPlugin'
import ImagesPlugin from './Plugins/ImagesPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import NewMentionsPlugin from './Plugins/MentionsPlugin'
import clsx from 'clsx'

/* eslint-disable */

interface Props {
  setContent: (content: string) => void
  onPaste?: (files: File[]) => void
  isComment?: boolean
}
const TRANSFORMERS = [...TEXT_FORMAT_TRANSFORMERS]
const PublicationEditor = ({
  setContent,
  onPaste,
  isComment = false
}: Props) => {
  return (
    <div className="relative">
      {/* todo toolbar for rich text editor */}
      {/* <ToolbarPlugin /> */}
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className={clsx(
              'blocktext-p-text overflow-auto  outline-none bg-s-bg',
              isComment
                ? 'min-h-[20px] max-h-[200px] sm:max-h-[250px]'
                : ' min-h-[70px] max-h-[300px] sm:max-h-[350px]  px-4 py-2 border border-s-border rounded-xl m-4'
            )}
          />
        }
        placeholder={
          <div
            className={clsx(
              'text-gray-400 absolute pointer-events-none whitespace-nowrap',
              isComment ? 'left-0 top-0 sm:left-0' : 'px-4 top-2 left-4 '
            )}
          >
            {isComment ? (
              'Say it....'
            ) : (
              <>
                <div>What's this about...? ( optional )</div>
                <div className="text-xs">
                  Tip: type @ and profile handle to tag them{' '}
                </div>
              </>
            )}
          </div>
        }
        ErrorBoundary={() => <div>Something went wrong !</div>}
      />
      <OnChangePlugin
        onChange={(editorState) => {
          editorState.read(() => {
            const markdown = $convertToMarkdownString(TRANSFORMERS)
            setContent(markdown)
          })
        }}
      />
      <NewMentionsPlugin />
      {/* <HistoryPlugin /> */}
      <HashtagPlugin />
      <LexicalAutoLinkPlugin />
      <ImagesPlugin onPaste={onPaste} />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
    </div>
  )
}

export default PublicationEditor
