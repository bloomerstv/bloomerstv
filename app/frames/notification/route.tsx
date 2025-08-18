/**
 * TEMPORARILY DISABLED: frames.js implementation
 * This file is being preserved for future use when frames.js is ready.
 */

/*
import { Button } from 'frames.js/next'
import { frames } from '../frames'
import { NODE_GRAPHQL_URL } from '../../../utils/config'
import { stringToLength } from '../../../utils/stringToLength'

export const POST = frames(async (ctx) => {
  const url = ctx.url
  const handle = decodeURIComponent(url.searchParams.get('handle') || '')
  const profileId = decodeURIComponent(url.searchParams.get('profileId') || '')
  let errorMsg: string | null = null

  try {
    const requestData = await ctx?.request?.json()

    const identityToken = requestData?.untrustedData?.identityToken

    await fetch(NODE_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: identityToken
      },
      body: JSON.stringify({
        query: `
                mutation AddNotificationSubscriberToStreamer {
  addNotificationSubscriberToStreamer(profileId: "${profileId}")
}
                `
      })
    }).then((res) => res.json())
  } catch (error) {
    errorMsg = stringToLength(String(error), 40)
    console.error('error', error)
  }

  const params = new URLSearchParams(url.search)
  const commonQueryParams = params.toString()

  return {
    image: (
      <div tw="w-full h-full pt-12 px-6 pb-6 bg-[#1976d2] relative flex items-center justify-center">
        <span tw="text-white text-3xl absolute top-1 left-8">{`/${handle?.split('/')[1]}/more`}</span>
        <div tw="bg-white relative rounded-3xl text-black w-full h-full items-center justify-center flex">
          {errorMsg ? (
            <span tw="text-red-500">{errorMsg}</span>
          ) : (
            <div tw="flex flex-col items-start justify-center pl-4">
              <div tw="flex flex-col items-start justify-center mb-8">
                <div tw="text-4xl font-bold text-black mb-4">
                  {`You've successfully subscribed to receive notifications when ${handle} goes
                  live.`}
                </div>
                <div tw="text-3xl text-gray-500 mb-4">
                  You'll get XMTP DM notifications on wallet address linked to
                  this profile.
                </div>
                <div tw="text-3xl text-gray-500 mb-4">
                  You will also recieve browser notifications if you have
                  enabled them on https://bloomers.tv website.
                </div>
                <div tw="text-3xl text-gray-500 mb-4">
                  Recommend to install BloomersTV PWA on your mobile device &
                  enable notifications.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    buttons: [
      <Button action="post" target={`/more?${commonQueryParams}`}>
        ⬅️ Back
      </Button>,
      <Button action="post" target={`/?${commonQueryParams}`}>
        🏠 Home
      </Button>
    ]
  }
})
*/

// Placeholder export handler to keep the file structure intact
export const POST = async () =>
  new Response('Notification frames temporarily disabled')
