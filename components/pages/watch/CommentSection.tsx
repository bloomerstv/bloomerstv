import {
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
  publicationId,
  className,
  level = 0
}: {
  publicationId: string
  className?: string
  level?: number
}) => {
  const [newCommments, setNewComments] = useState<NewComment[]>([])
  const { data } = usePublications({
    where: {
      commentOn: {
        // @ts-ignore
        id: publicationId,
        ranking: {
          filter: CommentRankingFilterType.Relevant
        }
      }
    }
  })

  return (
    <div className={clsx('h-full w-full', className, level === 0 && 'pr-2.5')}>
      <CreateCommentRow
        commentOn={publicationId}
        onCommentCreated={(comment) => {
          setNewComments([comment, ...newCommments])
        }}
        className={clsx(level === 0 && 'pr-2.5')}
      />

      {newCommments?.map((comment, index) => {
        return (
          <CommentRow comment={comment as Comment} key={index} level={level} />
        )
      })}
      {data?.map((comment) => {
        return (
          <CommentRow
            comment={comment as Comment}
            key={comment?.id}
            addNewCommment={(comment) => {
              setNewComments([comment, ...newCommments])
            }}
            level={level}
          />
        )
      })}
    </div>
  )
}

export default CommentSection
