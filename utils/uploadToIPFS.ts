import { S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import axios from 'axios'
import { v4 as uuid } from 'uuid'
import { EVER_REGION, STS_TOKEN_URL } from './config'
import { EVER_ENDPOINT } from './contants'

export type IPFSUploadResult = {
  url: string
  type: string
}

const getS3Client = async () => {
  const token = await axios.get(String(STS_TOKEN_URL))
  const client = new S3({
    endpoint: EVER_ENDPOINT,
    credentials: {
      accessKeyId: token.data?.accessKeyId,
      secretAccessKey: token.data?.secretAccessKey,
      sessionToken: token.data?.sessionToken
    },
    region: EVER_REGION,
    maxAttempts: 5
  })

  client.middlewareStack.addRelativeTo(
    (next: (args: any) => Promise<any>) => async (args: any) => {
      const { response } = await next(args)
      if (response.body == null) {
        response.body = new Uint8Array()
      }
      return { response }
    },
    {
      name: 'nullFetchResponseBodyMiddleware',
      override: true,
      relation: 'after',
      toMiddleware: 'deserializerMiddleware'
    }
  )

  return client
}

/**
 *
 * @param data - Data to upload to IPFS
 * @returns attachment array
 */
const uploadToIPFS = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<{
  url: string
  type?: string
} | null> => {
  try {
    const client = await getS3Client()
    const params = {
      Bucket: 'diversehq',
      Key: uuid(),
      Body: file,
      ContentType: file.type
    }

    // use this for uploading without progress
    // await client.putObject({ ...params, Body: file, ContentType: file.type })

    const task = new Upload({ client, params })
    task.on('httpUploadProgress', (e) => {
      const loaded = e.loaded || 0
      const total = e.total || 0
      const progress = (loaded / total) * 100
      onProgress?.(Math.round(progress))
    })
    await task.done()
    const result = await client.headObject(params)
    const metadata = result.Metadata

    return {
      url: `ipfs://${metadata?.['ipfs-hash']}`,
      type: file.type || 'image/jpeg'
    }
  } catch (error) {
    console.log('error', error)
    return {
      url: '',
      type: file.type || 'image/jpeg'
    }
  }
}

export default uploadToIPFS
