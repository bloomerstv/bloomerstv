import { useEffect } from 'react'
import {
  StreamReplayPostsQuery,
  useStreamReplayPostsQuery
} from '../../graphql/generated'
import { AnyPost, useAccountsBulk, usePosts } from '@lens-protocol/react'
import useSession from './useSession'
import { useStreamersWithAccounts } from '../../components/store/useStreamersWithAccounts'
import { usePostsStore } from '../../components/store/usePosts'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import { getUniqueStringsIgnoreCase } from '../getUniqueElements'

export const useStreamReplayPosts = ({
  accountAddress,
  skip = 0
}: {
  accountAddress?: string
  skip?: number
}): {
  streamReplayPosts?: StreamReplayPostsQuery
  posts?: AnyPost[]
  loading: boolean
} => {
  const { isAuthenticated, authenticatedUser } = useSession()
  const setAccountsFromPublicReplays = useStreamersWithAccounts(
    (state) => state.setAccountsFromPublicReplays
  )
  const { setPosts, setStreamReplayPosts } = usePostsStore((state) => ({
    setPosts: state.setPosts,
    setStreamReplayPosts: state.setStreamReplayPosts
  }))

  const { data, loading: streamReplayLoading } = useStreamReplayPostsQuery({
    variables: {
      skip: skip,
      accountAddress
    }
  })

  const { data: accountsWithoutPosts } = useAccountsBulk({
    addresses: getUniqueStringsIgnoreCase(
      data?.streamReplayPosts?.streamReplayPosts
        ?.map((p) => {
          if (!p?.postId && p?.accountAddress) {
            return p?.accountAddress
          }
          return undefined
        })
        .filter(
          (accountAddress): accountAddress is string =>
            accountAddress !== undefined
        )
    )
  })
  const { data: posts, loading } = usePosts({
    filter: {
      posts: data?.streamReplayPosts?.streamReplayPosts
        ?.map((p) => p?.postId)
        .filter((p) => p)
    }
  })

  // Effect for processing accounts and setting accounts from public replays
  useEffect(() => {
    if (accountAddress) return

    // get unique accountAddresses from posts
    const uniqueAccounts = Array.from(
      new Set(posts?.items?.map((p) => p?.author))
    ).filter((account) => {
      return (
        account?.address !== authenticatedUser?.address &&
        !accountsWithoutPosts?.map((p) => p?.address).includes(account?.address)
      )
    })

    setAccountsFromPublicReplays([
      ...uniqueAccounts,
      ...(accountsWithoutPosts ?? [])
    ])
  }, [posts, accountAddress, authenticatedUser, accountsWithoutPosts])

  // Effect for setting stream replay posts in the store
  useEffect(() => {
    if (data) {
      setStreamReplayPosts(data ?? null)
    }
  }, [data, accountAddress])

  // Effect for setting posts in the store
  useEffect(() => {
    if (posts && posts?.items.length > 0 && !accountAddress) {
      setPosts(posts?.items as AnyPost[])
    }
  }, [posts, accountAddress, setPosts])

  return {
    streamReplayPosts: data,
    posts: posts?.items as AnyPost[],
    loading: streamReplayLoading || loading
  }
}
