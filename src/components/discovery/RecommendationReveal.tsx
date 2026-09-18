import { useState, useEffect, useRef, WheelEvent, TouchEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Spirit } from '../../types'

interface RecommendationRevealProps {
  primaryMatch: Spirit
  secondaryMatches: Spirit[]
  matchScore: number
  onRestart: () => void
}

/**
 * RecommendationReveal (Stage 05 Final Reveal)
 * Haute Distillerie 3-Stage Cinematic Presentation:
 * - NO tabs on top (pure, quiet luxury)
 * - Clean, non-overlapping stage transitions (mode="wait"):
 *   - Stage 0: The Synthesis Prologue (Initial statement & concordance)
 *   - Stage 1: The Sanctuary Hero Bottle (Dedicated centerpiece: slanted, slowly rotating, glowing)
 *   - Stage 2: The Tasting Dossier (Crystal-clear, high-contrast sommelier story, palate notes & actions)
 * - Seamless scroll wheel, touch swipe, and depth gauge navigation
 * - Fixed 100svh viewport with internal dossier scrolling
 */
export default function RecommendationReveal({
  primaryMatch,
  secondaryMatches,
  matchScore,
  onRestart,
}: RecommendationRevealProps) {
  // Current active stage: 0 (Prologue), 1 (Bottle Sanctuary), 2 (Tasting Dossier)
  const [stage, setStage] = useState<number>(0)
  const isTransitioning = useRef<boolean>(false)
  const touchStartY = useRef<number | null>(null)
  const detailsScrollRef = useRef<HTMLDivElement>(null)

  const goToStage = (targetStage: number) => {
    if (isTransitioning.current) return
    isTransitioning.current = true
    setStage(targetStage)
    setTimeout(() => {
      isTransitioning.current = false
    }, 450)
  }

  // Wheel Gesture Handler: Smoothly advances or returns between stages
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (isTransitioning.current) return

    // If on Stage 2 (Dossier), check if the internal container is scrolling
    if (stage === 2 && detailsScrollRef.current) {
      const { scrollTop } = detailsScrollRef.current
      if (e.deltaY < -25 && scrollTop <= 2) {
        // At the very top scrolling up -> return to Bottle Sanctuary
        goToStage(1)
        return
      }
      // Otherwise allow native internal scroll of the dossier content
      return
    }

    if (e.deltaY > 25) {
      // Scroll down -> advance
      if (stage === 0) goToStage(1)
      else if (stage === 1) goToStage(2)
    } else if (e.deltaY < -25) {
      // Scroll up -> return
      if (stage === 1) goToStage(0)
      else if (stage === 2) goToStage(1)
    }
  }

  // Touch Gesture Handlers for Mobile / Tablet
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartY.current === null || isTransitioning.current) return
    const currentY = e.touches[0].clientY
    const deltaY = touchStartY.current - currentY

    if (stage === 2 && detailsScrollRef.current) {
      const { scrollTop } = detailsScrollRef.current
      if (deltaY < -35 && scrollTop <= 2) {
        goToStage(1)
        touchStartY.current = currentY
        return
      }
      return
    }

    if (deltaY > 40) {
      // Swipe up (advance)
      if (stage < 2) {
        goToStage(stage + 1)
        touchStartY.current = currentY
      }
    } else if (deltaY < -40) {
      // Swipe down (return)
      if (stage > 0) {
        goToStage(stage - 1)
        touchStartY.current = currentY
      }
    }
  }

  // Keyboard Navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        goToStage(Math.min(2, stage + 1))
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        goToStage(Math.max(0, stage - 1))
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [stage])

  return (
    <div
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className="relative w-full h-full min-h-0 flex flex-col justify-between select-none overflow-hidden"
    >
      {/* ── Quiet Luxury Vertical Depth Gauge (Far Right Edge, No Cheap Tabs) ── */}
      <div
        className="pointer-events-none fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-center gap-3"
        aria-hidden="true"
      >
        <span className="text-[8px] font-mono tracking-widest text-[#C6A15B]/50 uppercase rotate-90 origin-center mb-3">
          DEPTH
        </span>
        <div className="flex flex-col items-center gap-3">
          {[0, 1, 2].map((idx) => {
            const isActive = stage === idx
            return (
              <div
                key={idx}
                className={`w-2 h-2 rotate-45 transition-all duration-500 ${
                  isActive
                    ? 'bg-[#C6A15B] shadow-[0_0_10px_#C6A15B] scale-125'
                    : 'border border-[#C6A15B]/30 bg-[#080807]'
                }`}
              />
            )
          })}
        </div>
      </div>

      {/* ── Primary Stage Container with Clean Non-Overlapping Transitions ── */}
      <div className="relative flex-1 min-h-0 w-full h-full flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* STAGE 0: THE SYNTHESIS PROLOGUE */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          {stage === 0 && (
            <motion.div
              key="stage-0-prologue"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -28, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4 z-10"
            >
              {/* Animated Gold Heraldic Seal */}
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-13 h-13 rounded-full border border-[#C6A15B]/50 bg-[#12100d] flex items-center justify-center mb-6 shadow-[0_0_28px_rgba(198,161,91,0.35)]"
              >
                <span className="text-[#E5C378] text-xl font-serif">✦</span>
              </motion.div>

              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] shadow-[0_0_8px_#C6A15B]" />
                <span className="text-[10px] sm:text-xs font-mono tracking-[0.32em] uppercase text-[#C6A15B]">
                  DIAGEO Bespoke Palate Synthesis
                </span>
              </div>

              <h1 className="font-serif text-[clamp(2.3rem,5.2vw,3.9rem)] text-[#FAF7F2] font-normal tracking-tight leading-[1.08] mb-4">
                We've found something that feels like you.
              </h1>

              <p className="text-stone/70 text-sm sm:text-base font-sans tracking-wide max-w-lg mx-auto mb-8 font-light leading-relaxed">
                Calibrated across your sensory choices, ambient mood, and flavor spectrum.
              </p>

              {/* Concordance Gold Pill */}
              <div className="flex items-center gap-2.5 px-4 py-1.5 bg-[#12100d] border border-[#C6A15B]/40 rounded-full font-mono text-[11px] tracking-[0.24em] text-[#E5C378] shadow-[0_4px_20px_rgba(198,161,91,0.25)] mb-8">
                <span className="text-[#C6A15B]">✦</span>
                <span>{matchScore}% SENSORY CONCORDANCE</span>
              </div>

              {/* Breathing Scroll Prompt */}
              <button
                type="button"
                onClick={() => goToStage(1)}
                className="group flex flex-col items-center gap-2 text-[#C6A15B]/80 hover:text-[#FAF7F2] cursor-pointer transition-colors pt-2"
              >
                <span className="text-[10px] font-mono tracking-[0.28em] uppercase">
                  Scroll or Click to Unveil Bottle
                </span>
                <motion.span
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-base"
                >
                  ↓
                </motion.span>
              </button>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* STAGE 1: THE BOTTLE SANCTUARY (Dedicated Slanted Rotating Showcase) */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          {stage === 1 && (
            <motion.div
              key="stage-1-bottle"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full flex flex-col items-center justify-center text-center px-4 z-20"
            >
              {/* Volumetric Glowing Amber Light Aura Behind Bottle */}
              <motion.div
                animate={{
                  opacity: [0.45, 0.7, 0.45],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[560px] h-[380px] sm:h-[560px] rounded-full blur-[95px] pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgba(198,161,91,0.65) 0%, rgba(198,161,91,0.25) 45%, transparent 72%)',
                }}
                aria-hidden="true"
              />

              {/* Title Floating Above Bottle */}
              <div className="mb-2 z-10">
                <span className="text-[10px] font-mono tracking-[0.32em] uppercase text-[#C6A15B]/90 block mb-1">
                  {primaryMatch.category} · {primaryMatch.origin}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-normal tracking-tight">
                  {primaryMatch.fullName.toUpperCase()}
                </h2>
                <p className="font-serif text-sm sm:text-base italic text-[#E5C378] mt-0.5">
                  {primaryMatch.descriptors.join(' · ')}
                </p>
              </div>

              {/* ── Slanted & Slowly Rotating 3D Bottle Showcase ── */}
              <div
                className="relative w-full max-w-[290px] sm:max-w-[340px] h-[290px] sm:h-[360px] flex items-center justify-center my-1"
                style={{ perspective: 1200 }}
              >
                {/* Concentric Architectural Pedestal Rings on Floor */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[260px] sm:w-[320px] h-[55px] pointer-events-none">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
                    className="w-full h-full rounded-full border border-dashed border-[#C6A15B]/35"
                    style={{ transform: 'rotateX(76deg)' }}
                  />
                  <div
                    className="absolute inset-x-6 inset-y-2 rounded-full border border-[#C6A15B]/50 bg-[#C6A15B]/15 shadow-[0_0_25px_rgba(198,161,91,0.4)]"
                    style={{ transform: 'rotateX(76deg)' }}
                  />
                </div>

                {/* 3D Bottle Rotation & Slanted Posture */}
                <motion.div
                  animate={{
                    rotateY: [-16, 16, -16],
                    rotateZ: [-8, -4, -8],
                    rotateX: [6, 9, 6],
                    y: [-10, 8, -10],
                  }}
                  transition={{
                    rotateY: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
                    rotateZ: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
                    rotateX: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
                    y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="relative w-[210px] sm:w-[250px] h-[270px] sm:h-[330px] flex items-center justify-center"
                >
                  {/* Glowing Amber Glass Aura */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#C6A15B]/30 via-transparent to-transparent rounded-2xl filter blur-xl opacity-75" />

                  {/* Bottle Visual Box */}
                  <div className="relative w-full h-full flex items-center justify-center rounded-2xl overflow-hidden shadow-[0_25px_65px_rgba(0,0,0,0.95)] border border-[#C6A15B]/35 bg-[#080807]/70">
                    <img
                      src={primaryMatch.image}
                      alt={primaryMatch.fullName}
                      className="w-full h-full object-cover object-center filter brightness-[1.06] contrast-[1.08]"
                    />

                    {/* Luminous Light Sweep Sheen */}
                    <motion.div
                      animate={{ x: ['-140%', '240%'] }}
                      transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
                      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[#FAF7F2]/25 to-transparent skew-x-[-25deg]"
                      aria-hidden="true"
                    />

                    {/* Luxury Gold Hairline Corner Brackets */}
                    <div className="pointer-events-none absolute top-2 left-2 w-3 h-3 border-t border-l border-[#C6A15B]/60" />
                    <div className="pointer-events-none absolute top-2 right-2 w-3 h-3 border-t border-r border-[#C6A15B]/60" />
                    <div className="pointer-events-none absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#C6A15B]/60" />
                    <div className="pointer-events-none absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#C6A15B]/60" />
                  </div>

                  {/* Mirrored Base Shadow */}
                  <div
                    className="absolute -bottom-8 inset-x-8 h-10 bg-gradient-to-b from-[#C6A15B]/30 to-transparent blur-md rounded-full pointer-events-none"
                    style={{ transform: 'rotateX(80deg)' }}
                  />
                </motion.div>
              </div>

              {/* Concordance Seal Centered Below Bottle */}
              <div className="mt-2 mb-2 flex items-center gap-2 px-3.5 py-1 bg-[#12100d] border border-[#C6A15B]/40 rounded-full font-mono text-[10px] tracking-[0.24em] text-[#E5C378] shadow-[0_4px_16px_rgba(198,161,91,0.2)] z-10">
                <span className="text-[#C6A15B]">✦</span>
                <span>{matchScore}% SENSORY CONCORDANCE</span>
              </div>

              {/* Continuous Scroll Prompt */}
              <button
                type="button"
                onClick={() => goToStage(2)}
                className="group flex flex-col items-center gap-1 text-[#C6A15B]/80 hover:text-[#FAF7F2] cursor-pointer transition-colors mt-1 z-10"
              >
                <span className="text-[10px] font-mono tracking-[0.26em] uppercase">
                  Scroll or Click for Tasting Dossier
                </span>
                <motion.span
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-sm"
                >
                  ↓
                </motion.span>
              </button>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* STAGE 2: THE TASTING DOSSIER (Pure, Crisp, 100% High-Contrast) */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          {stage === 2 && (
            <motion.div
              key="stage-2-dossier"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full max-w-5xl mx-auto flex flex-col justify-between overflow-hidden px-3 sm:px-6 z-30 bg-[#080807]/95 rounded-sm border border-[#C6A15B]/25 py-2 sm:py-4 shadow-[0_0_60px_rgba(0,0,0,0.9)]"
            >
              {/* Internal Smooth Scrollable Container for Dossier Details */}
              <div
                ref={detailsScrollRef}
                className="flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-3 py-2 space-y-6"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(198,161,91,0.4) transparent' }}
              >
                {/* Two-Column / Balanced Dossier Architecture */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
                  {/* Left Column: Companion Floating Bottle View */}
                  <div className="lg:col-span-4 flex flex-col items-center justify-center">
                    <div className="relative w-[180px] sm:w-[210px] h-[250px] sm:h-[290px] rounded-xl overflow-hidden border border-[#C6A15B]/40 bg-[#0e0d0c] shadow-[0_15px_40px_rgba(0,0,0,0.85)]">
                      <img
                        src={primaryMatch.image}
                        alt={primaryMatch.fullName}
                        className="w-full h-full object-cover object-center filter brightness-[1.04]"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080807]/90 via-transparent to-transparent" />
                      <div className="absolute bottom-2.5 inset-x-2 text-center">
                        <span className="text-[9px] font-mono tracking-widest text-[#E5C378] uppercase">
                          ✦ {matchScore}% SENSORY MATCH
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => goToStage(1)}
                      className="mt-3 text-[10px] font-mono tracking-widest uppercase text-[#C6A15B]/70 hover:text-[#C6A15B] transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>↑ View Bottle Sanctuary</span>
                    </button>
                  </div>

                  {/* Right Column: Editorial Dossier Content */}
                  <div className="lg:col-span-8 flex flex-col text-left">
                    {/* Category & Origin Bar */}
                    <div className="flex flex-wrap items-center gap-3 mb-2 font-mono text-[10px] sm:text-xs tracking-[0.28em] text-[#C6A15B] uppercase">
                      <span>{primaryMatch.category}</span>
                      <span className="text-stone/40">·</span>
                      <span>{primaryMatch.origin}</span>
                      <span className="text-stone/40">·</span>
                      <span>{primaryMatch.abv}</span>
                    </div>

                    {/* Monumental Product Title */}
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#FAF7F2] font-normal leading-[1.08] tracking-tight mb-2">
                      {primaryMatch.fullName.toUpperCase()}
                    </h2>

                    {/* Descriptors */}
                    <div className="flex flex-wrap items-center gap-2 mb-4 font-serif text-base sm:text-lg italic text-[#E5C378]">
                      {primaryMatch.descriptors.map((desc, i) => (
                        <span key={desc} className="flex items-center gap-2">
                          <span>{desc}</span>
                          {i < primaryMatch.descriptors.length - 1 && (
                            <span className="text-[#C6A15B]/40 text-xs not-italic">·</span>
                          )}
                        </span>
                      ))}
                    </div>

                    {/* Sommelier Story Description */}
                    <p className="text-sm sm:text-base text-[#DCD7D0] font-sans leading-relaxed mb-6 font-light">
                      {primaryMatch.description}
                    </p>

                    {/* Tasting Notes Palate */}
                    <div className="mb-5">
                      <span className="text-[9px] font-mono tracking-[0.24em] uppercase text-stone/40 block mb-2">
                        TASTING PALATE
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {primaryMatch.tastingNotes.map((note) => (
                          <span
                            key={note}
                            className="text-xs font-mono tracking-wider text-[#FAF7F2] bg-[#161412] border border-[#C6A15B]/30 px-3.5 py-1.5 rounded-full"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Cask & Pairing Architecture Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4 mb-6 border-y border-[#C6A15B]/20 text-xs">
                      <div className="bg-[#12100d]/80 border border-[#C6A15B]/20 rounded-xs p-3.5">
                        <span className="text-[9px] font-mono tracking-[0.24em] uppercase text-[#C6A15B] block mb-1">
                          CASK MATURATION
                        </span>
                        <span className="text-[#D8D4CE] font-sans text-xs font-light">
                          {primaryMatch.cask}
                        </span>
                      </div>
                      <div className="bg-[#12100d]/80 border border-[#C6A15B]/20 rounded-xs p-3.5">
                        <span className="text-[9px] font-mono tracking-[0.24em] uppercase text-[#C6A15B] block mb-1">
                          SERVING RITUAL
                        </span>
                        <span className="text-[#D8D4CE] font-sans text-xs font-light">
                          {primaryMatch.servingStyle}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <Link
                        to={`/spirit/${primaryMatch.id}`}
                        className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-sm bg-[#C6A15B] hover:bg-[#D8BD7A] text-[#080807] font-mono font-medium text-xs tracking-[0.22em] uppercase transition-all duration-300 shadow-[0_0_25px_rgba(198,161,91,0.35)] hover:-translate-y-0.5"
                      >
                        <span>Explore your match</span>
                        <span className="transition-transform duration-300 group-hover:translate-x-1 font-bold">
                          →
                        </span>
                      </Link>

                      <button
                        type="button"
                        onClick={onRestart}
                        className="inline-flex items-center gap-2 px-5 py-3.5 rounded-sm border border-[#C6A15B]/30 hover:border-[#C6A15B] text-stone/70 hover:text-ivory font-mono text-xs tracking-[0.22em] uppercase transition-all duration-300 cursor-pointer bg-[#0e0d0b]/70 hover:bg-[#141210]"
                      >
                        <span>↻ Recalibrate Taste</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Secondary Cellar Recommendations */}
                {secondaryMatches.length > 0 && (
                  <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-[#C6A15B]/80 block mb-0.5">
                          ALTERNATIVE EXPRESSIONS
                        </span>
                        <h3 className="font-serif text-lg text-[#FAF7F2] font-normal">
                          Other Bottles From Your Spectrum
                        </h3>
                      </div>
                      <Link
                        to="/collection"
                        className="text-[10px] font-mono tracking-widest text-stone/50 hover:text-ivory uppercase"
                      >
                        View Full Cellar →
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {secondaryMatches.map((spirit) => (
                        <div
                          key={spirit.id}
                          className="bg-[#100f0d] border border-white/10 hover:border-[#C6A15B]/40 rounded-xs p-3 flex items-center justify-between gap-3 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-14 bg-[#080807] rounded-xs p-1 flex items-center justify-center overflow-hidden border border-white/5 shrink-0">
                              <img
                                src={spirit.image}
                                alt={spirit.fullName}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <div>
                              <span className="text-[8px] font-mono tracking-widest uppercase text-stone/40 block">
                                {spirit.category}
                              </span>
                              <h4 className="font-serif text-xs text-[#FAF7F2] line-clamp-1">
                                {spirit.fullName}
                              </h4>
                              <span className="text-[9px] font-mono text-[#C6A15B]/80">
                                {spirit.origin}
                              </span>
                            </div>
                          </div>

                          <Link
                            to={`/spirit/${spirit.id}`}
                            className="text-[10px] font-mono text-gold-light hover:underline shrink-0"
                          >
                            View →
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Discreet Bottom Status & Scroll Guide (No Tabs) ── */}
      <footer className="relative z-30 flex items-center justify-between px-4 py-2 border-t border-[#C6A15B]/15 text-[10px] font-mono text-stone/40 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-[#C6A15B]" />
          <span className="uppercase tracking-widest text-[#C6A15B]/80">
            {stage === 0 && '01 · Palate Synthesis'}
            {stage === 1 && '02 · The Sanctuary Bottle'}
            {stage === 2 && '03 · Tasting Dossier'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {stage > 0 && (
            <button
              type="button"
              onClick={() => goToStage(stage - 1)}
              className="hover:text-[#FAF7F2] transition-colors cursor-pointer tracking-wider uppercase"
            >
              ↑ Previous
            </button>
          )}
          {stage < 2 && (
            <button
              type="button"
              onClick={() => goToStage(stage + 1)}
              className="text-[#C6A15B] hover:text-[#FAF7F2] transition-colors cursor-pointer tracking-wider uppercase flex items-center gap-1"
            >
              <span>Scroll to advance</span>
              <span>↓</span>
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}
