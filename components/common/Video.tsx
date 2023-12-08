import 'plyr-react/plyr.css'
import cn from '../../utils/ui/cn'
import { Player } from '@livepeer/react'
import { ARWEAVE_GATEWAY, IPFS_GATEWAY } from '../../utils/contants'
import React, { FC, memo } from 'react'

interface VideoProps {
  src: string
  poster?: string
  className?: string
  playbackId?: string
  streamOfflineErrorComponent?: React.ReactNode
  onStreamStatusChange?: (isLive: boolean) => void
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
}

const Video: FC<VideoProps> = ({
  src,
  poster,
  className = '',
  streamOfflineErrorComponent = null,
  onStreamStatusChange = () => {},
  autoPlay = true,
  muted = true,
  loop = false,
  playbackId
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
        objectFit="contain"
        showLoadingSpinner={true}
        showUploadingIndicator
        showPipButton={false}
        aspectRatio="16to9"
        autoPlay={autoPlay}
        muted={muted}
        playbackId={playbackId}
        // viewerId={currentProfile?.ownedBy.address}
        controls={{ defaultVolume: 1 }}
        refetchPlaybackInfoInterval={1000 * 60 * 60 * 24}
        autoUrlUpload={{
          fallback: true,
          ipfsGateway: IPFS_GATEWAY,
          arweaveGateway: ARWEAVE_GATEWAY
        }}
        loop={loop}
        onStreamStatusChange={onStreamStatusChange}
        streamOfflineErrorComponent={streamOfflineErrorComponent}
        theme={{
          colors: {
            progressLeft: '#1668b8',
            progressRight: '#f7f7f8',
            progressMiddle: '#ffffff',
            volumeLeft: '#1668b8',
            volumeRight: '#f7f7f8',
            volumeMiddle: '#ffffff',
            loading: '#1668b8',
            liveIndicator: '#1668b8'
          }
          // sizes: {
          //   iconButtonSize: '30px',
          //   iconButtonSizeSm: '25px'
          // }
        }}
      />
    </div>
  )
}

export default memo(Video)
