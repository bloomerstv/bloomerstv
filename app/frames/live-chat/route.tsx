/* eslint-disable react/jsx-key */
import { Button } from 'frames.js/next'
import { frames } from '../frames'
import { NODE_GRAPHQL_URL } from '../../../utils/config'
import { stringToLength } from '../../../utils/stringToLength'

type frameChat = {
  id: string
  handle: string
  formattedAmount: string | null
  currencySymbol: string | null
  content: string
}

export const POST = frames(async (ctx) => {
  const url = ctx.url
  const handle = decodeURIComponent(url.searchParams.get('handle') || '')
  const profileId = decodeURIComponent(url.searchParams.get('profileId') || '')
  let chats: frameChat[] = []

  try {
    const { data } = await fetch(NODE_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        query: `
        query StreamChats {
  streamChats(profileId: "${profileId}", limit: 4) {
    content
    currencySymbol
    formattedAmount
    id
    handle
  }
}
        `
      })
    }).then((res) => res.json())

    console.log('data', data)

    chats = data?.streamChats || []
  } catch (error) {
    console.error('error', error)
  }

  const params = new URLSearchParams(url.search)
  const commonQueryParams = params.toString()

  return {
    image: (
      <div tw="w-full h-full pt-12 px-6 pb-6 bg-[#1976d2] relative flex items-center justify-center">
        <span tw="text-white text-3xl absolute top-1 left-8">{`/${handle?.split('/')[1]}/more/live-chat`}</span>

        <div tw="bg-white relative rounded-3xl text-black w-full h-full items-center justify-center flex">
          {/* route */}
          <div tw="flex flex-col items-start justify-center pt-8">
            {chats ? (
              chats.map((chat) => (
                <div
                  key={chat?.id}
                  tw="flex flex-col items-start justify-center mb-8"
                >
                  <div tw="text-5xl font-bold text-black">
                    {`${chat?.handle} ${chat?.formattedAmount ? `tipped ${parseFloat(chat?.formattedAmount)} ${chat?.currencySymbol}` : ''}`}
                  </div>
                  <div tw="text-3xl text-gray-500">
                    {stringToLength(chat?.content, 60)}
                  </div>
                </div>
              ))
            ) : (
              <div>No chats yet</div>
            )}
          </div>
        </div>
      </div>
    ),
    buttons: [
      <Button action="post" target={`/more?${commonQueryParams}`}>
        ⬅️ Back
      </Button>,
      <Button action="post" target={`/live-chat?${commonQueryParams}`}>
        🔃 Refresh
      </Button>,
      <Button action="post" target={`/?${commonQueryParams}`}>
        🏠 Home
      </Button>
    ]
  }
})
