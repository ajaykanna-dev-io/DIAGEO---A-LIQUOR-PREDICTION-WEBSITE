import { useEffect, useState, useRef } from 'react'
import { motion, useReducedMotion, useInView } from 'framer-motion'
import type { TasteProfile } from '@/types'

interface TasteProfileBarsProps {
  profile: TasteProfile
  title?: string
}

interface AttributeItem {
  key: keyof TasteProfile
  label: string
}

const attributes: AttributeItem[] = [
  { key: 'smoothness', label: 'SMOOTH' },
  { key: 'complexity', label: 'WARM' },
  { key: 'smokiness', label: 'WOODY' },
  { key: 'intensity', label: 'SPICE' },
  { key: 'sweetness', label: 'SWEET' },
]

/**
 * Phase 7 — Flavor Signature
 *
 * Editorial layout:
 *    SMOOTH   ━━━━━━━━━━━━━━━  86%
 *    WARM     ━━━━━━━━━━━      72%
 *    WOODY    ━━━━━━━━━        64%
 *    SPICE    ━━━━━━━          48%
 *    SWEET    ━━━━━            42%
 *
 * Viewport-triggered staggered reveal over 900ms.
 * Luxurious gold accents, editorial typography.
 */
export default function TasteProfileBars({ profile }: TasteProfileBarsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, {
    amount: 0.2,
    once: false,
  })

  return (
    <div ref={containerRef} className="flex flex-col gap-6 md:gap-7 w-full">
      {attributes.map((item, i) => (
        <SignatureRow
          key={item.key}
          label={item.label}
          value={profile[item.key]}
          delay={i * 0.09}
          animate={isInView}
        />
      ))}
    </div>
  )
}

function SignatureRow({
  label,
  value,
  delay,
  animate,
}: {
  label: string
  value: number
  delay: number
  animate: boolean
}) {
  const reduceMotion = useReducedMotion()
  const [displayValue, setDisplayValue] = useState(reduceMotion ? value : 0)

  useEffect(() => {
    if (reduceMotion) {
      setDisplayValue(value)
      return
    }

    if (!animate) {
      setDisplayValue(0)
      return
    }

    setDisplayValue(0)
    let frame: number | undefined
    const duration = 1200 // Mild, silky deceleration pace

    const timeout = setTimeout(() => {
      const start = performance.now()

      const tick = (now: number) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        // Gentle cubic deceleration: silky and mild
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayValue(Math.round(eased * value))
        if (progress < 1) {
          frame = requestAnimationFrame(tick)
        }
      }
      frame = requestAnimationFrame(tick)
    }, delay * 1000)

    return () => {
      clearTimeout(timeout)
      if (frame !== undefined) cancelAnimationFrame(frame)
    }
  }, [animate, value, delay, reduceMotion])

  return (
    <div className="group flex items-center gap-4 sm:gap-6 py-1">
      {/* Label: Fixed width editorial typography */}
      <span className="text-xs uppercase tracking-[0.2em] text-stone/80 font-mono w-20 sm:w-24 flex-shrink-0 group-hover:text-gold-light transition-colors duration-300">
        {label}
      </span>

      {/* Bar Track & Animated Value Fill */}
      <div className="relative flex-1 h-[3px] bg-white/[0.08] rounded-full overflow-visible">
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={animate ? { width: `${value}%`, opacity: 1 } : { width: '0%', opacity: 0 }}
          transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full bg-gradient-to-r from-gold/30 via-gold to-gold-light rounded-full shadow-[0_0_10px_rgba(198,161,91,0.4)]"
        >
          {/* Mild radiant trailing gold indicator pip */}
          <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-gold-light shadow-[0_0_10px_rgba(230,202,133,0.9)] border border-[#0d0c0a]" />
        </motion.div>
      </div>

      {/* Value: Editorial serif count-up */}
      <span className="font-display font-light text-sm sm:text-base text-ivory/95 tabular-nums w-12 text-right flex-shrink-0 tracking-wider">
        {displayValue}%
      </span>
    </div>
  )
}
