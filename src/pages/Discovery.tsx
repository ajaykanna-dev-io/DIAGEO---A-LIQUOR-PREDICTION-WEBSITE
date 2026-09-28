import { useState, useEffect, useCallback, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import DiscoveryWelcome from '../components/discovery/DiscoveryWelcome'
import DiscoveryShell from '../components/discovery/DiscoveryShell'
import FlavorQuestionChamber from '../components/discovery/FlavorQuestionChamber'
import SensoryTransition from '../components/discovery/SensoryTransition'
import RecommendationReveal from '../components/discovery/RecommendationReveal'
import CinematicReveal from '../components/discovery/CinematicReveal'
import { questions, getShuffledQuestions, getQuestionsFromIds } from '../data/questions'
import { getAlternativesWithMatch } from '../data/spirits'
import { useTasteMatch } from '../hooks/useTasteMatch'
import type { Answers, Question } from '../types'
import { getRevealTechniqueForStage } from '../utils/discoveryTransitions'
import type { SensoryTransitionMetadata } from '../data/sensoryTransitionData'

const TOTAL_QUESTIONS = questions.length // 13 Flavor Questions from questions.ts
const TOTAL_STAGES = TOTAL_QUESTIONS + 1 // 13 Questions + 1 Reveal Stage
const STORAGE_KEY = 'no8reserve_discovery_persistent_v6'

interface ActiveTransitionState extends SensoryTransitionMetadata {
  stageNumber: number
  totalStages: number
  targetStageIndex: number
}

export default function Discovery() {
  // Load persistent state from localStorage (resilient against page refresh, browser restart)
  // stageIndex: -1 = Welcome Screen, 0..12 = Questions, 13 = Final Reveal
  // ALWAYS show welcome screen on initial website open (every new page load)
  // Only resume progress after user clicks LET'S BEGIN
  const [stageIndex, setStageIndex] = useState<number>(-1)

  // Active ordered questions for this discovery session (shuffled dynamically on every new session)
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed.questionOrder) && parsed.questionOrder.length > 0) {
          return getQuestionsFromIds(parsed.questionOrder)
        }
      }
      const sessionOrder = sessionStorage.getItem('no8reserve_discovery_order_v1')
      if (sessionOrder) {
        const parsedOrder = JSON.parse(sessionOrder)
        if (Array.isArray(parsedOrder) && parsedOrder.length > 0) {
          return getQuestionsFromIds(parsedOrder)
        }
      }
    } catch {}
    return getShuffledQuestions()
  })

  // Active sensory transition state (appears ONLY between Question A and Question B)
  const [activeTransition, setActiveTransition] = useState<ActiveTransitionState | null>(null)

  // 3-second cinematic reveal state (appears between Final Question and Result Page)
  const [isCinematicRevealing, setIsCinematicRevealing] = useState(false)
  const [isResultPageRevealed, setIsResultPageRevealed] = useState(false)

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
      const sessionAnswers = sessionStorage.getItem('no8reserve_discovery_answers_v3')
      if (sessionAnswers) {
        const parsed = JSON.parse(sessionAnswers)
        if (Object.keys(parsed).length > 0) return parsed
      }
    } catch {}
    return {}
  })

  // Currently active question (when stageIndex is 0..12) from the dynamic mixed questions
  const currentQuestion = useMemo(() => {
    if (stageIndex >= 0 && stageIndex < TOTAL_QUESTIONS) {
      return activeQuestions[stageIndex]
    }
    return null
  }, [stageIndex, activeQuestions])

  // Active sensory hue
  const ambientHue = useMemo(() => {
    if (activeTransition) return activeTransition.ambientHue
    if (!currentQuestion) return 38
    const activeOptId = answers[currentQuestion.id]
    const opt = currentQuestion.options.find((o) => o.id === activeOptId)
    return opt?.hue ?? 38
  }, [currentQuestion, answers, activeTransition])

  // Taste match calculation hook
  const { spirit: primarySpirit, match: matchScore } = useTasteMatch(answers)
  const secondaryMatches = useMemo(
    () => getAlternativesWithMatch(primarySpirit, 3).map((a) => a.spirit),
    [primarySpirit]
  )

  // Persist answers, stage, and shuffled question order to BOTH localStorage and sessionStorage (only active discovery stages >= 0)
  useEffect(() => {
    if (stageIndex < 0) return
    try {
      const payload = {
        stageIndex,
        answers,
        questionOrder: activeQuestions.map((q) => q.id),
        updatedAt: Date.now(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      sessionStorage.setItem('no8reserve_discovery_answers_v3', JSON.stringify(answers))
      sessionStorage.setItem('no8reserve_discovery_stage_v3', String(stageIndex))
      sessionStorage.setItem('no8reserve_discovery_order_v1', JSON.stringify(activeQuestions.map((q) => q.id)))
    } catch {}
  }, [answers, stageIndex, activeQuestions])

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

  // Proactively preload final result assets as soon as the final question is reached
  useEffect(() => {
    if (stageIndex === TOTAL_QUESTIONS - 1 && primarySpirit) {
      if (primarySpirit.image) {
        const img = new Image()
        img.src = primarySpirit.image
      }
      secondaryMatches.forEach((s) => {
        if (s.image) {
          const img = new Image()
          img.src = s.image
        }
      })
      const altar = new Image()
      altar.src = '/images/results_penthouse_altar.jpg'
      ;[
        '/images/sensory/sensory-vanilla.jpg',
        '/images/sensory/sensory-citrus.jpg',
        '/images/sensory/sensory-oak.jpg',
        '/images/sensory/sensory-spice.jpg',
        '/images/sensory/sensory-fruit.jpg',
        '/images/sensory/sensory-smoke.jpg',
      ].forEach((src) => {
        const orb = new Image()
        orb.src = src
      })
    }
  }, [stageIndex, primarySpirit, secondaryMatches])

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (stageIndex === TOTAL_QUESTIONS - 1) {
      // Ensure all questions have at least their default selection before revealing
      setAnswers((prev) => {
        const full = { ...prev }
        activeQuestions.forEach((q) => {
          if (!full[q.id]) {
            const defOpt = q.options[2] ?? q.options[0]
            if (defOpt) full[q.id] = defOpt.id
          }
        })
        return full
      })

      // Directly mount result stage and trigger the 3-second cinematic reveal
      setActiveTransition(null)
      setIsResultPageRevealed(false)
      setIsCinematicRevealing(true)
      setStageIndex(TOTAL_QUESTIONS)
      return
    }

    if (stageIndex + 1 < TOTAL_QUESTIONS) {
      // Direct question-to-question navigation without full-screen interstitial interruption
      setActiveTransition(null)
      setStageIndex((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [stageIndex, activeQuestions])

  // Called at 2.45s when the cinematic reveal overlay begins dissolving
  const handleRevealStart = useCallback(() => {
    setIsResultPageRevealed(true)
  }, [])

  // Called when CinematicReveal finishes its 3-second sequence
  const handleCinematicRevealComplete = useCallback(() => {
    setIsCinematicRevealing(false)
    setIsResultPageRevealed(true)
  }, [])

  // Called when SensoryTransition finishes its 4-phase sequence
  const handleTransitionComplete = useCallback(() => {
    if (activeTransition) {
      const targetIndex = activeTransition.targetStageIndex
      setActiveTransition(null)
      setStageIndex(targetIndex)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [activeTransition])

  const handleBack = useCallback(() => {
    setActiveTransition(null)
    setStageIndex((prev) => Math.max(prev - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Robust Restart / Recalibrate: Clears previous answers, resets to Welcome Screen, clears storage cache, and shuffles new question order
  const handleRestart = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      sessionStorage.removeItem('no8reserve_discovery_answers_v3')
      sessionStorage.removeItem('no8reserve_discovery_stage_v3')
      sessionStorage.removeItem('no8reserve_discovery_order_v1')
    } catch {}

    const newShuffled = getShuffledQuestions()
    setActiveQuestions(newShuffled)
    setActiveTransition(null)
    setIsCinematicRevealing(false)
    setIsResultPageRevealed(false)
    setAnswers({})
    setStageIndex(-1) // Return to Welcome Screen
  }, [])

  // Welcome Screen → Begin Discovery: transitions from stageIndex -1 to saved stage or a fresh shuffled discovery
  const handleWelcomeBegin = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        // Resume ONLY if the user was in an ongoing quiz (between stage 0 and 12) with active answers
        if (
          typeof parsed.stageIndex === 'number' &&
          parsed.stageIndex >= 0 &&
          parsed.stageIndex < TOTAL_QUESTIONS &&
          parsed.answers &&
          Object.keys(parsed.answers).length > 1
        ) {
          if (Array.isArray(parsed.questionOrder) && parsed.questionOrder.length > 0) {
            const restored = getQuestionsFromIds(parsed.questionOrder)
            setActiveQuestions(restored)
          }
          setStageIndex(parsed.stageIndex)
          setAnswers(parsed.answers)
          return
        }
      }
    } catch {}

    // Otherwise, generate a freshly shuffled sequence of questions for this new discovery session
    const newShuffled = getShuffledQuestions()
    setActiveQuestions(newShuffled)

    const firstQ = newShuffled[0]
    const defaultFirstAnswer = (firstQ?.options[2] ?? firstQ?.options[0])?.id
    const resetAnswers: Answers = defaultFirstAnswer ? { [firstQ.id]: defaultFirstAnswer } : {}
    setAnswers(resetAnswers)
    setStageIndex(0)
    try {
      const payload = {
        stageIndex: 0,
        answers: resetAnswers,
        questionOrder: newShuffled.map((q) => q.id),
        updatedAt: Date.now(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      sessionStorage.setItem('no8reserve_discovery_answers_v3', JSON.stringify(resetAnswers))
      sessionStorage.setItem('no8reserve_discovery_stage_v3', '0')
      sessionStorage.setItem('no8reserve_discovery_order_v1', JSON.stringify(newShuffled.map((q) => q.id)))
    } catch {}
  }, [])

  // Jump to specific stage
  const handleJumpToStage = useCallback((index: number) => {
    setActiveTransition(null)
    setStageIndex(Math.max(0, Math.min(index, TOTAL_STAGES - 1)))
  }, [])

  const stageTitle = useMemo(() => {
    if (stageIndex < TOTAL_QUESTIONS) {
      return currentQuestion?.stageName || `Flavour ${stageIndex + 1}`
    }
    return 'The Reveal'
  }, [stageIndex, currentQuestion])

  // Cinematic discovery reveal technique for current stage
  const currentTransitionConfig = useMemo(() => {
    return getRevealTechniqueForStage(stageIndex)
  }, [stageIndex])

  // Welcome Screen (stageIndex === -1)
  if (stageIndex === -1) {
    return <DiscoveryWelcome onBegin={handleWelcomeBegin} />
  }

  // Render the final result stage with the 3-second cinematic reveal overlay mounted above it
  if (stageIndex === TOTAL_QUESTIONS) {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-[#070605]">
        {/* The final result page is already mounted underneath the cinematic reveal */}
        <RecommendationReveal
          primaryMatch={primarySpirit}
          secondaryMatches={secondaryMatches}
          matchScore={matchScore}
          onRestart={handleRestart}
          isRevealed={isResultPageRevealed || !isCinematicRevealing}
        />

        {/* The 3-second cinematic reveal overlay sits on top */}
        {isCinematicRevealing && (
          <CinematicReveal
            result={primarySpirit}
            answers={answers}
            onRevealStart={handleRevealStart}
            onComplete={handleCinematicRevealComplete}
          />
        )}
      </div>
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
      isTransitioning={Boolean(activeTransition)}
      onBack={handleBack}
      onNext={handleNext}
      onJumpToStage={handleJumpToStage}
      onRestart={handleRestart}
    >
      <AnimatePresence mode="wait">
        {activeTransition ? (
          <SensoryTransition
            key={`sensory-transition-${activeTransition.targetStageIndex}`}
            stageNumber={activeTransition.stageNumber}
            totalStages={activeTransition.totalStages}
            category={activeTransition.category}
            title={activeTransition.title}
            description={activeTransition.description}
            imageUrl={activeTransition.imageUrl}
            fallbackImageUrl={activeTransition.fallbackImageUrl}
            atmosphere={activeTransition.atmosphere}
            ambientHue={activeTransition.ambientHue}
            onTransitionComplete={handleTransitionComplete}
          />
        ) : (
          stageIndex >= 0 && stageIndex < TOTAL_QUESTIONS && currentQuestion && (
            <FlavorQuestionChamber
              key="flavor-question-chamber-persistent"
              questions={activeQuestions}
              question={currentQuestion}
              totalQuestions={TOTAL_QUESTIONS}
              currentIndex={stageIndex}
              answers={answers}
              selectedOptionId={answers[currentQuestion.id]}
              matchScore={matchScore}
              revealTechnique={currentTransitionConfig.technique}
              onSelectOption={(optionId, qId) => {
                const targetQId = qId || currentQuestion.id
                setAnswers((prev) => ({ ...prev, [targetQId]: optionId }))
              }}
              onStageIndexChange={(nextIdx) => {
                setStageIndex(nextIdx)
              }}
              onNext={handleNext}
              onBack={handleBack}
            />
          )
        )}
      </AnimatePresence>
    </DiscoveryShell>
  )
}
