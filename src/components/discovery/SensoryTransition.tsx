import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { AtmosphereType } from '../../data/sensoryTransitionData'

export interface SensoryTransitionProps {
  stageNumber: number
  totalStages: number
  category: string
  title: string
  description: string
  imageUrl: string
  fallbackImageUrl?: string
  atmosphere?: AtmosphereType
  ambientHue?: number
  onTransitionComplete: () => void
}

/**
 * SensoryTransition — Cinematic Editorial Transition Chapter
 *
 * Appears exclusively between Question A and Question B.
 * Introduces the sensory concept of Question B.
 *
 * Design Guidelines:
 * - One unified, immutable layout for all 13 questions
 * - Symmetrical luxury editorial composition (whisky cellar + luxury fragrance reveal)
 * - Single, non-overlapping header: "Nº8 RESERVE" (top-left) & "STAGE XX / 13" (top-right)
 * - Lower-middle 45-50% physical centerpiece resting on a black marble pedestal with a thin gold edge
 * - NO circular avatar crops, NO sci-fi orbital rings, NO glowing HUDs, NO dashboard elements
 * - 4 distinct visual depth layers: Background -> Atmosphere -> Sensory Object -> Marble Pedestal
 * - Explicit 4-phase lifecycle: Enter -> Hold -> Exit -> onTransitionComplete
 */
export default function SensoryTransition({
  stageNumber,
  totalStages,
  category,
  title,
  description,
  imageUrl,
  fallbackImageUrl,
  atmosphere = 'amber',
  ambientHue = 38,
  onTransitionComplete,
}: SensoryTransitionProps) {
  // Phase state: 'enter' -> 'hold' -> 'exit'
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter')

  useEffect(() => {
    // Phase 1: Enter (0 - 800ms)
    const holdTimer = setTimeout(() => {
      setPhase('hold')
    }, 850)

    // Phase 2: Hold (850 - 2000ms), then begin Exit
    const exitTimer = setTimeout(() => {
      setPhase('exit')
    }, 2050)

    // Phase 3: Exit complete (2050 - 2500ms), advance to Question B
    const completeTimer = setTimeout(() => {
      onTransitionComplete()
    }, 2500)

    return () => {
      clearTimeout(holdTimer)
      clearTimeout(exitTimer)
      clearTimeout(completeTimer)
    }
  }, [onTransitionComplete])

  return (
    <div className="fixed inset-0 w-screen h-[100svh] z-[90] overflow-hidden select-none pointer-events-none flex flex-col justify-between">
      {/* ── LAYER 1: CINEMATIC CELLAR BACKGROUND & CONTROLLED VIGNETTE ── */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-700"
        style={{
          backgroundImage: "url('/images/whisky-sanctuary-plate.jpg')",
          filter: 'brightness(0.85) contrast(1.1)',
        }}
        aria-hidden="true"
      />

      {/* Atmospheric Ambient Radial Warmth */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: phase === 'exit' ? 0 : 0.38,
          scale: phase === 'exit' ? 1.05 : 1,
        }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] rounded-full blur-[140px] z-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, hsla(${ambientHue}, 80%, 48%, 0.4) 0%, hsla(${ambientHue}, 65%, 25%, 0.15) 50%, transparent 75%)`,
        }}
        aria-hidden="true"
      />

      {/* Deep Obsidian Edge Vignette (center brighter than edges) */}
      <div
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,4,3,0.55)_65%,rgba(5,4,3,0.95)_100%)] pointer-events-none"
        aria-hidden="true"
      />

      {/* ── LAYER 2: THE SINGLE TRANSITION HEADER (TOP ~10%) ── */}
      <header className="relative w-full flex items-center justify-between px-6 sm:px-12 pt-6 sm:pt-8 z-30 select-none">
        {/* TOP LEFT: Nº8 RESERVE in small, elegant champagne-gold */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <img
            src="/images/logo-BJ7D25WF.webp"
            alt="No. 8 Reserve"
            className="h-8 sm:h-10 w-auto object-contain opacity-95 drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)] filter brightness-105"
          />
          <span className="w-px h-3.5 bg-[#C6A15B]/40" />
          <span className="font-serif text-[11px] sm:text-xs tracking-[0.22em] text-[#C6A15B] uppercase font-light">
            TASTE DISCOVERY
          </span>
        </div>

        {/* TOP RIGHT: STAGE XX / 13 */}
        <div className="font-sans text-[10px] sm:text-[11px] tracking-[0.28em] text-[#FAF7F2]/60 font-light uppercase flex items-center gap-2.5">
          <span className="w-5 h-px bg-[#C6A15B]/40 inline-block" />
          <span>STAGE {String(stageNumber).padStart(2, '0')} / {String(totalStages).padStart(2, '0')}</span>
        </div>
      </header>

      {/* ── LAYER 3: UPPER TYPOGRAPHY (NEXT ~15%) ── */}
      <div className="relative w-full flex flex-col items-center text-center px-4 max-w-2xl mx-auto z-20 mt-1 sm:mt-3">
        {/* Category: Small uppercase, letter spacing 0.25em, champagne gold */}
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: phase === 'exit' ? 0 : 1,
            y: phase === 'exit' ? -12 : 0,
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-sans text-[10px] sm:text-[11px] tracking-[0.25em] text-[#C6A15B] uppercase font-medium mb-1 sm:mb-2 drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]"
        >
          {category}
        </motion.span>

        {/* Title: Large elegant serif typography */}
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{
            opacity: phase === 'exit' ? 0 : 1,
            y: phase === 'exit' ? -15 : 0,
          }}
          transition={{ duration: 0.55, delay: 0.35 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-[#FAF7F2] font-normal tracking-[0.03em] leading-tight drop-shadow-[0_2px_22px_rgba(0,0,0,0.95)] uppercase"
        >
          {title}
        </motion.h1>

        {/* Description: Small refined italic serif (max 2 lines) */}
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{
            opacity: phase === 'exit' ? 0 : 0.85,
            y: phase === 'exit' ? -10 : 0,
          }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="font-serif italic text-xs sm:text-sm md:text-base text-[#FAF7F2]/80 max-w-xl leading-relaxed text-center mt-2 px-4 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]"
        >
          {description}
        </motion.p>
      </div>

      {/* ── LAYER 4: MAIN SENSORY CENTERPIECE (MIDDLE ~55% & BOTTOM ~20%) ── */}
      <div className="relative w-full max-w-[560px] mx-auto flex flex-col items-center justify-end z-10 my-auto pb-4 sm:pb-6">
        
        {/* ── 4A. ATMOSPHERIC LAYER (Restrained, item-specific) ── */}
        <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
          {/* Smoke atmosphere */}
          {atmosphere === 'smoke' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'exit' ? 0 : 0.35 }}
              transition={{ duration: 0.8 }}
              className="absolute w-[420px] h-[340px] bg-gradient-to-t from-transparent via-[#C6A15B]/15 to-transparent blur-3xl"
            />
          )}

          {/* Cream / Velvet atmosphere */}
          {atmosphere === 'cream' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'exit' ? 0 : 0.28 }}
              transition={{ duration: 0.8 }}
              className="absolute w-[440px] h-[320px] bg-gradient-to-t from-transparent via-[#FFF8E7]/15 to-transparent blur-3xl"
            />
          )}

          {/* Citrus / Botanical atmosphere */}
          {(atmosphere === 'citrus' || atmosphere === 'botanical') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'exit' ? 0 : 0.3 }}
              transition={{ duration: 0.8 }}
              className="absolute w-[420px] h-[320px] bg-gradient-to-t from-transparent via-[#C6D8AF]/15 to-transparent blur-3xl"
            />
          )}

          {/* Ember / Spice atmosphere */}
          {atmosphere === 'ember' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'exit' ? 0 : 0.38 }}
              transition={{ duration: 0.8 }}
              className="absolute w-[440px] h-[340px] bg-gradient-to-t from-transparent via-[#E25822]/15 to-transparent blur-3xl"
            />
          )}

          {/* Soft floating dust/ember motes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'exit' ? 0 : 0.6 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700]/40 blur-xs absolute -top-8 left-1/4 animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-[#FFE57F]/50 blur-xs absolute top-12 right-1/4 animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-[#FFD700]/30 blur-xs absolute top-24 left-1/3 animate-pulse" />
          </motion.div>
        </div>

        {/* ── 4B. SENSORY OBJECT (Arch Vitrine Centerpiece, NOT a circle) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, filter: 'blur(8px)', y: 30 }}
          animate={{
            opacity: phase === 'exit' ? 0 : 1,
            scale: phase === 'exit' ? 0.97 : 1,
            filter: phase === 'exit' ? 'blur(6px)' : 'blur(0px)',
            y: phase === 'exit' ? 12 : 0,
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-[280px] sm:w-[380px] md:w-[440px] h-[240px] sm:h-[300px] md:h-[340px] z-10 flex flex-col items-center justify-end"
        >
          {/* Architectural Vitrine Silhouette: Curved arched top, resting directly on the pedestal */}
          <div className="relative w-full h-full rounded-t-[140px] sm:rounded-t-[190px] md:rounded-t-[220px] rounded-b-none overflow-hidden bg-black/90 shadow-[0_25px_60px_rgba(0,0,0,0.95)] border-t border-x border-[#C6A15B]/30">
            {/* High-Resolution Sensory Photograph */}
            <motion.img
              src={imageUrl}
              alt={title}
              initial={{ scale: 1.08 }}
              animate={{ scale: [1.02, 1.05, 1.02] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement
                const fallback = fallbackImageUrl || `/images/flavors/${title.toLowerCase().replace(/\s+/g, '')}.jpg`
                if (target.src !== fallback && !target.src.endsWith(fallback)) {
                  target.src = fallback
                }
              }}
            />

            {/* Subtle Vignette Gradient: Edges softly melt into cellar darkness */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(5,4,3,0.7)_90%)] pointer-events-none z-10" />

            {/* Fine Specular Vitrine Highlight (Subtle crystal glass curvature) */}
            <div className="absolute inset-0 rounded-t-[140px] sm:rounded-t-[190px] md:rounded-t-[220px] border-t border-l border-white/20 pointer-events-none z-20" />
          </div>
        </motion.div>

        {/* ── 4C. BLACK MARBLE PEDESTAL PLATFORM (Physical luxury platform, NO sci-fi rings) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: phase === 'exit' ? 0 : 1,
            scale: phase === 'exit' ? 0.98 : 1,
          }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="relative w-[320px] sm:w-[440px] md:w-[500px] flex flex-col items-center pointer-events-none z-20"
        >
          {/* Top chamfered champagne-gold edge */}
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#C6A15B]/60 to-transparent" />

          {/* Polished Obsidian Marble Slab */}
          <div className="w-full h-5 sm:h-6 rounded-[100%] bg-gradient-to-b from-[#1c1916] via-[#0d0c0a] to-[#040404] border-t border-[#C6A15B]/40 shadow-[0_10px_35px_rgba(0,0,0,0.98)]" />

          {/* Deep Ground Contact Shadow */}
          <div className="w-[85%] h-4 rounded-full bg-black/90 blur-md -mt-2" />

          {/* Subtle Ground Reflection Fading Downward */}
          <div
            className="w-[80%] h-8 -mt-2 pointer-events-none opacity-20 blur-sm overflow-hidden"
            style={{
              background: `radial-gradient(ellipse at center, hsla(${ambientHue}, 60%, 40%, 0.4) 0%, transparent 75%)`,
            }}
          />
        </motion.div>

      </div>

      {/* ── BOTTOM ANCHOR SPACING (BOTTOM ~20% FADE) ── */}
      <div className="w-full h-4 sm:h-8 pointer-events-none" />
    </div>
  )
}
