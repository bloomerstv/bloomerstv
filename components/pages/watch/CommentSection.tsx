import React, { useState } from 'react'
import CommentRow from './CommentRow'
import CreateCommentRow from './CreateCommentRow'
import clsx from 'clsx'
import {
  Account,
  AnyPost,
  Post,
  PostReferenceType,
  usePostReferences
} from '@lens-protocol/react'

export interface NewComment {
  author: Account
  metadata: {
    content: string
  }
}

const CommentSection = ({
  post,
  className,
  level = 0
}: {
  post: AnyPost
  className?: string
  level?: number
}) => {
  const [newCommments, setNewComments] = useState<NewComment[]>([])

  const { data } = usePostReferences({
    referencedPost: post?.id,
    referenceTypes: [PostReferenceType.CommentOn]
  })

  return (
    <div className={clsx('h-full w-full', className)}>
      <CreateCommentRow
        commentOn={post?.id}
        onCommentCreated={(comment) => {
          setNewComments([comment, ...newCommments])
        }}
        className={clsx(level === 0 && 'pl-0')}
      />

      {newCommments?.map((comment, index) => {
        return (
          <CommentRow
            className={clsx(level === 0 && 'pl-0')}
            comment={comment as Post}
            key={index}
            level={level}
          />
        )
      })}
      {data?.items.map((comment) => {
        return (
          <CommentRow
            comment={comment as Post}
            key={comment?.id}
            level={level}
            className={clsx(level === 0 && 'pl-0')}
          />
        )
      })}
    </div>
  )
}

export default CommentSection
