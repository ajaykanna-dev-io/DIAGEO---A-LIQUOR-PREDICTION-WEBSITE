import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Spirit } from '@/types'
import { IoClose } from 'react-icons/io5'
import { spirits, getAlternativesWithMatch } from '@/data/spirits'

interface RecommendationRevealProps {
  primaryMatch: Spirit
  secondaryMatches: Spirit[]
  matchScore: number
  onRestart: () => void
  isRevealed?: boolean
}

/**
 * RecommendationReveal
 * Replicates the ultra-premium editorial design from the reference image:
 * - Twilight penthouse tasting lounge background with circular illuminated marble altar
 * - Center: Dynamic bottle cutout from spirits.ts positioned on the glowing altar
 * - Left: "YOUR MATCH", Brand & Name, Specs, Tasting Description, Pill Tags, and Match Score Badge
 * - Right: Frosted glass "FLAVOUR PROFILE" card with SPICE, OAK, FRUIT, SMOKE, SWEETNESS bars,
 *   "EXPLORE THIS EXPRESSION →" CTA, and "CELLAR SELECTION → | RECALIBRATE ↻"
 * - Archetype Selector: Interactive ‹ ARCHETYPE › buttons cycling through all spirits & synchronous data updates
 * - Smooth Wheel/Scroll & Touch Gesture: Deliberately transitions through subsequent spirits on scroll down/up
 */
export default function RecommendationReveal({
  primaryMatch,
  secondaryMatches,
  matchScore,
  onRestart,
  isRevealed = true,
}: RecommendationRevealProps) {
  const [showCellarModal, setShowCellarModal] = useState(false)
  const [mobileTab, setMobileTab] = useState<'match' | 'flavour'>('match')

  // Construct complete ranked list of all spirits starting with optimal match
  const allSpirits = useMemo(() => {
    const scoredOthers = getAlternativesWithMatch(primaryMatch, spirits.length)
    return [{ spirit: primaryMatch, match: matchScore }, ...scoredOthers]
  }, [primaryMatch, matchScore])

  const [activeSpiritIndex, setActiveSpiritIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1)

  const [transitionDuration, setTransitionDuration] = useState<number>(0.55)

  const activeEntry = allSpirits[activeSpiritIndex] || allSpirits[0]
  const activeSpirit = activeEntry.spirit
  const activeMatchScore = activeEntry.match

  // Lock and gesture tracking refs to guarantee strictly ONE brand transition per scroll gesture
  const isLockedRef = useRef(false)
  const lockedUntilRef = useRef(0)
  const lastWheelEventTimeRef = useRef(0)
  const accumulatedDeltaRef = useRef(0)
  const gestureStartTimeRef = useRef(0)
  const wheelSilenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mouseWheelDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingWheelDeltaRef = useRef(0)

  // Master spirit transition trigger with velocity duration & lock enforcement
  const triggerTransition = useCallback(
    (direction: 1 | -1, customDuration?: number) => {
      if (isLockedRef.current) return
      const duration = typeof customDuration === 'number' ? customDuration : 0.55
      const now = performance.now()

      isLockedRef.current = true
      // In AnimatePresence mode="wait", the visual cycle is: exit duration + enter duration = duration * 2
      // We lock for the full animation duration + safety buffer (at least 950ms) to ensure
      // trackpad inertia and residual momentum never advance more than 1 brand.
      const totalAnimationMs = Math.round(duration * 2 * 1000)
      const minLockDurationMs = Math.max(totalAnimationMs + 180, 950)
      lockedUntilRef.current = now + minLockDurationMs

      setTransitionDuration(duration)
      setSlideDirection(direction)
      setActiveSpiritIndex((prev) =>
        direction > 0
          ? (prev + 1) % allSpirits.length
          : (prev - 1 + allSpirits.length) % allSpirits.length
      )

      setTimeout(() => {
        if (performance.now() - lastWheelEventTimeRef.current >= 300) {
          isLockedRef.current = false
        }
      }, minLockDurationMs)
    },
    [allSpirits.length]
  )

  const handleNextSpirit = useCallback(
    (customDuration?: number) => {
      triggerTransition(1, customDuration)
    },
    [triggerTransition]
  )

  const handlePrevSpirit = useCallback(
    (customDuration?: number) => {
      triggerTransition(-1, customDuration)
    },
    [triggerTransition]
  )

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (showCellarModal) return

      const now = performance.now()
      lastWheelEventTimeRef.current = now

      // Reset wheel silence timer on every event
      if (wheelSilenceTimerRef.current) {
        clearTimeout(wheelSilenceTimerRef.current)
      }

      // 1. IF CURRENTLY LOCKED:
      // Completely discard this event. We are either animating or absorbing residual inertia/momentum.
      // Reset the silence timer so the lock is held until the trackpad/wheel has fully stopped for 350ms.
      if (isLockedRef.current) {
        accumulatedDeltaRef.current = 0
        pendingWheelDeltaRef.current = 0
        if (mouseWheelDebounceTimerRef.current) {
          clearTimeout(mouseWheelDebounceTimerRef.current)
          mouseWheelDebounceTimerRef.current = null
        }

        wheelSilenceTimerRef.current = setTimeout(() => {
          const currentTime = performance.now()
          if (
            currentTime >= lockedUntilRef.current &&
            currentTime - lastWheelEventTimeRef.current >= 300
          ) {
            isLockedRef.current = false
            accumulatedDeltaRef.current = 0
            gestureStartTimeRef.current = 0
          } else {
            const remaining = Math.max(80, lockedUntilRef.current - currentTime)
            setTimeout(() => {
              if (performance.now() - lastWheelEventTimeRef.current >= 280) {
                isLockedRef.current = false
                accumulatedDeltaRef.current = 0
                gestureStartTimeRef.current = 0
              }
            }, remaining)
          }
        }, 350)
        return
      }

      // 2. DISCRETE MOUSE WHEEL NOTCH vs CONTINUOUS TRACKPAD
      const isLineMode = e.deltaMode === 1
      const isLargeDiscreteStep = isLineMode || Math.abs(e.deltaY) >= 100

      if (isLargeDiscreteStep) {
        // Collect mouse wheel notches over a tiny 48ms buffer
        pendingWheelDeltaRef.current += e.deltaY

        if (!mouseWheelDebounceTimerRef.current) {
          mouseWheelDebounceTimerRef.current = setTimeout(() => {
            const delta = pendingWheelDeltaRef.current
            pendingWheelDeltaRef.current = 0
            mouseWheelDebounceTimerRef.current = null

            if (isLockedRef.current || Math.abs(delta) < 40) return

            const direction = delta > 0 ? 1 : -1
            const absDelta = Math.abs(delta)

            // 1 notch = slow deliberate wheel turn -> 1.05s
            // 2 notches = medium wheel turn -> 0.60s
            // 3+ notches = fast wheel spin -> 0.28s
            let computedDuration = 1.05
            if (absDelta >= 300) {
              computedDuration = 0.28
            } else if (absDelta >= 200) {
              computedDuration = 0.60
            }

            triggerTransition(direction, computedDuration)
          }, 48)
        }
        return
      }

      // 3. CONTINUOUS TRACKPAD PIXEL SCROLL:
      if (accumulatedDeltaRef.current === 0) {
        gestureStartTimeRef.current = now
      }
      accumulatedDeltaRef.current += e.deltaY

      // Reset if tiny nudge under threshold stops
      wheelSilenceTimerRef.current = setTimeout(() => {
        accumulatedDeltaRef.current = 0
        gestureStartTimeRef.current = 0
      }, 220)

      const TRACKPAD_THRESHOLD = 26

      if (Math.abs(accumulatedDeltaRef.current) >= TRACKPAD_THRESHOLD) {
        const elapsed = Math.max(16, now - gestureStartTimeRef.current)
        const absDelta = Math.abs(accumulatedDeltaRef.current)
        const direction = accumulatedDeltaRef.current > 0 ? 1 : -1
        const velocity = absDelta / elapsed

        accumulatedDeltaRef.current = 0
        gestureStartTimeRef.current = 0

        // Velocity mapping:
        // Slow scroll (<= 0.16 px/ms): ~1.15s duration (existing screen slowly dissolves, next slowly shows)
        // Fast scroll (>= 1.60 px/ms): ~0.26s duration (fast, crisp transition)
        const clampedVelocity = Math.max(0.16, Math.min(1.60, velocity))
        const normalized = (clampedVelocity - 0.16) / (1.60 - 0.16)
        const computedDuration = Math.round((1.15 - normalized * (1.15 - 0.26)) * 100) / 100

        triggerTransition(direction, computedDuration)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      if (wheelSilenceTimerRef.current) clearTimeout(wheelSilenceTimerRef.current)
      if (mouseWheelDebounceTimerRef.current) clearTimeout(mouseWheelDebounceTimerRef.current)
    }
  }, [showCellarModal, triggerTransition])

  // Touch Swipe Gesture for Mobile / Tablet with velocity-adaptive duration
  const touchStartYRef = useRef<number | null>(null)
  const touchStartTimeRef = useRef<number>(0)

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (showCellarModal) return
      touchStartYRef.current = e.touches[0].clientY
      touchStartTimeRef.current = performance.now()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (showCellarModal || touchStartYRef.current === null) return
      const touchEndY = e.changedTouches[0].clientY
      const diffY = touchStartYRef.current - touchEndY
      const timeTaken = Math.max(16, performance.now() - touchStartTimeRef.current)
      touchStartYRef.current = null

      if (isLockedRef.current) return

      const TOUCH_THRESHOLD = 35

      if (Math.abs(diffY) > TOUCH_THRESHOLD) {
        const velocity = Math.abs(diffY) / timeTaken
        const clampedVelocity = Math.max(0.18, Math.min(1.8, velocity))
        const normalized = (clampedVelocity - 0.18) / (1.8 - 0.18)
        const computedDuration = Math.round((1.15 - normalized * (1.15 - 0.28)) * 100) / 100

        const direction = diffY > 0 ? 1 : -1
        triggerTransition(direction, computedDuration)
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [showCellarModal, triggerTransition])

  // Keyboard navigation (ArrowLeft/Right, ArrowUp/Down)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showCellarModal) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        triggerTransition(1, 0.55)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        triggerTransition(-1, 0.55)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showCellarModal, triggerTransition])

  // Parse title into brand line & expression line to match "Johnnie Walker" / "Blonde"
  const { brandLine, expressionLine } = useMemo(() => {
    if (activeSpirit.brand && activeSpirit.name) {
      return { brandLine: activeSpirit.brand, expressionLine: activeSpirit.name }
    }
    const parts = activeSpirit.fullName.split(' ')
    if (parts.length >= 3) {
      return {
        brandLine: parts.slice(0, 2).join(' '),
        expressionLine: parts.slice(2).join(' '),
      }
    }
    if (parts.length === 2) {
      return { brandLine: parts[0], expressionLine: parts[1] }
    }
    return { brandLine: activeSpirit.fullName, expressionLine: '' }
  }, [activeSpirit])

  // Clean, consistent specs line: "BLEND · SCOTLAND · 40%"
  const specsLine = useMemo(() => {
    const category = (activeSpirit.category || 'Single Malt').toUpperCase()
    const origin = (activeSpirit.origin || 'Scotland').split(',')[0].trim().toUpperCase()
    const abv = activeSpirit.abv || '40%'
    return `${category}  ·  ${origin}  ·  ${abv}`
  }, [activeSpirit])

  // 5 Flavour dimensions matching the reference image: SPICE, OAK, FRUIT, SMOKE, SWEETNESS
  const flavourBars = useMemo(() => {
    const prof = activeSpirit.profile || {
      complexity: 65,
      intensity: 60,
      smoothness: 85,
      smokiness: 20,
      sweetness: 85,
    }

    return [
      { label: 'SPICE', val: Math.round(prof.complexity * 0.88 + 4) },
      { label: 'OAK', val: Math.round(prof.intensity * 0.86 + 8) },
      { label: 'FRUIT', val: Math.round(prof.smoothness * 0.94 + 2) },
      { label: 'SMOKE', val: Math.round(prof.smokiness) },
      { label: 'SWEETNESS', val: Math.round(prof.sweetness) },
    ]
  }, [activeSpirit])

  const archetype = activeSpirit.archetype || 'THE ICON'

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden flex flex-col justify-between bg-[#070605] text-[#FAF7F2] select-none z-50">
      {/* ── CINEMATIC BACKDROP ── */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none transition-all duration-1000"
        style={{
          backgroundImage: "url('/images/results_penthouse_altar.jpg')",
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/50 opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.65)_90%)]" />
      </div>

      {/* ── EDITORIAL TOP HEADER ── */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-12 pt-3 sm:pt-5 pb-1 sm:pb-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            onClick={onRestart}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            title="No. 8 Reserve — Return to Start"
          >
            <img
              src="/images/logo-BJ7D25WF.webp"
              alt="No. 8 Reserve"
              className="h-8 sm:h-10 w-auto object-contain drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-all"
            />
          </div>
          <span className="h-3.5 w-px bg-[#C6A15B]/40" />
          <span className="font-mono text-[8px] sm:text-[10px] tracking-[0.28em] text-[#C6A15B] uppercase font-semibold whitespace-nowrap drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
            TASTE DISCOVERY
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden sm:flex items-center gap-2 sm:gap-2.5 font-mono text-[8px] sm:text-[10px] tracking-[0.22em] text-stone/60 uppercase whitespace-nowrap">
            <span>YOUR JOURNEY</span>
            <span className="w-8 sm:w-12 h-px bg-white/20" />
            <span className="text-[#FAF7F2] font-semibold">13 / 13</span>
          </div>
        </div>
      </header>

      {/* ── FINAL RECOMMENDATION PAGE (PENTHOUSE ALTAR WITH CARDS) ── */}
      <motion.div
        key="final-recommendation-container"
        initial={{ opacity: 0, scale: 0.985, filter: 'blur(8px)' }}
        animate={{
          opacity: isRevealed ? 1 : 0,
          scale: isRevealed ? 1 : 0.985,
          filter: isRevealed ? 'blur(0px)' : 'blur(8px)',
        }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex-1 flex flex-col justify-between w-full min-h-0"
      >
        {/* ── DESKTOP 3-COLUMN REVEAL GRID (lg:grid) ── */}
            <div className="hidden lg:grid grid-cols-12 gap-5 lg:gap-8 items-center w-full max-w-7xl mx-auto px-6 sm:px-12 flex-1 min-h-0">
              {/* LEFT COLUMN: Dossier Card */}
              <motion.div
                initial={{ opacity: 0, y: 22, x: -18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3, transition: { duration: 0.25 } }}
                className="col-span-4 z-20 group relative rounded-2xl p-4 sm:p-5 lg:p-5.5 bg-[#0c0a08]/80 backdrop-blur-2xl border border-[#C6A15B]/30 hover:border-[#DFBA73]/55 shadow-[0_20px_50px_rgba(0,0,0,0.85)] hover:shadow-[0_25px_60px_rgba(198,161,91,0.18)] transition-all duration-500 flex flex-col justify-between space-y-3 self-center"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C6A15B]/10 rounded-full blur-2xl pointer-events-none" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSpirit.id}
                    initial={{ opacity: 0, y: slideDirection > 0 ? 18 : -18, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: slideDirection > 0 ? -18 : 18, filter: 'blur(5px)' }}
                    transition={{ duration: transitionDuration, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col justify-between h-full space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.35em] uppercase text-[#C6A15B] font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] animate-pulse" />
                        {activeSpiritIndex === 0 ? 'YOUR MATCH' : 'CELLAR ARCHETYPE'}
                      </span>
                      <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-stone/50 uppercase">
                        {specsLine}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h1 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-[#FAF7F2] font-normal leading-[1.12] tracking-tight">
                        <span>{brandLine}</span>
                        {expressionLine && (
                          <>
                            <br />
                            <span className="text-[#E5C378]">{expressionLine}</span>
                          </>
                        )}
                      </h1>

                      <p className="text-stone/80 text-xs sm:text-[13px] font-sans font-light leading-relaxed line-clamp-3">
                        {activeSpirit.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {activeSpirit.descriptors.slice(0, 3).map((desc) => (
                          <span
                            key={desc}
                            className="px-3 py-1 rounded-full border border-white/15 bg-white/5 text-[10px] sm:text-[11px] font-mono text-stone/90 backdrop-blur-md shadow-xs"
                          >
                            {desc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-white/10 mt-1">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#C6A15B]/60 bg-black/60 flex items-center justify-center p-1.5 shadow-[0_0_12px_rgba(198,161,91,0.25)]">
                          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#E5C378]" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <path d="M8 21h8m-4-7v7m0-7a7 7 0 007-7V3H5v4a7 7 0 007 7z" />
                          </svg>
                        </div>

                        <div className="flex flex-col">
                          <span className="font-serif text-xl sm:text-2xl text-[#FAF7F2] font-light leading-none">
                            {Math.round(activeMatchScore)}%
                          </span>
                          <span className="font-mono text-[8px] tracking-[0.28em] text-stone/50 uppercase mt-0.5">
                            TASTE AFFINITY
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] tracking-[0.25em] text-[#C6A15B] uppercase font-medium">
                          {activeSpiritIndex === 0 ? 'OPTIMAL MATCH' : 'SPECTRUM MATCH'}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] shadow-[0_0_6px_#C6A15B]" />
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* CENTER COLUMN: Bottle on Altar Pedestal with Interactive Archetype Capsule */}
              <div className="col-span-4 relative flex flex-col items-center justify-center self-stretch z-10 min-h-0">
                {/* Archetype Badge Directly on Top of the Bottle with Interactive ‹ › Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: -16, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center mb-1.5 sm:mb-2 shrink-0 select-none z-30"
                >
                  <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.38em] text-[#C6A15B]/75 uppercase mb-1">
                    TASTE ARCHETYPE
                  </span>
                  <div className="flex items-center justify-between gap-1.5 px-2.5 sm:px-3.5 py-1 rounded-full border border-[#C6A15B]/70 bg-gradient-to-r from-black/90 via-[#18140e]/95 to-black/90 backdrop-blur-md shadow-[0_4px_24px_rgba(198,161,91,0.35),0_0_12px_rgba(198,161,91,0.2)]">
                    <button
                      type="button"
                      onClick={() => handlePrevSpirit(0.55)}
                      className="w-6 h-6 p-2 mr-2 rounded-full flex items-center justify-center text-[#C6A15B] text-[#FFF8DB] bg-[#C6A15B]/25 active:scale-90 transition-all cursor-pointer select-none font-serif text-sm"
                      title="Previous archetype (or scroll up)"
                      aria-label="Previous archetype"
                    >
                      ‹
                    </button>
                    <div className="min-w-[120px] sm:min-w-[150px] text-center overflow-hidden px-1">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={activeSpirit.id}
                          initial={{ opacity: 0, y: slideDirection > 0 ? 8 : -8, filter: 'blur(3px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, y: slideDirection > 0 ? -8 : 8, filter: 'blur(3px)' }}
                          transition={{ duration: transitionDuration, ease: [0.22, 1, 0.36, 1] }}
                          className="font-mono text-[10px] sm:text-[11px] tracking-[0.34em] text-[#FAF7F2] uppercase font-bold block"
                        >
                          {archetype}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNextSpirit(0.55)}
                      className="w-6 h-6 p-2 mr-2 rounded-full flex items-center justify-center text-[#C6A15B] text-[#FFF8DB] bg-[#C6A15B]/25 active:scale-90 transition-all cursor-pointer select-none font-serif text-sm"
                      title="Next archetype (or scroll down)"
                      aria-label="Next archetype"
                    >
                      ›
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.96, filter: 'blur(6px)' }}
                  animate={{
                    opacity: isRevealed ? 1 : 0,
                    y: isRevealed ? 0 : 20,
                    scale: isRevealed ? 1 : 0.96,
                    filter: isRevealed ? 'blur(0px)' : 'blur(6px)',
                  }}
                  transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex flex-col items-center justify-center flex-1 min-h-0"
                >
                  {/* Golden altar glow beneath bottle */}
                  <div className="absolute bottom-0 w-52 sm:w-64 h-14 rounded-full bg-[#FFD54F]/30 blur-3xl pointer-events-none" />
                  <div className="absolute bottom-2 w-36 sm:w-48 h-6 rounded-full bg-[#C6A15B]/40 blur-xl pointer-events-none" />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSpirit.id}
                      initial={{
                        opacity: 0,
                        y: slideDirection > 0 ? 30 : -30,
                        scale: 0.94,
                        filter: 'blur(6px)',
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        filter: 'blur(0px)',
                      }}
                      exit={{
                        opacity: 0,
                        y: slideDirection > 0 ? -30 : 30,
                        scale: 0.94,
                        filter: 'blur(6px)',
                      }}
                      transition={{ duration: transitionDuration, ease: [0.22, 1, 0.36, 1] }}
                      className="relative h-[270px] sm:h-[310px] md:h-[340px] lg:h-[365px] xl:h-[385px] flex items-center justify-center"
                    >
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        className="relative h-full flex items-center justify-center"
                      >
                        <img
                          src={activeSpirit.image}
                          alt={activeSpirit.fullName}
                          className="max-h-full max-w-full object-contain filter drop-shadow-[0_22px_40px_rgba(0,0,0,0.95)] drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] select-none"
                        />
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`reflection-${activeSpirit.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.2 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: transitionDuration * 0.7 }}
                      className="relative w-36 sm:w-44 h-7 overflow-hidden blur-[1.5px] pointer-events-none -mt-2"
                      style={{ transform: 'scaleY(-1)' }}
                    >
                      <img
                        src={activeSpirit.image}
                        alt=""
                        className="max-h-full max-w-full object-contain filter brightness-40"
                      />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* RIGHT COLUMN: Flavour Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 22, x: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3, transition: { duration: 0.25 } }}
                className="col-span-4 z-20 group relative rounded-2xl p-4 sm:p-5 lg:p-5.5 bg-[#0c0a08]/80 backdrop-blur-2xl border border-[#C6A15B]/30 hover:border-[#DFBA73]/55 shadow-[0_20px_50px_rgba(0,0,0,0.85)] hover:shadow-[0_25px_60px_rgba(198,161,91,0.18)] transition-all duration-500 flex flex-col justify-between space-y-2.5 self-center"
              >
                <div className="absolute top-0 left-0 w-32 h-32 bg-[#C6A15B]/10 rounded-full blur-2xl pointer-events-none" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSpirit.id}
                    initial={{ opacity: 0, y: slideDirection > 0 ? 18 : -18, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: slideDirection > 0 ? -18 : 18, filter: 'blur(5px)' }}
                    transition={{ duration: transitionDuration, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-2.5"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.32em] uppercase text-[#C6A15B] font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] animate-pulse" />
                        FLAVOUR PROFILE
                      </span>
                      <span className="font-mono text-[9px] tracking-widest text-stone/50 uppercase">
                        5 DIMENSIONS
                      </span>
                    </div>

                    <div className="space-y-2 sm:space-y-2.5">
                      {flavourBars.map((fb, idx) => (
                        <div key={fb.label} className="space-y-0.5 sm:space-y-1">
                          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono tracking-wider uppercase">
                            <span className="text-stone/75">{fb.label}</span>
                            <span className="text-[#FAF7F2] font-medium">{fb.val}%</span>
                          </div>
                          <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              key={`${activeSpirit.id}-${fb.label}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${fb.val}%` }}
                              transition={{
                                duration: transitionDuration * 0.85,
                                delay: (transitionDuration * 0.05) * idx,
                                ease: 'easeOut',
                              }}
                              className="h-full bg-gradient-to-r from-[#9e7d3b] via-[#E5C378] to-[#FFF8DB] rounded-full relative shadow-[0_0_8px_rgba(229,195,120,0.6)]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <Link
                      to={`/spirit/${activeSpirit.id}`}
                      className="w-full mt-1.5 py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#1b1712] via-[#2a2215] to-[#1b1712] hover:from-[#352a19] hover:to-[#2a2215] border border-[#C6A15B]/70 hover:border-[#F5CE76] text-[#FAF7F2] font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.6)] hover:shadow-[0_0_22px_rgba(198,161,91,0.35)] cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <span>EXPLORE THIS EXPRESSION</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                  </motion.div>
                </AnimatePresence>

                {/* ── PROMINENT LUXURY ACTION BUTTONS: CELLAR SELECTION & RECALIBRATE ── */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#C6A15B]/25 mt-0.5">
                  <button
                    type="button"
                    onClick={() => setShowCellarModal(true)}
                    className="group relative flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-[#C6A15B]/70 hover:border-[#F5CE76] bg-gradient-to-b from-[#1c1813] via-[#14120f] to-[#0c0a08] hover:from-[#2a2219] hover:via-[#1c1813] hover:to-[#120f0c] text-[#E5C378] hover:text-[#FFF8DB] font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-semibold transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.06)] hover:shadow-[0_0_20px_rgba(198,161,91,0.35)] cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>CELLAR SELECTION</span>
                    <span className="text-[#F5CE76] transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={onRestart}
                    className="group relative flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-[#C6A15B]/70 hover:border-[#F5CE76] bg-gradient-to-b from-[#1c1813] via-[#14120f] to-[#0c0a08] hover:from-[#2a2219] hover:via-[#1c1813] hover:to-[#120f0c] text-[#E5C378] hover:text-[#FFF8DB] font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-semibold transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.06)] hover:shadow-[0_0_20px_rgba(198,161,91,0.35)] cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="text-[#F5CE76] text-xs transition-transform duration-500 group-hover:rotate-180">↻</span>
                    <span>RE-DISCOVER</span>
                  </button>
                </div>
              </motion.div>
            </div>

            {/* ── MOBILE COMPATIBLE CARD INTERFACE (lg:hidden) ── */}
            {/* Fits cleanly into mobile viewports without squishing or overflowing */}
            <div className="flex lg:hidden flex-col justify-between items-center w-full px-4 py-1 flex-1 min-h-0 overflow-hidden">
              {/* Mobile Top Sensory Header (fills empty space purposefully) */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center text-center pt-1 pb-1.5 shrink-0 z-20"
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-5 h-px bg-gradient-to-r from-transparent to-[#C6A15B]/70" />
                  <span className="font-mono text-[9px] tracking-[0.38em] text-[#C6A15B] uppercase font-medium">
                    CURATED SENSORY DESTINY
                  </span>
                  <span className="w-5 h-px bg-gradient-to-l from-transparent to-[#C6A15B]/70" />
                </div>
                <h1 className="font-serif text-base sm:text-lg text-stone-100 font-normal tracking-wide">
                  Your Signature Expression
                </h1>
              </motion.div>

              {/* Mobile Center Bottle on Altar */}
              <div className="relative flex-1 flex flex-col items-center justify-center w-full min-h-0 py-1">
                {/* Mobile Archetype Badge Directly on Top of Bottle with Interactive ‹ › Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center mb-1.5 shrink-0 select-none z-30"
                >
                  <span className="text-[8px] font-mono tracking-[0.32em] text-[#C6A15B]/80 uppercase mb-0.5">
                    TASTE ARCHETYPE
                  </span>
                  <div className="flex items-center justify-between gap-1.5 px-2.5 py-1 rounded-full border border-[#C6A15B]/70 bg-gradient-to-r from-black/90 via-[#1e1710] to-black/90 backdrop-blur-md shadow-[0_4px_18px_rgba(198,161,91,0.35)]">
                    <button
                      type="button"
                      onClick={() => handlePrevSpirit(0.55)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[#C6A15B] hover:text-[#FFF8DB] hover:bg-[#C6A15B]/25 active:scale-90 transition-all cursor-pointer select-none font-serif text-sm"
                      title="Previous archetype"
                      aria-label="Previous archetype"
                    >
                      ‹
                    </button>
                    <div className="min-w-[110px] text-center overflow-hidden px-1">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={activeSpirit.id}
                          initial={{ opacity: 0, y: slideDirection > 0 ? 6 : -6, filter: 'blur(3px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, y: slideDirection > 0 ? -6 : 6, filter: 'blur(3px)' }}
                          transition={{ duration: transitionDuration, ease: [0.22, 1, 0.36, 1] }}
                          className="font-mono text-[10px] tracking-[0.32em] text-[#FAF7F2] uppercase font-bold block"
                        >
                          {archetype}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNextSpirit(0.55)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[#C6A15B] hover:text-[#FFF8DB] hover:bg-[#C6A15B]/25 active:scale-90 transition-all cursor-pointer select-none font-serif text-sm"
                      title="Next archetype"
                      aria-label="Next archetype"
                    >
                      ›
                    </button>
                  </div>
                </motion.div>

                <div className="absolute bottom-2 w-52 h-10 rounded-full bg-[#FFD54F]/30 blur-xl pointer-events-none" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSpirit.id}
                    initial={{ opacity: 0, y: slideDirection > 0 ? 20 : -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: slideDirection > 0 ? -20 : 20, scale: 0.95 }}
                    transition={{ duration: transitionDuration }}
                    className="relative h-[225px] sm:h-[260px] flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative h-full flex items-center justify-center"
                    >
                      <img
                        src={activeSpirit.image}
                        alt={activeSpirit.fullName}
                        className="max-h-full max-w-full object-contain filter drop-shadow-[0_24px_45px_rgba(0,0,0,0.98)] select-none"
                      />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Mobile Tab Pill Switcher */}
              <div className="flex items-center gap-2 p-1 rounded-full bg-black/80 border border-[#C6A15B]/40 mb-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setMobileTab('match')}
                  className={`px-4 py-1 rounded-full font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
                    mobileTab === 'match'
                      ? 'bg-[#C6A15B] text-black font-bold shadow-[0_0_10px_rgba(198,161,91,0.5)]'
                      : 'text-stone/60 hover:text-white'
                  }`}
                >
                  ✦ {activeSpiritIndex === 0 ? 'YOUR MATCH' : 'EXPRESSION'}
                </button>
                <button
                  type="button"
                  onClick={() => setMobileTab('flavour')}
                  className={`px-4 py-1 rounded-full font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
                    mobileTab === 'flavour'
                      ? 'bg-[#C6A15B] text-black font-bold shadow-[0_0_10px_rgba(198,161,91,0.5)]'
                      : 'text-stone/60 hover:text-white'
                  }`}
                >
                  ∿ FLAVOUR MATRIX
                </button>
              </div>

              {/* Mobile Active Card Container */}
              <div className="w-full max-w-md shrink-0">
                <AnimatePresence mode="wait">
                  {mobileTab === 'match' ? (
                    <motion.div
                      key={`mob-match-${activeSpirit.id}`}
                      initial={{ opacity: 0, y: slideDirection > 0 ? 12 : -12, filter: 'blur(3px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: slideDirection > 0 ? -12 : 12, filter: 'blur(3px)' }}
                      transition={{ duration: transitionDuration, ease: [0.22, 1, 0.36, 1] }}
                      className="rounded-xl p-3.5 bg-[#0c0a08]/85 backdrop-blur-2xl border border-[#C6A15B]/35 shadow-xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.25em] text-[#C6A15B] uppercase font-bold">
                          {activeSpiritIndex === 0 ? 'YOUR MATCH' : 'CELLAR ARCHETYPE'}
                        </span>
                        <span className="font-mono text-[8px] tracking-wider text-stone/50 uppercase">
                          {specsLine}
                        </span>
                      </div>

                      <h2 className="font-serif text-lg text-white font-medium truncate">
                        {activeSpirit.fullName}
                      </h2>

                      <p className="text-stone/75 text-[11px] font-light leading-snug line-clamp-2">
                        {activeSpirit.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-lg text-[#F5CE76]">
                            {Math.round(activeMatchScore)}%
                          </span>
                          <span className="font-mono text-[8px] text-stone/50 tracking-wider">
                            {activeSpiritIndex === 0 ? 'OPTIMAL' : 'MATCH'}
                          </span>
                        </div>

                        <div className="flex gap-1">
                          {activeSpirit.descriptors.slice(0, 2).map((d) => (
                            <span key={d} className="px-2 py-0.5 rounded text-[9px] font-mono bg-white/5 border border-white/10 text-stone/80">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 pt-1.5 border-t border-white/10">
                        <Link
                          to={`/spirit/${activeSpirit.id}`}
                          className="w-full py-2.5 text-center rounded-lg bg-gradient-to-r from-[#1b1712] via-[#2a2215] to-[#1b1712] hover:from-[#352a19] hover:to-[#2a2215] border border-[#C6A15B]/70 text-[#FAF7F2] font-mono text-[10px] uppercase font-semibold tracking-[0.22em] shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <span>EXPLORE THIS EXPRESSION</span>
                          <span className="text-[#F5CE76]">→</span>
                        </Link>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setShowCellarModal(true)}
                            className="group flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border border-[#C6A15B]/70 hover:border-[#F5CE76] bg-gradient-to-b from-[#1c1813] to-[#0c0a08] text-[#E5C378] hover:text-[#FFF8DB] font-mono text-[9px] uppercase tracking-wider font-semibold shadow-md transition-all cursor-pointer"
                          >
                            <span>CELLAR SELECTION</span>
                            <span className="text-[#F5CE76] text-xs">→</span>
                          </button>
                          <button
                            type="button"
                            onClick={onRestart}
                            className="group flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border border-[#C6A15B]/70 hover:border-[#F5CE76] bg-gradient-to-b from-[#1c1813] to-[#0c0a08] text-[#E5C378] hover:text-[#FFF8DB] font-mono text-[9px] uppercase tracking-wider font-semibold shadow-md transition-all cursor-pointer"
                          >
                            <span className="text-[#F5CE76] text-xs transition-transform duration-500 group-hover:rotate-180">↻</span>
                            <span>RE-DISCOVER</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`mob-flavour-${activeSpirit.id}`}
                      initial={{ opacity: 0, y: slideDirection > 0 ? 12 : -12, filter: 'blur(3px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: slideDirection > 0 ? -12 : 12, filter: 'blur(3px)' }}
                      transition={{ duration: transitionDuration, ease: [0.22, 1, 0.36, 1] }}
                      className="rounded-xl p-3 bg-[#0c0a08]/85 backdrop-blur-2xl border border-[#C6A15B]/35 shadow-xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.25em] text-[#C6A15B] uppercase font-bold">
                          FLAVOUR PROFILE
                        </span>
                        <span className="font-mono text-[8px] tracking-wider text-stone/50 uppercase">
                          5 DIMENSIONS
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                        {flavourBars.slice(0, 4).map((fb) => (
                          <div key={fb.label} className="space-y-0.5">
                            <div className="flex justify-between text-[9px] font-mono">
                              <span className="text-stone/60">{fb.label}</span>
                              <span className="text-[#F5CE76]">{fb.val}%</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-[#C6A15B] to-[#F5CE76]" style={{ width: `${fb.val}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col gap-2 pt-1.5 border-t border-white/10">
                        <Link
                          to={`/spirit/${activeSpirit.id}`}
                          className="w-full py-2.5 text-center rounded-lg bg-gradient-to-r from-[#1b1712] via-[#2a2215] to-[#1b1712] hover:from-[#352a19] hover:to-[#2a2215] border border-[#C6A15B]/70 text-[#FAF7F2] font-mono text-[10px] uppercase font-semibold tracking-[0.22em] shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <span>EXPLORE THIS EXPRESSION</span>
                          <span className="text-[#F5CE76]">→</span>
                        </Link>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setShowCellarModal(true)}
                            className="group flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border border-[#C6A15B]/70 hover:border-[#F5CE76] bg-gradient-to-b from-[#1c1813] to-[#0c0a08] text-[#E5C378] hover:text-[#FFF8DB] font-mono text-[9px] uppercase tracking-wider font-semibold shadow-md transition-all cursor-pointer"
                          >
                            <span>CELLAR SELECTION</span>
                            <span className="text-[#F5CE76] text-xs">→</span>
                          </button>
                          <button
                            type="button"
                            onClick={onRestart}
                            className="group flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border border-[#C6A15B]/70 hover:border-[#F5CE76] bg-gradient-to-b from-[#1c1813] to-[#0c0a08] text-[#E5C378] hover:text-[#FFF8DB] font-mono text-[9px] uppercase tracking-wider font-semibold shadow-md transition-all cursor-pointer"
                          >
                            <span className="text-[#F5CE76] text-xs transition-transform duration-500 group-hover:rotate-180">↻</span>
                            <span>RE-DISCOVER</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── ANIMATED BOTTOM ARROW (MOVE DOWN ANIMATION, NO WORDINGS) ── */}
            <div className="relative z-30 w-full flex justify-center pb-2 sm:pb-3 shrink-0 pointer-events-auto">
              <button
                type="button"
                onClick={() => handleNextSpirit(0.55)}
                className="group relative p-2 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 focus:outline-none"
                aria-label="Next expression"
              >
                <motion.div
                  animate={{
                    y: [0, 8, 0],
                  }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#C6A15B]/50 bg-black/60 group-hover:bg-[#C6A15B]/20 group-hover:border-[#F5CE76] shadow-[0_0_16px_rgba(198,161,91,0.25)] group-hover:shadow-[0_0_24px_rgba(198,161,91,0.55)] transition-all duration-300"
                >
                  <motion.svg
                    animate={{
                      y: [0, 3, 0],
                    }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="w-4 h-4 text-[#E5C378] group-hover:text-[#FFF8DB] transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </motion.div>
              </button>
            </div>
          </motion.div>



      {/* ── 5. CELLAR SELECTION SLIDE-OVER MODAL ── */}
      <AnimatePresence>
        {showCellarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl bg-[#0e0d0b] border border-[#C6A15B]/40 rounded-xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div>
                  <span className="text-[9px] font-mono tracking-[0.35em] text-[#C6A15B] uppercase block">
                    THE CELLAR SPECTRUM
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#FAF7F2] font-normal">
                    Expressions From Your Profile
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCellarModal(false)}
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-stone/60 hover:text-white hover:border-gold transition-colors"
                >
                  <IoClose className="w-4 h-4" />
                </button>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {secondaryMatches.slice(0, 3).map((spirit) => (
                  <Link
                    key={spirit.id}
                    to={`/spirit/${spirit.id}`}
                    className="group bg-[#14120f] border border-white/10 hover:border-[#C6A15B]/60 rounded-lg p-4 flex flex-col items-center justify-between transition-all duration-300 hover:shadow-[0_10px_25px_rgba(198,161,91,0.2)]"
                  >
                    <div className="h-36 w-full flex items-center justify-center my-2">
                      <img
                        src={spirit.image}
                        alt={spirit.fullName}
                        className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="text-center w-full pt-2 border-t border-white/5">
                      <h4 className="font-serif text-sm text-[#FAF7F2] truncate group-hover:text-[#E5C378]">
                        {spirit.fullName}
                      </h4>
                      <span className="text-[8px] font-mono text-[#C6A15B]/80 uppercase tracking-widest block mt-0.5">
                        {spirit.origin}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <Link
                  to="/collection"
                  className="px-6 py-2.5 rounded-full border border-[#C6A15B] text-[#FAF7F2] hover:bg-[#C6A15B]/20 font-mono text-[10px] uppercase tracking-[0.25em] transition-all shadow-[0_0_15px_rgba(198,161,91,0.25)]"
                >
                  Explore Full Cellar Collection →
                </Link>
                <button
                  type="button"
                  onClick={() => setShowCellarModal(false)}
                  className="font-mono text-[10px] text-stone/50 hover:text-white uppercase tracking-wider transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
