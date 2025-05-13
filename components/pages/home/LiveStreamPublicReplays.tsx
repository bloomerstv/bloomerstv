import React, { useCallback, useEffect, useRef, useState } from 'react'

import HomeVideoCard from '../../common/HomeVideoCard'
import LoadingVideoCard from '../../ui/LoadingVideoCard'
import { Button, IconButton } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import useIsMobile from '../../../utils/hooks/useIsMobile'
import useInnerWidth from '../../../utils/hooks/useInnerWidth'
import {
  StreamReplayPost,
  useIsVerifiedQuery
} from '../../../graphql/generated'
import {
  APP_ADDRESS,
  APP_ID,
  hideAccountAddresses
} from '../../../utils/config'
import { CATEGORIES } from '../../../utils/categories'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import clsx from 'clsx'
import StreamCard from './StreamCard'
import { useStreamersWithAccounts } from '../../store/useStreamersWithAccounts'
import { usePostsStore } from '../../store/usePosts'
import {
  AnyPost,
  MainContentFocus,
  PageSize,
  Post,
  PostId,
  PostType,
  usePosts
} from '@lens-protocol/react'
import { useStreamReplayPosts } from '../../../utils/hooks/useStreamReplayPosts'
const HomePageCards = () => {
  const [showShowMoreButton, setShowShowMoreButton] = useState(true)
  const [showAll, setShowAll] = React.useState(false)
  const { posts, streamReplayPosts } = usePostsStore((state) => ({
    posts: state.posts,
    streamReplayPosts: state.streamReplayPosts
  }))
  const width = useInnerWidth()
  const [selectedCategory, setSelectedCategory] = React.useState(CATEGORIES[0])

  const {
    accounts,
    loading: accountsLoading,
    streamersWithAccounts
  } = useStreamersWithAccounts((state) => {
    return {
      accounts: state.accountsFromPublicReplays,
      loading: state.loading,
      streamersWithAccounts: state.streamersWithAccounts
    }
  })

  const accountsMap = new Map(accounts?.map((a) => [a?.address, a]))

  const isMobile = useIsMobile()

  const postsMap = new Map(posts?.map((p) => [p?.id, p]))

  const filteredPosts =
    streamReplayPosts?.streamReplayPosts?.streamReplayPosts?.filter((p) => {
      const post = p?.postId
        ? // @ts-ignore
          postsMap.get(p?.postId)
        : null

      if (p?.postId && !post) return false

      if (selectedCategory?.tags?.length > 0) {
        return (
          post?.__typename === 'Post' &&
          // @ts-ignore
          post?.metadata?.tags &&
          // @ts-ignore
          post?.metadata?.tags?.some((tag) =>
            selectedCategory?.tags?.includes(tag)
          )
        )
      }

      return true
    })

  // for clips
  const { data, loading } = usePosts({
    filter: {
      postTypes: [PostType.Root],
      apps: [APP_ADDRESS],
      metadata: {
        mainContentFocus: [MainContentFocus.Video],
        tags:
          selectedCategory?.tags?.length > 0
            ? {
                oneOf: [selectedCategory?.tags[0]]
              }
            : undefined
      }
    },
    pageSize: PageSize.Ten
  })

  const filteredPostsClips =
    data?.items?.filter(
      (p) =>
        p.__typename === 'Post' && p.metadata?.__typename === 'VideoMetadata'
    ) || []

  const { data: isVerified } = useIsVerifiedQuery({
    variables: {
      accountAddresses: filteredPostsClips?.map((p) => p.author?.address)
    }
  })

  const verifiedMap = new Map(
    isVerified?.isVerified?.map((v) => [
      v?.accountAddress,
      v?.isVerified ?? false
    ])
  )

  // add type streamClips to data
  const streamClips = React.useMemo(() => {
    return (
      filteredPostsClips?.map((post) => {
        return {
          ...post,
          type: 'streamClips'
        }
      }) ?? []
    )
  }, [filteredPostsClips])

  const streamReplays = React.useMemo(() => {
    return (
      filteredPosts?.map((post) => {
        return {
          ...post,
          timestamp: post?.createdAt,
          type: 'streamReplays'
        }
      }) ?? []
    )
  }, [filteredPosts])

  const combinedData = React.useMemo(() => {
    if (!streamReplays.length && !streamClips.length) {
      return []
    }

    return [...streamReplays, ...streamClips].sort(
      (a, b) =>
        new Date(b?.timestamp || 0).getTime() -
        new Date(a?.timestamp || 0).getTime()
    )
  }, [streamReplays, streamClips])

  const containerRef = useRef<HTMLDivElement>(null)
  const [isOverflowingLeft, setIsOverflowingLeft] = useState(false)
  const [isOverflowingRight, setIsOverflowingRight] = useState(false)

  const checkOverflow = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current

      setIsOverflowingLeft(scrollLeft > 0)
      setIsOverflowingRight(scrollLeft + clientWidth + 3 < scrollWidth)
    }
  }

  useEffect(() => {
    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [])

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -600, behavior: 'smooth' })
      checkOverflow()
    }
  }

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 600, behavior: 'smooth' })
      checkOverflow()
    }
  }

  const lengthToShow = isMobile
    ? 9
    : width < 1536
      ? Math.max(12 - (streamersWithAccounts?.length ?? 0), 0)
      : Math.max(16 - (streamersWithAccounts?.length ?? 0), 0)

  const renderLoadingCards = () => {
    // Create an array of 8 elements and map over it
    return Array(lengthToShow)
      .fill(null)
      .map((_, i) => <LoadingVideoCard key={i} />)
  }

  useEffect(() => {
    if (combinedData?.length <= lengthToShow) {
      setShowShowMoreButton(false)
    } else {
      setShowShowMoreButton(true)
    }
  }, [combinedData?.length])

  return (
    <>
      {/* categories row  */}
      <div className="relative w-full overflow-x-hidden">
        {isOverflowingLeft && !isMobile && (
          <div className="absolute left-0 bg-p-bg z-10 px-1 -mt-0.5">
            <IconButton onClick={scrollLeft} size="medium">
              <ChevronLeftIcon fontSize="medium" />
            </IconButton>
          </div>
        )}
        <div
          className="sm:w-[calc(100vw-300px)] no-scrollbar overflow-y-auto flex flex-row items-center gap-x-3 gap-y-2 mb-4 px-2"
          ref={containerRef}
          style={{
            scrollBehavior: 'smooth'
          }}
          onScroll={checkOverflow}
        >
          {CATEGORIES.map((category) => (
            <button
              key={category?.name}
              onClick={(e) => {
                e.preventDefault() // Ensure this is not preventing navigation
                setSelectedCategory(category)
              }}
              className={clsx(
                'flex-shrink-0 cursor-pointer border-none py-1.5 px-3 sm:py-2 sm:px-4 font-semibold text-sm outline-none shadow-sm transition duration-300 ease-in-out transform rounded-md ',
                selectedCategory?.name === category?.name
                  ? 'bg-p-text text-p-bg'
                  : 'bg-p-bg sm:bg-s-bg text-p-text hover:bg-p-hover'
              )}
            >
              {category?.name === 'None' ? 'All' : category?.name}
            </button>
          ))}
        </div>
        {isOverflowingRight && !isMobile && (
          <div className="absolute top-0 right-0 bg-p-bg z-10 px-1 -mt-0.5">
            <IconButton onClick={scrollRight} size="medium">
              <ChevronRightIcon fontSize="medium" />
            </IconButton>
          </div>
        )}
      </div>

      {/* @ts-ignore */}
      <div className="flex flex-row flex-wrap w-full gap-y-6">
        {/* <ContributeDiv /> */}

        {/* live streams */}
        {selectedCategory?.name === 'None' &&
          streamersWithAccounts?.map((streamer) => {
            if (hideAccountAddresses.includes(streamer.accountAddress)) {
              return null
            }
            return (
              <StreamCard key={streamer?.accountAddress} streamer={streamer} />
            )
          })}

        {/* live streams replay, clips and videos */}

        {!loading &&
          !accountsLoading &&
          combinedData
            ?.slice(0, showAll ? combinedData?.length : lengthToShow)
            ?.map((post) => {
              if (!post) return null

              if (post?.type === 'streamClips' && post?.__typename === 'Post') {
                if (hideAccountAddresses.includes(post?.author?.address)) {
                  return null
                }
                return (
                  <HomeVideoCard
                    premium={verifiedMap.get(post?.author?.address)}
                    key={post?.id}
                    post={post as Post}
                  />
                )
              }

              const streamReplayPost =
                post?.__typename === 'StreamReplayPost'
                  ? postsMap.get(post?.postId as PostId)
                  : null
              if (
                post?.__typename === 'Post' &&
                post?.author?.address &&
                hideAccountAddresses.includes(post?.author?.address)
              ) {
                return null
              }
              return (
                <HomeVideoCard
                  // @ts-ignore
                  cover={post?.thumbnail}
                  // @ts-ignore
                  duration={post?.sourceSegmentsDuration}
                  // @ts-ignore
                  premium={!!post?.premium}
                  // @ts-ignore
                  key={post?.id ?? post?.sessionId}
                  post={streamReplayPost as Post}
                  // @ts-ignore
                  session={
                    streamReplayPost
                      ? undefined
                      : {
                          createdAt: post?.timestamp!,
                          // @ts-ignore
                          sessionId: post?.sessionId!,
                          account: accountsMap.get(
                            // @ts-ignore
                            post?.accountAddress
                          )
                        }
                  }
                />
              )
            })}

        {(loading || accountsLoading) && <>{renderLoadingCards()}</>}

        {!showAll && showShowMoreButton && (
          <div className="w-full centered-row -mt-4">
            <Button
              endIcon={<KeyboardArrowDownIcon />}
              variant="text"
              autoCapitalize=""
              onClick={() => setShowAll(true)}
              sx={{ textTransform: 'none' }}
            >
              Show more
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

const AccountsHomeCard = ({ accountAddress }: { accountAddress: string }) => {
  const [skip, setSkip] = useState(0)
  const { loading, posts, streamReplayPosts } = useStreamReplayPosts({
    accountAddress,
    skip: skip
  })

  const [allStreamReplayPosts, setAllStreamReplayPosts] = useState<
    StreamReplayPost[]
  >([])

  const [allPosts, setAllPosts] = useState<AnyPost[]>([])

  useEffect(() => {
    // add it to allPosts if it isn't already added

    setAllPosts((prev) => {
      const newPosts = posts?.filter(
        (p) => !prev?.some((prevP) => prevP?.id === p?.id)
      )

      if (!newPosts || newPosts?.length === 0) return prev

      return [...prev, ...newPosts!]
    })
  }, [posts])

  useEffect(() => {
    // @ts-ignore
    setAllStreamReplayPosts((prev) => {
      const newStreamReplayPosts =
        streamReplayPosts?.streamReplayPosts?.streamReplayPosts?.filter(
          (p) => !prev?.some((prevP) => prevP?.postId === p?.postId)
        )

      if (!newStreamReplayPosts || newStreamReplayPosts?.length === 0)
        return prev

      return [...prev, ...newStreamReplayPosts!]
    })
  }, [streamReplayPosts?.streamReplayPosts?.streamReplayPosts])

  const streamReplayMap = new Map(
    allStreamReplayPosts?.map((p) => [p?.postId, p])
  )

  const loadMoreRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          streamReplayPosts?.streamReplayPosts?.hasMore &&
          !loading
        ) {
          setSkip(streamReplayPosts?.streamReplayPosts?.next)
        }
      },
      { threshold: 1.0 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current)
      }
    }
  }, [
    streamReplayPosts?.streamReplayPosts?.hasMore,
    loading,
    streamReplayPosts?.streamReplayPosts?.next
  ])

  return (
    <div className="w-full">
      {/* @ts-ignore */}
      <div className="flex flex-row flex-wrap w-full gap-y-6">
        {allPosts?.map((post) => {
          return (
            <HomeVideoCard
              // @ts-ignore
              cover={streamReplayMap.get(post?.id)?.thumbnail}
              // @ts-ignore
              duration={streamReplayMap.get(post?.id)?.sourceSegmentsDuration}
              premium={!!streamReplayMap.get(post?.id)?.premium}
              key={post?.id}
              post={post as Post}
            />
          )
        })}

        {(streamReplayPosts?.streamReplayPosts?.hasMore ||
          (!allPosts?.length && loading)) &&
          Array.from({ length: 3 }, (_, i) => <LoadingVideoCard key={i} />)}
      </div>
      <div ref={loadMoreRef} className="h-1" />
    </div>
  )
}

const LiveStreamPublicReplays = ({
  accountAddress
}: {
  accountAddress?: string
}) => {
  return (
    <div className="w-full">
      {accountAddress ? (
        <AccountsHomeCard accountAddress={accountAddress} />
      ) : (
        <HomePageCards />
      )}
    </div>
  )
}

export default LiveStreamPublicReplays
