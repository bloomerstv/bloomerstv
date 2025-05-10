import { MainContentFocus, PostType, SessionClient } from '@lens-protocol/react'
import { APP_ADDRESS, APP_ID, lensUrl } from '../config'
import { fetchPosts } from '@lens-protocol/client/actions'

export const getLastStreamPostId = async (
  accountAddress: string,
  sessionClient: SessionClient
): Promise<string | null> => {
  if (!accountAddress) return null
  // @ts-ignore
  const result = await fetchPosts(sessionClient, {
    pageSize: 1,
    filter: {
      authors: [accountAddress],
      postTypes: [PostType.Root],
      metadata: {
        mainContentFocus: [MainContentFocus.Livestream]
      },
      apps: [APP_ADDRESS]
    }
  })

  if (result.isErr()) {
    console.error('Error fetching posts:', result.error)
    return null
  }

  return result.value.items[0]?.id
}

export const getLastStreamPublicationId = async (
  profileId: string
): Promise<string | null> => {
  if (!profileId) return null

  const data = await fetch(lensUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json' // replace with your operation name
    },
    body: JSON.stringify({
      query: `
      query Publications {
            publications(request: {
                limit: Ten,
                where: {
                    from: ["${profileId}"],
                    publicationTypes: [POST],
                    metadata: {
                        mainContentFocus: [LIVESTREAM],
                        publishedOn: ["${APP_ID}"]
                    }
                }
            }) {
                items {
                    ... on Post {
                        id
                    }
                }
            }
        }
        `
    })
  }).then((res) => res.json())

  return data?.data?.publications?.items?.[0]?.id ?? null
}
