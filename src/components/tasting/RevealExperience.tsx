import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Spirit, TasteProfile, Answers } from '@/types'
import SpiritDNA from './SpiritDNA'
import TasteProfileBars from '@/components/TasteProfileBars'
import AlternativeSpiritCard from '@/components/AlternativeSpiritCard'

interface RevealExperienceProps {
  spirit: Spirit
  profile: TasteProfile
  match: number
  alternatives: { spirit: Spirit; match: number }[]
  answers: Answers
  onRetake: () => void
}

/**
 * RevealExperience
 * The ceremonial conclusion of the tasting ritual.
 * Features an initial quiet distillation synthesis phase, camera approach,
 * full inspection of the completed Spirit DNA, bespoke cellar match showcase,
 * sensory coordinates breakdown, and sommelier cellar pairings.
 */
export default function RevealExperience({
  spirit,
  profile,
  match,
  alternatives,
  answers,
  onRetake,
}: RevealExperienceProps) {
  const reduceMotion = useReducedMotion()
  const [stage, setStage] = useState<'synthesis' | 'revelation'>(
    reduceMotion ? 'revelation' : 'synthesis'
  )
  const [synthesisStep, setSynthesisStep] = useState(0)

  // Synthesis steps text
  const synthesisTexts = [
    'Aligning sensory coordinates...',
    'Synthesizing palate viscosity & cask resonance...',
    'Your bespoke Spirit DNA has formed.',
  ]

  useEffect(() => {
    if (reduceMotion) return

    // Synthesis countdown: 3.2 seconds total
    const t1 = setTimeout(() => setSynthesisStep(1), 1100)
    const t2 = setTimeout(() => setSynthesisStep(2), 2200)
    const t3 = setTimeout(() => setStage('revelation'), 3400)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [reduceMotion])

  return (
    <div className="relative w-full text-[#FAF7F2] pb-24">
      <AnimatePresence mode="wait">
        {/* ── PHASE 1: SILENT DISTILLATION SYNTHESIS ── */}
        {stage === 'synthesis' && (
          <motion.div
            key="synthesis-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-12"
          >
            {/* Illuminated Central Vessel */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                filter: [
                  'drop-shadow(0 0 30px rgba(198,161,91,0.2))',
                  'drop-shadow(0 0 60px rgba(198,161,91,0.5))',
                  'drop-shadow(0 0 30px rgba(198,161,91,0.2))',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="mb-8"
            >
              <SpiritDNA
                answers={answers}
                currentStep={8}
                size={260}
                interactive={false}
              />
            </motion.div>

            {/* Subdued Editorial Text */}
            <p className="text-xs uppercase tracking-[0.3em] font-mono text-gold-light/80 mb-3">
              DIAGEO DISTILLATION RITUAL
            </p>
            <AnimatePresence mode="wait">
              <motion.h2
                key={synthesisStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="font-display font-light text-xl sm:text-2xl text-ivory max-w-md mx-auto"
              >
                {synthesisTexts[synthesisStep]}
              </motion.h2>
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── PHASE 2: CEREMONIAL TASTING DOSSIER ── */}
        {stage === 'revelation' && (
          <motion.div
            key="revelation-view"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10"
          >
            {/* Archetype Reveal Header */}
            <header className="text-center mb-10 sm:mb-16">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] font-mono text-gold-light block mb-2">
                Distillation Dossier · Profile #{spirit.id.toUpperCase()}
              </span>
              <h1 className="font-display font-light text-3xl sm:text-5xl md:text-6xl text-ivory tracking-tight mb-3">
                {spirit.archetype || 'THE CONNOISSEUR'}
              </h1>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-4" />
              <p className="text-xs sm:text-sm text-stone/80 font-mono tracking-wider max-w-xl mx-auto">
                Synthesized from your unique sensory coordinates across 8 tasting dimensions
              </p>
            </header>

            {/* ── Hero Split: Completed Spirit DNA & Tailored Reserve Bottle ── */}
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-center mb-16 sm:mb-24">
              {/* Left Column: Interactive Spirit DNA & Palate Breakdown */}
              <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="relative mb-6 flex flex-col items-center">
                  <SpiritDNA
                    answers={answers}
                    currentStep={8}
                    size={280}
                    interactive={true}
                  />
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs uppercase tracking-[0.2em] font-mono text-gold-light">
                    Palate Match
                  </span>
                  <span className="h-px w-8 bg-gold/40" />
                  <span className="text-sm font-mono text-ivory font-bold">
                    {match}% Affinity
                  </span>
                </div>

                <h2 className="font-display font-light text-2xl sm:text-3xl text-ivory mb-4">
                  {spirit.fullName}
                </h2>

                <p className="text-stone/90 leading-relaxed text-sm sm:text-base font-sans mb-6 max-w-lg">
                  {spirit.description}
                </p>

                {/* Descriptors Chips */}
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
                  {spirit.descriptors.map((d) => (
                    <span
                      key={d}
                      className="text-xs uppercase tracking-widest font-mono px-3 py-1 bg-[#1A1815] border border-stone/20 text-ivory rounded-sm"
                    >
                      {d}
                    </span>
                  ))}
                </div>

                {/* Granular Tasting Notes Grid */}
                <div className="w-full bg-[#121110] border border-stone/15 rounded-md p-4 sm:p-5 text-left mb-6">
                  <span className="text-[10px] uppercase tracking-widest font-mono text-stone/50 block mb-2">
                    Sommelier Tasting Notes
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {spirit.tastingNotes.map((note) => (
                      <span
                        key={note}
                        className="text-xs text-stone/90 bg-[#1A1815] px-2.5 py-1 rounded-sm border border-stone/10"
                      >
                        ✦ {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Physical Bottle Exhibition ── */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center">
                <div className="relative w-full max-w-md bg-gradient-to-b from-[#181714] to-[#0E0D0B] border border-gold/25 rounded-lg p-6 sm:p-8 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.85)] flex flex-col items-center text-center">
                  {/* Glass Pedestal Highlight */}
                  <div
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at 50% 35%, hsla(${spirit.glyphHue}, 60%, 45%, 0.12) 0%, transparent 70%)`,
                    }}
                  />

                  {/* High-res Bottle Image */}
                  <div className="relative z-10 w-48 sm:w-56 h-72 sm:h-80 flex items-center justify-center my-4">
                    {spirit.image ? (
                      <img
                        src={spirit.image}
                        alt={spirit.fullName}
                        className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
                      />
                    ) : (
                      <div className="w-32 h-64 border border-gold/40 rounded-t-full flex items-center justify-center text-gold-light font-display">
                        DIAGEO
                      </div>
                    )}
                  </div>

                  {/* Bottle Provenance Specs */}
                  <div className="relative z-10 w-full pt-4 border-t border-stone/15 flex items-center justify-between text-left text-xs font-mono">
                    <div>
                      <span className="text-[10px] uppercase text-stone/50 block">
                        Origin
                      </span>
                      <span className="text-ivory">{spirit.origin}</span>
                    </div>
                    {spirit.abv && (
                      <div>
                        <span className="text-[10px] uppercase text-stone/50 block">
                          Strength
                        </span>
                        <span className="text-ivory">{spirit.abv}</span>
                      </div>
                    )}
                    {spirit.cask && (
                      <div className="text-right max-w-[140px] truncate">
                        <span className="text-[10px] uppercase text-stone/50 block">
                          Cask Maturation
                        </span>
                        <span className="text-ivory truncate block">
                          {spirit.cask}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Sensory Dimensions Radar & Serving Ritual ── */}
            <div className="grid md:grid-cols-2 gap-8 items-start mb-16 sm:mb-24">
              {/* Palate Profile Dimensions */}
              <div className="bg-[#121110] border border-stone/15 rounded-lg p-6 sm:p-8">
                <span className="text-xs uppercase tracking-[0.2em] font-mono text-gold-light block mb-2">
                  Sensory Balance
                </span>
                <h3 className="font-display font-light text-2xl text-ivory mb-6">
                  Palate Architecture
                </h3>
                <TasteProfileBars profile={profile} />
              </div>

              {/* Serving Ritual & Gastronomic Pairing */}
              <div className="bg-[#121110] border border-stone/15 rounded-lg p-6 sm:p-8 flex flex-col justify-between h-full">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] font-mono text-gold-light block mb-2">
                    Curated Ritual
                  </span>
                  <h3 className="font-display font-light text-2xl text-ivory mb-6">
                    Service & Pairing
                  </h3>

                  <div className="space-y-4 text-left">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-mono text-stone/50 block mb-1">
                        Serving Style
                      </span>
                      <p className="text-sm text-ivory font-sans">
                        {spirit.servingStyle}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-mono text-stone/50 block mb-1">
                        Gastronomic Pairing
                      </span>
                      <p className="text-sm text-ivory font-sans">
                        {spirit.pairing}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-stone/10">
                  <p className="text-xs text-stone/70 font-mono">
                    ✦ Cellar verified by DIAGEO Master Distillers
                  </p>
                </div>
              </div>
            </div>

            {/* ── Alternative Cellar Expressions ── */}
            {alternatives.length > 0 && (
              <section className="mb-16 sm:mb-24">
                <div className="text-center mb-10">
                  <span className="text-xs uppercase tracking-[0.2em] font-mono text-gold-light block mb-2">
                    Secondary Cellar Affinities
                  </span>
                  <h3 className="font-display font-light text-2xl sm:text-3xl text-ivory">
                    Alternative Reserves
                  </h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {alternatives.map(({ spirit: altSpirit, match: altMatch }) => (
                    <AlternativeSpiritCard
                      key={altSpirit.id}
                      spirit={altSpirit}
                      match={altMatch}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ── Bottom Ritual Actions ── */}
            <footer className="pt-8 border-t border-stone/15 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={onRetake}
                className="text-xs uppercase tracking-[0.2em] font-mono text-stone hover:text-ivory transition-colors duration-300 py-2 px-4 border border-stone/20 hover:border-gold/40 rounded-sm cursor-pointer"
              >
                ↺ Retake Tasting Ritual
              </button>

              <div className="flex items-center gap-4">
                <Link
                  to="/collection"
                  className="text-xs uppercase tracking-[0.2em] font-mono text-stone hover:text-ivory transition-colors duration-300 py-2 px-4 border border-stone/20 hover:border-gold/40 rounded-sm inline-block"
                >
                  Explore Entire Cellar
                </Link>
                <Link
                  to="/"
                  className="text-xs uppercase tracking-[0.2em] font-mono text-[#080807] bg-gold hover:bg-gold-light transition-all duration-300 py-2 px-5 rounded-sm font-medium inline-block shadow-[0_0_20px_rgba(198,161,91,0.3)]"
                >
                  Return to Atelier
                </Link>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
