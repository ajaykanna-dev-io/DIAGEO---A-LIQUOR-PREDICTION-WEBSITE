import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Spirit } from '@/types'
import AmbientBarAudio from '@/components/AmbientBarAudio'
import { IoClose } from 'react-icons/io5'

interface RecommendationRevealProps {
  primaryMatch: Spirit
  secondaryMatches: Spirit[]
  matchScore: number
  onRestart: () => void
}

/**
 * RecommendationReveal
 * Replicates the ultra-premium editorial design from the reference image:
 * - Twilight penthouse tasting lounge background with circular illuminated marble altar
 * - Center: Dynamic bottle cutout from spirits.ts positioned on the glowing altar
 * - Left: "YOUR MATCH", Brand & Name, Specs, Tasting Description, Pill Tags, and Match Score Badge
 * - Right: Frosted glass "FLAVOUR PROFILE" card with SPICE, OAK, FRUIT, SMOKE, SWEETNESS bars,
 *   "EXPLORE THIS EXPRESSION →" CTA, and "CELLAR SELECTION → | RECALIBRATE ↻"
 * - Top Header: "A U R E L | TASTE DISCOVERY" and "YOUR JOURNEY ─── 08 / 08" with audio toggle
 * - Bottom Bar: "01 ── • ── ‹ ARCHETYPE › ── • ── 08"
 */
type RevealPhase = 'phase1_synthesis' | 'phase2_archetype' | 'final_recommendation'

export default function RecommendationReveal({
  primaryMatch,
  secondaryMatches,
  matchScore,
  onRestart,
}: RecommendationRevealProps) {
  const [phase, setPhase] = useState<RevealPhase>('final_recommendation')
  const [showCellarModal, setShowCellarModal] = useState(false)
  const [mobileTab, setMobileTab] = useState<'match' | 'flavour'>('match')

  // Parse title into brand line & expression line to match "Johnnie Walker" / "Blonde"
  const { brandLine, expressionLine } = useMemo(() => {
    if (primaryMatch.brand && primaryMatch.name) {
      return { brandLine: primaryMatch.brand, expressionLine: primaryMatch.name }
    }
    const parts = primaryMatch.fullName.split(' ')
    if (parts.length >= 3) {
      return {
        brandLine: parts.slice(0, 2).join(' '),
        expressionLine: parts.slice(2).join(' '),
      }
    }
    if (parts.length === 2) {
      return { brandLine: parts[0], expressionLine: parts[1] }
    }
    return { brandLine: primaryMatch.fullName, expressionLine: '' }
  }, [primaryMatch])

  // Clean, consistent specs line: "BLEND · SCOTLAND · 40%"
  const specsLine = useMemo(() => {
    const category = (primaryMatch.category || 'Single Malt').toUpperCase()
    const origin = (primaryMatch.origin || 'Scotland').split(',')[0].trim().toUpperCase()
    const abv = primaryMatch.abv || '40%'
    return `${category}  ·  ${origin}  ·  ${abv}`
  }, [primaryMatch])

  // 5 Flavour dimensions matching the reference image: SPICE, OAK, FRUIT, SMOKE, SWEETNESS
  const flavourBars = useMemo(() => {
    const prof = primaryMatch.profile || {
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
  }, [primaryMatch])

  const archetype = primaryMatch.archetype || 'THE EXPLORER'

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
          <Link
            to="/"
            className="font-serif tracking-[0.25em] text-base sm:text-xl text-[#FAF7F2] hover:text-[#E5C378] transition-colors whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
          >
            DIAGEO
          </Link>
          <span className="h-3.5 w-px bg-[#C6A15B]/40" />
          <span className="font-mono text-[8px] sm:text-[10px] tracking-[0.28em] text-[#C6A15B] uppercase font-semibold whitespace-nowrap drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
            TASTE DISCOVERY
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          {phase !== 'final_recommendation' ? (
            <button
              onClick={() => setPhase('final_recommendation')}
              className="px-3 py-1 rounded-full border border-[#C6A15B]/60 bg-black/70 text-[#F5CE76] hover:text-white font-mono text-[9px] uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_12px_rgba(198,161,91,0.25)]"
            >
              Skip to Reveal →
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-2 sm:gap-2.5 font-mono text-[8px] sm:text-[10px] tracking-[0.22em] text-stone/60 uppercase whitespace-nowrap">
              <span>YOUR JOURNEY</span>
              <span className="w-8 sm:w-12 h-px bg-white/20" />
              <span className="text-[#FAF7F2] font-semibold">13 / 13</span>
            </div>
          )}

          <AmbientBarAudio className="ml-2 sm:ml-4" />
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── PHASE 1: SENSORY ANALYSIS (DISTILLATION SYNTHESIS) ── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {phase === 'phase1_synthesis' && (
          <motion.div
            key="phase1-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto my-auto min-h-0"
          >
            {/* Concentric Golden Orbital Rings */}
            <div className="relative w-36 h-36 sm:w-48 sm:h-48 mb-6 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-[#C6A15B]/30 border-dashed"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-3 rounded-full border border-[#F5CE76]/40"
              />
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#1a140b] via-[#332512] to-[#120e08] border border-[#C6A15B] flex items-center justify-center shadow-[0_0_40px_rgba(198,161,91,0.45)]"
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#F5CE76]" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 21h8m-4-7v7m0-7a7 7 0 007-7V3H5v4a7 7 0 007 7z" />
                </svg>
              </motion.div>
            </div>

            {/* Stage Title */}
            <span className="font-mono text-[9px] sm:text-[11px] tracking-[0.38em] uppercase text-[#C6A15B] font-bold mb-2 block">
              PHASE 01 — SENSORY SYNTHESIS
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal tracking-tight mb-3">
              Synthesizing Palate Coordinates
            </h2>
            <p className="font-sans text-xs sm:text-sm text-stone/80 max-w-md mx-auto leading-relaxed mb-6 font-light">
              Calibrating oak maturity, smoke viscosity, and cask resonance against master blender profiles...
            </p>

            {/* 4 Animated Metric Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full max-w-lg mb-6">
              {[
                { label: 'VISCOSITY', val: '94%' },
                { label: 'CASK BALANCE', val: '88%' },
                { label: 'ESTERS', val: '91%' },
                { label: 'HARMONY', val: `${Math.round(matchScore)}%` },
              ].map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 * i + 0.2 }}
                  className="p-2.5 rounded-xl bg-black/60 border border-[#C6A15B]/30 backdrop-blur-md"
                >
                  <span className="font-mono text-[8px] sm:text-[9px] tracking-widest text-stone/50 block">
                    {m.label}
                  </span>
                  <span className="font-serif text-base sm:text-lg text-[#F5CE76] font-light">
                    {m.val}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Auto progress bar */}
            <div className="w-48 sm:w-64 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.8, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-[#C6A15B] via-[#F5CE76] to-white shadow-[0_0_10px_#F5CE76]"
              />
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* ── PHASE 2: BESPOKE ARCHETYPE IDENTIFIED ── */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {phase === 'phase2_archetype' && (
          <motion.div
            key="phase2-container"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto my-auto min-h-0"
          >
            <span className="font-mono text-[9px] sm:text-[11px] tracking-[0.38em] uppercase text-[#C6A15B] font-bold mb-3 block">
              PHASE 02 — ARCHETYPE IDENTIFIED
            </span>

            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="mb-3 flex items-center justify-center gap-2"
            >
              <span className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent to-[#C6A15B]" />
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-stone/60 font-semibold">
                YOUR TASTE PROFILE ARCHETYPE
              </span>
              <span className="w-12 sm:w-16 h-px bg-gradient-to-l from-transparent to-[#C6A15B]" />
            </motion.div>

            {/* Unveiled Archetype Title */}
            <motion.h1
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#FAF7F2] font-normal tracking-tight mb-4 drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)]"
            >
              ‹ {archetype} ›
            </motion.h1>

            {/* Match Affinity Badge */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#C6A15B]/60 bg-black/70 backdrop-blur-xl shadow-[0_0_25px_rgba(198,161,91,0.35)] mb-6"
            >
              <div className="w-7 h-7 rounded-full bg-[#C6A15B]/20 border border-[#C6A15B] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#F5CE76]" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 21h8m-4-7v7m0-7a7 7 0 007-7V3H5v4a7 7 0 007 7z" />
                </svg>
              </div>
              <span className="font-serif text-xl sm:text-2xl text-white font-light">
                {Math.round(matchScore)}%
              </span>
              <span className="font-mono text-[9px] tracking-[0.25em] text-[#F5CE76] uppercase font-bold">
                TASTE AFFINITY MATCH
              </span>
            </motion.div>

            <p className="font-sans text-xs sm:text-sm text-stone/80 max-w-md mx-auto leading-relaxed font-light mb-6">
              Distilling your bespoke expression from the world&apos;s greatest single malts and blended whiskies...
            </p>

            {/* Transition trigger button */}
            <button
              onClick={() => setPhase('final_recommendation')}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C6A15B] to-[#E5C378] text-black font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold shadow-[0_0_20px_rgba(198,161,91,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Reveal Matched Spirit →
            </button>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* ── FINAL RECOMMENDATION PAGE (PENTHOUSE ALTAR WITH CARDS) ── */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {phase === 'final_recommendation' && (
          <motion.div
            key="final-recommendation-container"
            initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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

                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.35em] uppercase text-[#C6A15B] font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] animate-pulse" />
                    YOUR MATCH
                  </span>
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-stone/50 uppercase">
                    {specsLine}
                  </span>
                </div>

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
                  {primaryMatch.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {primaryMatch.descriptors.slice(0, 3).map((desc) => (
                    <span
                      key={desc}
                      className="px-3 py-1 rounded-full border border-white/15 bg-white/5 text-[10px] sm:text-[11px] font-mono text-stone/90 backdrop-blur-md shadow-xs"
                    >
                      {desc}
                    </span>
                  ))}
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
                        {Math.round(matchScore)}%
                      </span>
                      <span className="font-mono text-[8px] tracking-[0.28em] text-stone/50 uppercase mt-0.5">
                        TASTE AFFINITY
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] tracking-[0.25em] text-[#C6A15B] uppercase font-medium">
                      OPTIMAL MATCH
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] shadow-[0_0_6px_#C6A15B]" />
                  </div>
                </div>
              </motion.div>

              {/* CENTER COLUMN: Bottle on Altar Pedestal */}
              <div className="col-span-4 relative flex flex-col items-center justify-center self-stretch z-10 min-h-0">
                {/* Archetype Badge Directly on Top of the Bottle */}
                <motion.div
                  initial={{ opacity: 0, y: -16, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center mb-1.5 sm:mb-2 shrink-0 select-none z-30"
                >
                  <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.38em] text-[#C6A15B]/75 uppercase mb-1">
                    TASTE ARCHETYPE
                  </span>
                  <div className="flex items-center gap-2.5 px-4 sm:px-5 py-1.5 rounded-full border border-[#C6A15B]/60 bg-gradient-to-r from-black/85 via-[#18140e]/95 to-black/85 backdrop-blur-md shadow-[0_4px_24px_rgba(198,161,91,0.35),0_0_12px_rgba(198,161,91,0.2)]">
                    <span className="text-[#C6A15B] text-xs font-serif">‹</span>
                    <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.34em] text-[#FAF7F2] uppercase font-semibold">
                      {archetype}
                    </span>
                    <span className="text-[#C6A15B] text-xs font-serif">›</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex flex-col items-center justify-center flex-1 min-h-0"
                >
                  {/* Golden altar glow beneath bottle */}
                  <div className="absolute bottom-0 w-52 sm:w-64 h-14 rounded-full bg-[#FFD54F]/30 blur-3xl pointer-events-none" />
                  <div className="absolute bottom-2 w-36 sm:w-48 h-6 rounded-full bg-[#C6A15B]/40 blur-xl pointer-events-none" />

                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative h-[270px] sm:h-[310px] md:h-[340px] lg:h-[365px] xl:h-[385px] flex items-center justify-center"
                  >
                    <img
                      src={primaryMatch.image}
                      alt={primaryMatch.fullName}
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_22px_40px_rgba(0,0,0,0.95)] drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] select-none"
                    />
                  </motion.div>

                  <div
                    className="relative w-36 sm:w-44 h-7 overflow-hidden opacity-20 blur-[1.5px] pointer-events-none -mt-2"
                    style={{ transform: 'scaleY(-1)' }}
                  >
                    <img
                      src={primaryMatch.image}
                      alt=""
                      className="max-h-full max-w-full object-contain filter brightness-40"
                    />
                  </div>
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
                          initial={{ width: 0 }}
                          animate={{ width: `${fb.val}%` }}
                          transition={{ duration: 1.1, delay: 0.08 * idx, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-[#9e7d3b] via-[#E5C378] to-[#FFF8DB] rounded-full relative shadow-[0_0_8px_rgba(229,195,120,0.6)]"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  to={`/spirit/${primaryMatch.id}`}
                  className="w-full mt-1.5 py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#1b1712] via-[#2a2215] to-[#1b1712] hover:from-[#352a19] hover:to-[#2a2215] border border-[#C6A15B]/70 hover:border-[#F5CE76] text-[#FAF7F2] font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.6)] hover:shadow-[0_0_22px_rgba(198,161,91,0.35)] cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>EXPLORE THIS EXPRESSION</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>

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
                    <span>RECALIBRATE</span>
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
                {/* Mobile Archetype Badge Directly on Top of Bottle */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center mb-1.5 shrink-0 select-none z-30"
                >
                  <span className="text-[8px] font-mono tracking-[0.32em] text-[#C6A15B]/80 uppercase mb-0.5">
                    TASTE ARCHETYPE
                  </span>
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C6A15B]/60 bg-gradient-to-r from-black/90 via-[#1e1710] to-black/90 backdrop-blur-md shadow-[0_4px_18px_rgba(198,161,91,0.35)]">
                    <span className="text-[#C6A15B] text-xs font-serif">‹</span>
                    <span className="font-mono text-[10px] tracking-[0.32em] text-[#FAF7F2] uppercase font-semibold">
                      {archetype}
                    </span>
                    <span className="text-[#C6A15B] text-xs font-serif">›</span>
                  </div>
                </motion.div>

                <div className="absolute bottom-2 w-52 h-10 rounded-full bg-[#FFD54F]/30 blur-xl pointer-events-none" />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative h-[225px] sm:h-[260px] flex items-center justify-center"
                >
                  <img
                    src={primaryMatch.image}
                    alt={primaryMatch.fullName}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_24px_45px_rgba(0,0,0,0.98)] select-none"
                  />
                </motion.div>
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
                  ✦ YOUR MATCH
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
                      key="mob-match-card"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="rounded-xl p-3.5 bg-[#0c0a08]/85 backdrop-blur-2xl border border-[#C6A15B]/35 shadow-xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.25em] text-[#C6A15B] uppercase font-bold">
                          YOUR MATCH
                        </span>
                        <span className="font-mono text-[8px] tracking-wider text-stone/50 uppercase">
                          {specsLine}
                        </span>
                      </div>

                      <h2 className="font-serif text-lg text-white font-medium truncate">
                        {primaryMatch.fullName}
                      </h2>

                      <p className="text-stone/75 text-[11px] font-light leading-snug line-clamp-2">
                        {primaryMatch.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-lg text-[#F5CE76]">
                            {Math.round(matchScore)}%
                          </span>
                          <span className="font-mono text-[8px] text-stone/50 tracking-wider">MATCH</span>
                        </div>

                        <div className="flex gap-1">
                          {primaryMatch.descriptors.slice(0, 2).map((d) => (
                            <span key={d} className="px-2 py-0.5 rounded text-[9px] font-mono bg-white/5 border border-white/10 text-stone/80">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 pt-1.5 border-t border-white/10">
                        <Link
                          to={`/spirit/${primaryMatch.id}`}
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
                            <span>RECALIBRATE</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="mob-flavour-card"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
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
                          to={`/spirit/${primaryMatch.id}`}
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
                            <span>RECALIBRATE</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── BOTTOM NAVBAR: DISCOVERY COMPLETE ── */}
            <motion.footer
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-10 pb-4 sm:pb-6 pt-1 flex items-center justify-center shrink-0 mt-auto pointer-events-auto"
            >
              <div className="flex items-center gap-2.5 px-5 sm:px-6 py-1.5 sm:py-2 rounded-full border border-[#C6A15B]/40 bg-black/80 backdrop-blur-md shadow-[0_2px_14px_rgba(198,161,91,0.22)] shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#C6A15B] animate-pulse shadow-[0_0_8px_#C6A15B]" />
                <span className="text-[#FAF7F2] font-mono text-[9px] sm:text-[11px] tracking-[0.32em] uppercase font-semibold">
                  DISCOVERY COMPLETE
                </span>
                <span className="w-2 h-2 rounded-full bg-[#C6A15B] animate-pulse shadow-[0_0_8px_#C6A15B]" />
              </div>
            </motion.footer>
          </motion.div>
        )}
      </AnimatePresence>



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
