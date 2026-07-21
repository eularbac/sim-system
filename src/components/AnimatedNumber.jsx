import { useEffect, useRef, useState } from 'react'

/**
 * Counts up from 0 to `value` whenever `value` changes.
 * Respects prefers-reduced-motion by jumping straight to the final value.
 */
export default function AnimatedNumber({ value, duration = 700, format }) {
  const [display, setDisplay] = useState(0)
  const frameRef = useRef(null)

  useEffect(() => {
    const target = Number(value) || 0
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      setDisplay(target)
      return
    }

    const start = performance.now()
    const from = 0

    function tick(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setDisplay(from + (target - from) * eased)
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        setDisplay(target)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [value, duration])

  const rounded = Math.round(display)
  return <>{format ? format(rounded) : rounded}</>
}
