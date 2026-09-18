import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface MatchScoreProps {
  value: number
  className?: string
  delay?: number
}

/**
 * Phase 4 — Supportive Match Score
 *
 * Formatted as:
 *    90%
 *   TASTE MATCH
 *
 * Smooth count-up from 0 to calculated value over 900ms.
 * De-escalated so it supports the recommendation rather than dominating it.
 */
export default function MatchScore({ value, className = '', delay = 0.4 }: MatchScoreProps) {
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(reduceMotion ? value : 0)

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value)
      return
    }

    const duration = 950
    let start: number | null = null
    let frame: number

    // Delay start until entrance begins
    const timeout = setTimeout(() => {
      const tick = (now: number) => {
        if (start === null) start = now
        const progress = Math.min((now - start) / duration, 1)
        // Cubic ease-out
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(Math.round(eased * value))
        if (progress < 1) {
          frame = requestAnimationFrame(tick)
        }
      }
      frame = requestAnimationFrame(tick)
    }, delay * 1000)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(frame)
    }
  }, [value, delay, reduceMotion])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`inline-flex flex-col items-start ${className}`}
    >
      <div className="flex items-baseline gap-0.5">
        <span className="font-display font-light text-3xl sm:text-4xl text-ivory tabular-nums leading-none">
          {display}
        </span>
        <span className="text-gold-light text-lg sm:text-xl font-light leading-none">%</span>
      </div>
      <span className="text-[10px] sm:text-[11px] uppercase tracking-widest2 text-stone/85 font-mono mt-1 block">
        Taste Match
      </span>
    </motion.div>
  )
}
