import React from 'react'
import TextAndImagePostCard from './TextAndImagePostCard'
// import CollectButton from '../profile/CollectButton'
import toast from 'react-hot-toast'
import formatHandle from '../../../utils/lib/formatHandle'
import CommentSection from '../watch/CommentSection'
import { useIsVerifiedQuery } from '../../../graphql/generated'
import { AnyPost, Post } from '@lens-protocol/react'
import useSession from '../../../utils/hooks/useSession'
import useFollow from '../../../utils/hooks/lens/useFollow'

const TextAndImagePostPage = ({
  post,
  className = ''
}: {
  post: AnyPost
  premium?: boolean
  className?: string
}) => {
  const { isAuthenticated, account } = useSession()

  const { execute, loading: followLoading } = useFollow()
  const [isFollowing, setIsFollowing] = React.useState<boolean>(
    !!post?.author?.operations?.isFollowedByMe
  )

  const { data: isVerifiedResult } = useIsVerifiedQuery({
    variables: {
      accountAddresses: [post?.author?.address]
    },
    skip: !post?.author?.address
  })

  const handleFollow = async () => {
    if (!isAuthenticated) return
    try {
      const result = await execute({
        account: post?.author?.address
      })

      if (result.isOk()) {
        setIsFollowing(true)
        toast.success(`Following ${formatHandle(post?.author?.address)}`)
      } else if (result.isErr()) {
        toast.error(result.error.message)
      }
    } catch (e) {
      console.log(e)
      toast.error(String(e))
    }
  }

  if (
    (post?.__typename === 'Post' && post?.commentOn) ||
    post?.__typename === 'Repost'
  )
    return null

  return (
    <div className="w-full">
      <TextAndImagePostCard
        post={post}
        className={className}
        premium={!!isVerifiedResult?.isVerified?.[0]?.isVerified}
        isPostPage
      />
      {/* {isAuthenticated && (
        <div className="mt-2">
          <CollectButton
            post={post}
            followLoading={followLoading}
            handleFollow={handleFollow}
            isFollowing={isFollowing}
          />
        </div>
      )} */}

      <div className="border-t mt-3 border-p-border w-full">
        <div className="text-xl font-semibold my-1">{`${post?.stats?.comments} Comment${post?.stats?.comments > 1 ? 's' : ''}`}</div>
        <CommentSection post={post} />
      </div>
    </div>
  )
}

export default TextAndImagePostPage
