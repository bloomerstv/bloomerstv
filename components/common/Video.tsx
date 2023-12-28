import 'plyr-react/plyr.css'
import cn from '../../utils/ui/cn'
import { Asset, ClipLength, Player } from '@livepeer/react'
import { ARWEAVE_GATEWAY, IPFS_GATEWAY } from '../../utils/contants'
import React, { FC, memo } from 'react'
import { SessionType, useSession } from '@lens-protocol/react-web'

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
  children?: React.ReactNode
  showPipButton?: boolean
  autoHide?: number | undefined
  clipLength?: ClipLength | undefined
  onClipStarted?: () => void
  onClipError?: (error: Error) => any
  onClipCreated?: ((asset: Asset) => any) | undefined
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
  playbackId,
  children = null,
  showPipButton = true,
  autoHide = 3000,
  clipLength,
  onClipStarted = () => {},
  onClipError = () => {},
  onClipCreated = () => {}
}) => {
  //   const currentProfile = useAppStore((state) => state.currentProfile)
  const { data } = useSession()

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
        playbackId={playbackId}
        // configs
        objectFit="contain"
        showLoadingSpinner={true}
        showUploadingIndicator
        aspectRatio="16to9"
        refetchPlaybackInfoInterval={1000 * 60 * 60 * 24}
        // controls
        showPipButton={showPipButton}
        autoPlay={autoPlay}
        muted={muted}
        controls={{ defaultVolume: 1, autohide: autoHide }}
        loop={loop}
        // clip props
        clipLength={clipLength}
        onClipStarted={onClipStarted}
        onClipError={onClipError}
        onClipCreated={onClipCreated}
        // others
        viewerId={
          data?.type === SessionType.WithProfile ? data?.address : undefined
        }
        autoUrlUpload={{
          fallback: true,
          ipfsGateway: IPFS_GATEWAY,
          arweaveGateway: ARWEAVE_GATEWAY
        }}
        renderChildrenOutsideContainer
        onStreamStatusChange={onStreamStatusChange}
        streamOfflineErrorComponent={streamOfflineErrorComponent}
        theme={{
          colors: {
            progressLeft: '#1668b8',
            progressRight: '#f7f7f8',
            progressMiddle: '#ffffff',
            volumeLeft: '#ffffff',
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
      >
        {children}
      </Player>
    </div>
  )
}

export default memo(Video)
