import React from 'react'
import {
  DisableAudioIcon,
  DisableVideoIcon,
  EnableAudioIcon,
  EnableVideoIcon,
  PlayIcon,
  StartScreenshareIcon,
  StopIcon,
  StopScreenshareIcon
} from '@livepeer/react/assets'
import * as Broadcast from '@livepeer/react/broadcast'
import { getIngest } from '@livepeer/react/external'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'

export const BroadcastLive = ({
  streamKey,
  onStreamStatusChange
}: {
  streamKey: string
  onStreamStatusChange: (isLive: boolean) => void
}) => {
  return (
    <Broadcast.Root ingestUrl={getIngest(streamKey)}>
      <Broadcast.Container>
        <Broadcast.Video
          title="Livestream"
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'cover'
          }}
        />

        <Broadcast.Controls
          autoHide={0}
          className="centered-row gap-3 mt-[8vw]"
        >
          <Broadcast.EnabledTrigger className="w-10 h-10 hover:scale-110 transition-all ease-in-out duration-300 transform flex-shrink-0 border-none outline-none bg-black/30 backdrop-blur-sm rounded-full text-white p-1 cursor-pointer">
            <Broadcast.EnabledIndicator asChild matcher={false}>
              <PlayIcon className="w-full h-full" />
            </Broadcast.EnabledIndicator>
            <Broadcast.EnabledIndicator asChild>
              <StopIcon className="w-full h-full" />
            </Broadcast.EnabledIndicator>
          </Broadcast.EnabledTrigger>
          <Broadcast.AudioEnabledTrigger className="w-10 h-10 hover:scale-110 transition-all ease-in-out duration-300 transform flex-shrink-0 border-none outline-none bg-black/30 backdrop-blur-sm rounded-full text-white p-2 cursor-pointer">
            <Broadcast.AudioEnabledIndicator asChild matcher={false}>
              <DisableAudioIcon />
            </Broadcast.AudioEnabledIndicator>
            <Broadcast.AudioEnabledIndicator asChild>
              <EnableAudioIcon />
            </Broadcast.AudioEnabledIndicator>
          </Broadcast.AudioEnabledTrigger>

          <Broadcast.VideoEnabledTrigger className="w-10 h-10 hover:scale-110 transition-all ease-in-out duration-300 transform flex-shrink-0 border-none outline-none bg-black/30 backdrop-blur-sm rounded-full text-white p-2 cursor-pointer">
            <Broadcast.VideoEnabledIndicator asChild matcher={false}>
              <DisableVideoIcon />
            </Broadcast.VideoEnabledIndicator>
            <Broadcast.VideoEnabledIndicator asChild>
              <EnableVideoIcon />
            </Broadcast.VideoEnabledIndicator>
          </Broadcast.VideoEnabledTrigger>

          <Broadcast.ScreenshareTrigger className="w-10 h-10 hover:scale-110 transition-all ease-in-out duration-300 transform flex-shrink-0 border-none outline-none bg-black/30 backdrop-blur-sm rounded-full text-white p-2 cursor-pointer">
            <Broadcast.ScreenshareIndicator asChild matcher={false}>
              <StopScreenshareIcon />
            </Broadcast.ScreenshareIndicator>
            <Broadcast.ScreenshareIndicator asChild>
              <StartScreenshareIcon />
            </Broadcast.ScreenshareIndicator>
          </Broadcast.ScreenshareTrigger>
        </Broadcast.Controls>

        <div
          style={{
            position: 'absolute',
            left: 20,
            bottom: 10,
            display: 'flex',
            gap: 10
          }}
        >
          <SourceSelectComposed name="cameraSource" type="videoinput" />
          <SourceSelectComposed name="microphoneSource" type="audioinput" />
        </div>

        <Broadcast.LoadingIndicator asChild matcher={false}>
          <div className="absolute text-white overflow-hidden py-1 px-2 rounded-full top-2 left-2 bg-black/40 backdrop-blur-sm flex items-center">
            <Broadcast.StatusIndicator
              matcher="live"
              className="flex gap-2 items-center"
            >
              <div className="bg-brand animate-pulse h-1.5 w-1.5 rounded-full" />
              <span className="text-xs text-brand select-none">LIVE</span>
            </Broadcast.StatusIndicator>

            <Broadcast.StatusIndicator
              className="flex gap-2 items-center"
              matcher="pending"
            >
              <div className="bg-white h-1.5 w-1.5 rounded-full animate-pulse" />
              <span className="text-xs select-none">LOADING</span>
            </Broadcast.StatusIndicator>

            <Broadcast.StatusIndicator
              className="flex gap-2 items-center"
              matcher="idle"
            >
              <div className="bg-white h-1.5 w-1.5 rounded-full animate-pulse" />
              <span className="text-xs select-none">IDLE</span>
            </Broadcast.StatusIndicator>
          </div>
        </Broadcast.LoadingIndicator>
      </Broadcast.Container>
      <ContextComponent onStreamStatusChange={onStreamStatusChange} />
    </Broadcast.Root>
  )
}

const ContextComponent = ({
  onStreamStatusChange,
  __scopeBroadcast
}: Broadcast.BroadcastScopedProps<any>) => {
  const context = Broadcast.useBroadcastContext(
    'CurrentSource',
    __scopeBroadcast
  )

  const { status } = Broadcast.useStore(context.store, ({ status }) => ({
    status
  }))

  React.useEffect(() => {
    if (onStreamStatusChange) {
      onStreamStatusChange?.(status === 'live')
    }
  }, [status])

  return <></>
}

const SourceSelectComposed = React.forwardRef(
  (
    { name, type }: { name: string; type: 'audioinput' | 'videoinput' },
    ref: React.Ref<HTMLButtonElement> | undefined
  ) => (
    <Broadcast.SourceSelect name={name} type={type}>
      {(devices) =>
        devices ? (
          <>
            <Broadcast.SelectTrigger
              ref={ref}
              className="inline-flex items-center cursor-pointer justify-between rounded-lg px-2 text-xs leading-none h-7 gap-1 outline-none border-none text-white bg-black/30 backdrop-blur-sm"
              aria-label={type === 'audioinput' ? 'Audio input' : 'Video input'}
            >
              <Broadcast.SelectValue
                placeholder={
                  type === 'audioinput'
                    ? 'Select an audio input'
                    : 'Select a video input'
                }
              />
              <Broadcast.SelectIcon>
                <ChevronDownIcon style={{ width: 14, height: 14 }} />
              </Broadcast.SelectIcon>
            </Broadcast.SelectTrigger>
            <Broadcast.SelectPortal>
              <Broadcast.SelectContent className="overflow-hidden bg-black/70 backdrop-blur-sm  text-white rounded-xl">
                <Broadcast.SelectViewport className="p-1 rounded-lg">
                  <Broadcast.SelectGroup>
                    {devices?.map((device) => (
                      <SourceSelectItem
                        key={device.deviceId}
                        value={device.deviceId}
                        className="rounded-lg"
                      >
                        {device.friendlyName}
                      </SourceSelectItem>
                    ))}
                  </Broadcast.SelectGroup>
                </Broadcast.SelectViewport>
              </Broadcast.SelectContent>
            </Broadcast.SelectPortal>
          </>
        ) : (
          <span>There was an error fetching the available devices.</span>
        )
      }
    </Broadcast.SourceSelect>
  )
)

const SourceSelectItem = React.forwardRef<
  HTMLDivElement,
  Broadcast.SelectItemProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <Broadcast.SelectItem
      style={{
        fontSize: 12,
        borderRadius: 5,
        display: 'flex',
        alignItems: 'center',
        paddingRight: 35,
        paddingLeft: 25,
        position: 'relative',
        userSelect: 'none',
        height: 30
      }}
      {...props}
      ref={forwardedRef}
    >
      <Broadcast.SelectItemText>{children}</Broadcast.SelectItemText>
      <Broadcast.SelectItemIndicator
        style={{
          position: 'absolute',
          left: 0,
          width: 25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CheckIcon style={{ width: 14, height: 14 }} />
      </Broadcast.SelectItemIndicator>
    </Broadcast.SelectItem>
  )
})

export default Broadcast
