import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DiscoveryShell from '../components/discovery/DiscoveryShell'
import FlavorQuestionChamber from '../components/discovery/FlavorQuestionChamber'
import RecommendationReveal from '../components/discovery/RecommendationReveal'
import { questions } from '../data/questions'
import { getAlternativesWithMatch } from '../data/spirits'
import { useTasteMatch } from '../hooks/useTasteMatch'
import type { Answers } from '../types'
import { barMusic } from '../utils/barMusicEngine'
import { getRevealTechniqueForStage } from '../utils/discoveryTransitions'

const TOTAL_QUESTIONS = questions.length // 13 Flavor Questions from questions.ts
const TOTAL_STAGES = TOTAL_QUESTIONS + 1 // 13 Questions + 1 Reveal Stage
const STORAGE_KEY = 'diageo_discovery_persistent_v5'



export default function Discovery() {
  // Load persistent state from localStorage (resilient against page refresh, browser restart)
  const [stageIndex, setStageIndex] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (typeof parsed.stageIndex === 'number') {
          return Math.max(-1, Math.min(parsed.stageIndex, TOTAL_STAGES - 1))
        }
      }
      // Fallback check sessionStorage
      const sessionStage = sessionStorage.getItem('diageo_discovery_stage_v3')
      if (sessionStage !== null) {
        const num = parseInt(sessionStage, 10)
        if (!isNaN(num)) return Math.max(-1, Math.min(num, TOTAL_STAGES - 1))
      }
    } catch {}
    return -1 // Default to Gateway sanctuary hero view
  })

  // Load persistent user answers or fallback to medium defaults
  const [answers, setAnswers] = useState<Answers>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed.answers && Object.keys(parsed.answers).length > 0) {
          return parsed.answers
        }
      }
      const sessionAnswers = sessionStorage.getItem('diageo_discovery_answers_v3')
      if (sessionAnswers) {
        const parsed = JSON.parse(sessionAnswers)
        if (Object.keys(parsed).length > 0) return parsed
      }
    } catch {}
    return {}
  })

  // Currently active question (when stageIndex is 0..12)
  const currentQuestion = useMemo(() => {
    if (stageIndex >= 0 && stageIndex < TOTAL_QUESTIONS) {
      return questions[stageIndex]
    }
    return null
  }, [stageIndex])

  // Active sensory hue
  const ambientHue = useMemo(() => {
    if (!currentQuestion) return 38
    const activeOptId = answers[currentQuestion.id]
    const opt = currentQuestion.options.find((o) => o.id === activeOptId)
    return opt?.hue ?? 38
  }, [currentQuestion, answers])

  // Taste match calculation hook
  const { spirit: primarySpirit, match: matchScore } = useTasteMatch(answers)
  const secondaryMatches = useMemo(
    () => getAlternativesWithMatch(primarySpirit, 3).map((a) => a.spirit),
    [primarySpirit]
  )

  // Persist answers and stage to BOTH localStorage and sessionStorage
  useEffect(() => {
    try {
      const payload = {
        stageIndex,
        answers,
        updatedAt: Date.now(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      sessionStorage.setItem('diageo_discovery_answers_v3', JSON.stringify(answers))
      sessionStorage.setItem('diageo_discovery_stage_v3', String(stageIndex))
    } catch {}
  }, [answers, stageIndex])

  // Ensure every active question defaults to checkpoint 3 (middle / medium) if not yet chosen
  useEffect(() => {
    if (stageIndex >= 0 && stageIndex < TOTAL_QUESTIONS && currentQuestion) {
      setAnswers((prev) => {
        if (!prev[currentQuestion.id]) {
          const defaultMiddleOption = currentQuestion.options[2] ?? currentQuestion.options[0]
          if (defaultMiddleOption) {
            return {
              ...prev,
              [currentQuestion.id]: defaultMiddleOption.id,
            }
          }
        }
        return prev
      })
    }
  }, [stageIndex, currentQuestion])

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (stageIndex === TOTAL_QUESTIONS - 1) {
      // Ensure all questions have at least their default selection before revealing
      setAnswers((prev) => {
        const full = { ...prev }
        questions.forEach((q) => {
          if (!full[q.id]) {
            const defOpt = q.options[2] ?? q.options[0]
            if (defOpt) full[q.id] = defOpt.id
          }
        })
        return full
      })
    }
    setStageIndex((prev) => Math.min(prev + 1, TOTAL_STAGES - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [stageIndex])

  const handleBack = useCallback(() => {
    setStageIndex((prev) => Math.max(prev - 1, -1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Robust Restart / Recalibrate: Clears previous answers, resets to Question 1, and clears storage cache
  const handleRestart = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      sessionStorage.removeItem('diageo_discovery_answers_v3')
      sessionStorage.removeItem('diageo_discovery_stage_v3')
    } catch {}

    const firstQ = questions[0]
    const defaultFirstAnswer = (firstQ?.options[2] ?? firstQ?.options[0])?.id
    const resetAnswers: Answers = defaultFirstAnswer ? { [firstQ.id]: defaultFirstAnswer } : {}

    setAnswers(resetAnswers)
    setStageIndex(0) // Start directly at Question 1

    try {
      const payload = {
        stageIndex: 0,
        answers: resetAnswers,
        updatedAt: Date.now(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      sessionStorage.setItem('diageo_discovery_answers_v3', JSON.stringify(resetAnswers))
      sessionStorage.setItem('diageo_discovery_stage_v3', '0')
    } catch {}

    barMusic.playChamberWalkTransition()
  }, [])

  // Jump to specific stage
  const handleJumpToStage = useCallback((index: number) => {
    setStageIndex(Math.max(-1, Math.min(index, TOTAL_STAGES - 1)))
    barMusic.playChamberWalkTransition()
  }, [])

  const stageTitle = useMemo(() => {
    if (stageIndex === -1) return 'Gateway Sanctuary'
    if (stageIndex < TOTAL_QUESTIONS) {
      return currentQuestion?.stageName || `Flavour ${stageIndex + 1}`
    }
    return 'The Reveal'
  }, [stageIndex, currentQuestion])

  const answeredCount = Object.keys(answers).length

  // Cinematic discovery reveal technique for current stage
  const currentTransitionConfig = useMemo(() => {
    return getRevealTechniqueForStage(stageIndex)
  }, [stageIndex])

  // Directly render the ultra-premium full-screen reveal window when final stage is reached
  if (stageIndex === TOTAL_QUESTIONS) {
    return (
      <RecommendationReveal
        primaryMatch={primarySpirit}
        secondaryMatches={secondaryMatches}
        matchScore={matchScore}
        onRestart={handleRestart}
      />
    )
  }

  return (
    <DiscoveryShell
      currentStageIndex={stageIndex}
      totalStages={TOTAL_STAGES}
      totalQuestions={TOTAL_QUESTIONS}
      stageTitle={stageTitle}
      ambientHue={ambientHue}
      matchScore={Math.round(matchScore)}
      revealTechnique={currentTransitionConfig.technique}
      onBack={handleBack}
      onNext={handleNext}
      onJumpToStage={handleJumpToStage}
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
            className="flex flex-col items-center text-center my-auto py-8 sm:py-16 max-w-4xl mx-auto z-10 px-4"
          >
            {/* Visual Sanctuary Crest with 3D Concentric Orbitals */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative w-36 h-36 sm:w-44 sm:h-44 mb-8 flex items-center justify-center"
            >
              {/* Concentric Ambient Rings */}
              <div className="absolute inset-0 rounded-full border border-[#C6A15B]/25 animate-spin-slow" />
              <div className="absolute inset-3 rounded-full border border-dashed border-[#C6A15B]/35 animate-spin-reverse" />
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#0d0c0a] border border-[#C6A15B]/50 shadow-[0_0_55px_rgba(198,161,91,0.3)] flex items-center justify-center p-3 overflow-hidden">
                <img
                  src={questions[0]?.image as string || '/images/discovery/19-discovery-hero.webp'}
                  alt="DIAGEO Tasting Journey"
                  className="w-full h-full object-cover rounded-full filter contrast-125 brightness-95"
                />
              </div>
            </motion.div>

            {/* WHAT / WHY Editorial Hierarchy */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_#C6A15B]" />
              <span className="text-[10px] sm:text-xs font-mono tracking-[0.35em] uppercase text-gold-light/95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                DIAGEO · WHAT'S YOUR WHISKY
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_#C6A15B]" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28 }}
              className="font-serif text-[clamp(2.2rem,5vw,4.2rem)] text-[#FAF7F2] font-normal tracking-tight leading-[1.08] mb-5 max-w-3xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
            >
              Find your flavour.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.38 }}
              className="text-stone/80 text-sm sm:text-base md:text-lg font-sans font-light max-w-xl mx-auto leading-relaxed mb-10 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]"
            >
              Take our guided 13-stage sensory journey to calibrate your unique Taste Profile.
              Using artificial intelligence and master blender craft, we uncover your bespoke spirit match.
            </motion.p>

            {/* ACTION: Begin / Resume Discovery */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.48 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <button
                type="button"
                onClick={() => {
                  barMusic.playChamberWalkTransition()
                  setStageIndex(0)
                }}
                className="group px-9 py-4 bg-[#C6A15B] hover:bg-[#D8BD7A] text-[#080807] font-mono text-xs uppercase tracking-[0.25em] font-semibold rounded-full shadow-[0_0_35px_rgba(198,161,91,0.35)] hover:shadow-[0_0_50px_rgba(198,161,91,0.55)] transition-all duration-300 cursor-pointer flex items-center gap-3 hover:scale-105 active:scale-95"
              >
                <span>
                  {answeredCount > 0 ? `Resume Calibration (${answeredCount}/13 Saved)` : 'Begin Taste Calibration'}
                </span>
                <span className="transition-transform duration-300 group-hover:translate-x-1 font-bold">
                  →
                </span>
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="px-6 py-4 border border-stone/20 hover:border-gold/40 text-stone/70 hover:text-ivory font-mono text-xs uppercase tracking-[0.2em] rounded-full transition-colors cursor-pointer bg-[#0e0d0b]/40 hover:bg-white/5"
              >
                Start Fresh Calibration
              </button>
            </motion.div>
          </motion.section>
        )}

        {/* ════════════════════════════════════════════════════════════ */}
        {/* 01..13 — FLAVOR QUESTION CHAMBERS (Cinematic Discovery Reveal) */}
        {/* ════════════════════════════════════════════════════════════ */}
        {stageIndex >= 0 && stageIndex < TOTAL_QUESTIONS && currentQuestion && (
          <motion.div
            key={`question-stage-${currentQuestion.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 0.985,
              filter: 'blur(6px)',
              transition: { duration: 0.35, ease: [0.4, 0, 1, 1] },
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex-1 min-h-0 flex flex-col justify-between overflow-hidden"
          >
            <FlavorQuestionChamber
              question={currentQuestion}
              totalQuestions={TOTAL_QUESTIONS}
              currentIndex={stageIndex}
              selectedOptionId={answers[currentQuestion.id]}
              matchScore={matchScore}
              revealTechnique={currentTransitionConfig.technique}
              onSelectOption={(optionId) => {
                setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }))
              }}
              onNext={handleNext}
              onBack={handleBack}
            />
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════ */}
        {/* 14 — THE REVEAL STAGE (Full Environmental Reveal) */}
        {/* ════════════════════════════════════════════════════════════ */}
        {stageIndex === TOTAL_QUESTIONS && (
          <motion.div
            key="stage-final-reveal"
            initial={{ opacity: 0, scale: 0.96, filter: 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
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
