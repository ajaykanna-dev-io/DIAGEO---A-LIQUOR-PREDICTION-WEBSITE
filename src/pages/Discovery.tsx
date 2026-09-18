import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DiscoveryShell from '../components/discovery/DiscoveryShell'
import TastingDeckChamber from '../components/discovery/TastingDeckChamber'
import RecommendationReveal from '../components/discovery/RecommendationReveal'
import TastingHouseCanvas from '../components/tastingHouse/TastingHouseCanvas'
import { useDiscoveryMatch } from '../hooks/useDiscoveryMatch'
import {
  DiscoveryAnswers,
  moodOptions,
  flavourOptions,
  occasionOptions,
  spiritOptions,
} from '../data/discoveryStages'
import type { TastingCardData } from '../components/discovery/TastingCard'

const TOTAL_QUESTION_STAGES = 5 // 01 Mood, 02 Flavour, 03 Occasion, 04 Spirit, 05 Reveal
const TOTAL_QUESTION_DIMENSIONS = 4 // 4 Answering Stages before the Reveal

export default function Discovery() {
  // Current view index: -1 is Intro Hero, 0..3 are Question Stages, 4 is Reveal
  const [stageIndex, setStageIndex] = useState<number>(() => {
    try {
      const savedIndex = sessionStorage.getItem('diageo_discovery_stage')
      return savedIndex !== null ? Number(savedIndex) : -1
    } catch {
      return -1
    }
  })

  // User answers
  const [answers, setAnswers] = useState<DiscoveryAnswers>(() => {
    try {
      const saved = sessionStorage.getItem('diageo_discovery_answers_v2')
      return saved
        ? JSON.parse(saved)
        : {
            character: { weight: 50, expression: 50 },
          }
    } catch {
      return { character: { weight: 50, expression: 50 } }
    }
  })

  // Dynamic ambient light hue that gently responds to selections and hovers
  const [ambientHue, setAmbientHue] = useState<number>(38)

  // Recommendation synthesis hook
  const { primarySpirit, alternatives, matchScore } = useDiscoveryMatch(answers)
  const secondaryMatches = useMemo(() => alternatives.map((a) => a.spirit), [alternatives])

  // Persist answers and stage to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('diageo_discovery_answers_v2', JSON.stringify(answers))
      sessionStorage.setItem('diageo_discovery_stage', String(stageIndex))
    } catch {}
  }, [answers, stageIndex])

  // Navigation handlers
  const handleNext = useCallback(() => {
    setStageIndex((prev) => Math.min(prev + 1, TOTAL_QUESTION_STAGES - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleBack = useCallback(() => {
    setStageIndex((prev) => Math.max(prev - 1, -1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleRestart = useCallback(() => {
    try {
      sessionStorage.removeItem('diageo_discovery_answers_v2')
      sessionStorage.removeItem('diageo_discovery_stage')
    } catch {}
    setAnswers({ character: { weight: 50, expression: 50 } })
    setAmbientHue(38)
    setStageIndex(-1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Card Mappings for each Tasting Deck Dimension
  const moodCards: TastingCardData[] = useMemo(
    () =>
      moodOptions.map((m) => ({
        id: m.id,
        label: m.label,
        subtitle: m.subtitle,
        image: m.image,
        accentHue: m.accentHue,
      })),
    []
  )

  const flavourCards: TastingCardData[] = useMemo(
    () =>
      flavourOptions.map((f) => ({
        id: f.id,
        label: f.label,
        subtitle: f.tastingNote,
        badge: f.subtitle,
        image: f.image,
        accentHue: f.accentHue,
      })),
    []
  )

  const occasionCards: TastingCardData[] = useMemo(
    () =>
      occasionOptions.map((o) => ({
        id: o.id,
        label: o.label,
        subtitle: o.subtitle,
        badge: o.setting,
        image: o.image,
        accentHue: o.accentHue,
      })),
    []
  )

  const spiritCards: TastingCardData[] = useMemo(
    () =>
      spiritOptions.map((s) => ({
        id: s.id,
        label: s.name,
        subtitle: s.tagline,
        badge: s.heritage,
        image: s.image,
        accentHue: s.ambientHue,
        accentColor: s.accentColor,
      })),
    []
  )

  // Card selection handlers with automatic advancement
  const handleChooseMood = (card: TastingCardData) => {
    setAnswers((prev) => ({ ...prev, mood: card.id }))
    if (card.accentHue) setAmbientHue(card.accentHue)
    handleNext()
  }

  const handleChooseFlavour = (card: TastingCardData) => {
    setAnswers((prev) => ({ ...prev, flavour: card.id }))
    if (card.accentHue) setAmbientHue(card.accentHue)
    handleNext()
  }

  const handleChooseOccasion = (card: TastingCardData) => {
    setAnswers((prev) => ({ ...prev, occasion: card.id }))
    if (card.accentHue) setAmbientHue(card.accentHue)
    handleNext()
  }

  const handleChooseSpirit = (card: TastingCardData) => {
    setAnswers((prev) => ({ ...prev, spirit: card.id }))
    if (card.accentHue) setAmbientHue(card.accentHue)
    handleNext()
  }

  // Current stage title for the header
  const stageTitle = useMemo(() => {
    switch (stageIndex) {
      case 0:
        return 'The Mood'
      case 1:
        return 'The Flavour'
      case 2:
        return 'The Occasion'
      case 3:
        return 'The Spirit'
      case 4:
        return 'The Reveal'
      default:
        return 'Discovery'
    }
  }, [stageIndex])

  // Render First-Person 3D Tasting House for all 4 Chambers (0: Mood, 1: Flavour, 2: Occasion, 3: Spirit)
  if (stageIndex >= 0 && stageIndex <= 3) {
    const activeSelectedId =
      stageIndex === 0
        ? answers.mood
        : stageIndex === 1
        ? answers.flavour
        : stageIndex === 2
        ? answers.occasion
        : answers.spirit

    return (
      <TastingHouseCanvas
        currentStageIndex={stageIndex}
        totalStages={TOTAL_QUESTION_DIMENSIONS}
        selectedOptionId={activeSelectedId}
        onSelectOption={(optionId) => {
          if (stageIndex === 0) {
            setAnswers((prev) => ({ ...prev, mood: optionId }))
            const chosen = moodOptions.find((m) => m.id === optionId)
            if (chosen?.accentHue) setAmbientHue(chosen.accentHue)
          } else if (stageIndex === 1) {
            setAnswers((prev) => ({ ...prev, flavour: optionId }))
            const chosen = flavourOptions.find((f) => f.id === optionId)
            if (chosen?.accentHue) setAmbientHue(chosen.accentHue)
          } else if (stageIndex === 2) {
            setAnswers((prev) => ({ ...prev, occasion: optionId }))
            const chosen = occasionOptions.find((o) => o.id === optionId)
            if (chosen?.accentHue) setAmbientHue(chosen.accentHue)
          } else {
            setAnswers((prev) => ({ ...prev, spirit: optionId }))
            const chosen = spiritOptions.find((s) => s.id === optionId)
            if (chosen?.ambientHue) setAmbientHue(chosen.ambientHue)
          }
        }}
        onWalkComplete={() => {
          handleNext()
        }}
        onBack={handleBack}
      />
    )
  }

  return (
    <DiscoveryShell
      currentStageIndex={stageIndex}
      totalStages={TOTAL_QUESTION_STAGES}
      stageTitle={stageTitle}
      ambientHue={ambientHue}
      onBack={handleBack}
    >
      <AnimatePresence mode="wait">
        {/* ════════════════════════════════════════════════════════════ */}
        {/* 00 — INITIAL VIEWPORT HERO (Gateway Sanctuary) */}
        {/* ════════════════════════════════════════════════════════════ */}
        {stageIndex === -1 && (
          <motion.section
            key="discovery-hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center my-auto py-6 sm:py-12 max-w-4xl mx-auto z-10"
          >
            {/* Visual Sanctuary Crest */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative w-36 h-36 sm:w-44 sm:h-44 mb-6 flex items-center justify-center"
            >
              {/* Concentric Ambient Rings */}
              <div className="absolute inset-0 rounded-full border border-[#C6A15B]/25 animate-spin-slow" />
              <div className="absolute inset-3 rounded-full border border-dashed border-[#C6A15B]/35 animate-spin-reverse" />
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#0d0c0a] border border-[#C6A15B]/50 shadow-[0_0_55px_rgba(198,161,91,0.3)] flex items-center justify-center p-3">
                <img
                  src="/images/discovery/19-discovery-hero.webp"
                  alt="AUREL Tasting House"
                  className="w-full h-full object-cover rounded-full filter contrast-125 brightness-95"
                />
              </div>
            </motion.div>

            {/* WHAT / WHY Editorial Hierarchy */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3 mb-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_#C6A15B]" />
              <span className="text-[10px] sm:text-xs font-mono tracking-[0.35em] uppercase text-gold-light/95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                DIAGEO · First-Person Discovery
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_#C6A15B]" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28 }}
              className="font-serif text-[clamp(2.2rem,5vw,4.1rem)] text-[#FAF7F2] font-normal tracking-tight leading-[1.08] mb-4 max-w-3xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
            >
              Enter the Tasting House.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.38 }}
              className="text-stone/80 text-sm sm:text-base font-sans font-light max-w-xl mx-auto leading-relaxed mb-8 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]"
            >
              Step across the architectural threshold into the private DIAGEO estate.
              Walk room by room at human eye level, choose from physical tasting displays,
              and discover your bespoke spirit.
            </motion.p>

            {/* ACTION: Begin Discovery */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.48 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <button
                type="button"
                onClick={handleNext}
                className="group px-8 py-4 bg-[#C6A15B] hover:bg-[#D8BD7A] text-[#080807] font-mono text-xs uppercase tracking-[0.25em] font-medium rounded-sm shadow-[0_0_35px_rgba(198,161,91,0.35)] hover:shadow-[0_0_50px_rgba(198,161,91,0.5)] transition-all duration-300 cursor-pointer flex items-center gap-3 hover:-translate-y-0.5"
              >
                <span>
                  {answers.mood || answers.flavour ? 'Resume Tasting Journey' : 'Enter The Tasting House'}
                </span>
                <span className="transition-transform duration-300 group-hover:translate-x-1 font-bold">
                  →
                </span>
              </button>

              {(answers.mood || answers.flavour || answers.occasion || answers.spirit) && (
                <button
                  type="button"
                  onClick={handleRestart}
                  className="px-6 py-4 border border-stone/20 hover:border-gold/40 text-stone/70 hover:text-ivory font-mono text-xs uppercase tracking-[0.2em] rounded-sm transition-colors cursor-pointer bg-[#0e0d0b]/40"
                >
                  Restart Tasting
                </button>
              )}
            </motion.div>
          </motion.section>
        )}

        {/* ════════════════════════════════════════════════════════════ */}
        {/* 01 — THE MOOD (Tasting Deck Dealing Ritual) */}
        {/* ════════════════════════════════════════════════════════════ */}
        {stageIndex === 0 && (
          <motion.div
            key="stage-01"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex flex-col justify-between"
          >
            <TastingDeckChamber
              cards={moodCards}
              stageNumber={1}
              totalStages={TOTAL_QUESTION_DIMENSIONS}
              questionTitle="THE MOOD"
              questionPrompt="What are you in the mood for today?"
              questionSubtitle="Choose the feeling that matches your moment."
              initialSelectedId={answers.mood}
              onCardChosen={handleChooseMood}
            />
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════ */}
        {/* 02 — THE FLAVOUR (Tasting Deck Dealing Ritual) */}
        {/* ════════════════════════════════════════════════════════════ */}
        {stageIndex === 1 && (
          <motion.div
            key="stage-02"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex flex-col justify-between"
          >
            <TastingDeckChamber
              cards={flavourCards}
              stageNumber={2}
              totalStages={TOTAL_QUESTION_DIMENSIONS}
              questionTitle="THE FLAVOUR"
              questionPrompt="Which flavour profile draws you in?"
              questionSubtitle="Pick what excites your palate."
              initialSelectedId={answers.flavour}
              onCardChosen={handleChooseFlavour}
            />
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════ */}
        {/* 03 — THE OCCASION (Tasting Deck Dealing Ritual) */}
        {/* ════════════════════════════════════════════════════════════ */}
        {stageIndex === 2 && (
          <motion.div
            key="stage-03"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex flex-col justify-between"
          >
            <TastingDeckChamber
              cards={occasionCards}
              stageNumber={3}
              totalStages={TOTAL_QUESTION_DIMENSIONS}
              questionTitle="THE OCCASION"
              questionPrompt="When do you plan to enjoy it?"
              questionSubtitle="Select the atmosphere and company of your moment."
              initialSelectedId={answers.occasion}
              onCardChosen={handleChooseOccasion}
            />
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════ */}
        {/* 04 — THE SPIRIT (Tasting Deck Dealing Ritual) */}
        {/* ════════════════════════════════════════════════════════════ */}
        {stageIndex === 3 && (
          <motion.div
            key="stage-04-spirit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex flex-col justify-between"
          >
            <TastingDeckChamber
              cards={spiritCards}
              stageNumber={4}
              totalStages={TOTAL_QUESTION_DIMENSIONS}
              questionTitle="THE SPIRIT"
              questionPrompt="Which world would you like to explore?"
              questionSubtitle="Select the category and terroir that speaks to your curiosity."
              initialSelectedId={answers.spirit}
              onCardChosen={handleChooseSpirit}
            />
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════ */}
        {/* 05 — THE REVEAL */}
        {/* ════════════════════════════════════════════════════════════ */}
        {stageIndex === 4 && (
          <motion.div
            key="stage-05-reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full flex flex-col justify-between min-h-0"
          >
            <RecommendationReveal
              primaryMatch={primarySpirit}
              secondaryMatches={secondaryMatches}
              matchScore={matchScore}
              onRestart={handleRestart}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </DiscoveryShell>
  )
}
