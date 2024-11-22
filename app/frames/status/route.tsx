/* eslint-disable react/jsx-key */
import { Button } from 'frames.js/next'
import { frames } from '../frames'
import { NODE_GRAPHQL_URL } from '../../../utils/config'
import { timeAgoShort, timeToGo } from '../../../utils/helpers'

export const POST = frames(async (ctx) => {
  const url = ctx.url
  const profileId = decodeURIComponent(url.searchParams.get('profileId') || '')
  const handle = decodeURIComponent(url.searchParams.get('handle') || '')

  let streamTimings: {
    nextStreamTime?: number
    lastSeen?: number
    isActive: Boolean
    latestSessionCreatedAt: number
  } | null = null

  try {
    const { data } = await fetch(NODE_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        query: `
        query Streamer {
  streamer(profileId: "${profileId}") {
    nextStreamTime
    lastSeen
    isActive
    latestSessionCreatedAt
  }
}
        `
      })
    }).then((res) => res.json())

    streamTimings = data?.streamer ?? null
  } catch (error) {
    console.error('error', error)
  }

  console.log('nextStreamTiem', streamTimings?.nextStreamTime)

  console.log(
    'timeToGo(streamTimings?.nextStreamTime!)',
    timeToGo(streamTimings?.nextStreamTime!)
  )

  const params = new URLSearchParams(url.search)
  const commonQueryParams = params.toString()

  return {
    image: (
      <div tw="w-full h-full pt-12 px-6 pb-6 bg-[#1976d2] relative flex items-center justify-center">
        <span tw="text-white text-3xl absolute top-1 left-8">{`/${handle?.split('/')[1]}/status`}</span>

        <div tw="bg-white relative rounded-3xl text-black w-full h-full items-center justify-center flex">
          <div tw="flex flex-col items-start justify-center">
            {streamTimings?.isActive && (
              <div tw="flex flex-col items-start justify-center mb-8">
                <div tw="text-6xl font-bold text-black">
                  {`${handle?.split('')[1]} is live rn`}
                </div>
                <div tw="text-4xl text-gray-500">
                  Go back & click on Watch Live !
                </div>
              </div>
            )}

            {streamTimings?.isActive &&
              new Date(streamTimings?.latestSessionCreatedAt) < new Date() && (
                <div tw="flex flex-col items-start justify-center mb-8">
                  <div tw="text-6xl font-bold text-black">
                    {`${timeAgoShort(streamTimings?.latestSessionCreatedAt)} ago`}
                  </div>
                  <div tw="text-4xl text-gray-500">Started Streaming</div>
                </div>
              )}

            {!streamTimings?.isActive && streamTimings?.lastSeen && (
              <div tw="flex flex-col items-start justify-center mb-8">
                <div tw="text-6xl font-bold text-black">
                  {`${timeAgoShort(streamTimings?.lastSeen!)} ago`}
                </div>
                <div tw="text-4xl text-gray-500">Last streamed</div>
              </div>
            )}

            {streamTimings?.nextStreamTime &&
            new Date(streamTimings?.nextStreamTime!) > new Date() ? (
              <div tw="flex flex-col items-start justify-center mb-8">
                <div tw="text-6xl font-bold text-black">
                  {`${timeToGo(streamTimings?.nextStreamTime!)} to go`}
                </div>
                <div tw="text-4xl text-gray-500">For the next stream</div>
              </div>
            ) : (
              <div tw="flex flex-col items-start justify-center mb-8">
                <div tw="text-6xl font-bold text-black">
                  No streams scheduled
                </div>
                <div tw="text-4xl text-gray-500">
                  Turn on notifications for updates
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    buttons: [
      <Button action="post" target={`/?${commonQueryParams}`}>
        ⬅️ Back
      </Button>,
      <Button action="post" target={`/status?${commonQueryParams}`}>
        🔃 Refresh
      </Button>
    ]
  }
})
