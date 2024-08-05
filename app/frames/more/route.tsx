/* eslint-disable react/jsx-key */
import { Button } from 'frames.js/next'
import { frames } from '../frames'
import { NODE_GRAPHQL_URL } from '../../../utils/config'

export const POST = frames(async (ctx) => {
  const url = ctx.url
  const handle = decodeURIComponent(url.searchParams.get('handle') || '')
  const profileId = decodeURIComponent(url.searchParams.get('profileId') || '')

  let isNotificationOn: boolean = true

  const isLens = ctx?.clientProtocol?.id && ctx?.clientProtocol?.id === 'lens'

  if (
    isLens &&
    profileId &&
    profileId !== 'undefined' &&
    profileId !== ctx?.message?.profileId
  ) {
    const requestData = await ctx?.request?.json()
    const identityToken = requestData?.untrustedData?.identityToken

    try {
      const { data } = await fetch(NODE_GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: identityToken
        },
        body: JSON.stringify({
          query: `
        query Query {
  isSubcribedNotificationForStreamer(profileId: "${profileId}")
}
        `
        })
      }).then((res) => res.json())

      isNotificationOn = !!data?.isSubcribedNotificationForStreamer
    } catch (error) {
      console.error('error', error)
    }
  }

  const params = new URLSearchParams(url.search)
  const commonQueryParams = params.toString()

  return {
    image: (
      <div tw="w-full h-full pt-12 px-6 pb-6 bg-[#1976d2] relative flex items-center justify-center">
        <span tw="text-white text-3xl absolute top-1 left-8">{`/${handle?.split('/')[1]}/more`}</span>
        <div tw="bg-white relative rounded-3xl text-black w-full h-full items-center justify-center flex">
          {/* route */}
          <span>Choose one of the below options</span>
        </div>
      </div>
    ),
    buttons:
      isLens && !isNotificationOn
        ? [
            <Button action="post" target={`/?${commonQueryParams}`}>
              ⬅️ Back
            </Button>,
            <Button action="post" target={`/live-chat?${commonQueryParams}`}>
              💬 Live Chat
            </Button>,
            <Button action="post" target={`/notification?${commonQueryParams}`}>
              🔔 Enable Notifications
            </Button>
          ]
        : [
            <Button action="post" target={`/?${commonQueryParams}`}>
              ⬅️ Back
            </Button>,
            <Button action="post" target={`/live-chat?${commonQueryParams}`}>
              💬 Live Chat
            </Button>
          ]
  }
})
