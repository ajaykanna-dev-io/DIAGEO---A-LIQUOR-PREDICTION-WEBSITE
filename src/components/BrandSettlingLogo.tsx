import { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface BrandSettlingLogoProps {
  className?: string
  subtitle?: string
}

/**
 * BrandSettlingLogo
 *
 * Cinematic brand introduction for DIAGEO Haute Distillerie:
 * 1. Upon entering a page, "DIAGEO" appears with prominent scale & gold shimmer in the upper-center viewport.
 * 2. Remains in focus for a moment (~1s) so the user absorbs and remembers the brand identity.
 * 3. Gracefully glides, scales down, and settles smoothly into its exact navbar anchor position.
 * 4. Resets to interactive navigation link with luxury hover effects once docked.
 */
export default function BrandSettlingLogo({
  className = '',
  subtitle = 'Haute Distillerie',
}: BrandSettlingLogoProps) {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const anchorRef = useRef<HTMLAnchorElement>(null)

  // Animation lifecycle: 'measuring' -> 'intro' -> 'gliding' -> 'settled'
  const [phase, setPhase] = useState<'measuring' | 'intro' | 'gliding' | 'settled'>(
    reduceMotion ? 'settled' : 'measuring'
  )
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  // Whenever the page/route changes, trigger the brand settling sequence
  useLayoutEffect(() => {
    if (reduceMotion) {
      setPhase('settled')
      return
    }

    // Measure resting position in the navbar
    const calculateOffset = () => {
      if (!anchorRef.current) return
      const rect = anchorRef.current.getBoundingClientRect()
      const targetCenterX = rect.left + rect.width / 2
      const targetCenterY = rect.top + rect.height / 2

      const viewportCenterX = window.innerWidth / 2
      // Positioned majestically in the upper-third of the screen
      const viewportCenterY = Math.min(Math.max(window.innerHeight * 0.36, 180), 320)

      setOffset({
        x: viewportCenterX - targetCenterX,
        y: viewportCenterY - targetCenterY,
      })
      setPhase('intro')
    }

    // Small frame wait for layout stabilization
    const frame = requestAnimationFrame(calculateOffset)
    return () => cancelAnimationFrame(frame)
  }, [location.pathname, reduceMotion])

  useEffect(() => {
    if (phase !== 'intro') return

    // Hold at center for ~950ms so user clearly registers the brand name
    const introTimer = setTimeout(() => {
      setPhase('gliding')
    }, 950)

    return () => clearTimeout(introTimer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'gliding') return

    // Glides smoothly over 1100ms, then becomes settled
    const glideTimer = setTimeout(() => {
      setPhase('settled')
    }, 1150)

    return () => clearTimeout(glideTimer)
  }, [phase])

  const isIntro = phase === 'intro'
  const isGliding = phase === 'gliding'
  const isAnimating = isIntro || isGliding
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false

  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Anchor container in the navbar (maintains layout footprint) */}
      <Link
        ref={anchorRef}
        to="/"
        className="relative group inline-flex flex-col items-start focus:outline-none"
        aria-label="DIAGEO - Return to homepage"
      >
        {/* The Animated / Settled DIAGEO Brand Mark */}
        <motion.div
          animate={
            isIntro
              ? {
                  x: offset.x,
                  y: offset.y,
                  scale: isMobile ? 1.7 : 2.2,
                  letterSpacing: '0.38em',
                  opacity: 1,
                }
              : isGliding
              ? {
                  x: 0,
                  y: 0,
                  scale: 1,
                  letterSpacing: '0.2em',
                  opacity: 1,
                }
              : {
                  x: 0,
                  y: 0,
                  scale: 1,
                  letterSpacing: '0.2em',
                  opacity: 1,
                }
          }
          initial={
            reduceMotion
              ? false
              : {
                  x: offset.x,
                  y: offset.y,
                  scale: isMobile ? 1.6 : 2.0,
                  letterSpacing: '0.28em',
                  opacity: 0,
                }
          }
          transition={{
            duration: isIntro ? 0.45 : 1.15,
            ease: [0.16, 1, 0.3, 1], // Haute luxury silky deceleration
          }}
          className={`relative z-50 select-none flex flex-col items-center ${
            isAnimating ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
          style={{ transformOrigin: 'center center' }}
        >
          {/* Luminous Ambient Halo during the intro display */}
          <AnimatePresence>
            {isIntro && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1.15 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="pointer-events-none absolute -inset-16 -z-10 rounded-full blur-2xl"
                style={{
                  background:
                    'radial-gradient(circle, rgba(198,161,91,0.32) 0%, rgba(198,161,91,0.08) 55%, transparent 75%)',
                }}
              />
            )}
          </AnimatePresence>

          {/* Golden Shimmer Sheen Text */}
          <motion.span
            className="font-display text-xl sm:text-2xl font-light tracking-[0.2em] transition-opacity duration-300 group-hover:opacity-85"
            style={{
              backgroundImage: isIntro
                ? 'linear-gradient(115deg, #FAF7F2 15%, #FFE9B8 45%, #C6A15B 55%, #FAF7F2 85%)'
                : undefined,
              backgroundSize: isIntro ? '220% 100%' : undefined,
              WebkitBackgroundClip: isIntro ? 'text' : undefined,
              WebkitTextFillColor: isIntro ? 'transparent' : '#FAF7F2',
            }}
            animate={
              isIntro
                ? {
                    backgroundPosition: ['100% 0%', '0% 0%'],
                  }
                : {}
            }
            transition={{ duration: 1.0, ease: 'easeInOut' }}
          >
            DIAGEO
          </motion.span>

          {/* Subtitle tag beneath DIAGEO during intro display */}
          <AnimatePresence>
            {isIntro && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="flex items-center gap-2 mt-1.5 pointer-events-none"
              >
                <span className="w-1 h-1 rounded-full bg-gold/70" />
                <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.45em] text-gold-light/90 whitespace-nowrap">
                  {subtitle}
                </span>
                <span className="w-1 h-1 rounded-full bg-gold/70" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Link>
    </div>
  )
}
