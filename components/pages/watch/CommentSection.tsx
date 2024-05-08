import {
  AnyPublication,
  Comment,
  CommentRankingFilterType,
  Profile,
  usePublications
} from '@lens-protocol/react-web'
import React, { useState } from 'react'
import CommentRow from './CommentRow'
import CreateCommentRow from './CreateCommentRow'
import clsx from 'clsx'

export interface NewComment {
  by: Profile
  metadata: {
    content: string
  }
}

const CommentSection = ({
  publication,
  className,
  level = 0
}: {
  publication: AnyPublication
  className?: string
  level?: number
}) => {
  const [newCommments, setNewComments] = useState<NewComment[]>([])
  const { data } = usePublications({
    where: {
      commentOn: {
        // @ts-ignore
        id: publication?.id,
        ranking: {
          filter: CommentRankingFilterType.Relevant
        }
      }
    }
  })

  return (
    <div className={clsx('h-full w-full', className)}>
      <CreateCommentRow
        commentOn={publication?.id}
        onCommentCreated={(comment) => {
          setNewComments([comment, ...newCommments])
        }}
        className={clsx(level === 0 && 'pl-0')}
      />

      {newCommments?.map((comment, index) => {
        return (
          <CommentRow
            className={clsx(level === 0 && 'pl-0')}
            comment={comment as Comment}
            key={index}
            level={level}
          />
        )
      })}
      {data?.map((comment) => {
        return (
          <CommentRow
            comment={comment as Comment}
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
