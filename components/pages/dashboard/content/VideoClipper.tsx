import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { getListOfThumbnailsFromRecordingUrl } from '../../../../utils/lib/getThumbnailFromRecordingUrl'
import Draggable from 'react-draggable'
import clsx from 'clsx'
import { useStreamAsVideo } from '../../../store/useStreamAsVideo'
import { THUMBNAIL_FALLBACK } from '../../../../utils/config'
import {
  MediaScopedProps,
  useMediaContext,
  useStore
} from '@livepeer/react/player'

const VideoClipper = ({
  url,
  __scopeMedia
}: MediaScopedProps<{ url: string }>) => {
  const context = useMediaContext('CurrentSource', __scopeMedia)
  const { duration, playing, loading, progress, __controlsFunctions } =
    useStore(
      context.store,
      ({ duration, playing, loading, progress, __controlsFunctions }) => ({
        duration,
        playing,
        loading,
        progress,
        __controlsFunctions
      })
    )
  // const { duration, playing, loading, progress, requestSeek, togglePlay } =
  //   useMediaController((state) => state)

  const setStartTime = useStreamAsVideo((state) => state.setStartTime)
  const setEndTime = useStreamAsVideo((state) => state.setEndTime)

  const [startPosition, setStartPosition] = useState(0)
  const [endPosition, setEndPosition] = useState(0)
  const [totalWidth, setTotalWidth] = useState(0)

  const containerRef = useRef<null | HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef?.current?.offsetWidth) return
    setEndPosition(containerRef.current.offsetWidth - 8)
    setTotalWidth(containerRef.current.offsetWidth)
  }, [containerRef?.current?.offsetWidth])
  // const [value, setValue] = useState([0, duration])

  // const handleChange = (event, newValue) => {
  //   setValue(newValue)
  // }

  const formatTime = useCallback((value) => {
    const hours = Math.floor(value / 3600)
    const minutes = Math.floor((value % 3600) / 60)
    const seconds = Math.floor(value % 60)

    return hours > 0
      ? `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${minutes.toString().padStart(2, '0')}:${seconds
          .toString()
          .padStart(2, '0')}`
  }, [])

  const timeToLocation = useCallback(
    (time) => {
      return (time / duration) * totalWidth
    },
    [duration, totalWidth]
  )

  const startTime = useCallback(() => {
    if (!totalWidth) return
    const time = (startPosition / totalWidth) * duration
    setStartTime(time)

    return formatTime(time) || '00:00'
  }, [startPosition, totalWidth, duration])

  const endTime = useCallback(() => {
    if (!totalWidth) return
    const time = ((endPosition + 8) / totalWidth) * duration
    setEndTime(time)
    return formatTime(time) || '00:00'
  }, [endPosition, totalWidth, duration])

  const thumbnails = getListOfThumbnailsFromRecordingUrl(url, duration, 25)
  if (loading) return null

  return (
    <div className="py-2 mx-3.5">
      <div className="between-row text-p-text py-1">
        {/* start time */}
        <div className="text-sm ">{startTime()}</div>
        <div className="text-sm ">{endTime()}</div>
      </div>
      <div className="flex relative" ref={containerRef}>
        {thumbnails.map((thumbnail, index) => (
          <div
            key={index}
            className={clsx(
              'flex-grow flex-shrink overflow-hidden',
              index === 0 && 'rounded-l-lg',
              index === thumbnails.length - 1 && 'rounded-r-lg'
            )}
          >
            <img
              src={thumbnail}
              alt={`Thumbnail ${index}`}
              className={clsx(
                'w-full h-20 object-cover image-unselectable block'
              )}
              onError={(e) => {
                // @ts-ignore
                e.target.onerror = null // Prevents infinite looping in case the fallback image also fails to load
                // @ts-ignore
                e.target.src = THUMBNAIL_FALLBACK // Replace with your default background image
              }}
            />
          </div>
        ))}

        {/* left background */}
        <div
          className="absolute top-0 h-full rounded-l-lg"
          style={{
            left: '0%',
            right: `${
              100 - (startPosition / (totalWidth || startPosition)) * 100
            }%`,
            backgroundColor: 'rgba(0, 0, 0, 0.7)'
          }}
        ></div>

        {/* right background */}
        <div
          className="absolute top-0 h-full rounded-r-lg"
          style={{
            left: `${((endPosition + 8) / (totalWidth || endPosition)) * 100}%`,
            right: '0%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)'
          }}
        ></div>

        {/* top line  */}
        <div
          className="absolute top-0 h-1 bg-brand"
          style={{
            left: `${
              (startPosition / (totalWidth || startPosition + 4)) * 100
            }%`,
            right: `${
              100 - ((endPosition + 9) / (totalWidth || endPosition)) * 100
            }%`
          }}
        ></div>

        {/* bottom line */}
        <div
          className="absolute bottom-0 h-1 bg-brand"
          style={{
            left: `${
              (startPosition / (totalWidth || startPosition + 4)) * 100
            }%`,
            right: `${
              100 - ((endPosition + 9) / (totalWidth || endPosition)) * 100
            }%`
          }}
        ></div>

        {/* progress white line */}
        <Draggable
          axis="x"
          bounds="parent"
          position={{ x: timeToLocation(progress), y: 0 }}
          onDrag={(e, data) => {
            if (!containerRef?.current?.offsetWidth) return
            const newProgress = data.x / containerRef.current.offsetWidth
            __controlsFunctions.requestSeek(newProgress * duration)
          }}
          onStop={() => {
            if (playing) {
              __controlsFunctions.togglePlay(false)
            }
          }}
        >
          <div
            className="absolute top-0 h-full w-1 bg-white"
            style={{
              cursor: 'ew-resize'
            }}
          />
        </Draggable>

        {/* start line  */}
        <Draggable
          axis="x"
          bounds="parent"
          position={{ x: startPosition, y: 0 }}
          onDrag={(e, data) => {
            if (!containerRef?.current?.offsetWidth) return
            if (data.x < endPosition + 8) {
              setStartPosition(data.x)
            }
          }}
        >
          <div className="absolute top-0 h-full bg-transparent">
            <div
              className="h-full w-2  bg-brand rounded-l-lg centered-row  transform -translate-x-2"
              style={{
                cursor: 'ew-resize'
              }}
            >
              <div className="bg-white w-[2px] h-8" />
            </div>
          </div>
        </Draggable>

        {/* end line */}
        <Draggable
          axis="x"
          bounds="parent"
          position={{ x: endPosition, y: 0 }}
          onDrag={(e, data) => {
            if (!containerRef?.current?.offsetWidth) return
            if (data.x + 8 > startPosition) {
              setEndPosition(data.x)
            }
          }}
        >
          <div className="absolute top-0 h-full bg-transparent ">
            <div
              className="h-full w-2  bg-brand rounded-r-lg centered-row transform translate-x-2"
              style={{
                cursor: 'ew-resize'
              }}
            >
              <div className="bg-white w-[2px] h-8" />
            </div>
          </div>
        </Draggable>
      </div>
    </div>
  )
}

export default memo(VideoClipper)
