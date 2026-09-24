import { ReactNode, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoClose, IoEyeOutline, IoChevronBack, IoChevronForward } from 'react-icons/io5'
import AmbientBarAudio from '@/components/AmbientBarAudio'
import { barMusic } from '@/utils/barMusicEngine'
import type { RevealTechnique } from '@/utils/discoveryTransitions'

interface DiscoveryShellProps {
  currentStageIndex: number
  totalStages: number
  totalQuestions?: number
  stageTitle?: string
  ambientHue?: number
  matchScore?: number
  revealTechnique?: RevealTechnique
  onBack?: () => void
  onNext?: () => void
  onJumpToStage?: (stageIndex: number) => void
  children: ReactNode
}

/**
 * DiscoveryShell
 * Persistent luxury architectural container for the 13-stage discovery journey.
 * Uses a strict 100svh CSS Grid layout dividing the page into distinct zones:
 * - Zone 1: Top Brand & System Header (Row 1: 64px)
 * - Zone 2: Thin Cinematic Journey Progress Bar (Row 2: 44px)
 * - Zone 3: Main Experience Container (Row 3: minmax(0, 1fr), strictly bounded)
 * - Zone 4: Independent Isolated Navigation Footer (Row 4: 76px)
 */
export default function DiscoveryShell({
  currentStageIndex,
  totalStages,
  totalQuestions,
  ambientHue = 38,
  matchScore = 95,
  revealTechnique = 'focus-pull',
  onBack,
  onNext,
  onJumpToStage,
  children,
}: DiscoveryShellProps) {
  const isLanding = currentStageIndex === -1
  const isFinalReveal = currentStageIndex >= 13
  const isChamber = currentStageIndex >= 0 && currentStageIndex < totalStages
  const displayStage = Math.min(totalStages, Math.max(1, currentStageIndex + 1))
  const totalQuestionsCount = totalQuestions || (totalStages > 1 ? totalStages - 1 : 13)
  const progressFraction = Math.min(1, Math.max(0, (currentStageIndex + 1) / totalQuestionsCount))

  // Determine active phase for the vertical rail
  const activePhase =
    displayStage <= 6 ? 'taste' : displayStage <= 10 ? 'explore' : 'refine'

  // Lock HTML and Body overflow to strictly prevent any browser window scrolling
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow
    const prevHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevBodyOverflow
      document.documentElement.style.overflow = prevHtmlOverflow
    }
  }, [])

  return (
    <div
      className={`fixed inset-0 w-screen h-[100svh] max-h-[100svh] overflow-hidden grid ${
        isChamber
          ? 'grid-rows-[64px_44px_minmax(0,1fr)_76px]'
          : 'grid-rows-[64px_minmax(0,1fr)]'
      } bg-[#080807] text-[#FAF7F2] select-none transition-colors duration-1000 ease-out`}
    >
      {/* ── Atmospheric Background Layer (Photorealistic Speyside Tasting Sanctuary) ── */}
      <motion.div
        animate={{
          scale: isLanding ? [1, 1.02, 1] : 1,
          filter:
            revealTechnique === 'breathing'
              ? 'brightness(0.82) contrast(1.08) saturate(1.0)'
              : isLanding
              ? 'brightness(0.72) contrast(1.08) saturate(0.95)'
              : isFinalReveal
              ? 'brightness(0.92) contrast(1.1) saturate(1.05)'
              : 'brightness(0.80) contrast(1.10) saturate(1.05)',
        }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className={`pointer-events-none fixed inset-0 z-0 bg-cover bg-center transition-all duration-1000 ${
          isLanding ? 'opacity-65' : isFinalReveal ? 'opacity-85' : 'opacity-75'
        }`}
        style={{
          backgroundImage: "url('/images/discovery-sanctuary-table.jpg')",
        }}
        aria-hidden="true"
      />

      {/* ── Volumetric Ambient Spotlight that responds to active stage hue and reveal technique ── */}
      <motion.div
        key={`ambient-spotlight-${ambientHue}-${revealTechnique}`}
        initial={{ opacity: 0.12 }}
        animate={{
          opacity: isLanding
            ? [0.18, 0.26, 0.18]
            : isFinalReveal
            ? [0.28, 0.38, 0.28]
            : revealTechnique === 'liquid-diffusion'
            ? [0.15, 0.32, 0.2]
            : [0.14, 0.24, 0.14],
          scale: revealTechnique === 'liquid-diffusion' ? [0.95, 1.08, 1] : 1,
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none fixed top-0 left-1/3 -translate-x-1/2 w-[850px] h-[580px] rounded-full blur-[140px] z-0 transition-colors duration-1000"
        style={{
          background: isLanding
            ? 'radial-gradient(ellipse at 50% 38%, rgba(198,161,91,0.25) 0%, rgba(198,161,91,0.06) 45%, transparent 72%)'
            : isFinalReveal
            ? 'radial-gradient(ellipse at 50% 35%, rgba(245,206,118,0.4) 0%, rgba(198,161,91,0.18) 45%, transparent 70%)'
            : `radial-gradient(ellipse at 50% 30%, hsla(${ambientHue}, 80%, 52%, 0.32) 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* ── Deep Vignette & Dark Overlay for Maximum Contrast & Cinematic Focus ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(8,8,7,0.55)_65%,rgba(8,8,7,0.92)_100%)] transition-all duration-1000"
        aria-hidden="true"
      />

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ZONE 1: TOP BRAND & SYSTEM HEADER (Fixed Row 1)              */}
      {/* ════════════════════════════════════════════════════════════ */}
      <header className="relative z-30 w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 h-full shrink-0 border-b border-white/5 backdrop-blur-sm bg-black/25">
        {/* Brand Mark: DIAGEO | HAUTE DISTILLERIE / TASTING SANCTUARY */}
        <Link
          to="/"
          className="group flex items-center gap-3 hover:opacity-95 transition-all cursor-pointer select-none shrink-0"
          title="Return to Home"
        >
          <span className="font-serif text-lg sm:text-xl lg:text-2xl font-normal tracking-[0.28em] text-[#FAF7F2] group-hover:text-[#F5CE76] transition-colors uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            DIAGEO
          </span>
          <span className="h-4 w-px bg-white/20 hidden sm:inline-block" />
          <div className="flex flex-col hidden sm:flex leading-tight">
            <span className="text-[7.5px] sm:text-[8.5px] uppercase tracking-[0.28em] font-mono text-[#DFBA73] font-semibold">
              HAUTE DISTILLERIE
            </span>
            <span className="text-[7px] sm:text-[8px] uppercase tracking-[0.24em] font-mono text-stone/50">
              TASTING SANCTUARY
            </span>
          </div>
        </Link>

        {/* Right: Sound, More Options & Exit Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <AmbientBarAudio />

          {/* Speakeasy Options Menu Dots */}
          <button
            type="button"
            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-[#E0DBD2] hover:text-white hover:border-[#DFBA73] text-xs cursor-pointer transition-all shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
            title="Preferences"
            aria-label="Preferences"
          >
            ···
          </button>

          <span className="h-4 w-px bg-white/20 hidden sm:inline-block" />

          {/* Exit Action Pill */}
          <Link
            to="/"
            className="group flex items-center gap-1.5 py-1 px-3 sm:px-3.5 rounded-full border border-white/25 hover:border-[#F5CE76] bg-black/60 hover:bg-black/90 backdrop-blur-md transition-all duration-300 text-[#FAF7F2] hover:text-white font-mono text-[9px] sm:text-[10px] font-semibold tracking-[0.22em] uppercase cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.85)] hover:shadow-[0_0_14px_rgba(245,206,118,0.3)]"
            title="Exit Tasting Sanctuary to Home"
          >
            <IoClose className="w-3.5 h-3.5 text-[#F5CE76] group-hover:rotate-90 group-hover:text-white transition-all duration-300" />
            <span>EXIT</span>
          </Link>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ZONE 2: THIN CINEMATIC JOURNEY PROGRESS TRACK (Fixed Row 2)  */}
      {/* ════════════════════════════════════════════════════════════ */}
      {isChamber ? (
        <div className="relative z-20 w-full flex items-center justify-between max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full shrink-0 select-none">
          {/* Connected Milestone Track 01 ── 02 ── ... ── 13 */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {Array.from({ length: totalStages }, (_, i) => i + 1).map((stageNum, idx, arr) => {
              const isCurrent = stageNum === displayStage
              const isPast = stageNum < displayStage

              return (
                <div key={`track-step-${stageNum}`} className="flex items-center">
                  {isCurrent ? (
                    <button
                      type="button"
                      onClick={() => onJumpToStage?.(stageNum - 1)}
                      className="relative flex items-center justify-center w-6 h-6 rounded-full border border-[#F5CE76] bg-black/80 shadow-[0_0_10px_rgba(245,206,118,0.7)] cursor-pointer"
                    >
                      <span className="font-mono text-[9px] text-[#F5CE76] font-bold">
                        {stageNum}
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onJumpToStage?.(stageNum - 1)}
                      className={`font-mono text-[8.5px] tracking-wider transition-colors cursor-pointer hover:text-[#FAF7F2] px-0.5 ${
                        isPast ? 'text-[#DFBA73] font-semibold' : 'text-stone/40'
                      }`}
                    >
                      {String(stageNum).padStart(2, '0')}
                    </button>
                  )}

                  {idx < arr.length - 1 && (
                    <div
                      className={`w-2.5 sm:w-3.5 h-px mx-0.5 sm:mx-1 transition-colors ${
                        isPast ? 'bg-[#DFBA73]/60' : 'bg-white/15'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* Right: YOUR JOURNEY ── 02 / 13 and REVEAL (95%) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="hidden md:flex items-center gap-2 font-mono text-[8.5px] uppercase tracking-[0.25em] text-[#DFBA73] font-medium">
              <span className="text-stone/50">YOUR JOURNEY</span>
              <span className="text-stone/40">——</span>
              <span className="text-white font-bold">
                {displayStage} / {totalStages}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 rounded-full border border-[#DFBA73]/45 bg-black/60 backdrop-blur-md text-[#F5CE76] shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              <IoEyeOutline className="w-3.5 h-3.5 text-[#F5CE76]" />
              <span className="font-mono text-[8px] sm:text-[8.5px] uppercase tracking-[0.2em] font-bold">
                REVEAL ({matchScore || 95}%)
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-0" />
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ZONE 3: MAIN EXPERIENCE (Strictly Bounded Row 3)             */}
      {/* ════════════════════════════════════════════════════════════ */}
      <main className="relative z-10 w-full h-full min-h-0 overflow-hidden flex flex-col justify-center">
        {/* Floating Subtle Vertical Tasting Rail on Wide Screens (Far Left Edge) */}
        {isChamber && (
          <aside className="fixed left-3 2xl:left-5 top-1/2 -translate-y-1/2 z-20 hidden 2xl:flex flex-col items-start gap-7 select-none pointer-events-none opacity-80">
            {/* TASTE */}
            <div className="flex flex-col items-start gap-1">
              <span
                className={`font-mono text-[8px] tracking-[0.25em] uppercase font-semibold ${
                  activePhase === 'taste' ? 'text-white' : 'text-stone/40'
                }`}
              >
                TASTE
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  activePhase === 'taste' ? 'bg-[#F5CE76] shadow-[0_0_6px_#F5CE76]' : 'bg-white/20'
                }`}
              />
            </div>

            {/* EXPLORE */}
            <div className="flex flex-col items-start gap-1">
              <span
                className={`font-mono text-[8px] tracking-[0.25em] uppercase font-semibold ${
                  activePhase === 'explore' ? 'text-white' : 'text-stone/40'
                }`}
              >
                EXPLORE
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  activePhase === 'explore' ? 'bg-[#F5CE76] shadow-[0_0_6px_#F5CE76]' : 'bg-white/20'
                }`}
              />
            </div>

            {/* REFINE */}
            <div className="flex flex-col items-start gap-1">
              <span
                className={`font-mono text-[8px] tracking-[0.25em] uppercase font-semibold ${
                  activePhase === 'refine' ? 'text-white' : 'text-stone/40'
                }`}
              >
                REFINE
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  activePhase === 'refine' ? 'bg-[#F5CE76] shadow-[0_0_6px_#F5CE76]' : 'bg-white/20'
                }`}
              />
            </div>

            {/* YOUR EXPRESSION */}
            <div className="flex flex-col items-start leading-tight pt-2">
              <span className="font-mono text-[7px] tracking-[0.25em] uppercase text-stone/40 font-medium">
                YOUR
              </span>
              <span className="font-mono text-[7px] tracking-[0.25em] uppercase text-stone/40 font-medium">
                EXPRESSION
              </span>
            </div>
          </aside>
        )}

        {children}
      </main>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ZONE 4: INDEPENDENT ISOLATED NAVIGATION FOOTER (Row 4)      */}
      {/* ════════════════════════════════════════════════════════════ */}
      {isChamber ? (
        <footer className="relative z-30 w-full h-full shrink-0 flex items-center max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2.5 select-none">
          <div className="w-full flex items-center justify-between px-4 sm:px-6 h-[54px] sm:h-[58px] rounded-xl bg-gradient-to-r from-[#14110c]/90 via-[#0a0907]/95 to-[#14110c]/90 border border-[#C6A15B]/30 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
            {/* Left Side: Stage Designation */}
            <div className="flex flex-col items-start leading-tight">
              <div className="flex items-center gap-2">
                <span className="w-4 h-px bg-[#DFBA73]" />
                <span className="font-mono text-[8.5px] sm:text-[9.5px] tracking-[0.25em] text-[#DFBA73] uppercase font-bold">
                  STAGE {String(displayStage).padStart(2, '0')} / {String(totalQuestionsCount).padStart(2, '0')}
                </span>
              </div>
              <span className="font-mono text-[7.5px] sm:text-[8px] tracking-[0.2em] text-stone/50 uppercase pl-6">
                REFINE YOUR EXPRESSION
              </span>
            </div>

            {/* Center: Backward Button, Calibration Rail, Forward Button */}
            <div className="flex items-center gap-3 sm:gap-4 mx-auto sm:mx-0">
              {/* Previous Button */}
              <button
                type="button"
                onClick={onBack}
                disabled={currentStageIndex <= 0}
                className={`group relative flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full border transition-all duration-300 select-none shadow-[0_3px_12px_rgba(0,0,0,0.8)] ${
                  currentStageIndex <= 0
                    ? 'opacity-25 cursor-not-allowed border-white/10 bg-black/40 text-stone/40'
                    : 'cursor-pointer border-[#DFBA73]/50 hover:border-[#F5CE76] bg-black/60 hover:bg-black/90 text-[#FAF7F2] hover:text-white hover:scale-105 active:scale-95'
                }`}
                title="Previous stage"
                aria-label="Previous question"
              >
                <IoChevronBack className="text-xs text-[#F5CE76] transition-transform group-hover:-translate-x-0.5" />
              </button>

              {/* Central Distillation Calibration Progress Rail */}
              <div className="flex flex-col items-center gap-0.5 min-w-[130px] sm:min-w-[170px] md:min-w-[210px]">
                <div className="flex items-center justify-between w-full px-1 font-mono text-[7px] sm:text-[8px] tracking-[0.22em] text-[#DFBA73] uppercase">
                  <span>CALIBRATION</span>
                  <span className="text-white font-bold">{Math.round(progressFraction * 100)}%</span>
                </div>
                <div className="w-full h-1 bg-black/80 border border-[#C6A15B]/30 relative overflow-hidden rounded-full shadow-inner">
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#C6A15B] via-[#DFBA73] to-[#F5CE76] shadow-[0_0_8px_#F5CE76]"
                    animate={{
                      width: `${progressFraction * 100}%`,
                    }}
                    transition={{ duration: 0.35 }}
                  />
                </div>
              </div>

              {/* Next / Reveal Button — Radiant Solid Gold Jewel Button */}
              <button
                type="button"
                onClick={() => {
                  barMusic.playChamberWalkTransition()
                  onNext?.()
                }}
                className="group relative flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full border border-[#FFF0C2] bg-gradient-to-b from-[#F5CE76] via-[#DFBA73] to-[#B8934A] hover:from-[#FFF0C2] hover:via-[#F5CE76] hover:to-[#DFBA73] text-black transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(245,206,118,0.7)] hover:shadow-[0_0_28px_rgba(245,206,118,0.95)] hover:scale-108 active:scale-95 select-none"
                title={currentStageIndex === totalQuestionsCount - 1 ? 'Reveal Spirit Discovery' : 'Next stage'}
                aria-label="Next question"
              >
                <IoChevronForward className="text-xs text-black font-extrabold transition-transform group-hover:translate-x-0.5" />
                <div className="pointer-events-none absolute -inset-1 rounded-full bg-[#F5CE76]/30 blur-sm group-hover:bg-[#F5CE76]/50 transition-colors" />
              </button>
            </div>

            {/* Right Side: Inspirational Note */}
            <div className="hidden sm:flex flex-col items-end text-right leading-tight">
              <span className="font-mono text-[7.5px] sm:text-[8.5px] tracking-[0.25em] text-[#DFBA73] uppercase font-semibold">
                ONE ANSWER CLOSER
              </span>
              <span className="font-mono text-[7px] sm:text-[7.5px] tracking-[0.2em] text-stone/50 uppercase">
                TO YOUR EXPRESSION
              </span>
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  )
}
