/* eslint-disable react/jsx-key */
import { Button } from 'frames.js/next'
import { frames } from '../frames'
import {
  formatDate,
  numberWithCommas,
  timeAgoShort
} from '../../../utils/helpers'
import { NODE_GRAPHQL_URL } from '../../../utils/config'

export const POST = frames(async (ctx) => {
  const url = ctx.url
  const handle = decodeURIComponent(url.searchParams.get('handle') || '')
  const followers = decodeURIComponent(url.searchParams.get('followers') || '')
  const profileId = decodeURIComponent(url.searchParams.get('profileId') || '')

  let stats: {
    totalStreams: number
    startedStreaming: string
  } | null = {
    totalStreams: 0,
    startedStreaming: ''
  }

  try {
    const { data } = await fetch(NODE_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json' // replace with your operation name
      },
      body: JSON.stringify({
        query: `
       query StreamerStats {
          streamerStats(profileId: "${profileId}") {
            totalStreams
            startedStreaming
          }
        }
        `
      })
    }).then((res) => res.json())

    stats = data?.streamerStats ?? null
  } catch (error) {
    console.error('error', error)
  }

  const params = new URLSearchParams(url.search)
  const commonQueryParams = params.toString()

  return {
    image: (
      <div tw="w-full h-full pt-12 px-6 pb-6 bg-[#1976d2] relative flex items-center justify-center">
        {/* route */}
        <span tw="text-white text-3xl absolute top-1 left-8">{`/${handle?.split('/')[1]}/stats`}</span>
        <div tw="bg-white relative rounded-3xl text-black w-full h-full items-center justify-center flex">
          <div tw="flex flex-col items-start justify-center">
            <div tw="flex flex-col items-start justify-center mb-8">
              <div tw="text-6xl font-bold text-black">
                {numberWithCommas(Number(followers))}
              </div>
              <div tw="text-4xl text-gray-500">Followers</div>
            </div>

            <div tw="flex flex-col items-start justify-center mb-8">
              <div tw="text-6xl font-bold text-black">
                {`${numberWithCommas(stats?.totalStreams)}+`}
              </div>
              <div tw="text-4xl text-gray-500">Total streams</div>
            </div>

            <div tw="flex flex-col items-start justify-center">
              <div tw="text-6xl font-bold text-black flex flex-row items-end justify-start">
                <div>
                  {stats?.startedStreaming
                    ? formatDate(stats?.startedStreaming)
                    : 'N/A'}
                </div>
                <div tw="text-4xl text-gray-400 ml-4">
                  {stats?.startedStreaming
                    ? timeAgoShort(stats?.startedStreaming)
                    : ''}
                </div>
              </div>
              <div tw="text-4xl text-gray-500">Stated Streaming Since</div>
            </div>
          </div>
        </div>
      </div>
    ),
    buttons: [
      <Button action="post" target={`/?${commonQueryParams}`}>
        ⬅️ Back
      </Button>,
      <Button action="post" target={`/stats?${commonQueryParams}`}>
        🔃 Refresh
      </Button>
    ]
  }
})
