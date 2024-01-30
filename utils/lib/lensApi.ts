import { APP_ID, lensUrl } from '../config'

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
