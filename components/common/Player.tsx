import {
  ClipIcon,
  EnterFullscreenIcon,
  ExitFullscreenIcon,
  LoadingIcon,
  MuteIcon,
  PauseIcon,
  PictureInPictureIcon,
  PlayIcon,
  SettingsIcon,
  UnmuteIcon
} from '@livepeer/react/assets'
import * as Player from '@livepeer/react/player'
import * as Popover from '@radix-ui/react-popover'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import React, { memo, useCallback, useTransition } from 'react'

import { ClipLength } from '@livepeer/react'
import cn from '../../utils/ui/cn'
import VideoClipper from '../pages/dashboard/content/VideoClipper'

const PlayerWithControls = ({
  src,
  poster,
  title,
  className = '',
  streamOfflineErrorComponent = null,
  onStreamStatusChange,
  createClip,
  autoPlay = true,
  muted = true,
  loop = false,
  autoHide = 3000,
  showPipButton = true,
  clipLength,
  videoClipperRef,
  videoClipperSrc
}: {
  title?: string
  src: string | null
  poster?: string | null | undefined
  muted?: boolean
  className?: string
  createClip?: (
    playbackId: string,
    startTime: number,
    endTime: number
  ) => Promise<void>
  streamOfflineErrorComponent?: React.ReactNode
  onStreamStatusChange?: (isLive: boolean) => void
  autoPlay?: boolean
  loop?: boolean
  showPipButton?: boolean
  autoHide?: number | undefined
  clipLength?: ClipLength | undefined
  videoClipperRef?: React.RefObject<HTMLDivElement>
  videoClipperSrc?: string
}) => {
  const [hidden, setHidden] = React.useState(false)
  const timerRef = React.useRef(null) // Store the timer id in a ref

  React.useEffect(() => {
    if (!autoHide) return

    const resetTimer = () => {
      setHidden(false)
      // @ts-ignore
      clearTimeout(timerRef.current)
      // @ts-ignore
      timerRef.current = setTimeout(() => setHidden(true), autoHide)
    }

    window.addEventListener('mousemove', resetTimer)
    window.addEventListener('mousedown', resetTimer)

    resetTimer() // Initialize the timer

    return () => {
      // Clean up when the component is unmounted
      // @ts-ignore
      clearTimeout(timerRef.current)
      window.removeEventListener('mousemove', resetTimer)
      window.removeEventListener('mousedown', resetTimer)
    }
  }, [])

  if (!src) {
    return (
      <PlayerLoading
        title="Invalid source"
        description="We could not fetch valid playback information for the playback ID you provided. Please check and try again."
      />
    )
  }

  return (
    <Player.Root
      // @ts-ignore
      src={src}
      clipLength={clipLength}
      autoPlay={autoPlay}
    >
      <Player.Container
        className={cn(
          'w-full overflow-hidden bg-black outline-none transition text-white',
          className
        )}
      >
        <Player.Video
          autoFocus
          loop={loop}
          title={title}
          className={cn('h-full w-full transition')}
          poster={poster}
          muted={muted}
        />

        <Player.LoadingIndicator className="w-full relative h-full bg-black/50 backdrop-blur data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <LoadingIcon className="w-8 h-8 animate-spin text-[#7a7a81]" />
          </div>
          <PlayerLoading />
          <Player.Poster
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Player.LoadingIndicator>

        <Player.ErrorIndicator
          matcher="all"
          className="absolute select-none inset-0 text-center bg-black/40 backdrop-blur-lg flex flex-col items-center justify-center gap-4 duration-1000 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <LoadingIcon className="w-8 h-8 animate-spin text-[#7a7a81]" />
          </div>
          <PlayerLoading />
        </Player.ErrorIndicator>

        <Player.ErrorIndicator
          matcher="offline"
          className="absolute select-none animate-in fade-in-0 inset-0 text-center bg-black/40 backdrop-blur-lg flex flex-col items-center justify-center gap-4 duration-1000 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0"
        >
          {streamOfflineErrorComponent ? (
            streamOfflineErrorComponent
          ) : (
            <>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <div className="text-lg sm:text-2xl font-bold">
                    Stream is offline
                  </div>
                  <div className="text-xs sm:text-sm text-gray-100">
                    Playback will start automatically once the stream has
                    started
                  </div>
                </div>
                <LoadingIcon className="w-6 h-6 md:w-8 md:h-8 mx-auto animate-spin text-[#7a7a81]" />
              </div>
            </>
          )}
        </Player.ErrorIndicator>

        <Player.ErrorIndicator
          matcher="access-control"
          className="absolute select-none inset-0 text-center bg-black/40 backdrop-blur-lg flex flex-col items-center justify-center gap-4 duration-1000 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0"
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <div className="text-lg sm:text-2xl font-bold">
                Stream is private
              </div>
              <div className="text-xs sm:text-sm text-gray-100">
                It looks like you don't have permission to view this content
              </div>
            </div>
            <LoadingIcon className="w-6 h-6 md:w-8 md:h-8 mx-auto animate-spin text-[#7a7a81]" />
          </div>
        </Player.ErrorIndicator>

        {!hidden && (
          <Player.Controls
            autoHide={0}
            className="bg-gradient-to-b gap-1 px-3 md:px-3 py-2 flex-col-reverse flex from-black/5 via-80% via-black/30 duration-1000 to-black/60 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0"
          >
            <div className="flex justify-between gap-4">
              <div className="flex flex-1 items-center gap-3">
                <Player.PlayPauseTrigger className="bg-transparent p-0 border-none hover:cursor-pointer">
                  <Player.PlayingIndicator asChild matcher={false}>
                    <PlayIcon className="text-white w-6 h-6" />
                  </Player.PlayingIndicator>
                  <Player.PlayingIndicator asChild>
                    <PauseIcon className="w-6 h-6 text-white" />
                  </Player.PlayingIndicator>
                </Player.PlayPauseTrigger>

                {/* <Player.LiveIndicator className="gap-2 flex items-center">
                <div className="bg-red-600 h-1.5 w-1.5 rounded-full" />
                <span className="text-sm select-none">LIVE</span>
              </Player.LiveIndicator> */}
                <Player.LiveIndicator
                  matcher={false}
                  className="flex gap-2 items-center"
                >
                  <Player.Time className="text-sm tabular-nums select-none" />
                </Player.LiveIndicator>

                <Player.MuteTrigger className="bg-transparent p-0 border-none hover:cursor-pointer">
                  <Player.VolumeIndicator asChild matcher={false}>
                    <MuteIcon className="text-white w-5 h-5" />
                  </Player.VolumeIndicator>
                  <Player.VolumeIndicator asChild matcher={true}>
                    <UnmuteIcon className="text-white w-5 h-5" />
                  </Player.VolumeIndicator>
                </Player.MuteTrigger>
                <Player.Volume className="relative mr-1 flex-1 group flex cursor-pointer items-center select-none touch-none max-w-[120px] h-5">
                  <Player.Track className="bg-white/30 relative grow rounded-full transition h-[2px] md:h-[3px] group-hover:h-[3px] group-hover:md:h-[4px]">
                    <Player.Range className="absolute bg-white rounded-full h-full" />
                  </Player.Track>
                  <Player.Thumb className="block transition group-hover:scale-110 w-2 h-2 bg-white rounded-full" />
                </Player.Volume>
              </div>
              <div className="flex sm:flex-1 md:flex-[1.5] justify-end items-center gap-2.5">
                <Settings className="bg-transparent p-0 border-none hover:cursor-pointer" />

                {createClip && <Clip createClip={createClip} />}

                {showPipButton && (
                  <Player.PictureInPictureTrigger className="bg-transparent p-0 border-none hover:cursor-pointer">
                    <PictureInPictureIcon className="text-white w-5 h-5" />
                  </Player.PictureInPictureTrigger>
                )}

                <Player.FullscreenTrigger className="bg-transparent p-0 border-none hover:cursor-pointer">
                  <Player.FullscreenIndicator asChild>
                    <ExitFullscreenIcon className="text-white w-5 h-5" />
                  </Player.FullscreenIndicator>

                  <Player.FullscreenIndicator matcher={false} asChild>
                    <EnterFullscreenIcon className="text-white w-5 h-5" />
                  </Player.FullscreenIndicator>
                </Player.FullscreenTrigger>
              </div>
            </div>
            <Player.Seek className="relative group flex cursor-pointer items-center select-none touch-none w-full h-5">
              <Player.Track className="bg-white/20 relative grow rounded-full transition-all duration-300 h-[2px] md:h-[3px] group-hover:h-[3px] group-hover:md:h-[4px]">
                <Player.SeekBuffer className="absolute group-hover:bg-white/60 bg-white/40 transition-all duration-1000 rounded-full h-full" />
                <Player.Range className="absolute bg-brand rounded-full h-full" />
              </Player.Track>
              <Player.Thumb className="block scale-0 group-hover:scale-100 w-3 h-3 bg-brand duration-150 transition-all rounded-full" />
            </Player.Seek>
          </Player.Controls>
        )}

        {videoClipperSrc && videoClipperRef && (
          <Player.Portal container={videoClipperRef.current}>
            <VideoClipper url={videoClipperSrc} />
          </Player.Portal>
        )}
      </Player.Container>
      {onStreamStatusChange && (
        <ContextComponent onStreamStatusChange={onStreamStatusChange} />
      )}
    </Player.Root>
  )
}

export default memo(PlayerWithControls)

const ContextComponent = ({
  onStreamStatusChange,
  __scopeMedia
}: Player.MediaScopedProps<any>) => {
  const context = Player.useMediaContext('CurrentSource', __scopeMedia)

  const { progress } = Player.useStore(
    context.store,
    // @ts-ignore
    ({ progress }) => ({ progress: Boolean(progress) })
  )

  React.useEffect(() => {
    onStreamStatusChange?.(Boolean(progress))
  }, [Boolean(progress)])

  return <></>
}

const PlayerLoading = ({
  title,
  description
}: {
  title?: React.ReactNode
  description?: React.ReactNode
}) => (
  <div className="relative w-full px-3 py-2 gap-3 flex-col-reverse flex aspect-video bg-white/10 overflow-hidden rounded-sm">
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 animate-pulse bg-white/5 overflow-hidden rounded-lg" />
        <div className="w-16 h-6 md:w-20 md:h-7 animate-pulse bg-white/5 overflow-hidden rounded-lg" />
      </div>

      <div className="flex items-center gap-2">
        <div className="w-6 h-6 animate-pulse bg-white/5 overflow-hidden rounded-lg" />
        <div className="w-6 h-6 animate-pulse bg-white/5 overflow-hidden rounded-lg" />
      </div>
    </div>
    <div className="w-full h-2 animate-pulse bg-white/5 overflow-hidden rounded-lg" />

    {title && (
      <div className="absolute flex flex-col gap-1 inset-10 text-center justify-center items-center">
        <span className="text-white text-lg font-medium">{title}</span>
        {description && (
          <span className="text-sm text-white/80">{description}</span>
        )}
      </div>
    )}
  </div>
)

function Clip({
  className,
  createClip
}: {
  className?: string
  createClip: (
    playbackId: string,
    startTime: number,
    endTime: number
  ) => Promise<void>
}) {
  const [isPending, startTransition] = useTransition()

  const createClipComposed = useCallback((opts: any) => {
    console.log('opts', opts)
    startTransition(async () => {
      await createClip(opts.playbackId, opts.startTime, opts.endTime)
    })
  }, [])

  return (
    <Player.LiveIndicator className={className} asChild>
      <Player.ClipTrigger
        onClip={createClipComposed}
        disabled={isPending}
        className="bg-transparent p-0 border-none hover:cursor-pointer"
      >
        {isPending ? (
          <LoadingIcon className="w-5 h-5 animate-spin text-[#7a7a81]" />
        ) : (
          <ClipIcon className="w-5 h-5 text-white" />
        )}
      </Player.ClipTrigger>
    </Player.LiveIndicator>
  )
}

// eslint-disable-next-line react/display-name
const Settings = React.forwardRef(
  (
    { className }: { className?: string },
    ref: React.Ref<HTMLButtonElement> | undefined
  ) => {
    return (
      <Popover.Root>
        <Popover.Trigger ref={ref} asChild>
          <button
            type="button"
            className={className}
            aria-label="Playback settings"
            onClick={(e) => e.stopPropagation()}
          >
            <SettingsIcon className="text-white w-5 h-5" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="w-60 rounded-xl bg-black/40 backdrop-blur-sm p-4 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            side="top"
            alignOffset={-50}
            align="end"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              <Player.LiveIndicator
                matcher={false}
                className="gap-2 flex-col flex"
              >
                <label
                  className="text-xs text-white font-bold"
                  htmlFor="speedSelect"
                >
                  Playback speed
                </label>
                <Player.RateSelect name="speedSelect">
                  <Player.SelectTrigger
                    className="inline-flex items-center bg-white/30 text-white backdrop-blur-md justify-between rounded-lg px-2 text-xs leading-none h-7 gap-1 outline-none border-none"
                    aria-label="Playback speed"
                  >
                    <Player.SelectValue placeholder="Select a speed..." />
                    <Player.SelectIcon>
                      <ChevronDownIcon className="h-4 w-4" />
                    </Player.SelectIcon>
                  </Player.SelectTrigger>
                  <Player.SelectPortal>
                    <Player.SelectContent className="overflow-hidden bg-black/70 backdrop-blur-sm text-white rounded-xl">
                      <Player.SelectViewport className="p-1 rounded-lg">
                        <Player.SelectGroup>
                          <RateSelectItem className="rounded-lg" value={0.5}>
                            0.5x
                          </RateSelectItem>
                          <RateSelectItem className="rounded-lg" value={0.75}>
                            0.75x
                          </RateSelectItem>
                          <RateSelectItem className="rounded-lg" value={1}>
                            1x (normal)
                          </RateSelectItem>
                          <RateSelectItem className="rounded-lg" value={1.25}>
                            1.25x
                          </RateSelectItem>
                          <RateSelectItem className="rounded-lg" value={1.5}>
                            1.5x
                          </RateSelectItem>
                          <RateSelectItem className="rounded-lg" value={1.75}>
                            1.75x
                          </RateSelectItem>
                          <RateSelectItem className="rounded-lg" value={2}>
                            2x
                          </RateSelectItem>
                        </Player.SelectGroup>
                      </Player.SelectViewport>
                    </Player.SelectContent>
                  </Player.SelectPortal>
                </Player.RateSelect>
              </Player.LiveIndicator>
              <div className="gap-2 flex-col flex">
                <label
                  className="text-xs text-white font-bold"
                  htmlFor="qualitySelect"
                >
                  Quality
                </label>
                <Player.VideoQualitySelect
                  name="qualitySelect"
                  defaultValue="1.0"
                >
                  <Player.SelectTrigger
                    className="inline-flex items-center justify-between rounded-lg px-2 text-xs leading-none h-7 gap-1 outline-none border-none text-white bg-white/30 backdrop-blur-md"
                    aria-label="Playback quality"
                  >
                    <Player.SelectValue placeholder="Select a quality..." />
                    <Player.SelectIcon>
                      <ChevronDownIcon className="h-4 w-4" />
                    </Player.SelectIcon>
                  </Player.SelectTrigger>
                  <Player.SelectPortal>
                    <Player.SelectContent className="overflow-hidden bg-black/70 backdrop-blur-sm  text-white rounded-xl">
                      <Player.SelectViewport className="p-1 rounded-lg">
                        <Player.SelectGroup>
                          <VideoQualitySelectItem
                            className="rounded-lg"
                            value="auto"
                          >
                            Auto (HD+)
                          </VideoQualitySelectItem>
                          <VideoQualitySelectItem
                            className="rounded-lg"
                            value="1080p"
                          >
                            1080p (HD)
                          </VideoQualitySelectItem>
                          <VideoQualitySelectItem
                            className="rounded-lg"
                            value="720p"
                          >
                            720p
                          </VideoQualitySelectItem>
                          <VideoQualitySelectItem
                            className="rounded-lg"
                            value="480p"
                          >
                            480p
                          </VideoQualitySelectItem>
                          <VideoQualitySelectItem
                            className="rounded-lg"
                            value="360p"
                          >
                            360p
                          </VideoQualitySelectItem>
                        </Player.SelectGroup>
                      </Player.SelectViewport>
                    </Player.SelectContent>
                  </Player.SelectPortal>
                </Player.VideoQualitySelect>
              </div>
            </div>
            {/* <Popover.Close
              className="rounded-full h-5 w-5 inline-flex items-center justify-center absolute top-2.5 right-2.5 outline-none"
              aria-label="Close"
            >
              <XIcon />
            </Popover.Close> */}
            <Popover.Arrow className="fill-black/40" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    )
  }
)

// eslint-disable-next-line react/display-name
const RateSelectItem = React.forwardRef<
  HTMLDivElement,
  Player.RateSelectItemProps
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Player.RateSelectItem
      className={cn(
        'text-xs leading-none rounded-sm flex items-center h-7 pr-[35px] pl-[25px] relative select-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-white/20',
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <Player.SelectItemText>{children}</Player.SelectItemText>
      <Player.SelectItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
        <CheckIcon className="w-4 h-4" />
      </Player.SelectItemIndicator>
    </Player.RateSelectItem>
  )
})

// eslint-disable-next-line react/display-name
const VideoQualitySelectItem = React.forwardRef<
  HTMLDivElement,
  Player.VideoQualitySelectItemProps
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Player.VideoQualitySelectItem
      className={cn(
        'text-xs leading-none rounded-sm flex items-center h-7 pr-[35px] pl-[25px] relative select-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-white/20',
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <Player.SelectItemText>{children}</Player.SelectItemText>
      <Player.SelectItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
        <CheckIcon className="w-4 h-4" />
      </Player.SelectItemIndicator>
    </Player.VideoQualitySelectItem>
  )
})
