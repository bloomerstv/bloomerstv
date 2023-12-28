import {
  Post,
  PublicationMetadataMainFocusType,
  PublicationType,
  usePublications
} from '@lens-protocol/react-web'
import React from 'react'
import { APP_ID } from '../../../utils/config'
import HomeVideoCard from '../../common/HomeVideoCard'
import LoadingVideoCard from '../../ui/LoadingVideoCard'

const ClipsFeed = () => {
  const { data, loading } = usePublications({
    where: {
      publicationTypes: [PublicationType.Post],
      metadata: {
        mainContentFocus: [PublicationMetadataMainFocusType.ShortVideo],
        // @ts-ignore
        publishedOn: [APP_ID]
      }
    }
  })
  return (
    <div className="sm:m-8 my-4">
      <div className="text-p-text font-bold text-2xl py-2 px-2 mb-2 sm:mb-4">
        Stream Clips
      </div>
      {/* @ts-ignore */}
      {data?.length > 0 ? (
        <div className="flex flex-row flex-wrap sm:gap-x-4 gap-y-6 sm:gap-y-12">
          {data?.map((post) => {
            return <HomeVideoCard key={post?.id} post={post as Post} />
          })}
        </div>
      ) : (
        <>{loading && <LoadingVideoCard />}</>
      )}
    </div>
  )
}

export default ClipsFeed
