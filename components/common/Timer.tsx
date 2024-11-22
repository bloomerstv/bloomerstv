import React, { useEffect, useState } from 'react'

type TimerProps = {
  targetDate: string | number // Date string, epoch milliseconds, or seconds
  renderer: (timeElapsed: {
    days: number
    hours: number
    minutes: number
    seconds: number
  }) => React.ReactNode // Custom render function
}

const Timer: React.FC<TimerProps> = ({ targetDate, renderer }) => {
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const calculateTimeElapsed = () => {
      const now = Date.now()
      let target: number

      if (typeof targetDate === 'string') {
        target = new Date(targetDate).getTime()
      } else if (targetDate.toString().length === 10) {
        // Seconds
        target = targetDate * 1000
      } else {
        // Milliseconds
        target = targetDate
      }

      const difference = now - target

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / (1000 * 60)) % 60)
      const seconds = Math.floor((difference / 1000) % 60)

      setTimeElapsed({ days, hours, minutes, seconds })
    }

    const intervalId = setInterval(calculateTimeElapsed, 1000)
    calculateTimeElapsed()

    return () => clearInterval(intervalId)
  }, [targetDate])

  return <>{renderer(timeElapsed)}</>
}

export default Timer
