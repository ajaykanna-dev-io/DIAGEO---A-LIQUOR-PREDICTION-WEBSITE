import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ParallaxImageProps {
  src: string
  alt?: string
  /** Parallax speed: 0 = no movement, 1 = full scroll, negative = reverse. Default 0.3 */
  speed?: number
  /** Dark overlay opacity 0–1. Default 0.65 */
  overlay?: number
  /** Optional overlay gradient direction. Default 'to bottom' */
  gradientDirection?: string
  className?: string
}

/**
 * A full-bleed parallax background image.
 * The image moves at a slower rate than the scroll, creating cinematic depth.
 * A dark overlay ensures foreground content remains readable.
 */
export default function ParallaxImage({
  src,
  alt = '',
  speed = 0.3,
  overlay = 0.65,
  gradientDirection = 'to bottom',
  className = '',
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Translate the image by ±(speed * 20)% based on scroll position
  const range = speed * 20
  const y = useTransform(scrollYProgress, [0, 1], [`-${range}%`, `${range}%`])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.05, 1.1])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y, scale }}
      >
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </motion.div>

      {/* Dark gradient overlay for readability */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${gradientDirection}, rgba(11,11,10,${overlay}) 0%, rgba(11,11,10,${Math.min(overlay + 0.15, 0.95)}) 50%, rgba(11,11,10,${overlay}) 100%)`,
        }}
      />
    </div>
  )
}
