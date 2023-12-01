import 'plyr-react/plyr.css'
import cn from '../../utils/ui/cn'
import { Player } from '@livepeer/react'
import { ARWEAVE_GATEWAY, IPFS_GATEWAY } from '../../utils/contants'
import React, { FC, memo } from 'react'

interface VideoProps {
  src: string
  poster?: string
  className?: string
  playerbackId?: string
  streamOfflineErrorComponent?: React.ReactNode
}

const Video: FC<VideoProps> = ({
  src,
  poster,
  className = '',
  playerbackId,
  streamOfflineErrorComponent = null
}) => {
  //   const currentProfile = useAppStore((state) => state.currentProfile)

  return (
    <div
      className={cn('lp-player', className)}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <Player
        src={src}
        poster={poster}
        playbackId={playerbackId}
        objectFit="contain"
        showLoadingSpinner
        showUploadingIndicator
        showPipButton={false}
        aspectRatio="16to9"
        // viewerId={currentProfile?.ownedBy.address}
        controls={{ defaultVolume: 1 }}
        refetchPlaybackInfoInterval={1000 * 60 * 60 * 24}
        autoUrlUpload={{
          fallback: true,
          ipfsGateway: IPFS_GATEWAY,
          arweaveGateway: ARWEAVE_GATEWAY
        }}
        onStreamStatusChange={(isLive) => {
          console.log('isLive', isLive)
        }}
        streamOfflineErrorComponent={streamOfflineErrorComponent}
      />
    </div>
  )
}

export default memo(Video)
