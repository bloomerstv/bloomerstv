import { AnyPublication } from '@lens-protocol/react-web'
import React from 'react'
import LoadingImage from '../../ui/LoadingImage'
import getAvatar from '../../../utils/lib/getAvatar'
import formatHandle from '../../../utils/lib/formatHandle'
import { timeAgo } from '../../../utils/helpers'
import VerifiedBadge from '../../ui/VerifiedBadge'
import Markup from '../../common/Lexical/Markup'
import getPublicationData from '../../../utils/lib/getPublicationData'
import { stringToLength } from '../../../utils/stringToLength'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import Link from 'next/link'
import LikeButton from '../profile/LikeButton'
import MirrorButton from '../profile/MirrorButton'

const TextAndImagePostCard = ({
  publication,
  premium,
  className = ''
}: {
  publication: AnyPublication
  premium?: boolean
  className?: string
}) => {
  if (
    publication?.__typename === 'Comment' ||
    publication?.__typename === 'Mirror'
  )
    return null
  if (
    publication?.metadata?.__typename !== 'TextOnlyMetadataV3' &&
    publication?.metadata?.__typename !== 'ImageMetadataV3'
  )
    return null

  const asset = getPublicationData(publication?.metadata)?.asset

  return (
    <div className={className}>
      <div
        className={`bg-s-bg flex flex-row rounded-xl p-2 shrink-0 w-full h-full shadow-sm align-items-stretch`}
      >
        <div className="w-[250px]">
          <div className="between-row w-full shrink-0">
            <div className="start-row gap-x-2 shrink-0 w-full">
              <LoadingImage
                src={getAvatar(publication?.by)}
                className="w-10 h-10 rounded-full"
                alt="avatar"
              />
              <div className="start-col shrink-0 w-full">
                <div className="font-bold start-center-row text-s-text gap-x-1">
                  <>{formatHandle(publication?.by)}</>
                  {premium && <VerifiedBadge />}
                </div>
                <div className="text-xs text-s-text shrink-0">
                  {timeAgo(publication?.createdAt)}
                </div>
              </div>
            </div>
          </div>
          {/* content */}
          <div className="h-[75px] overflow-hidden">
            <Markup className="text-sm">
              {stringToLength(publication?.metadata?.content, 100)}
            </Markup>
          </div>
          {/* quoted content with link */}
          {publication?.__typename === 'Quote' &&
          (publication?.quoteOn?.metadata?.__typename === 'VideoMetadataV3' ||
            publication?.quoteOn?.metadata?.__typename ===
              'LiveStreamMetadataV3') ? (
            <Link
              href={`/watch/${publication?.quoteOn?.id}`}
              className="text-p-text no-underline"
            >
              <div className="bg-p-hover hover:shadow-md px-1 text-xs  rounded-lg h-8 start-center-row">
                <PlayArrowIcon fontSize="small" />
                <div className="font-semibold">
                  {stringToLength(publication?.quoteOn?.metadata?.title, 40)}
                </div>
              </div>
            </Link>
          ) : (
            <div className="rounded-lg h-8"></div>
          )}

          {/* buttons */}
          {/* todo uncomment after react sdk fix for stats */}
          <div className="start-center-row gap-x-2 mt-2">
            <LikeButton publication={publication} />
            <MirrorButton publication={publication} />
          </div>
        </div>

        {asset?.type === 'Image' && (
          <LoadingImage
            src={asset?.uri}
            className="rounded-xl h-[150px] -mb-1.5 ml-2"
            alt="post"
          />
        )}
      </div>
    </div>
  )
}

export default TextAndImagePostCard
