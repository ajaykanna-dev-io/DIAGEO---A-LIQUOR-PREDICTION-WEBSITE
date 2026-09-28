import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Spirit, Answers } from '@/types'
import SensoryConstellation, { type SensoryNodeItem } from './SensoryConstellation'

export type { SensoryNodeItem }

export interface CinematicRevealProps {
  result: Spirit
  answers?: Answers
  sensoryNotes?: string[]
  noteCount?: number
  onComplete: () => void
  onRevealStart?: () => void
}

/**
 * Derives dynamic luxury sensory notes from the user's matched spirit
 * and quiz choices. Supports dynamic counts from 3 to 7 notes.
 */
export function getDynamicSensoryNotes(
  spirit: Spirit,
  answers?: Answers,
  customNotes?: string[],
  count: number = 5
): SensoryNodeItem[] {
  // Available curated sensory orb assets matching the reference image
  const library: Record<string, { id: string; label: string; sublabel?: string; image: string }> = {
    citrus: {
      id: 'citrus',
      label: 'CITRUS',
      sublabel: 'Orange Zest',
      image: '/images/sensory/sensory-citrus.jpg',
    },
    vanilla: {
      id: 'vanilla',
      label: 'VANILLA',
      sublabel: 'Cream & Pods',
      image: '/images/sensory/sensory-vanilla.jpg',
    },
    oak: {
      id: 'oak',
      label: 'OAK',
      sublabel: 'Charred Cask',
      image: '/images/sensory/sensory-oak.jpg',
    },
    fruit: {
      id: 'fruit',
      label: 'DRIED FRUITS',
      sublabel: 'Dates & Raisins',
      image: '/images/sensory/sensory-fruit.jpg',
    },
    spice: {
      id: 'spice',
      label: 'SPICE',
      sublabel: 'Cinnamon & Star Anise',
      image: '/images/sensory/sensory-spice.jpg',
    },
    smoke: {
      id: 'smoke',
      label: 'PEAT SMOKE',
      sublabel: 'Highland Embers',
      image: '/images/sensory/sensory-smoke.jpg',
    },
    honey: {
      id: 'honey',
      label: 'HEATHER HONEY',
      sublabel: 'Golden Amber Nectar',
      image: '/images/orbs/orb-3.jpg',
    },
  }

  // If explicitly provided custom notes, map them
  if (customNotes && customNotes.length > 0) {
    const libraryKeys = Object.keys(library)
    return customNotes.map((name, idx) => {
      const lower = name.toLowerCase()
      const matchKey = libraryKeys.find(
        (k) => lower.includes(k) || library[k].label.toLowerCase().includes(lower)
      )
      if (matchKey) {
        return {
          ...library[matchKey],
          id: `${library[matchKey].id}-${idx}`,
          label: name.toUpperCase(),
        }
      }
      const fallbackItem = library[libraryKeys[idx % libraryKeys.length]]
      return {
        id: `custom-note-${idx}`,
        label: name.toUpperCase(),
        sublabel: fallbackItem.sublabel,
        image: fallbackItem.image,
      }
    })
  }

  // Determine ranking based on spirit tasting notes & quiz responses
  const rawNotes = [...(spirit.tastingNotes || []), ...(spirit.descriptors || [])]
  const noteText = rawNotes.join(' ').toLowerCase()
  const scores: Record<string, number> = {
    citrus: 2,
    vanilla: 3,
    oak: 3,
    fruit: 2,
    spice: 2,
    smoke: 1,
    honey: 1,
  }

  if (/oak|wood|cask|cedar|char|barrel/.test(noteText)) scores.oak += 5
  if (/vanilla|cream|toffee|caramel|butter|sweet/.test(noteText)) scores.vanilla += 5
  if (/citrus|orange|lemon|zest|herb|botanical|fresh/.test(noteText)) scores.citrus += 5
  if (/spice|pepper|cinnamon|ginger|clove|nutmeg|capsaicin/.test(noteText)) scores.spice += 5
  if (/fruit|apple|berry|raisin|date|plum|pear|fig|stewed/.test(noteText)) scores.fruit += 5
  if (/smoke|peat|ember|charred|brine|salt|maritime/.test(noteText)) scores.smoke += 5
  if (/honey|heather|amber|nectar|floral/.test(noteText)) scores.honey += 5

  // Factor in answers if provided
  if (answers) {
    if (answers['burntWood'] && parseInt(answers['burntWood'].slice(-1)) >= 3) {
      scores.smoke += 3
      scores.oak += 3
    }
    if (answers['cinnamon'] && parseInt(answers['cinnamon'].slice(-1)) >= 3) {
      scores.spice += 4
    }
    if (answers['appleCooked'] && parseInt(answers['appleCooked'].slice(-1)) >= 3) {
      scores.fruit += 4
    }
    if (answers['coconut'] || answers['lassi']) {
      scores.vanilla += 3
    }
    if (answers['lemongrass']) {
      scores.citrus += 3
    }
  }

  // Sort categories by score descending
  const sortedKeys = (Object.keys(scores) as Array<keyof typeof library>).sort(
    (a, b) => scores[b] - scores[a]
  )

  // Target count: supports 3, 4, 5, 6, 7 notes dynamically
  const targetCount = Math.max(3, Math.min(7, count))
  const selectedKeys = sortedKeys.slice(0, targetCount)

  return selectedKeys.map((key) => library[key])
}

/**
 * Canvas particle smoke simulation
 * Renders smooth, upward-drifting amber/cream mist around the central whisky glass.
 */
function SmokeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', handleResize)

    // Particle pool
    const particleCount = 28
    const particles = Array.from({ length: particleCount }, () => ({
      x: width * 0.5 + (Math.random() - 0.5) * 120,
      y: height * 0.58 + Math.random() * 80,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(0.55 + Math.random() * 0.75),
      radius: 25 + Math.random() * 45,
      maxRadius: 75 + Math.random() * 55,
      alpha: 0,
      maxAlpha: 0.08 + Math.random() * 0.12,
      phase: Math.random() * Math.PI * 2,
    }))

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Advance
        p.y += p.vy
        p.x += p.vx + Math.sin(p.phase) * 0.25
        p.phase += 0.02
        p.radius += 0.18

        // Alpha envelope: fade in then fade out as it drifts up
        const travelRatio = Math.max(0, Math.min(1, (height * 0.7 - p.y) / (height * 0.5)))
        p.alpha = Math.sin(travelRatio * Math.PI) * p.maxAlpha

        // Respawn if too high
        if (p.y < height * 0.2 || p.alpha <= 0.001) {
          p.x = width * 0.5 + (Math.random() - 0.5) * 100
          p.y = height * 0.58 + Math.random() * 60
          p.radius = 25 + Math.random() * 35
          p.alpha = 0
        }

        // Draw soft glowing mist circle
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius)
        grad.addColorStop(0, `rgba(235, 205, 155, ${p.alpha * 1.2})`)
        grad.addColorStop(0.5, `rgba(212, 175, 105, ${p.alpha * 0.6})`)
        grad.addColorStop(1, 'rgba(10, 9, 8, 0)')

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}

/**
 * CinematicReveal — The Ultra-Premium 3-Second Result Transition
 * Recreates the exact visual atmosphere, lighting, orbital paths, and sensory orbs
 * from the reference image.
 */
export default function CinematicReveal({
  result,
  answers,
  sensoryNotes: customNotes,
  noteCount = 5,
  onComplete,
  onRevealStart,
}: CinematicRevealProps) {
  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Transition timeline phase (total ~6.2 seconds):
  // 0.0s - 1.4s: 'analyzing' (palate synthesis, mist, droplet initiates)
  // 1.4s - 2.8s: 'curating' (curating taste notes, 5 orbs emerge progressively)
  // 2.8s - 4.2s: 'distilling' (distilling profile, smoke, full orbital flow)
  // 4.2s - 4.8s: 'awaiting' ("Your Final Spirit is awaiting for you" headline)
  // 4.8s - 5.5s: 'converging' (sensory notes glide inward into glass)
  // 5.5s - 6.2s: 'revealing' (golden light expands, overlay dissolves, bottle emerges)
  const [timelinePhase, setTimelinePhase] = useState<
    'analyzing' | 'curating' | 'distilling' | 'awaiting' | 'converging' | 'revealing'
  >('analyzing')

  // Smooth luxury progress percentage counter (0% -> 100% over 5.5s)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion) {
      setProgress(100)
      return
    }

    const startTime = performance.now()
    const totalDuration = 5500
    let rafId: number

    const tick = (now: number) => {
      const elapsed = now - startTime
      const rawT = Math.min(1, elapsed / totalDuration)
      // Smooth luxury ease: gradual acceleration, steady mid, gentle deceleration at 100%
      const easedT = rawT < 0.5 ? 2 * rawT * rawT : -1 + (4 - 2 * rawT) * rawT
      const currentPct = Math.min(100, Math.round(easedT * 100))
      setProgress(currentPct)

      if (rawT < 1) {
        rafId = requestAnimationFrame(tick)
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [prefersReducedMotion])

  // Dynamic sensory notes computed from result data (supports 3, 4, 5, 6, 7 notes)
  const dynamicNotes = useMemo(
    () => getDynamicSensoryNotes(result, answers, customNotes, noteCount),
    [result, answers, customNotes, noteCount]
  )

  // 6.2-second timeline lifecycle timer management
  useEffect(() => {
    if (prefersReducedMotion) {
      onRevealStart?.()
      const reducedTimer = setTimeout(() => {
        onComplete()
      }, 1600)
      return () => clearTimeout(reducedTimer)
    }

    const tCurating = setTimeout(() => setTimelinePhase('curating'), 1400)
    const tDistilling = setTimeout(() => setTimelinePhase('distilling'), 2800)
    const tAwaiting = setTimeout(() => setTimelinePhase('awaiting'), 4200)
    const tConverging = setTimeout(() => setTimelinePhase('converging'), 4800)
    const tRevealing = setTimeout(() => {
      setTimelinePhase('revealing')
      onRevealStart?.()
    }, 5500)
    const tComplete = setTimeout(() => onComplete(), 6200)

    return () => {
      clearTimeout(tCurating)
      clearTimeout(tDistilling)
      clearTimeout(tAwaiting)
      clearTimeout(tConverging)
      clearTimeout(tRevealing)
      clearTimeout(tComplete)
    }
  }, [onComplete, onRevealStart, prefersReducedMotion])

  // Preload bottle image and penthouse altar background immediately
  useEffect(() => {
    if (result.image) {
      const img = new Image()
      img.src = result.image
    }
    const bgAltar = new Image()
    bgAltar.src = '/images/results_penthouse_altar.jpg'
  }, [result])

  // Active step index for bottom journey medallions (0..3)
  const activeStepIndex = useMemo(() => {
    if (timelinePhase === 'analyzing') return 0
    if (timelinePhase === 'curating') return 1
    if (timelinePhase === 'distilling') return 2
    return 3 // awaiting, converging, revealing
  }, [timelinePhase])

  // Catchy bottom status message matching active phase
  const bottomStatusText = useMemo(() => {
    switch (timelinePhase) {
      case 'analyzing':
        return 'ANALYZING PALATE PROFILE...'
      case 'curating':
        return 'CURATING YOUR TASTING JOURNEY...'
      case 'distilling':
        return 'DISTILLING BESPOKE LIQUOR PROFILE...'
      case 'awaiting':
        return 'YOUR FINAL SPIRIT IS AWAITING FOR YOU...'
      case 'converging':
        return 'CONVERGING SENSORY HARMONICS...'
      case 'revealing':
        return 'REVEALING THE OPTIMAL MATCH...'
    }
  }, [timelinePhase])

  // Bottom right phase label
  const phaseLabel = useMemo(() => {
    switch (timelinePhase) {
      case 'analyzing':
        return 'ANALYZING'
      case 'curating':
        return 'CURATING'
      case 'distilling':
        return 'DISTILLING'
      case 'awaiting':
      case 'converging':
        return 'SYNTHESIS'
      case 'revealing':
        return 'THE REVELATION'
    }
  }, [timelinePhase])

  // 4 Taste Discovery journey steps from the reference image
  const journeySteps = useMemo(() => [
    {
      id: 'sensory',
      title1: 'SENSORY',
      title2: 'NOTES',
      icon: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      ),
    },
    {
      id: 'flavour',
      title1: 'FLAVOUR',
      title2: 'PROFILES',
      icon: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M7 3h10M7 21h10" />
          <path d="M5 8h14M4 12h16M5 16h14" />
          <path d="M7 3c-2.5 4-2.5 14 0 18M17 3c2.5 4 2.5 14 0 18" />
        </svg>
      ),
    },
    {
      id: 'preferences',
      title1: 'PERSONAL',
      title2: 'PREFERENCES',
      icon: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M8 3c1 2-1 4 0 6s2 2 0 4M12 3c1 2-1 4 0 6s2 2 0 4M16 3c1 2-1 4 0 6s2 2 0 4" />
          <path d="M7 19h10M9 22h6" />
        </svg>
      ),
    },
    {
      id: 'experience',
      title1: 'YOUR',
      title2: 'EXPERIENCE',
      icon: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M8 21h8M12 15v6M6 4h12l-2 8a4 4 0 0 1-8 0L6 4Z" />
        </svg>
      ),
    },
  ], [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: timelinePhase === 'revealing' ? 0 : 1,
      }}
      transition={{
        duration: timelinePhase === 'revealing' ? 0.55 : 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed inset-0 w-screen h-[100svh] z-[9999] overflow-hidden select-none pointer-events-auto flex flex-col justify-between bg-[#080706]"
      aria-label="Sensory Distillation Reveal"
    >
      {/* ── LAYER 1: CINEMATIC WHISKY CELLAR BASE BACKGROUND ── */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none transition-transform duration-3000 ease-out"
        style={{
          backgroundImage: "url('/images/whisky-sanctuary-plate.jpg')",
          transform: timelinePhase === 'revealing' ? 'scale(1.04)' : 'scale(1.0)',
          filter: 'brightness(0.96) contrast(1.12)',
        }}
        aria-hidden="true"
      />

      {/* Volumetric Radial Amber Warmth centered on the glass */}
      <motion.div
        animate={{
          scale: timelinePhase === 'converging' ? 1.25 : [1, 1.08, 1],
          opacity:
            timelinePhase === 'converging'
              ? 0.75
              : timelinePhase === 'revealing'
              ? 0.95
              : 0.45,
        }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[580px] rounded-full blur-[130px] pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(235, 175, 80, 0.55) 0%, rgba(198, 140, 50, 0.22) 45%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      {/* Deep Obsidian Edge Vignette (focal point at glass) */}
      <div
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_28%,rgba(6,5,4,0.55)_65%,rgba(6,5,4,0.96)_100%)] pointer-events-none"
        aria-hidden="true"
      />

      {/* Expanding Golden Light Bloom during Final Reveal (2.5s - 3.0s) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: timelinePhase === 'revealing' ? [0, 0.7, 0] : 0,
          scale: timelinePhase === 'revealing' ? [0.8, 2.2, 2.6] : 0.8,
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[90px] pointer-events-none z-30"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 230, 160, 0.85) 0%, rgba(227, 185, 95, 0.4) 40%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      {/* ── LAYER 2: ELEGANT BRANDING HEADER (MATCHING REFERENCE IMAGE) ── */}
      <header className="relative w-full flex items-center justify-between px-6 sm:px-12 pt-6 sm:pt-8 z-30 select-none">
        {/* TOP LEFT: Nº8 RESERVE logo mark */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <img
            src="/images/logo-BJ7D25WF.webp"
            alt="No. 8 Reserve"
            className="h-8 sm:h-10 w-auto object-contain drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)] filter brightness-105"
          />
        </div>

        {/* TOP RIGHT: TASTE DISCOVERY with diamond ornament */}
        <div className="font-serif text-[11px] sm:text-xs tracking-[0.28em] text-[#C6A15B] uppercase font-light flex items-center gap-2">
          <span className="w-1.5 h-1.5 rotate-45 border border-[#C6A15B]/70 bg-[#C6A15B]/40 inline-block mr-1" />
          <span>TASTE DISCOVERY</span>
        </div>
      </header>

      {/* ── LAYER 3: LUXURY EDITORIAL CROSSFADING TYPOGRAPHY ── */}
      <div className="relative w-full flex flex-col items-center text-center px-4 max-w-2xl mx-auto z-30 mt-1 sm:mt-2 pointer-events-none min-h-[95px] select-none">
        <AnimatePresence mode="wait">
          {timelinePhase === 'analyzing' && (
            <motion.div
              key="text-analyzing"
              initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <span className="font-sans text-[8.5px] sm:text-[9.5px] tracking-[0.34em] text-[#C6A15B] uppercase font-medium mb-1 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                A JOURNEY BEYOND TASTE
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#FAF7F2] font-light tracking-[0.06em] uppercase drop-shadow-[0_2px_18px_rgba(0,0,0,0.95)]">
                ANALYZING YOUR TASTE PROFILE
              </h2>
              <p className="font-serif italic text-xs sm:text-[13px] text-[#FAF7F2]/75 max-w-lg leading-relaxed text-center mt-1 px-4 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                Interpreting 13 sensory coordinates across oak depth, peat smoke, and velvety sweetness.
              </p>
            </motion.div>
          )}

          {timelinePhase === 'curating' && (
            <motion.div
              key="text-curating"
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <span className="font-sans text-[8.5px] sm:text-[9.5px] tracking-[0.34em] text-[#C6A15B] uppercase font-medium mb-1 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                SENSORY HARMONICS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#FAF7F2] font-light tracking-[0.06em] uppercase drop-shadow-[0_2px_18px_rgba(0,0,0,0.95)]">
                CURATING YOUR RARE NOTES
              </h2>
              <p className="font-serif italic text-xs sm:text-[13px] text-[#FAF7F2]/75 max-w-lg leading-relaxed text-center mt-1 px-4 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                Exploring rare flavours, layered aromas, and the nuances that define your unique whisky profile.
              </p>
            </motion.div>
          )}

          {timelinePhase === 'distilling' && (
            <motion.div
              key="text-distilling"
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <span className="font-sans text-[8.5px] sm:text-[9.5px] tracking-[0.34em] text-[#C6A15B] uppercase font-medium mb-1 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                ALCHEMY OF THE CASK
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#FAF7F2] font-light tracking-[0.06em] uppercase drop-shadow-[0_2px_18px_rgba(0,0,0,0.95)]">
                DISTILLING YOUR PERFECT POUR
              </h2>
              <p className="font-serif italic text-xs sm:text-[13px] text-[#FAF7F2]/75 max-w-lg leading-relaxed text-center mt-1 px-4 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                Harmonizing oak maturity, proof viscosity, and cask resonance into one signature spirit.
              </p>
            </motion.div>
          )}

          {(timelinePhase === 'awaiting' || timelinePhase === 'converging' || timelinePhase === 'revealing') && (
            <motion.div
              key="text-awaiting"
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <span className="font-sans text-[8.5px] sm:text-[9.5px] tracking-[0.34em] text-[#E3C585] uppercase font-semibold mb-1 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                THE PINNACLE REVELATION
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#FAF7F2] font-light tracking-[0.05em] uppercase drop-shadow-[0_2px_18px_rgba(0,0,0,0.95)]">
                YOUR FINAL SPIRIT IS AWAITING FOR YOU
              </h2>
              <p className="font-serif italic text-xs sm:text-[13px] text-[#FAF7F2]/80 max-w-lg leading-relaxed text-center mt-1 px-4 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                Step into the sanctuary. Your bespoke coordinates and optimal liquor match have been distilled.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── LAYER 4: CENTRAL HERO STAGE (GLASS + ORBITS + SENSORY NOTES) ── */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-20">
        
        {/* Real-time Smoke/Mist Canvas */}
        <SmokeCanvas />

        {/* ── 4A. GOLDEN MOLTEN LIQUID POUR / SUSPENDED DROPLET ANIMATION ── */}
        <div className="absolute top-[18%] sm:top-[20%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
          {/* Molten Golden Droplet Stream */}
          <motion.div
            initial={{ opacity: 0, y: -30, scaleY: 0.4 }}
            animate={{
              opacity:
                timelinePhase === 'analyzing' ||
                timelinePhase === 'curating' ||
                timelinePhase === 'distilling' ||
                timelinePhase === 'awaiting'
                  ? [0, 0.95, 0.95, 0.3]
                  : 0,
              y:
                timelinePhase === 'analyzing' ||
                timelinePhase === 'curating' ||
                timelinePhase === 'distilling' ||
                timelinePhase === 'awaiting'
                  ? [-10, 50, 95, 125]
                  : 0,
              scaleY: [1.6, 1.2, 0.8, 0.3],
            }}
            transition={{
              duration: 1.1,
              repeat:
                timelinePhase === 'analyzing' ||
                timelinePhase === 'curating' ||
                timelinePhase === 'distilling' ||
                timelinePhase === 'awaiting'
                  ? Infinity
                  : 0,
              repeatDelay: 0.3,
              ease: 'easeIn',
            }}
            className="w-2.5 h-8 rounded-full bg-gradient-to-b from-[#FFF5C0] via-[#E2A14A] to-[#B36B15] shadow-[0_0_20px_rgba(255,213,79,0.9)] filter blur-[0.3px]"
          />

          {/* Golden liquid splash sparkle when droplet enters glass */}
          <motion.div
            animate={{
              scale:
                timelinePhase === 'analyzing' ||
                timelinePhase === 'curating' ||
                timelinePhase === 'distilling' ||
                timelinePhase === 'awaiting'
                  ? [0.6, 1.6, 2.0]
                  : 1,
              opacity:
                timelinePhase === 'analyzing' ||
                timelinePhase === 'curating' ||
                timelinePhase === 'distilling' ||
                timelinePhase === 'awaiting'
                  ? [0, 0.85, 0]
                  : 0,
            }}
            transition={{ duration: 0.7, repeat: Infinity, repeatDelay: 0.7 }}
            className="w-14 h-3.5 -mt-2 rounded-[100%] border border-[#FFD54F]/80 bg-[#FFD54F]/35 blur-xs"
          />
        </div>

        {/* ── 4B. REFINED CHAMPAGNE-GOLD ORBITAL LIGHT LINES ── */}
        <motion.div
          animate={{
            scale: timelinePhase === 'converging' ? 0.7 : 1,
            opacity: timelinePhase === 'converging' ? 0.45 : timelinePhase === 'revealing' ? 0 : 1,
            rotate: [0, 4, 0, -4, 0],
          }}
          transition={{
            scale: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
            rotate: { duration: 18, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute top-[56%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[620px] md:w-[740px] h-[220px] sm:h-[320px] md:h-[370px] pointer-events-none z-10"
        >
          <svg
            viewBox="0 0 700 400"
            className="w-full h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="orbitalGoldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C6A15B" stopOpacity="0.1" />
                <stop offset="35%" stopColor="#FAF7F2" stopOpacity="0.85" />
                <stop offset="65%" stopColor="#E3C585" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#8A6729" stopOpacity="0.15" />
              </linearGradient>

              <linearGradient id="orbitalGoldGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E3C585" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#FFDE99" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#8A6729" stopOpacity="0.2" />
              </linearGradient>

              <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Orbital Curve 1 — Major Wide Ellipse tilted ~ -12° */}
            <g transform="rotate(-12 350 200)">
              <ellipse
                cx="350"
                cy="200"
                rx="310"
                ry="95"
                stroke="url(#orbitalGoldGrad1)"
                strokeWidth="1.2"
                strokeDasharray="4 8"
                filter="url(#goldGlow)"
              />
              {/* Luminous Node traveling on orbit 1 */}
              <circle cx="210" cy="115" r="3" fill="#FFF2B2" filter="url(#goldGlow)">
                <animate
                  attributeName="opacity"
                  values="0.4;1;0.4"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="490" cy="285" r="2.5" fill="#E3C585" filter="url(#goldGlow)" />
            </g>

            {/* Orbital Curve 2 — Secondary Nested Ellipse tilted ~ +8° */}
            <g transform="rotate(8 350 200)">
              <ellipse
                cx="350"
                cy="200"
                rx="265"
                ry="75"
                stroke="url(#orbitalGoldGrad2)"
                strokeWidth="1"
                opacity="0.8"
              />
              <circle cx="460" cy="135" r="3.2" fill="#FAF7F2" filter="url(#goldGlow)">
                <animate
                  attributeName="opacity"
                  values="0.6;1;0.6"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="240" cy="265" r="2" fill="#E3C585" />
            </g>

            {/* Orbital Curve 3 — Tight Inner Ellipse encircling glass rim */}
            <ellipse
              cx="350"
              cy="200"
              rx="180"
              ry="50"
              stroke="#E3C585"
              strokeWidth="0.8"
              strokeDasharray="2 6"
              opacity="0.5"
            />
          </svg>
        </motion.div>

        {/* ── 4C. CENTRAL HERO WHISKY GLASS ── */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.92,
            filter: 'blur(8px)',
            y: 20,
          }}
          animate={{
            opacity: timelinePhase === 'revealing' ? 0 : 1,
            scale:
              timelinePhase === 'awaiting' || timelinePhase === 'converging'
                ? 1.05
                : timelinePhase === 'revealing'
                ? 1.08
                : 1,
            filter:
              timelinePhase === 'awaiting' || timelinePhase === 'converging'
                ? 'blur(0px) brightness(1.35)'
                : timelinePhase === 'revealing'
                ? 'blur(4px) brightness(1.5)'
                : 'blur(0px) brightness(1.0)',
            y: 0,
          }}
          transition={{
            duration: 0.85,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute top-[56%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-15 flex flex-col items-center justify-center pointer-events-none"
        >
          {/* Subtle Ground Platform Contact Glow */}
          <div className="absolute -bottom-4 w-48 sm:w-60 h-8 rounded-[100%] bg-gradient-to-r from-transparent via-[#E2A14A]/40 to-transparent blur-md" />

          {/* The Hero Crystal Glass Render — perfectly matches the cellar plate coordinates */}
          <div className="relative w-[180px] sm:w-[220px] md:w-[260px] h-[220px] sm:h-[260px] md:h-[300px] flex items-center justify-center">
            {/* Luminous Inner Liquid Amber Core Glow */}
            <motion.div
              animate={{
                opacity:
                  timelinePhase === 'awaiting' || timelinePhase === 'converging'
                    ? 0.95
                    : [0.45, 0.7, 0.45],
                scale:
                  timelinePhase === 'awaiting' || timelinePhase === 'converging'
                    ? 1.15
                    : [0.95, 1.05, 0.95],
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 sm:w-40 h-28 sm:h-36 rounded-full bg-gradient-to-t from-[#B86A18] via-[#EAA538]/60 to-transparent blur-2xl pointer-events-none"
            />

            {/* Specular Crystal Facet Refraction Sparkle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
                className="w-36 h-36 rounded-full border border-[#FFF2B2]/20 opacity-40 blur-xs"
              />
            </div>
          </div>
        </motion.div>

        {/* ── 4D. MATHEMATICALLY CONTROLLED SENSORY CONSTELLATION ── */}
        <div className="absolute top-[56%] left-1/2 w-0 h-0 pointer-events-none z-25">
          <SensoryConstellation
            notes={dynamicNotes}
            isConverging={timelinePhase === 'converging' || timelinePhase === 'revealing'}
            constellationKey={dynamicNotes.map((n) => n.id).join('-')}
          />
        </div>

      </div>

      {/* ── LAYER 5: ANIMATED LUXURY TASTING JOURNEY STATION (MATCHING REFERENCE IMAGE) ── */}
      <div className="relative w-full flex flex-col items-center px-4 sm:px-12 z-30 pointer-events-none select-none -mt-4 sm:-mt-2">
        {/* 4 Golden Journey Medallions */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-8 md:gap-12 w-full max-w-2xl mx-auto">
          {journeySteps.map((step, idx) => {
            const isStepActive = idx <= activeStepIndex
            const isCurrent = idx === activeStepIndex

            return (
              <div key={step.id} className="flex items-center gap-2 sm:gap-5 md:gap-8">
                <div className="flex flex-col items-center">
                  {/* Circular Golden Medallion */}
                  <div
                    className={`relative w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isStepActive
                        ? 'border-[1.5px] border-[#FFD700] bg-[#FFD700]/15 text-[#FFEAA5] shadow-[0_0_16px_rgba(255,215,0,0.55)]'
                        : 'border border-[#C6A15B]/30 bg-black/40 text-[#C6A15B]/40'
                    }`}
                  >
                    {step.icon}
                    {isCurrent && (
                      <span className="absolute -inset-1 rounded-full border border-[#FFD700]/40 animate-ping opacity-60" />
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="flex flex-col items-center mt-1 sm:mt-1.5 text-center">
                    <span
                      className={`font-sans text-[7px] sm:text-[9px] tracking-[0.2em] uppercase font-light ${
                        isStepActive ? 'text-[#FAF7F2]' : 'text-stone/40'
                      }`}
                    >
                      {step.title1}
                    </span>
                    <span
                      className={`font-sans text-[6.5px] sm:text-[8px] tracking-[0.18em] uppercase ${
                        isStepActive ? 'text-[#E5C378]' : 'text-stone/30'
                      }`}
                    >
                      {step.title2}
                    </span>
                  </div>
                </div>

                {/* Connector line & diamond node between medallions */}
                {idx < 3 && (
                  <div className="hidden sm:flex items-center w-6 md:w-10 -mt-4">
                    <div
                      className={`h-px flex-1 transition-colors duration-500 ${
                        idx < activeStepIndex
                          ? 'bg-gradient-to-r from-[#FFD700] to-[#E3C585]'
                          : 'bg-[#C6A15B]/25'
                      }`}
                    />
                    <span
                      className={`w-1 h-1 rotate-45 mx-1 transition-colors duration-500 ${
                        idx < activeStepIndex ? 'bg-[#FFD700]' : 'bg-[#C6A15B]/30'
                      }`}
                    />
                    <div
                      className={`h-px flex-1 transition-colors duration-500 ${
                        idx < activeStepIndex
                          ? 'bg-gradient-to-r from-[#E3C585] to-[#FFD700]'
                          : 'bg-[#C6A15B]/25'
                      }`}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Fine Golden Progress Line with Percentage & Diamond */}
        <div className="flex flex-col items-center w-full max-w-sm sm:max-w-md mx-auto mt-2 sm:mt-2.5">
          <div className="flex items-center gap-2 sm:gap-3 w-full justify-center">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C6A15B]/40" />
            <span className="font-mono text-[11px] sm:text-[13px] text-[#FFD700] tracking-widest font-light">
              {progress}%
            </span>
            <span className="w-1.5 h-1.5 rotate-45 border border-[#FFD700] bg-[#FFD700]/70 shadow-[0_0_6px_#FFD700]" />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C6A15B]/40" />
          </div>

          {/* Thin Glowing Golden Fill Bar */}
          <div className="relative w-full h-[2px] bg-white/10 rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#9B7735] via-[#FFD77A] to-[#FFF5C0] shadow-[0_0_12px_rgba(255,215,0,0.85)] transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Catchy dynamic wording below the progress line */}
          <AnimatePresence mode="wait">
            <motion.p
              key={bottomStatusText}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.3 }}
              className="font-sans text-[8px] sm:text-[9.5px] tracking-[0.28em] text-[#E3C585] uppercase font-light mt-1.5 text-center drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
            >
              {bottomStatusText}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* ── LAYER 6: BOTTOM LUXURY ANCHOR BAR ── */}
      <footer className="relative w-full flex items-center justify-between px-6 sm:px-12 pb-4 sm:pb-6 z-30 select-none">
        {/* Left: Minimal Coordinates */}
        <div className="font-mono text-[8.5px] sm:text-[9.5px] tracking-[0.25em] text-[#FAF7F2]/50 uppercase font-light">
          NO. 8 RESERVE · BESPOKE PROFILE
        </div>

        {/* Right: Dynamic Distillation Status */}
        <div className="font-mono text-[8.5px] sm:text-[9.5px] tracking-[0.25em] text-[#C6A15B] uppercase font-light flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] animate-pulse" />
          <span>{phaseLabel}</span>
        </div>
      </footer>
    </motion.div>
  )
}
