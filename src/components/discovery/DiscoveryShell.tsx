import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoClose } from 'react-icons/io5'
import AmbientBarAudio from '@/components/AmbientBarAudio'
import BrandSettlingLogo from '@/components/BrandSettlingLogo'

interface DiscoveryShellProps {
  currentStageIndex: number
  totalStages: number
  stageTitle: string
  ambientHue?: number
  onBack: () => void
  children: ReactNode
}

/**
 * DiscoveryShell
 * Persistent luxury architectural container for the 6-stage discovery journey.
 * Provides:
 * - Dynamic background lighting that gently adapts to selected moods and spirits
 * - Minimal DIAGEO brand crest
 * - Discreet 01 / 05 progress indicator
 * - Subtle Exit and Back controls
 * - 100svh cinematic full-viewport layout without page scroll
 */
export default function DiscoveryShell({
  currentStageIndex,
  totalStages,
  stageTitle,
  ambientHue = 38,
  onBack,
  children,
}: DiscoveryShellProps) {
  const isLanding = currentStageIndex === -1
  const isFinalReveal = currentStageIndex >= totalStages - 1

  return (
    <div className="relative w-full h-[100svh] min-h-[600px] overflow-hidden flex flex-col justify-between bg-[#080807] text-[#FAF7F2] select-none transition-colors duration-1000 ease-out">
      {/* ── Atmospheric Background Layer (Subtle, Premium & Polished Visibility) ── */}
      <motion.div
        animate={{
          scale: isLanding ? [1, 1.025, 1] : 1,
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className={`pointer-events-none fixed inset-0 z-0 bg-cover bg-center transition-all duration-1000 ${
          isLanding
            ? 'opacity-48 filter brightness-[0.72] contrast-[1.08] saturate-[0.9]'
            : 'opacity-25 filter brightness-[0.52] contrast-[1.2] saturate-[0.8]'
        }`}
        style={{
          backgroundImage: "url('/images/tasting-bar-bg.jpg')",
        }}
        aria-hidden="true"
      />

      {/* ── Volumetric Ambient Spotlight that responds to active stage hue ── */}
      <motion.div
        animate={{
          opacity: isLanding ? [0.22, 0.32, 0.22] : [0.15, 0.22, 0.15],
          scale: isLanding ? [1, 1.06, 1] : 1,
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[850px] h-[650px] rounded-full blur-[140px] z-0 transition-colors duration-1000"
        style={{
          background: isLanding
            ? 'radial-gradient(ellipse at 50% 38%, rgba(198,161,91,0.28) 0%, rgba(198,161,91,0.08) 45%, transparent 72%)'
            : `radial-gradient(ellipse at 50% 30%, hsla(${ambientHue}, 65%, 45%, 0.35) 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* ── Deep Vignette & Dark Espresso Overlay ── */}
      <div
        className={`pointer-events-none fixed inset-0 z-0 transition-all duration-1000 ${
          isLanding
            ? 'bg-gradient-to-b from-[#080807]/75 via-[#080807]/45 to-[#080807]/88'
            : 'bg-gradient-to-b from-[#080807]/90 via-[#080807]/80 to-[#080807]/96'
        }`}
        aria-hidden="true"
      />
      <div
        className={`pointer-events-none fixed inset-0 z-0 transition-all duration-1000 ${
          isLanding
            ? 'bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(8,8,7,0.55)_75%,rgba(8,8,7,0.95)_100%)]'
            : 'bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(8,8,7,0.85)_85%,rgba(8,8,7,0.98)_100%)]'
        }`}
        aria-hidden="true"
      />

      {/* ── Content Wrapper (100svh Flex on Desktop) ── */}
      <div className="relative z-10 flex flex-col justify-between w-full max-w-[1440px] mx-auto px-[clamp(16px,4vw,64px)] py-3 sm:py-4 h-full min-h-0">
        {/* ════════════════════════════════════════════════════════════ */}
        {/* REFINED EDITORIAL HEADER */}
        {/* ════════════════════════════════════════════════════════════ */}
        <header className="w-full flex items-center justify-between gap-4 pb-2 shrink-0">
          {/* Brand Mark */}
          <div className="flex items-center gap-3">
            <BrandSettlingLogo subtitle="Tasting Sanctuary" />
            <span className="h-3 w-px bg-stone/20 hidden sm:inline-block" />
            <span className="text-[9px] uppercase tracking-[0.25em] font-mono text-stone/50 hidden sm:inline-block">
              Haute Distillerie · Tasting Sanctuary
            </span>
          </div>

          {/* Minimalist 01 / 04 Journey Progress */}
          {!isFinalReveal && !isLanding && (
            <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-stone/60">
              <span className="text-gold-light font-medium">0{currentStageIndex + 1}</span>
              <span className="text-stone/30">/</span>
              <span className="text-stone/50">0{totalStages - 1}</span>
              <span className="h-2 w-px bg-stone/20 hidden md:inline-block" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-stone/40 hidden md:inline-block">
                {stageTitle}
              </span>
            </div>
          )}

          {/* Speakeasy Bar Audio & Discreet Exit & Back Action */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <AmbientBarAudio />
            {currentStageIndex > 0 && !isFinalReveal && (
              <button
                type="button"
                onClick={onBack}
                className="group relative flex items-center gap-2 py-1.5 px-3 rounded-full border border-white/10 hover:border-[#C6A15B]/50 bg-[#0c0b0a]/60 hover:bg-[#141210] backdrop-blur-md transition-all duration-300 text-stone/60 hover:text-[#FAF7F2] cursor-pointer"
                aria-label="Return to previous dimension"
              >
                <span className="text-[10px] text-[#C6A15B]/70 group-hover:-translate-x-0.5 transition-transform duration-300">
                  ←
                </span>
                <span className="text-[9px] uppercase font-mono tracking-[0.24em]">
                  Back
                </span>
              </button>
            )}

            {/* ── Haute Distillerie Close Button (Matches Music Button Theme) ── */}
            <Link
              to="/"
              className="group relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/10 hover:border-[#C6A15B]/50 bg-[#0c0b0a]/75 hover:bg-[#14110c]/90 text-stone/60 hover:text-[#FAF7F2] shadow-[0_2px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_2px_18px_rgba(198,161,91,0.22)] transition-all duration-500 cursor-pointer overflow-hidden"
              title="Exit Tasting Sanctuary"
              aria-label="Exit Tasting Sanctuary"
            >
              {/* Ambient gold light sweep on hover */}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[#C6A15B]/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
                aria-hidden="true"
              />

              {/* Refined Close Icon from react-icons/io5 matching music button notes */}
              <div className="relative flex items-center justify-center text-stone/70 group-hover:text-[#E5C378] group-hover:rotate-90 transition-all duration-500 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(198,161,91,0.5)]">
                <IoClose className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </header>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* LIVING STAGE CONTENT (Chamber) */}
        {/* ════════════════════════════════════════════════════════════ */}
        <main className="flex-1 min-h-0 flex flex-col justify-between w-full overflow-hidden py-0.5">
          {children}
        </main>
      </div>
    </div>
  )
}
