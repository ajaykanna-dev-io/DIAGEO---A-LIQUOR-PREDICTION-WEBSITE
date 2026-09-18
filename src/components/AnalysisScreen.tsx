import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import type { Spirit, TasteProfile } from '@/types'

interface AnalysisScreenProps {
  onComplete: () => void
  spirit?: Spirit
  profile?: TasteProfile
}

type TransitionPhase =
  | 'answers'      // 0.0s – 1.0s (~1.0s): COMPLETION — "YOUR ANSWERS" in obsidian darkness
  | 'transition'   // 1.0s – 2.0s (~1.0s): TRANSITION — Tiny warm champagne point of light brightens
  | 'reading'      // 2.0s – 3.3s (~1.3s): SENSORY INTERPRETATION — "READING YOUR TASTE" + staggered atmospheric taste fragments
  | 'visual_build' // 3.3s – 4.3s (~1.0s): VISUAL BUILD — Quiet darkness, light gently breathes & expands
  | 'anticipation' // 4.3s – 5.4s (~1.1s): ANTICIPATION — "YOUR TASTE IS TAKING SHAPE" in large editorial serif
  | 'pre_reveal'   // 5.4s – 6.4s (~1.0s): REVELATION CUE — "YOUR TASTE PROFILE" + archetype name

export default function AnalysisScreen({ onComplete, spirit, profile }: AnalysisScreenProps) {
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState<TransitionPhase>('answers')

  // Extract sensory words strictly from user's matched spirit descriptors and top profile dimensions
  const sensoryWords = useMemo(() => {
    const list: string[] = []
    if (spirit?.descriptors) {
      list.push(...spirit.descriptors.map((d) => d.toUpperCase()))
    }
    if (profile) {
      const topKeys = (Object.keys(profile) as (keyof TasteProfile)[])
        .sort((a, b) => profile[b] - profile[a])
        .slice(0, 3)
      const attrMap: Record<keyof TasteProfile, string> = {
        complexity: 'COMPLEX',
        smoothness: 'SMOOTH',
        intensity: 'RICH',
        sweetness: 'SWEET',
        smokiness: 'WOODY',
      }
      topKeys.forEach((k) => {
        const val = attrMap[k]
        if (!list.includes(val)) list.push(val)
      })
    }
    // High-end cellar palette fallbacks
    const fallback = ['SMOOTH', 'WARM', 'WOODY', 'RICH', 'COMPLEX', 'REFINED', 'FRESH', 'SWEET']
    fallback.forEach((w) => {
      if (list.length < 5 && !list.includes(w)) list.push(w)
    })
    return list.slice(0, 5)
  }, [spirit, profile])

  const archetype = spirit?.archetype || 'THE EXPLORER'

  useEffect(() => {
    if (reduceMotion) {
      const timer = setTimeout(() => onComplete(), 1400)
      return () => clearTimeout(timer)
    }

    // Choreographed ~1 second per phase timeline (total: 6.4s)
    // 0.0s – 1.0s: answers
    // 1.0s – 2.0s: transition
    // 2.0s – 3.3s: reading (sensory fragments)
    // 3.3s – 4.3s: visual_build (quiet darkness & light breathing)
    // 4.3s – 5.4s: anticipation (your taste is taking shape)
    // 5.4s – 6.4s: pre_reveal (your taste profile)
    // 6.4s: onComplete -> result page
    const t1 = setTimeout(() => setPhase('transition'), 1000)
    const t2 = setTimeout(() => setPhase('reading'), 2000)
    const t3 = setTimeout(() => setPhase('visual_build'), 3300)
    const t4 = setTimeout(() => setPhase('anticipation'), 4300)
    const t5 = setTimeout(() => setPhase('pre_reveal'), 5400)
    const t6 = setTimeout(() => onComplete(), 6400)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      clearTimeout(t6)
    }
  }, [onComplete, reduceMotion])

  // Reduced motion accessible fallback
  if (reduceMotion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-obsidian text-stone">
        <p className="text-xs uppercase tracking-[0.4em] text-stone/70 font-mono mb-4">
          Your Taste Profile
        </p>
        <h1 className="font-display font-light text-3xl md:text-5xl text-ivory tracking-tight mb-2">
          {archetype}
        </h1>
        <p className="text-xs uppercase tracking-[0.35em] text-gold-light font-mono mt-4">
          Revealing Your Curated Match
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden bg-obsidian select-none">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. MULTI-LAYERED ATMOSPHERIC LUXURY BACKDROP & AMBIENT AURA */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden="true">
        {/* Soft amber radial halo that breathes and deepens as anticipation builds */}
        <motion.div
          animate={{
            scale:
              phase === 'visual_build'
                ? 0.8
                : phase === 'anticipation' || phase === 'pre_reveal'
                ? 1.35
                : 1,
            opacity:
              phase === 'visual_build'
                ? 0.05
                : phase === 'anticipation' || phase === 'pre_reveal'
                ? 0.22
                : 0.12,
          }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-[540px] h-[540px] rounded-full bg-gradient-to-b from-gold/[0.16] via-amber-700/[0.03] to-transparent blur-[130px]"
        />
        {/* Subtle perimeter vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(8,8,10,0.85)_100%)]" />
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. CENTRAL WARM CHAMPAGNE LIGHT SOURCE (`·` -> `✦`) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden="true">
        <motion.div
          animate={{
            scale:
              phase === 'answers'
                ? 0.5
                : phase === 'transition'
                ? [0.85, 1.25, 0.95]
                : phase === 'reading'
                ? [0.95, 1.1, 0.95]
                : phase === 'visual_build'
                ? [1, 1.5, 1.15]
                : phase === 'anticipation'
                ? 1.35
                : 1.6,
            opacity:
              phase === 'answers'
                ? 0.2
                : phase === 'visual_build'
                ? 0.65
                : phase === 'anticipation' || phase === 'pre_reveal'
                ? 1
                : 0.9,
          }}
          transition={{
            duration:
              phase === 'visual_build'
                ? 0.9
                : phase === 'transition' || phase === 'reading'
                ? 1.3
                : 0.6,
            repeat: phase === 'transition' || phase === 'reading' ? Infinity : 0,
            ease: 'easeInOut',
          }}
          className="relative flex items-center justify-center z-10"
        >
          {/* Subtle soft glowing amber aura */}
          <div
            className={`absolute rounded-full bg-gold-light/25 blur-sm transition-all duration-700 ${
              phase === 'anticipation' || phase === 'pre_reveal'
                ? 'w-10 h-10 bg-gold-light/40'
                : 'w-4 h-4'
            }`}
          />

          {/* Point of Light: Delicate amber ember dot (·) evolving into a sparkling four-pointed star (✦) */}
          {phase === 'anticipation' || phase === 'pre_reveal' ? (
            <span className="text-gold-light text-xs sm:text-sm font-serif select-none drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]">
              ✦
            </span>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-gold-light select-none shadow-[0_0_8px_rgba(212,175,55,0.9)]" />
          )}
        </motion.div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. SENSORY WORDS (2.0s – 3.3s) — ASYMMETRIC ATMOSPHERIC FRAGMENTS */}
      {/* ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === 'reading' && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center max-w-5xl mx-auto">
            {/* Word 0: Upper Left */}
            {sensoryWords[0] && (
              <motion.div
                initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                animate={{
                  opacity: [0, 0.95, 0.95, 0],
                  y: [12, 0, -2, -12],
                  filter: ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(4px)'],
                }}
                transition={{
                  duration: 0.85,
                  delay: 0.05,
                  times: [0, 0.25, 0.75, 1],
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute top-[24%] left-[12%] sm:left-[20%] text-xs uppercase tracking-[0.35em] font-mono text-gold-light/90 flex items-center gap-1.5"
              >
                <span className="text-gold-light/50 text-[9px]">·</span>
                {sensoryWords[0]}
              </motion.div>
            )}

            {/* Word 1: Lower Right */}
            {sensoryWords[1] && (
              <motion.div
                initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                animate={{
                  opacity: [0, 0.9, 0.9, 0],
                  y: [12, 0, -2, -12],
                  filter: ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(4px)'],
                }}
                transition={{
                  duration: 0.85,
                  delay: 0.3,
                  times: [0, 0.25, 0.75, 1],
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute bottom-[28%] right-[12%] sm:right-[22%] text-xs uppercase tracking-[0.35em] font-mono text-stone/90 flex items-center gap-1.5"
              >
                <span className="text-gold-light/50 text-[9px]">·</span>
                {sensoryWords[1]}
              </motion.div>
            )}

            {/* Word 2: Upper Right */}
            {sensoryWords[2] && (
              <motion.div
                initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                animate={{
                  opacity: [0, 0.85, 0.85, 0],
                  y: [12, 0, -2, -12],
                  filter: ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(4px)'],
                }}
                transition={{
                  duration: 0.85,
                  delay: 0.55,
                  times: [0, 0.25, 0.75, 1],
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute top-[32%] right-[14%] sm:right-[24%] text-[11px] uppercase tracking-[0.35em] font-mono text-gold-light/80 flex items-center gap-1.5"
              >
                <span className="text-gold-light/50 text-[9px]">·</span>
                {sensoryWords[2]}
              </motion.div>
            )}

            {/* Word 3: Lower Left */}
            {sensoryWords[3] && (
              <motion.div
                initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                animate={{
                  opacity: [0, 0.85, 0.85, 0],
                  y: [12, 0, -2, -12],
                  filter: ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(4px)'],
                }}
                transition={{
                  duration: 0.85,
                  delay: 0.75,
                  times: [0, 0.25, 0.75, 1],
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute bottom-[22%] left-[14%] sm:left-[22%] text-[11px] uppercase tracking-[0.35em] font-mono text-stone/85 flex items-center gap-1.5"
              >
                <span className="text-gold-light/50 text-[9px]">·</span>
                {sensoryWords[3]}
              </motion.div>
            )}

            {/* Word 4: Center-Right Whisper */}
            {sensoryWords[4] && (
              <motion.div
                initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                animate={{
                  opacity: [0, 0.75, 0.75, 0],
                  y: [12, 0, -2, -12],
                  filter: ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(4px)'],
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.95,
                  times: [0, 0.25, 0.75, 1],
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute top-[58%] right-[28%] sm:right-[36%] text-[10px] uppercase tracking-[0.4em] font-mono text-stone/70 hidden sm:flex items-center gap-1.5"
              >
                <span className="text-gold-light/50 text-[9px]">·</span>
                {sensoryWords[4]}
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. EDITORIAL REVELATION TYPOGRAPHY (CHOREOGRAPHED ~1s PHASES) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="relative z-20 flex flex-col items-center max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Phase 1 (0.0s – 1.0s): YOUR ANSWERS */}
          {phase === 'answers' && (
            <motion.div
              key="phase-answers"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <span className="text-[10px] uppercase tracking-[0.45em] text-gold-light/70 font-mono mb-2">
                Discovery Complete
              </span>
              <h2 className="text-xs sm:text-sm uppercase tracking-[0.4em] text-ivory/90 font-mono font-light">
                Your Answers
              </h2>
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-gold-light/40 to-transparent mt-4" />
            </motion.div>
          )}

          {/* Phase 2 (1.0s – 2.0s): THE SEED OF LIGHT (Whisper status to sense data) */}
          {phase === 'transition' && (
            <motion.div
              key="phase-transition"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <p className="text-[10px] uppercase tracking-[0.38em] text-stone/50 font-mono">
                Harmonizing Palate Data
              </p>
            </motion.div>
          )}

          {/* Phase 3 (2.0s – 3.3s): READING YOUR TASTE */}
          {phase === 'reading' && (
            <motion.div
              key="phase-reading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <div className="overflow-hidden">
                <motion.span
                  initial={{ y: 22, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-xs uppercase tracking-[0.4em] text-gold-light font-mono mb-2"
                >
                  Reading
                </motion.span>
              </div>
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: 26, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display font-light text-3xl sm:text-4xl md:text-5xl text-ivory tracking-tight"
                >
                  Your Taste
                </motion.h1>
              </div>
            </motion.div>
          )}

          {/* Phase 4 (3.3s – 4.3s): VISUAL BUILD & QUIET DARKNESS (Forming Character) */}
          {phase === 'visual_build' && (
            <motion.div
              key="phase-visual-build"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <p className="text-[10px] uppercase tracking-[0.38em] text-stone/45 font-mono">
                Forming Character
              </p>
            </motion.div>
          )}

          {/* Phase 5 (4.3s – 5.4s): ANTICIPATION — "YOUR TASTE IS TAKING SHAPE" */}
          {phase === 'anticipation' && (
            <motion.div
              key="phase-anticipation"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <div className="overflow-hidden">
                <motion.p
                  initial={{ y: 22, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display font-light text-3xl sm:text-4xl md:text-5xl text-ivory tracking-tight mb-1"
                >
                  Your Taste
                </motion.p>
              </div>
              <div className="overflow-hidden">
                <motion.p
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display italic font-light text-2xl sm:text-3xl md:text-4xl text-gold-light tracking-normal"
                >
                  Is Taking Shape
                </motion.p>
              </div>
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-12 h-px bg-gradient-to-r from-transparent via-gold-light/50 to-transparent mt-4"
              />
            </motion.div>
          )}

          {/* Phase 6 (5.4s – 6.4s): REVELATION CUE — "YOUR TASTE PROFILE" */}
          {phase === 'pre_reveal' && (
            <motion.div
              key="phase-pre-reveal"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1 h-1 rounded-full bg-gold-light" />
                <span className="text-[11px] uppercase tracking-[0.4em] text-gold-light/90 font-mono">
                  Your Taste Profile
                </span>
                <span className="w-1 h-1 rounded-full bg-gold-light" />
              </div>
              <h2 className="font-display font-light text-3xl sm:text-5xl md:text-6xl text-ivory tracking-wide mb-3">
                {archetype}
              </h2>
              <span className="text-[10px] uppercase tracking-widest2 text-stone/60 font-mono">
                Curated Selection
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
