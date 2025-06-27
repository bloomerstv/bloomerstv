import { useEffect } from 'react'
import {
  StreamReplayPostsQuery,
  useStreamReplayPostsQuery
} from '../../graphql/generated'
import { AnyPost, useAccountsBulk, usePosts } from '@lens-protocol/react'
import useSession from './useSession'
import { useStreamersWithAccounts } from '../../components/store/useStreamersWithAccounts'
import { usePostsStore } from '../../components/store/usePosts'
import { getUniqueStringsIgnoreCase } from '../getUniqueElements'

export const useStreamReplayPosts = (): {
  streamReplayPosts?: StreamReplayPostsQuery
  posts?: AnyPost[]
  loading: boolean
} => {
  const { authenticatedUser } = useSession()
  const setAccountsFromPublicReplays = useStreamersWithAccounts(
    (state) => state.setAccountsFromPublicReplays
  )
  const { setPosts, setStreamReplayPosts } = usePostsStore((state) => ({
    setPosts: state.setPosts,
    setStreamReplayPosts: state.setStreamReplayPosts
  }))

  const { data, loading: streamReplayLoading } = useStreamReplayPostsQuery()

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
  }, [posts, authenticatedUser, accountsWithoutPosts])

  // Effect for setting stream replay posts in the store
  useEffect(() => {
    if (data) {
      setStreamReplayPosts(data ?? null)
    }
  }, [data])

  // Effect for setting posts in the store
  useEffect(() => {
    if (posts && posts?.items.length > 0) {
      setPosts(posts?.items as AnyPost[])
    }
  }, [posts, setPosts])

  return {
    streamReplayPosts: data,
    posts: posts?.items as AnyPost[],
    loading: streamReplayLoading || loading
  }
}

export const useStreamReplayPostsOfAccount = ({
  accountAddress,
  skip = 0
}: {
  accountAddress: string
  skip?: number
}): {
  streamReplayPosts?: StreamReplayPostsQuery
  posts?: AnyPost[]
  loading: boolean
} => {
  const { data, loading: streamReplayLoading } = useStreamReplayPostsQuery({
    variables: {
      skip: skip,
      accountAddress
    }
  })

  const { data: posts, loading } = usePosts({
    filter: {
      posts:
        data?.streamReplayPosts?.streamReplayPosts
          ?.map((p) => p?.postId)
          .filter((p) => p) || []
    }
  })

  return {
    streamReplayPosts: data,
    posts: posts?.items as AnyPost[],
    loading: streamReplayLoading || loading
  }
}
