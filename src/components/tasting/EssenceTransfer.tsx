import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { QuestionOption } from '@/types'

interface EssenceTransferProps {
  activeOption: QuestionOption | null
  fromElementRect: DOMRect | null
  toElementRect: DOMRect | null
  onComplete: () => void
}

/**
 * EssenceTransfer
 * Cinematic trajectory animation rendering the selected essence vapor & luminous particles
 * traveling from the chosen sensory vessel across the distillery chamber into the central Spirit DNA.
 */
export default function EssenceTransfer({
  activeOption,
  fromElementRect,
  toElementRect,
  onComplete,
}: EssenceTransferProps) {
  const reduceMotion = useReducedMotion()
  const completedRef = useRef(false)

  useEffect(() => {
    if (!activeOption || !fromElementRect || !toElementRect) return

    completedRef.current = false
    const duration = reduceMotion ? 100 : 850
    const timer = setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true
        onComplete()
      }
    }, duration)

    return () => clearTimeout(timer)
  }, [activeOption, fromElementRect, toElementRect, onComplete, reduceMotion])

  if (
    !activeOption ||
    !fromElementRect ||
    !toElementRect ||
    reduceMotion ||
    !Number.isFinite(fromElementRect.left) ||
    !Number.isFinite(fromElementRect.top) ||
    !Number.isFinite(toElementRect.left) ||
    !Number.isFinite(toElementRect.top) ||
    fromElementRect.width <= 0 ||
    toElementRect.width <= 0
  ) {
    return null
  }

  // Calculate start and end coordinates
  const startX = fromElementRect.left + fromElementRect.width / 2
  const startY = fromElementRect.top + fromElementRect.height / 2
  const endX = toElementRect.left + toElementRect.width / 2
  const endY = toElementRect.top + toElementRect.height / 2

  if (
    !Number.isFinite(startX) ||
    !Number.isFinite(startY) ||
    !Number.isFinite(endX) ||
    !Number.isFinite(endY)
  ) {
    return null
  }

  // Curved quadratic / cubic control point
  const midX = (startX + endX) / 2
  const midY = Math.min(startY, endY) - 80

  const pathD = `M ${Math.round(startX)} ${Math.round(startY)} Q ${Math.round(midX)} ${Math.round(midY)} ${Math.round(endX)} ${Math.round(endY)}`

  // Sample points along the quadratic curve B(t)
  const steps = [0, 0.2, 0.4, 0.6, 0.8, 1.0]
  const cxPoints = steps.map(
    (t) => (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * endX
  )
  const cyPoints = steps.map(
    (t) => (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * midY + t * t * endY
  )

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    >
      <svg className="w-full h-full">
        <defs>
          <linearGradient id="essenceStream" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              stopColor={`hsla(${activeOption.hue}, 80%, 75%, 0.9)`}
            />
            <stop
              offset="70%"
              stopColor={`hsla(${activeOption.hue}, 65%, 55%, 0.6)`}
            />
            <stop offset="100%" stopColor="#C6A15B" stopOpacity="0.1" />
          </linearGradient>

          <filter id="streamGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Guiding Curved Vapor Trail */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#essenceStream)"
          strokeWidth="2.5"
          filter="url(#streamGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Lead Essence Particle Orb */}
        <motion.circle
          r="6"
          fill="#FFFFFF"
          stroke={`hsla(${activeOption.hue}, 70%, 60%, 0.8)`}
          strokeWidth="2"
          filter="url(#streamGlow)"
          initial={{ cx: startX, cy: startY, opacity: 1 }}
          animate={{ cx: cxPoints, cy: cyPoints, opacity: [1, 1, 0] }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Secondary trailing sparkles */}
        {[0.08, 0.16, 0.24].map((delay, i) => (
          <motion.circle
            key={i}
            r="3"
            fill={`hsla(${activeOption.hue}, 85%, 80%, 0.7)`}
            initial={{ cx: startX, cy: startY, opacity: 0.8 }}
            animate={{ cx: cxPoints, cy: cyPoints, opacity: [0.8, 0.6, 0] }}
            transition={{
              duration: 0.7,
              delay,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        ))}
      </svg>
    </div>
  )
}
