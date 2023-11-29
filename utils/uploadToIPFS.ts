import { S3 } from '@aws-sdk/client-s3'
// import { Upload } from '@aws-sdk/lib-storage'
import axios from 'axios'
import { v4 as uuid } from 'uuid'
import { EVER_ENDPOINT, EVER_REGION, STS_TOKEN_URL } from './config'

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

  return client
}

/**
 *
 * @param data - Data to upload to IPFS
 * @returns attachment array
 */
const uploadToIPFS = async (
  file: File
): Promise<{
  url: string
  type?: string
} | null> => {
  try {
    const client = await getS3Client()
    const params = {
      Bucket: 'diversehq',
      Key: uuid()
    }
    await client.putObject({ ...params, Body: file, ContentType: file.type })
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
