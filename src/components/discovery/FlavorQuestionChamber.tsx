import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Question } from '@/types'
import { getSensoryTransitionData, type SensoryTransitionMetadata } from '../../data/sensoryTransitionData'
import SensoryMedallion from './SensoryMedallion'

interface FlavorQuestionChamberProps {
  questions?: Question[]
  question: Question
  nextQuestion?: Question
  totalQuestions?: number
  currentIndex: number
  selectedOptionId?: string
  answers?: Record<string, string>
  matchScore?: number
  revealTechnique?: string
  onSelectOption: (optionId: string, questionId?: string) => void
  onNext: () => void
  onBack: () => void
  onStageIndexChange?: (newIndex: number) => void
}

/**
 * 5 Canonical Sensory Intensity Levels
 * Corresponds 1:1 with question.options[0..4]
 */
export interface IntensityLevelConfig {
  level: number // 1..5
  index: number // 0..4
  code: string // '01'..'05'
  label: string // 'NOT FOR ME', 'A HINT IS NICE', 'MODERATELY', 'QUITE A BIT', 'ABSOLUTELY'
  sublabel: string
  image: string
  normalizedProgress: number // 0.0, 0.25, 0.50, 0.75, 1.0
}

export const SENSORY_LEVELS: IntensityLevelConfig[] = [
  {
    level: 1,
    index: 0,
    code: '01',
    label: 'NOT FOR ME',
    sublabel: 'Not for me',
    image: '/images/orbs/orb-1.jpg',
    normalizedProgress: 0.0,
  },
  {
    level: 2,
    index: 1,
    code: '02',
    label: 'A HINT IS NICE',
    sublabel: 'A hint is nice',
    image: '/images/orbs/orb-2.jpg',
    normalizedProgress: 0.25,
  },
  {
    level: 3,
    index: 2,
    code: '03',
    label: 'MODERATELY',
    sublabel: 'Moderately',
    image: '/images/orbs/orb-3.jpg',
    normalizedProgress: 0.5,
  },
  {
    level: 4,
    index: 3,
    code: '04',
    label: 'QUITE A BIT',
    sublabel: 'Quite a bit',
    image: '/images/orbs/orb-4.jpg',
    normalizedProgress: 0.75,
  },
  {
    level: 5,
    index: 4,
    code: '05',
    label: 'ABSOLUTELY',
    sublabel: 'Absolutely',
    image: '/images/orbs/orb-5.jpg',
    normalizedProgress: 1.0,
  },
]

export const LEVEL_QUOTES: Record<number, string> = {
  1: 'Pure essence without sweetness',
  2: 'A subtle, gentle whisper',
  3: 'I enjoy it...',
  4: 'Bold character and warmth',
  5: 'Rich, intense, and uncompromising',
}

/**
 * Curated Editorial Headlines & Sensory Terms for all 13 tasting chapters.
 */
export interface QuestionEditorial {
  eyebrow: string
  lead: string
  highlight: string
  ambientHue: number
}

export const QUESTION_EDITORIALS: Record<string, QuestionEditorial> = {
  burntWood: {
    eyebrow: 'SMOKE & OAK',
    lead: 'How passionately do you pursue',
    highlight: 'the rich smoke of charred oak and peated embers?',
    ambientHue: 34,
  },
  chillies: {
    eyebrow: 'HEAT & SPICE',
    lead: 'How passionately do you embrace',
    highlight: 'the vibrant prickle of fiery pepper and highland spice?',
    ambientHue: 24,
  },
  coconut: {
    eyebrow: 'TROPICAL SILK',
    lead: 'To what degree does your palate celebrate',
    highlight: 'the velvety sweetness of toasted coconut and creamy vanillin?',
    ambientHue: 40,
  },
  appleCooked: {
    eyebrow: 'ORCHARD & CARAMEL',
    lead: 'How deeply do you favor',
    highlight: 'the warm resonance of baked orchard apples and dark caramel?',
    ambientHue: 36,
  },
  caramelPopcorns: {
    eyebrow: 'MAILLARD CONFECTION',
    lead: 'How enticing do you find',
    highlight: 'the rich, buttery allure of caramel popcorn?',
    ambientHue: 38,
  },
  greenTea: {
    eyebrow: 'BOTANICAL CLARITY',
    lead: 'How intently does your palate appreciate',
    highlight: 'the crisp botanical cut of highland tea and structured wood tannins?',
    ambientHue: 48,
  },
  pear: {
    eyebrow: 'FLORAL ESTERS',
    lead: 'How delicately do you welcome',
    highlight: 'the ethereal lift of crisp autumn pear and fragrant blossom?',
    ambientHue: 44,
  },
  freshGinger: {
    eyebrow: 'RHIZOME ZEST',
    lead: 'How boldly do you pursue',
    highlight: 'the electric zing of fresh root ginger and tingling warmth?',
    ambientHue: 30,
  },
  cumin: {
    eyebrow: 'TERROIR DEPTH',
    lead: 'How profoundly do you welcome',
    highlight: 'the earthy rustic warmth of toasted cumin and roasted spice?',
    ambientHue: 28,
  },
  cinnamon: {
    eyebrow: 'BARK & HEARTH',
    lead: 'How warmly do you embrace',
    highlight: 'the aromatic comfort of true Ceylon cinnamon and sweet wood?',
    ambientHue: 26,
  },
  vanilla: {
    eyebrow: 'BOURBON CASK',
    lead: 'How deeply do you crave',
    highlight: 'the luxurious warmth of aged Madagascar bourbon vanilla?',
    ambientHue: 38,
  },
  citrus: {
    eyebrow: 'ZEST & SOLAR',
    lead: 'How brightly do you favor',
    highlight: 'the sunlit burst of Seville orange oils and vibrant bergamot?',
    ambientHue: 42,
  },
  peat: {
    eyebrow: 'MARITIME EMBERS',
    lead: 'How intensely do you seek',
    highlight: 'the untamed coastal brine and phenolic depth of Islay peat?',
    ambientHue: 22,
  },
}

/**
 * Coordinate mapping along horizontal sensory scale:
 * Desktop: min 12%, max 88%
 * Mobile: min 8%, max 92%
 */
export function getArcCoordinates(progress: number, isMobile: boolean = false): { x: number; y: number } {
  const p = Math.max(0, Math.min(1, progress))
  const minX = isMobile ? 8 : 12
  const maxX = isMobile ? 92 : 88
  const widthSpan = maxX - minX

  const x = minX + p * widthSpan
  const y = 50

  return { x, y }
}

// ============================================================================
// QUESTION SCENE SUBCOMPONENT
// Encapsulates ONE complete question scene:
// - Atmospheric warmth & smoke
// - Outer glowing luxury frame + decorative diamonds
// - Header (Nº8 Reserve logo, TASTE DISCOVERY, STAGE XX / 13)
// - Left Column: Question title, Selection badge, 5-Node sensory rating scale
// - Right Column: Category eyebrow, diamond divider, Sensory Medallion suite
// - Bottom Navigation: ‹ PREVIOUS, Floating selection pill badge, NEXT QUESTION →
// ============================================================================

interface QuestionSceneProps {
  question: Question
  questionIndex: number
  totalQuestions: number
  editorial: QuestionEditorial
  sensoryData: SensoryTransitionMetadata
  selectedOptionId?: string
  isTransitioning: boolean
  onSelectOption: (optionId: string, questionId?: string) => void
  onAdvance: () => void
  onPrevious: () => void
}

function QuestionScene({
  question,
  questionIndex,
  totalQuestions,
  editorial,
  sensoryData,
  selectedOptionId,
  isTransitioning,
  onSelectOption,
  onAdvance,
  onPrevious,
}: QuestionSceneProps) {
  // Determine initial level
  const initialLevel = useMemo(() => {
    if (!selectedOptionId) return 3
    const idx = question.options.findIndex((opt) => opt.id === selectedOptionId)
    return idx >= 0 ? idx + 1 : 3
  }, [selectedOptionId, question.options])

  const initialProgress = (initialLevel - 1) / 4

  const [activeLevel, setActiveLevel] = useState<number>(initialLevel)
  const [visualProgress, setVisualProgress] = useState<number>(initialProgress)
  const visualProgressRef = useRef<number>(initialProgress)
  const rawProgressRef = useRef<number>(initialProgress)

  const [isTraveling, setIsTraveling] = useState<boolean>(false)
  const isTravelingRef = useRef<boolean>(false)
  const [targetLevel, setTargetLevel] = useState<number | null>(null)
  const [pulsingLevel, setPulsingLevel] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const isDraggingRef = useRef<boolean>(false)

  // Mobile drawer state
  const [showMobileInfo, setShowMobileInfo] = useState<boolean>(false)

  const arcContainerRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<{
    startTime: number
    startProgress: number
    targetProgress: number
    duration: number
    targetLevel: number
    rafId: number | null
  }>({
    startTime: 0,
    startProgress: initialProgress,
    targetProgress: initialProgress,
    duration: 0,
    targetLevel: initialLevel,
    rafId: null,
  })

  // Damping physics loop for dragging inertia
  useEffect(() => {
    let animationFrameId: number
    let lastTime = performance.now()

    const updatePhysics = (now: number) => {
      if (isTravelingRef.current) {
        animationFrameId = requestAnimationFrame(updatePhysics)
        return
      }

      const dt = Math.min(0.04, (now - lastTime) / 1000)
      lastTime = now

      const target = rawProgressRef.current
      const current = visualProgressRef.current
      const diff = target - current

      if (Math.abs(diff) > 0.0001) {
        const rate = isDraggingRef.current ? 22 : 14
        const damping = 1 - Math.exp(-rate * dt)
        const next = current + diff * damping

        visualProgressRef.current = next
        setVisualProgress(next)

        const nearest = Math.max(1, Math.min(5, Math.round(next * 4) + 1))
        if (nearest !== activeLevel) {
          setActiveLevel(nearest)
        }
      } else if (current !== target) {
        visualProgressRef.current = target
        setVisualProgress(target)
        const nearest = Math.max(1, Math.min(5, Math.round(target * 4) + 1))
        if (nearest !== activeLevel) {
          setActiveLevel(nearest)
        }
      }

      animationFrameId = requestAnimationFrame(updatePhysics)
    }

    animationFrameId = requestAnimationFrame(updatePhysics)
    return () => cancelAnimationFrame(animationFrameId)
  }, [activeLevel])

  // Direct orb tap with Traveling Light animation & confirmation
  const handleOrbClick = useCallback(
    (targetLvl: number) => {
      if (isTransitioning) return

      if (animRef.current.rafId) {
        cancelAnimationFrame(animRef.current.rafId)
        animRef.current.rafId = null
      }

      // If user clicks the currently active level directly:
      // Pulse confirmation and advance
      if (targetLvl === activeLevel && !isTravelingRef.current) {
        setPulsingLevel(targetLvl)
        const targetOption = question.options[targetLvl - 1]
        if (targetOption) {
          onSelectOption(targetOption.id, question.id)
        }
        setTimeout(() => {
          setPulsingLevel(null)
          onAdvance()
        }, 260)
        return
      }

      // If user clicks a different level:
      // Glide traveling light to target
      const currentProg = visualProgressRef.current
      const targetProg = (targetLvl - 1) / 4
      const duration = 520

      setIsTraveling(true)
      isTravelingRef.current = true
      setTargetLevel(targetLvl)
      setPulsingLevel(null)

      animRef.current = {
        startTime: performance.now(),
        startProgress: currentProg,
        targetProgress: targetProg,
        duration,
        targetLevel: targetLvl,
        rafId: null,
      }

      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

      const runAnimation = (now: number) => {
        const elapsed = now - animRef.current.startTime
        const t = Math.min(1, elapsed / animRef.current.duration)
        const easedT = easeInOutCubic(t)

        const nextProgress =
          animRef.current.startProgress +
          (animRef.current.targetProgress - animRef.current.startProgress) * easedT

        visualProgressRef.current = nextProgress
        rawProgressRef.current = nextProgress
        setVisualProgress(nextProgress)

        if (t < 1) {
          animRef.current.rafId = requestAnimationFrame(runAnimation)
        } else {
          visualProgressRef.current = animRef.current.targetProgress
          rawProgressRef.current = animRef.current.targetProgress
          setVisualProgress(animRef.current.targetProgress)

          const finalLvl = animRef.current.targetLevel
          setActiveLevel(finalLvl)
          setIsTraveling(false)
          isTravelingRef.current = false
          setTargetLevel(null)

          setPulsingLevel(finalLvl)
          const targetOption = question.options[finalLvl - 1]
          if (targetOption) {
            onSelectOption(targetOption.id, question.id)
          }

          setTimeout(() => {
            setPulsingLevel(null)
          }, 350)
        }
      }

      animRef.current.rafId = requestAnimationFrame(runAnimation)
    },
    [activeLevel, isTransitioning, question, onSelectOption, onAdvance]
  )

  // Pointer dragging updates
  const updateRawFromPointer = useCallback((clientX: number) => {
    const container = arcContainerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const isMobile = rect.width < 640
    const minX = isMobile ? 0.08 : 0.12
    const maxX = isMobile ? 0.92 : 0.88
    const span = maxX - minX

    const normalized = (clientX - rect.left) / rect.width
    const clampedProgress = Math.max(0, Math.min(1, (normalized - minX) / span))

    rawProgressRef.current = clampedProgress
  }, [])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isTransitioning) return
    e.preventDefault()

    if (animRef.current.rafId) {
      cancelAnimationFrame(animRef.current.rafId)
      animRef.current.rafId = null
    }
    setIsTraveling(false)
    isTravelingRef.current = false
    setTargetLevel(null)
    setPulsingLevel(null)

    const container = arcContainerRef.current
    if (container) {
      try {
        container.setPointerCapture(e.pointerId)
      } catch { }
    }

    isDraggingRef.current = true
    setIsDragging(true)
    updateRawFromPointer(e.clientX)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || isTransitioning) return
    e.preventDefault()
    updateRawFromPointer(e.clientX)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || isTransitioning) return
    e.preventDefault()

    const container = arcContainerRef.current
    if (container) {
      try {
        if (container.hasPointerCapture(e.pointerId)) {
          container.releasePointerCapture(e.pointerId)
        }
      } catch { }
    }

    isDraggingRef.current = false
    setIsDragging(false)

    const snapped = Math.max(1, Math.min(5, Math.round(visualProgressRef.current * 4) + 1))
    const snappedProg = (snapped - 1) / 4
    rawProgressRef.current = snappedProg
    visualProgressRef.current = snappedProg
    setVisualProgress(snappedProg)
    setActiveLevel(snapped)

    setPulsingLevel(snapped)
    const targetOption = question.options[snapped - 1]
    if (targetOption) {
      onSelectOption(targetOption.id, question.id)
    }

    setTimeout(() => {
      setPulsingLevel(null)
    }, 350)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handleOrbClick(Math.max(1, activeLevel - 1))
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleOrbClick(Math.min(5, activeLevel + 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        onAdvance()
      } else if (e.key === 'Backspace' && questionIndex > 0) {
        e.preventDefault()
        onPrevious()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeLevel, questionIndex, isTransitioning, handleOrbClick, onAdvance, onPrevious])

  const indicatorCoords = useMemo(() => {
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false
    return getArcCoordinates(visualProgress, isMobile)
  }, [visualProgress])

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* ── 1. VOLUMETRIC AMBIENT WARMTH & ATMOSPHERIC BREATH ── */}
      <div
        className="pointer-events-none absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[320px] rounded-full blur-[90px] z-[1] transition-all duration-1000"
        style={{
          opacity: 0.14 + visualProgress * 0.32,
          transform: `translate(-50%, -50%) scale(${0.96 + visualProgress * 0.08})`,
          background: `radial-gradient(ellipse at center, hsla(${editorial.ambientHue}, 75%, 45%, 0.32) 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Atmospheric rising smoke wisps */}
      <div className="pointer-events-none absolute top-[36%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[240px] z-[2] overflow-hidden">
        <motion.div
          animate={{
            y: [-6, -28, -6],
            opacity: 0.15 + visualProgress * 0.45,
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full h-full bg-gradient-to-t from-transparent via-[#E8D196]/15 to-transparent blur-2xl"
        />
      </div>

      {/* ── 2. ACTIVE GLOWING LUXURY FRAME WITH TOP & BOTTOM DECORATIVE DIAMONDS ── */}
      <div
        className="absolute inset-3 sm:inset-5 md:inset-6 rounded-[22px] sm:rounded-[28px] pointer-events-none z-10 border border-[#E3C585]/40 shadow-[0_0_28px_rgba(227,197,133,0.16)]"
        aria-hidden="true"
      >
        {/* Top center diamond on horizontal border */}
        <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 border border-[#E3C585] bg-[#0A0908] shadow-[0_0_10px_rgba(227,197,133,0.8)]" />
        {/* Bottom center diamond on horizontal border */}
        <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 border border-[#E3C585] bg-[#0A0908] shadow-[0_0_10px_rgba(227,197,133,0.8)]" />
      </div>

      {/* ── 3. UNIFIED INNER CHAMBER CONTAINER ── */}
      <div className="absolute inset-3 sm:inset-5 md:inset-6 rounded-[22px] sm:rounded-[28px] flex flex-col justify-between overflow-hidden pt-4 sm:pt-5 pb-3 sm:pb-4 px-4 sm:px-8 lg:px-10 xl:px-14 z-20 pointer-events-auto">

        {/* ── 3A. HEADER ROW (TOP) ── */}
        <header className="relative w-full flex items-center justify-between z-30 select-none pb-1 shrink-0">
          {/* Top-Left: Nº8 RESERVE logo mark + TASTE DISCOVERY */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <img
              src="/images/logo-BJ7D25WF.webp"
              alt="No. 8 Reserve"
              className="h-7 sm:h-8 w-auto object-contain opacity-95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] filter brightness-105"
            />
            <span className="w-px h-3.5 bg-[#C6A15B]/40" />
            <span className="font-serif text-[10.5px] sm:text-[11.5px] tracking-[0.24em] text-[#C6A15B] uppercase font-light drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              TASTE DISCOVERY
            </span>
          </div>

          {/* Top-Right: STAGE XX / 13 */}
          <div className="font-sans text-[10px] sm:text-[11px] tracking-[0.28em] text-[#FAF7F2]/75 font-light uppercase flex items-center gap-2.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            <span className="w-4 sm:w-5 h-px bg-[#C6A15B]/40 inline-block" />
            <span>
              STAGE {String(questionIndex + 1).padStart(2, '0')} / {String(totalQuestions || 13).padStart(2, '0')}
            </span>
          </div>
        </header>

        {/* ── 3B. MAIN CONTENT ROW (50% / 50% LUXURY REGIONS) ── */}
        <div className="flex-1 w-full flex flex-col lg:flex-row gap-4 xl:gap-8 items-center justify-between min-h-0 overflow-visible py-1">

          {/* ── LEFT COLUMN: UNIFIED QUESTION & SENSORY CONSOLE (50%) ── */}
          <div className="w-full lg:w-[50%] xl:w-[50%] h-full flex flex-col items-center justify-center py-1 overflow-visible pb-3 sm:pb-5">

            <div className="relative w-full max-w-[560px] xl:max-w-[600px] mx-auto flex flex-col items-center justify-center gap-2 sm:gap-3 select-none">

              {/* Volumetric ambient warm glow behind console */}
              <div
                className="pointer-events-none absolute -inset-6 rounded-full blur-[80px] z-0 opacity-25"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(255, 215, 0, 0.45) 0%, rgba(227, 197, 133, 0.2) 45%, transparent 75%)',
                }}
                aria-hidden="true"
              />

              {/* 1. EDITORIAL QUESTION HEADING */}
              <motion.div
                initial={{ opacity: 0, filter: 'blur(8px)', y: 6 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ duration: 0.85, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full text-center px-2"
              >
                <h2 className="font-serif font-normal text-[23px] sm:text-[27px] md:text-[30px] text-[#FAF7F2] leading-[1.26] max-w-[560px] xl:max-w-[600px] mx-auto drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
                  <span>{editorial.lead} </span>
                  <span className="font-serif italic text-[#E3C585] font-normal">{editorial.highlight}</span>
                </h2>
              </motion.div>

              {/* 2. ACTIVE SELECTION READOUT BADGE (03 MODERATELY) */}
              <motion.div
                initial={{ opacity: 0, filter: 'blur(5px)', y: 4 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ duration: 0.75, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 flex flex-col items-center justify-center pointer-events-none my-0.5 min-h-[50px] sm:min-h-[54px]"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${question.id}-${activeLevel}`}
                    initial={{ opacity: 0, y: 5, filter: 'blur(3px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -5, filter: 'blur(3px)' }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className="flex flex-col items-center justify-center"
                  >
                    <span className="font-serif font-normal text-[34px] sm:text-[38px] text-[#FFEAA5] leading-none drop-shadow-[0_0_16px_rgba(255,200,107,0.5)]">
                      {SENSORY_LEVELS[activeLevel - 1]?.code || '03'}
                    </span>
                    <span
                      style={{ fontSize: '0.72rem', letterSpacing: '0.3em', color: '#C6A15B' }}
                      className="font-sans uppercase font-medium mt-1 drop-shadow-[0_0_8px_rgba(255,200,107,0.3)]"
                    >
                      {SENSORY_LEVELS[activeLevel - 1]?.label || 'MODERATELY'}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* 3. 5-NODE PRECISION SENSORY TASTING SCALE */}
              <motion.div
                ref={arcContainerRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  touchAction: 'none',
                  pointerEvents: isTransitioning ? 'none' : 'auto',
                }}
                className="relative z-10 w-full h-[120px] max-w-[500px] xl:max-w-[540px] mx-auto cursor-grab active:cursor-grabbing touch-none select-none flex flex-col justify-start mt-0.5 mb-1"
              >
                {/* Soft obsidian backdrop */}
                <div
                  className="pointer-events-none absolute -inset-x-8 -top-3 -bottom-3 rounded-2xl z-0"
                  style={{
                    background: 'radial-gradient(ellipse at 50% 36%, rgba(10, 9, 8, 0.78) 0%, rgba(10, 9, 8, 0.45) 55%, transparent 80%)',
                  }}
                  aria-hidden="true"
                />

                {/* Solid luminous gold connecting line (2px) */}
                <div
                  style={{
                    left: '12%',
                    right: '12%',
                    top: '50px',
                  }}
                  className="absolute h-[2px] -translate-y-1/2 pointer-events-none z-[2]"
                >
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #9C7D38 0%, #E3C585 15%, #FFEAA5 50%, #E3C585 85%, #9C7D38 100%)',
                      boxShadow: '0 0 6px #FFEAA5, 0 0 12px rgba(255, 215, 0, 0.85), 0 0 20px rgba(255, 180, 50, 0.5)',
                    }}
                  />

                  {/* Traveling light glow sweep */}
                  {(isTraveling || isDragging) && (
                    <div
                      className="absolute top-0 bottom-0 rounded-full pointer-events-none transition-all duration-150"
                      style={{
                        left: `${Math.max(0, visualProgress * 100 - 8)}%`,
                        width: '16%',
                        background: 'linear-gradient(90deg, transparent, #FFFFFF 50%, transparent)',
                        boxShadow: '0 0 10px #FFFFFF, 0 0 18px #FFD700',
                      }}
                    />
                  )}
                </div>

                {/* 4 Intermediate gold pips */}
                {[0.125, 0.375, 0.625, 0.875].map((pipProgress, pipIdx) => {
                  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false
                  const { x } = getArcCoordinates(pipProgress, isMobile)
                  return (
                    <div
                      key={`mid-pip-${pipIdx}`}
                      style={{
                        left: `${x}%`,
                        top: '50px',
                        transform: 'translate(-50%, -50%)',
                      }}
                      className="absolute pointer-events-none z-[5] flex items-center justify-center"
                    >
                      <div
                        className="w-[7px] h-[7px] sm:w-[8px] sm:h-[8px] rounded-full"
                        style={{
                          background: 'radial-gradient(circle at 35% 35%, #FFFFFF 0%, #FFEAA5 45%, #C6A15B 100%)',
                          border: '1px solid #FFD700',
                          boxShadow: '0 0 6px #FFD700, 0 0 12px rgba(255, 215, 0, 0.85)',
                        }}
                      />
                    </div>
                  )
                })}

                {/* 5 Sensory nodes */}
                <div className="absolute inset-0 pointer-events-none z-[10]">
                  {SENSORY_LEVELS.map((lvl) => {
                    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false
                    const { x } = getArcCoordinates(lvl.normalizedProgress, isMobile)

                    const isCurrent = activeLevel === lvl.level
                    const isPulsing = pulsingLevel === lvl.level
                    const isTarget = targetLevel === lvl.level
                    const isSelected = (isCurrent && !isTraveling) || isPulsing

                    return (
                      <div
                        key={`orb-node-${lvl.level}`}
                        style={{
                          left: `${x}%`,
                          top: '50px',
                        }}
                        className="absolute -translate-x-1/2 flex flex-col items-center pointer-events-auto"
                      >
                        {/* Orb button */}
                        <div className="relative flex items-center justify-center -translate-y-1/2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOrbClick(lvl.level)
                            }}
                            className={`group relative focus:outline-none transition-all duration-300 ease-out flex items-center justify-center ${isTransitioning ? 'cursor-default pointer-events-none' : 'cursor-pointer'
                              }`}
                            aria-label={`Select level ${lvl.code}: ${lvl.sublabel}`}
                          >
                            {isSelected ? (
                              <div className="relative flex items-center justify-center">
                                {/* Volumetric radial glow halo */}
                                <div
                                  className="absolute -inset-3 sm:-inset-4 rounded-full pointer-events-none transition-all duration-500"
                                  style={{
                                    boxShadow: '0 0 25px rgba(255, 215, 0, 0.85), 0 0 50px rgba(255, 175, 45, 0.5), inset 0 0 10px rgba(255, 230, 150, 0.5)',
                                    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.35) 0%, rgba(255, 175, 45, 0.15) 50%, transparent 72%)',
                                  }}
                                />

                                {/* Outer gold ring */}
                                <div
                                  className="relative rounded-full p-[2.5px] bg-[#0A0908] flex items-center justify-center border-2 border-[#FFD700] transition-all duration-300"
                                  style={{
                                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.7), inset 0 0 6px rgba(255, 230, 150, 0.4)',
                                  }}
                                >
                                  <div className="w-[58px] h-[58px] sm:w-[64px] sm:h-[64px] md:w-[68px] md:h-[68px] rounded-full overflow-hidden border border-[#FFEAA5] flex items-center justify-center bg-black">
                                    <img
                                      src={lvl.image}
                                      alt={lvl.sublabel}
                                      style={{
                                        filter: 'brightness(1.22) contrast(1.15) saturate(1.15)',
                                      }}
                                      className="w-full h-full object-cover transition-all duration-300 select-none"
                                      draggable={false}
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`relative rounded-full p-[2px] bg-[#0A0908] flex items-center justify-center transition-all duration-300 ${isTarget
                                    ? 'border-2 border-[#E3C585] scale-105'
                                    : 'border border-[#C6A15B]/80 group-hover:border-[#E3C585] group-hover:scale-105'
                                  }`}
                                style={{
                                  boxShadow: '0 0 14px rgba(0, 0, 0, 0.95), 0 0 5px rgba(198, 161, 91, 0.25)',
                                }}
                              >
                                <div className="w-[44px] h-[44px] sm:w-[48px] sm:h-[48px] md:w-[50px] md:h-[50px] rounded-full overflow-hidden opacity-75 group-hover:opacity-100 transition-opacity bg-black">
                                  <img
                                    src={lvl.image}
                                    alt={lvl.sublabel}
                                    style={{
                                      filter: 'brightness(0.78) contrast(1.05)',
                                    }}
                                    className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-100 select-none"
                                    draggable={false}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Confirmation pulse */}
                            {isPulsing && (
                              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                <motion.div
                                  initial={{ scale: 0.9, opacity: 0.95 }}
                                  animate={{ scale: 1.6, opacity: 0 }}
                                  transition={{ duration: 0.45, ease: 'easeOut' }}
                                  className="absolute -inset-5 rounded-full bg-[#FFD700]/70 blur-sm"
                                />
                              </div>
                            )}
                          </button>
                        </div>

                        {/* Labels underneath */}
                        <div className="absolute top-[38px] sm:top-[40px] flex flex-col items-center pointer-events-none px-0.5 text-center w-[85px] sm:w-[100px]">
                          <span
                            style={{
                              color: isSelected ? '#FFEAA5' : 'rgba(250, 247, 242, 0.7)',
                              fontWeight: isSelected ? 600 : 400,
                            }}
                            className="font-serif text-[11px] sm:text-[12px] tracking-widest drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
                          >
                            {lvl.code}
                          </span>
                          <span
                            style={{
                              color: isSelected ? '#FAF7F2' : 'rgba(250, 247, 242, 0.7)',
                              fontWeight: isSelected ? 500 : 300,
                            }}
                            className="font-sans text-[10px] sm:text-[11px] tracking-wide mt-0.5 leading-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] line-clamp-2"
                          >
                            {lvl.sublabel}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Traveling light pointer */}
                <div
                  style={{
                    left: `${indicatorCoords.x}%`,
                    top: '50px',
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute pointer-events-auto z-30 flex items-center justify-center transition-opacity duration-300 ${isTraveling || isDragging ? 'opacity-100 cursor-grabbing' : 'opacity-0 pointer-events-none'
                    }`}
                >
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-6 h-6 rounded-full bg-[#FFD700]/40 blur-[6px] pointer-events-none" />
                    <div className="relative w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#E3C585] via-[#FFEAA5] to-[#FFFFFF] shadow-[0_0_12px_#FFEAA5,0_0_18px_#FFD700] ring-[1px] ring-[#FFEAA5]/90 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-[#5B3E19]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: UNIFIED SENSORY MEDALLION & CATEGORY SUITE (50%) ── */}
          <div className="hidden lg:flex lg:w-[50%] xl:w-[50%] h-full flex-col items-center justify-center py-1 sm:py-2 overflow-visible pointer-events-auto gap-2.5 xl:gap-3.5 pb-3 sm:pb-5">
            {/* Category Eyebrow & Diamond Divider */}
            <motion.div
              initial={{ opacity: 0, filter: 'blur(6px)', y: -4 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full flex flex-col items-center text-center pt-0.5 pb-1"
            >
              <span
                style={{
                  fontSize: '0.74rem',
                  letterSpacing: '0.28em',
                  color: '#C6A15B',
                }}
                className="font-sans font-medium uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
              >
                {editorial.eyebrow}
              </span>

              {/* Hairline Divider with Centered Diamond */}
              <div className="flex items-center justify-center gap-3 my-1.5 opacity-80">
                <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-[#C6A15B]/50 to-[#C6A15B]" />
                <div className="text-[#C6A15B] text-[8px] leading-none select-none">◇</div>
                <div className="w-12 sm:w-16 h-px bg-gradient-to-l from-transparent via-[#C6A15B]/50 to-[#C6A15B]" />
              </div>
            </motion.div>

            {/* Sensory Medallion Suite */}
            <div className="w-full flex items-center justify-center">
              <SensoryMedallion
                sensoryData={sensoryData}
                questionId={question.id}
                sommelierNote={question.sommelierNote}
                transitionState="active"
              />
            </div>
          </div>
        </div>

        {/* ── 3C. RESERVED BOTTOM NAVIGATION ROW ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.85, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full h-13 sm:h-15 flex items-center justify-between px-2 shrink-0 z-30 border-t border-[#E3C585]/20 mt-2 sm:mt-4 pt-2 sm:pt-3"
        >
          {/* Decorative center diamond on navigation border */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rotate-45 border border-[#C6A15B] bg-[#0A0908]" />

          {/* Previous on Bottom-Left */}
          <div className="w-1/4 flex justify-start">
            <button
              type="button"
              onClick={onPrevious}
              disabled={isTransitioning}
              className={`flex items-center gap-2 text-[#A39B8E] hover:text-[#E3C585] font-sans text-[10px] sm:text-[11px] tracking-[0.2em] uppercase transition-all duration-300 ${isTransitioning ? 'opacity-40 cursor-default' : 'cursor-pointer'
                }`}
              aria-label="Return to previous stage"
            >
              <span className="text-[13px] text-[#E3C585]/70">‹</span>
              <span>PREVIOUS</span>
            </button>
          </div>

          {/* Bottom Center Floating Pill Badge */}
          <div className="w-2/4 flex justify-center pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${question.id}-${activeLevel}`}
                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                style={{
                  borderRadius: '9999px',
                  border: '1px solid rgba(255, 215, 0, 0.55)',
                  background: 'rgba(10, 8, 6, 0.85)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: '0 0 30px rgba(255, 215, 0, 0.22)',
                }}
                className="px-5 sm:px-7 py-1.5 flex items-center gap-2.5 max-w-full truncate"
              >
                <span className="text-[#FFD700] text-[8px]">•</span>
                <span
                  style={{ letterSpacing: '0.15em', color: '#FFEAA5' }}
                  className="font-sans text-[9px] sm:text-[10px] uppercase font-medium whitespace-nowrap"
                >
                  {SENSORY_LEVELS[activeLevel - 1]?.label || 'MODERATELY'}
                </span>
                <span className="text-[#FFD700] text-[8px]">•</span>
                <span
                  style={{ letterSpacing: '0.15em', color: '#E3C585' }}
                  className="font-serif italic text-[10px] sm:text-[11px] text-[#E3C585]/90 whitespace-nowrap truncate max-w-[200px] sm:max-w-[320px]"
                >
                  "{LEVEL_QUOTES[activeLevel] || 'I enjoy it...'}"
                </span>
                <span className="text-[#FFD700] text-[8px]">•</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Right: NEXT QUESTION → / REVEAL PALATE → */}
          <div className="w-1/4 flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (isTransitioning) return
                setPulsingLevel(activeLevel)
                setTimeout(() => {
                  setPulsingLevel(null)
                  onAdvance()
                }, 200)
              }}
              disabled={isTransitioning}
              style={{
                border: '1.5px solid #FFD700',
                borderRadius: '9999px',
                background: 'rgba(10, 8, 6, 0.85)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 0 22px rgba(255, 215, 0, 0.35)',
              }}
              className={`px-6 sm:px-8 py-2.5 text-[#FFD700] hover:text-[#FFFFFF] hover:bg-[#FFD700]/20 hover:scale-[1.04] hover:shadow-[0_0_35px_rgba(255,215,0,0.6)] font-sans text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-medium flex items-center gap-2 group transition-all duration-300 ${isTransitioning ? 'opacity-50 cursor-default' : 'cursor-pointer'
                }`}
              aria-label="Advance to next question"
            >
              <span className="tracking-[0.2em]">
                {questionIndex === totalQuestions - 1 ? 'REVEAL PALATE' : 'NEXT QUESTION'}
              </span>
              <span className="text-[#FFD700] text-xs transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── 4. MOBILE SENSORY MEDALLION TRIGGER & DRAWER ── */}
      <div className="lg:hidden absolute top-14 sm:top-16 right-4 sm:right-6 z-30">
        <button
          type="button"
          onClick={() => setShowMobileInfo(!showMobileInfo)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C7A45A]/40 bg-[#050403]/85 text-[#FAF7F2] shadow-lg backdrop-blur-md font-sans text-[9px] tracking-widest uppercase cursor-pointer"
          aria-label="Toggle sensory medallion"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8D196] shadow-[0_0_6px_rgba(232,209,150,0.8)]" />
          <span>{sensoryData.title}</span>
          <span className="text-[#C7A45A] font-serif italic text-[10px]">explore</span>
        </button>
      </div>

      <AnimatePresence>
        {showMobileInfo && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.28 }}
            className="lg:hidden fixed inset-x-4 bottom-20 z-50 rounded-2xl border border-[#C7A45A]/35 bg-[#050403]/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.98)] p-4 flex flex-col items-center max-h-[75vh] overflow-y-auto pointer-events-auto"
          >
            <div className="flex items-center justify-between w-full mb-3">
              <span className="font-sans text-[8.5px] font-normal tracking-[0.3em] text-[#C7A45A] uppercase">
                STAGE {String(questionIndex + 1).padStart(2, '0')} / {String(totalQuestions || 13).padStart(2, '0')} · {sensoryData.category}
              </span>
              <button
                type="button"
                onClick={() => setShowMobileInfo(false)}
                className="text-[#FAF7F2]/60 hover:text-white text-base px-2 py-0.5 cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="w-full flex items-center justify-center mb-3">
              <SensoryMedallion
                sensoryData={sensoryData}
                questionId={question.id}
                sommelierNote={question.sommelierNote}
                transitionState="active"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// MAIN FLAVOR QUESTION CHAMBER CONTROLLER
// Coordinates synchronized scene-by-scene crossfades with AnimatePresence mode="sync"
// ============================================================================

export default function FlavorQuestionChamber({
  questions,
  question,
  totalQuestions = 13,
  currentIndex,
  answers = {},
  onSelectOption,
  onNext,
  onBack,
  onStageIndexChange,
}: FlavorQuestionChamberProps) {
  const [displayedIndex, setDisplayedIndex] = useState<number>(currentIndex)
  const isTransitioningRef = useRef<boolean>(false)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync if currentIndex changes externally (e.g. reload or restart)
  useEffect(() => {
    if (!isTransitioningRef.current && displayedIndex !== currentIndex) {
      setDisplayedIndex(currentIndex)
    }
  }, [currentIndex, displayedIndex])

  // Resolve current question
  const currentQuestion = useMemo(() => {
    if (questions && questions[displayedIndex]) {
      return questions[displayedIndex]
    }
    return question
  }, [questions, displayedIndex, question])

  // Current sensory data
  const currentSensoryData = useMemo(() => {
    return getSensoryTransitionData(currentQuestion)
  }, [currentQuestion])

  // Editorial headline
  const currentEditorial = useMemo(() => {
    return (
      QUESTION_EDITORIALS[currentQuestion.id] || {
        eyebrow: `CALIBRATE · ${currentQuestion.stageName || 'PALATE ARCHITECTURE'}`,
        lead: 'To what degree does your palate favor',
        highlight: `the distinct essence of ${currentQuestion.flavorName || 'this spirit'}?`,
        ambientHue: 38,
      }
    )
  }, [currentQuestion])

  // Clean up timers
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)
    }
  }, [])

  // Scene transition orchestrator (overlapping synchronized crossfade)
  const startSceneTransition = useCallback(
    (nextIdx: number) => {
      if (isTransitioningRef.current) return
      isTransitioningRef.current = true
      setIsTransitioning(true)

      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)

      // Mount new scene and dissolve outgoing scene concurrently
      setDisplayedIndex(nextIdx)
      onStageIndexChange?.(nextIdx)

      // Re-enable interactions after outgoing scene has dissolved completely
      transitionTimerRef.current = setTimeout(() => {
        isTransitioningRef.current = false
        setIsTransitioning(false)
      }, 1300)
    },
    [onStageIndexChange]
  )

  const handleAdvance = useCallback(() => {
    if (isTransitioningRef.current) return
    if (displayedIndex === totalQuestions - 1) {
      onNext()
    } else if (displayedIndex < totalQuestions - 1) {
      startSceneTransition(displayedIndex + 1)
    }
  }, [displayedIndex, totalQuestions, onNext, startSceneTransition])

  const handlePrevious = useCallback(() => {
    if (isTransitioningRef.current) return
    if (displayedIndex > 0) {
      startSceneTransition(displayedIndex - 1)
    } else {
      onBack()
    }
  }, [displayedIndex, onBack, startSceneTransition])

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* ════════════════════════════════════════════════════════════
          FULL SCENE SYNCHRONIZED CROSSFADE (AnimatePresence mode="sync")
          - Outgoing scene: opacity 1 -> 0, blur 0 -> 6px, scale 1 -> 0.985, translateY 0 -> -4px
          - Incoming scene: opacity 0 -> 1, blur 12px -> 0, scale 0.985 -> 1, translateY 8px -> 0
          - Both scenes overlap smoothly with cubic-bezier(0.22, 1, 0.36, 1)
          - ALL 35 visual elements (borders, orbital rings, detail disc, stage header, options)
            belong to QuestionScene and transition together as ONE unified luxury tasting scene!
         ════════════════════════════════════════════════════════════ */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`scene-${currentQuestion.id}-${displayedIndex}`}
          initial={{
            opacity: 0,
            filter: 'blur(12px)',
            scale: 0.985,
            y: 8,
          }}
          animate={{
            opacity: 1,
            filter: 'blur(0px)',
            scale: 1,
            y: 0,
            transition: {
              opacity: { duration: 1.25, ease: [0.35, 0, 0.25, 1] },
              filter: { duration: 1.25, ease: [0.22, 1, 0.36, 1] },
              scale: { duration: 1.25, ease: [0.22, 1, 0.36, 1] },
              y: { duration: 1.25, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          exit={{
            opacity: 0,
            filter: 'blur(6px)',
            scale: 0.985,
            y: -4,
            transition: {
              opacity: { duration: 1.15, ease: [0.35, 0, 0.25, 1] },
              filter: { duration: 1.15, ease: [0.22, 1, 0.36, 1] },
              scale: { duration: 1.15, ease: [0.22, 1, 0.36, 1] },
              y: { duration: 1.15, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="absolute inset-0 w-full h-full"
          style={{
            pointerEvents: isTransitioning ? 'none' : 'auto',
          }}
        >
          <QuestionScene
            question={currentQuestion}
            questionIndex={displayedIndex}
            totalQuestions={totalQuestions}
            editorial={currentEditorial}
            sensoryData={currentSensoryData}
            selectedOptionId={answers[currentQuestion.id]}
            isTransitioning={isTransitioning}
            onSelectOption={onSelectOption}
            onAdvance={handleAdvance}
            onPrevious={handlePrevious}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
