import { openframes } from 'frames.js/middleware'
import { createFrames } from 'frames.js/next'
import { getLensFrameMessage, isLensFrameActionPayload } from 'frames.js/lens'
// import { getXmtpFrameMessage, isXmtpFrameActionPayload } from 'frames.js/xmtp'

export const frames = createFrames({
  // basePath must point to the route of initial frame
  // in this case it will reside in app/frames/route.tsx therefore /frames
  basePath: '/frames',
  middleware: [
    openframes({
      clientProtocol: {
        id: 'lens',
        version: '1.0.0'
      },
      handler: {
        isValidPayload: (body) => isLensFrameActionPayload(body),
        getFrameMessage: async (body) => {
          if (!isLensFrameActionPayload(body)) {
            return undefined
          }

          return getLensFrameMessage(body)
        }
      }
    })
    // openframes({
    //   clientProtocol: {
    //     id: 'xmtp',
    //     version: '2024-02-09'
    //   },
    //   handler: {
    //     isValidPayload: (body) => isXmtpFrameActionPayload(body),
    //     getFrameMessage: async (body) => {
    //       if (!isXmtpFrameActionPayload(body)) {
    //         return undefined
    //       }

    //       return getXmtpFrameMessage(body)
    //     }
    //   }
    // })
  ]
})
