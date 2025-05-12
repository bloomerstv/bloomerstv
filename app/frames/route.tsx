/* eslint-disable react/jsx-key */
import { Button } from 'frames.js/next'
import { frames } from './frames'
import { humanReadableNumber } from '../../utils/helpers'
import getAvatar from '../../utils/lib/getAvatar'
import { mainnet, PublicClient } from '@lens-protocol/client'
import { fetchAccount, fetchAccountStats } from '@lens-protocol/client/actions'

const handleRequest = frames(async (ctx) => {
  const url = ctx.url
  const handle = decodeURIComponent(url.searchParams.get('handle') || '')
  const thumbnail = decodeURIComponent(url.searchParams.get('thumbnail') || '')

  const lensClient = PublicClient.create({
    environment: mainnet,
    origin: 'https://bloomers.tv'
  })

  const result = await fetchAccount(lensClient, {
    username: {
      localName: handle.split('/')[1]
    }
  })

  if (result.isErr()) {
    return {
      image: (
        <div tw="flex w-full h-full items-center justify-center bg-red-500">
          <span tw="text-white text-4xl">Account not found</span>
        </div>
      ),
      imageOptions: {
        width: 1200,
        height: 630
      }
    }
  }

  const account = result.value

  const accountStatsResult = await fetchAccountStats(lensClient, {
    account: account?.address
  })

  const finalThumbnail = thumbnail
    ? thumbnail
    : (account?.metadata?.coverPicture ?? 'https://bloomers.tv/banner.png')

  const followersCount = accountStatsResult?.isOk()
    ? (accountStatsResult?.value?.graphFollowStats?.followers ?? 0)
    : 0

  const commonQueryParams = new URLSearchParams({
    handle: encodeURIComponent(handle),
    followers: encodeURIComponent(followersCount),
    thumbnail: encodeURIComponent(finalThumbnail),
    accountAddress: encodeURIComponent(account?.address!)
  }).toString()

  return {
    image: (
      <div tw="flex relative flex-col w-full h-full items-center justify-center">
        <img
          src={finalThumbnail}
          style={{
            zIndex: -20
          }}
          tw="h-full w-full absolute object-cover"
        />

        <img
          src={getAvatar(account)}
          width={150}
          height={150}
          style={{
            zIndex: 20
          }}
          tw="rounded-full object-cover absolute top-6 left-6"
        />

        {/* name */}
        <span
          style={{
            zIndex: 20
          }}
          tw="bg-[#1976d2] text-5xl px-4 pt-1 pb-2 rounded-2xl absolute  top-6 left-50  text-white"
        >
          {`bloomers.tv/${handle?.split('/')[1]}`}
        </span>

        {/* follower count */}
        <div
          style={{
            zIndex: 20
          }}
          tw="flex flex-row items-center gap-x-2 bg-white rounded-xl px-3 py-1 text-3xl  absolute  top-26  left-50"
        >
          <svg
            fill="#000000"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z" />
          </svg>
          <span
            style={{
              paddingLeft: 5
            }}
          >
            {` ${humanReadableNumber(followersCount)}`}
          </span>
        </div>
      </div>
    ),
    imageOptions: {
      dynamic: true,
      headers: {
        'Cache-Control': 'max-age=300'
      }
    },
    buttons: [
      <Button
        action="link"
        target={`https://bloomers.tv/${handle?.split('/')[1]}`}
      >
        🔵 Watch Live
      </Button>,
      <Button action="post" target={`/stats?${commonQueryParams}`}>
        📊 Stats
      </Button>,
      <Button action="post" target={`/status?${commonQueryParams}`}>
        📅 Status
      </Button>,
      <Button action="post" target={`/more?${commonQueryParams}`}>
        ➕ More
      </Button>
    ]
  }
})

export const GET = handleRequest
export const POST = handleRequest
