import { immutable, StorageClient } from '@lens-chain/storage-client'
import { isMainnet } from '../../config'
import { lens, lensTestnet } from 'wagmi/chains'

export const storageClient = StorageClient.create()

export const acl = immutable(isMainnet ? lens.id : lensTestnet.id)
