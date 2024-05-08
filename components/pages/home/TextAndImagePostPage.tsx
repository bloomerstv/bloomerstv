import React from 'react'
import TextAndImagePostCard from './TextAndImagePostCard'
import {
  AnyPublication,
  SessionType,
  useFollow,
  useSession
} from '@lens-protocol/react-web'
import CollectButton from '../profile/CollectButton'
import { defaultSponsored } from '../../../utils/config'
import toast from 'react-hot-toast'
import formatHandle from '../../../utils/lib/formatHandle'
import CommentSection from '../watch/CommentSection'
import { useIsVerifiedQuery } from '../../../graphql/generated'

const TextAndImagePostPage = ({
  publication,
  className = ''
}: {
  publication: AnyPublication
  premium?: boolean
  className?: string
}) => {
  const { data } = useSession()

  const { execute, loading: followLoading } = useFollow()
  const [isFollowing, setIsFollowing] = React.useState<boolean>(
    publication?.by?.operations?.isFollowedByMe?.value
  )

  const { data: isVerifiedResult } = useIsVerifiedQuery({
    variables: {
      profileIds: [publication?.by?.id]
    },
    skip: !publication?.by?.id
  })

  const handleFollow = async () => {
    if (data?.type !== SessionType.WithProfile) return
    try {
      const result = await execute({
        profile: publication?.by,
        sponsored: defaultSponsored
      })

      if (result.isSuccess()) {
        setIsFollowing(true)
        toast.success(`Following ${formatHandle(publication?.by)}`)
      } else if (result.isFailure()) {
        toast.error(result.error.message)
      }
    } catch (e) {
      console.log(e)
      toast.error(String(e))
    }
  }

  if (
    publication.__typename === 'Comment' ||
    publication.__typename === 'Mirror'
  )
    return null
  return (
    <div className="w-full">
      <TextAndImagePostCard
        publication={publication}
        className={className}
        premium={!!isVerifiedResult?.isVerified?.[0]?.isVerified}
        isPostPage
      />
      {data?.type === SessionType.WithProfile && (
        <div className="mt-2">
          <CollectButton
            post={publication}
            followLoading={followLoading}
            handleFollow={handleFollow}
            isFollowing={isFollowing}
          />
        </div>
      )}

      <div className="border-t mt-3 border-p-border w-full">
        <div className="text-xl font-semibold my-1">{`${publication?.stats?.comments} Comment${publication?.stats?.comments > 1 ? 's' : ''}`}</div>
        <CommentSection publication={publication} />
      </div>
    </div>
  )
}

export default TextAndImagePostPage
