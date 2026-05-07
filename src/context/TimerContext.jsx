import { createContext, useContext, useState, useEffect, useRef } from 'react'

const TimerContext = createContext()

// Total test duration: 2 hours (7200 seconds)
const TOTAL_SECONDS = 7200

export function TimerProvider({ children }) {
  // Initialize from localStorage so timer survives full page refresh too
  const [seconds, setSeconds] = useState(() => {
    const saved = localStorage.getItem('hackerearth_timer_end')
    if (saved) {
      const remaining = Math.round((Number(saved) - Date.now()) / 1000)
      return remaining > 0 ? remaining : 0
    }
    // First visit — set the end time
    const endTime = Date.now() + TOTAL_SECONDS * 1000
    localStorage.setItem('hackerearth_timer_end', String(endTime))
    return TOTAL_SECONDS
  })

  const intervalRef = useRef(null)

  useEffect(() => {
    // Use the persisted end time for accuracy (avoids drift)
    const endTime = Number(localStorage.getItem('hackerearth_timer_end'))

    const tick = () => {
      const remaining = Math.round((endTime - Date.now()) / 1000)
      setSeconds(remaining > 0 ? remaining : 0)
      if (remaining <= 0) {
        clearInterval(intervalRef.current)
      }
    }

    intervalRef.current = setInterval(tick, 1000)
    return () => clearInterval(intervalRef.current)
  }, [])

  const h = String(Math.floor(seconds / 3600)).padStart(2, '0')
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')

  const formatted = `${h}:${m}:${s}`
  const isExpired = seconds <= 0
  const isWarning = seconds > 0 && seconds <= 300 // last 5 minutes

  return (
    <TimerContext.Provider value={{ seconds, formatted, isExpired, isWarning }}>
      {children}
    </TimerContext.Provider>
  )
}

export function useTimer() {
  const ctx = useContext(TimerContext)
  if (!ctx) throw new Error('useTimer must be used within a TimerProvider')
  return ctx
}
