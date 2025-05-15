import { immutable, StorageClient } from '@lens-chain/storage-client'
import { isMainnet } from '../../config'
import { chains } from '@lens-chain/sdk/viem'

export const storageClient = StorageClient.create()

export const acl = immutable(isMainnet ? chains.mainnet.id : chains.testnet.id)
