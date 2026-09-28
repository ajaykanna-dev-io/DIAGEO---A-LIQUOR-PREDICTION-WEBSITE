import { ReactNode, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface DiscoveryShellProps {
  currentStageIndex: number
  totalStages: number
  totalQuestions?: number
  stageTitle?: string
  ambientHue?: number
  matchScore?: number
  revealTechnique?: any
  isTransitioning?: boolean
  onBack?: () => void
  onNext?: () => void
  onJumpToStage?: (stageIndex: number) => void
  onRestart?: () => void
  children: ReactNode
}

/**
 * DiscoveryShell — Cinematic Luxury Whisky Tasting Room Installation
 *
 * Immersive, full-screen architectural space inspired by a private whisky vault.
 * - Photorealistic cinematic background (whisky barrels, black marble, warm amber lighting)
 * - Central crystal glass on glowing peat embers
 * - Absolutely NO top navigation bars, NO dashboard cards, NO borders
 * - Minimal, whisper-quiet Nº8 Reserve branding
 */
export default function DiscoveryShell({
  currentStageIndex,
  totalStages,
  totalQuestions: _totalQuestions,
  ambientHue = 38,
  isTransitioning: _isTransitioning = false,
  onBack: _onBack,
  children,
}: DiscoveryShellProps) {
  const isChamber = currentStageIndex >= 0 && currentStageIndex < totalStages

  // Track navigation direction
  const prevStageRef = useRef(currentStageIndex)
  useEffect(() => {
    prevStageRef.current = currentStageIndex
  }, [currentStageIndex])

  // Lock HTML and Body overflow to strictly prevent any scrolling
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
    <div className="fixed inset-0 w-screen h-[100svh] overflow-hidden bg-[#0A0908] text-[#FAF7F2] select-none flex flex-col justify-between">
      {/* ── 1. CINEMATIC PHOTOREALISTIC WHISKY VAULT SANCTUARY BACKGROUND ── */}
      <motion.div
        animate={{ scale: [1, 1.018, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/whisky-sanctuary-plate.jpg')",
          filter: 'brightness(1.05) contrast(1.05)',
        }}
        aria-hidden="true"
      />

      {/* ── 2. DYNAMIC VOLUMETRIC AMBIENT WARMTH & REFLECTIONS BEHIND CENTRAL GLASS & PEDESTAL ── */}
      <div
        className="pointer-events-none absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[920px] h-[580px] rounded-full blur-[140px] z-0 opacity-45 transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse at center, hsla(${ambientHue}, 85%, 58%, 0.40) 0%, rgba(227, 197, 133, 0.24) 35%, rgba(91, 62, 25, 0.16) 60%, transparent 75%)`,
        }}
        aria-hidden="true"
      />


      {/* ── 3. DEEP CINEMATIC OBSIDIAN VIGNETTE ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,9,8,0.35)_62%,rgba(10,9,8,0.92)_100%)]"
        aria-hidden="true"
      />

      {/* ── 4. TOP GRADIENT FOR EDITORIAL TEXT READABILITY ── */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-40 z-[1] bg-gradient-to-b from-[#0A0908]/85 via-[#0A0908]/40 to-transparent"
        aria-hidden="true"
      />

      {/* ── 5. PERSISTENT STRUCTURAL LUXURY FRAME (SUBTLE BASE RESTRAINED GEOMETRY) ── */}
      {isChamber && (
        <div
          className="absolute inset-3 sm:inset-5 md:inset-6 rounded-[22px] sm:rounded-[28px] pointer-events-none z-10 border border-[#E3C585]/20 opacity-25 shadow-[0_0_20px_rgba(227,197,133,0.08)]"
          aria-hidden="true"
        />
      )}

      {/* ── 7. MAIN IMMERSIVE STAGE EXPERIENCE ── */}
      <main className="relative z-20 w-full h-full flex flex-col justify-between overflow-hidden">
        {children}
      </main>
    </div>
  )
}

