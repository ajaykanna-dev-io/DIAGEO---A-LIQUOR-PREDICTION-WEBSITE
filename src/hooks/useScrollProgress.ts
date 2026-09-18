import { useRef } from 'react'
import { useScroll, useTransform, type MotionValue } from 'framer-motion'

interface ScrollProgressOptions {
  /** How much to offset the start trigger (0 = element enters viewport bottom, 1 = top) */
  offset?: [string, string]
}

interface ScrollProgressResult {
  ref: React.RefObject<HTMLElement>
  scrollYProgress: MotionValue<number>
  /** Parallax y-transform: slower movement for background depth effect */
  parallaxY: MotionValue<string>
  /** Subtle scale that increases as element scrolls into view */
  parallaxScale: MotionValue<number>
  /** Opacity that fades in as element enters viewport */
  fadeIn: MotionValue<number>
}

/**
 * Custom hook for scroll-linked parallax values.
 * Returns motion values for parallax translation, scale, and opacity.
 */
export function useScrollProgress(options: ScrollProgressOptions = {}): ScrollProgressResult {
  const ref = useRef<HTMLElement>(null!)
  const { offset = ['start end', 'end start'] } = options

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as any,
  })

  // Parallax: move background at 30% of scroll speed (subtle depth)
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  // Scale: subtle 1.0 → 1.06 as element scrolls through viewport
  const parallaxScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.04, 1, 1.04])
  // Fade in as element enters viewport
  const fadeIn = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  return { ref, scrollYProgress, parallaxY, parallaxScale, fadeIn }
}
