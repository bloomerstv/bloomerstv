import {
  CommentRankingFilterType,
  // CustomFiltersType,
  PublicationId,
  usePublications
} from '@lens-protocol/react-web'
import { CircularProgress } from '@mui/material'
import React from 'react'

// import { WebSocket } from 'ws'
// import { createClient } from 'graphql-ws'
// import { wsLensGraphEndpoint } from '../../../../utils/config'
import formatHandle from '../../../../utils/lib/formatHandle'
import getPublicationData from '../../../../utils/lib/getPublicationData'
import { timeAgo } from '../../../../utils/helpers'

const LiveChat = ({
  publicationId,
  title = 'Live Chat'
}: {
  publicationId: string
  title?: string
}) => {
  const { data } = usePublications({
    where: {
      commentOn: {
        id: publicationId as PublicationId,
        ranking: {
          filter: CommentRankingFilterType.All
        }
      }
    }
  })

  // const subscribeToNewComments = async () => {
  //     const client = createClient({
  //       url: wsLensGraphEndpoint,
  //       webSocketImpl: WebSocket
  //     })

  //     client.subscribe({
  //       query:
  //     })
  // }

  if (!publicationId) {
    return (
      <div className="h-full w-full bg-s-bg centered-col">
        <CircularProgress color="secondary" />
        <div className="">Chat not available right now</div>
      </div>
    )
  }

  return (
    <div className="h-full w-full bg-s-bg">
      <div className="px-4 py-3 font-semibold border-b borde-s-text">
        {title}
      </div>
      <div className="flex-grow overflow-auto p-2">
        <div>LiveChat: {publicationId}</div>
        <div>
          {data?.map((comment) => {
            if (comment?.__typename !== 'Comment') {
              return null
            }
            return (
              <div key={comment?.id}>
                {`${timeAgo(Number(comment?.createdAt))} ${formatHandle(
                  comment?.by
                )} : ${getPublicationData(comment?.metadata)?.content}`}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default LiveChat
