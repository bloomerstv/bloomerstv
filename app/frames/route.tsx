/* eslint-disable react/jsx-key */
import { Button } from 'frames.js/next'
import { frames } from './frames'

const handleRequest = frames(async (ctx) => {
  let iAm: string | undefined

  if (ctx.message) {
    iAm = (await ctx.message.walletAddress()) ?? 'anonymous'
  }

  return {
    image: <span>{iAm ? `I am ${iAm}` : `Click the button`}</span>,
    buttons: [<Button action="post">Who am I?</Button>]
  }
})

export const GET = handleRequest
export const POST = handleRequest
