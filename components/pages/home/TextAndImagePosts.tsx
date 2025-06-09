import React, { useRef } from 'react'
import { APP_ADDRESS } from '../../../utils/config'
import { useIsVerifiedQuery } from '../../../graphql/generated'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { IconButton } from '@mui/material'
import TextAndImagePostCard from './TextAndImagePostCard'
import { MainContentFocus, PostType, usePosts } from '@lens-protocol/react'

const TextAndImagePosts = () => {
  const { data, loading } = usePosts({
    filter: {
      postTypes: [PostType.Root, PostType.Quote],
      metadata: {
        mainContentFocus: [MainContentFocus.TextOnly, MainContentFocus.Image]
      },
      accountScore: {
        atLeast: 9200
      },
      apps: [APP_ADDRESS]
    }
  })

  const { data: isVerified } = useIsVerifiedQuery({
    variables: {
      accountAddresses: data?.items.map((p) => p.author?.address)
    }
  })

  const verifiedMap = new Map(
    isVerified?.isVerified?.map((v) => [
      v?.accountAddress,
      v?.isVerified ?? false
    ])
  )

  const scrollContainerRef = useRef(null)

  const scroll = (scrollOffset) => {
    // @ts-ignore
    scrollContainerRef.current.scrollBy({
      left: scrollOffset,
      behavior: 'smooth'
    })
  }

  if (!loading && data?.items.length === 0) {
    return null
  }

  return (
    <div className="w-full px-2">
      <div className="start-center-row gap-x-8  py-2 mb-2 sm:mb-4">
        <div className="text-p-text font-bold text-2xl">Community Posts</div>
        <div className="start-center-row">
          <IconButton size="small" onClick={() => scroll(-270)}>
            <KeyboardArrowLeftIcon />
          </IconButton>
          <IconButton size="small" onClick={() => scroll(270)}>
            <KeyboardArrowRightIcon />
          </IconButton>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        className="start-row gap-x-3 w-full sm:w-[calc(100vw-300px)] overflow-x-auto no-scrollbar pb-3"
        style={{ scrollBehavior: 'smooth' }} // Added inline style for smooth scrolling
      >
        {data?.items.map((post) => {
          return (
            <div key={post?.id}>
              <TextAndImagePostCard
                post={post}
                premium={verifiedMap.get(post?.author?.address)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TextAndImagePosts
