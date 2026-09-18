import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import BottleGlyph from './BottleGlyph'
import type { Spirit } from '@/types'

interface BottleRevealProps {
  spirit: Spirit
  className?: string
  priority?: boolean
}

/**
 * Phase 3 — Cinematic Bottle Reveal
 *
 * Bottle is the primary visual hero asset:
 * - Significantly increased visual prominence (520px–600px on desktop)
 * - Studio product photography with natural contact shadow & subtle floor reflection
 * - Animation:
 *     opacity: 0 → 1
 *     scale: 1.08 → 1
 *     blur: 10px → 0
 *     translateY: 20px → 0
 * - Refined easing [0.16, 1, 0.3, 1] over 1000ms
 * - Atmospheric spotlight/glow behind the bottle
 * - Single subtle light sweep across the bottle during reveal
 * - No continuous rotation
 */
export default function BottleReveal({ spirit, className = '' }: BottleRevealProps) {
  const reduceMotion = useReducedMotion()
  const [imgError, setImgError] = useState(false)
  const hasPhoto = Boolean(spirit.image) && !imgError

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Atmospheric spotlight behind bottle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        {/* Deep warm amber/gold atmospheric halo */}
        <div className="w-[360px] md:w-[480px] h-[460px] md:h-[580px] rounded-full bg-gradient-to-t from-gold/[0.12] via-gold/[0.04] to-transparent blur-[70px] -translate-y-6" />
        {/* Soft core glow */}
        <div className="w-[180px] md:w-[240px] h-[260px] md:h-[340px] rounded-full bg-amber-600/[0.06] blur-[50px]" />
      </motion.div>

      {/* Main hero bottle presentation */}
      <motion.div
        initial={
          reduceMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 1.08, filter: 'blur(10px)', y: 20 }
        }
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center justify-center"
      >
        {hasPhoto ? (
          <div className="relative group select-none">
            {/* Contact shadow on surface */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/80 rounded-full blur-[14px] pointer-events-none" />

            {/* High-resolution photographic bottle */}
            <img
              src={spirit.image}
              alt={spirit.fullName}
              onError={() => setImgError(true)}
              className="relative z-10 h-[260px] sm:h-[360px] md:h-[440px] lg:h-[500px] xl:h-[520px] max-h-[52vh] sm:max-h-[58vh] w-auto max-w-full object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] filter brightness-[1.02] contrast-[1.03]"
            />

            {/* Subtle floor reflection fade */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-12 bg-gradient-to-b from-black/40 to-transparent blur-[6px] pointer-events-none" />

            {/* Single delicate light sweep across the bottle */}
            {!reduceMotion && (
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none z-20"
                aria-hidden="true"
              >
                <div className="bottle-light-sweep absolute inset-0 bg-gradient-to-r from-transparent via-ivory/[0.07] to-transparent opacity-80" />
              </div>
            )}
          </div>
        ) : (
          <div className="relative flex items-center justify-center">
            <BottleGlyph
              hue={spirit.glyphHue}
              className="relative z-10 h-[380px] sm:h-[440px] md:h-[520px] drop-shadow-[0_30px_45px_rgba(0,0,0,0.85)]"
            />
            {/* Single light sweep */}
            {!reduceMotion && (
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none z-20 flex items-center justify-center"
                aria-hidden="true"
              >
                <div className="relative h-[380px] sm:h-[440px] md:h-[520px] w-32 overflow-hidden">
                  <div className="bottle-light-sweep absolute inset-0 bg-gradient-to-r from-transparent via-ivory/[0.08] to-transparent" />
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}
