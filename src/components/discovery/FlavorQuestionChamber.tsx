import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import type { Question } from '@/types'
import { barMusic } from '@/utils/barMusicEngine'
import { getRevealTechniqueForStage, type RevealTechnique } from '@/utils/discoveryTransitions'

interface FlavorQuestionChamberProps {
  question: Question
  totalQuestions: number
  currentIndex: number
  selectedOptionId?: string
  matchScore?: number
  revealTechnique?: RevealTechnique
  onSelectOption: (optionId: string) => void
  onNext: () => void
  onBack: () => void
}

/**
 * 5 Canonical Sensory Intensity Levels
 * Single source of truth for:
 * 1. Top Intensity Answer Choices (01..05)
 * 2. Bottom Sensory Checkpoint Dial Nodes (01..05)
 * 3. Eyebrow & Dial Header Labels (~ LEVEL 01..05)
 * 4. Option Weights & Scoring (question.options[0..4])
 */
export interface IntensityLevelConfig {
  level: number // 1, 2, 3, 4, 5
  index: number // 0, 1, 2, 3, 4
  code: string // '01', '02', '03', '04', '05'
  label: string // 'NONE', 'SUBTLE', 'MEDIUM', 'BOLD', 'MAXIMUM'
  description: string // 'Zero Affinity', 'Gentle Hint', 'Balanced Equilibrium', 'Bold Expression', 'Maximum Intensity'
  answer: string // "Not for me", "It's fine", "I like it", "I love it", "Too intense"
  percent: number // 0, 25, 50, 75, 100
  opacity: number
  scale: number
}

export const INTENSITY_LEVELS: IntensityLevelConfig[] = [
  {
    level: 1,
    index: 0,
    code: '01',
    label: 'NONE',
    description: 'Zero Affinity',
    answer: 'Not for me',
    percent: 0,
    opacity: 0.2,
    scale: 0.9,
  },
  {
    level: 2,
    index: 1,
    code: '02',
    label: 'SUBTLE',
    description: 'Gentle Hint',
    answer: "It's fine",
    percent: 25,
    opacity: 0.4,
    scale: 0.96,
  },
  {
    level: 3,
    index: 2,
    code: '03',
    label: 'MEDIUM',
    description: 'Balanced Equilibrium',
    answer: 'I like it',
    percent: 50,
    opacity: 0.62,
    scale: 1.04,
  },
  {
    level: 4,
    index: 3,
    code: '04',
    label: 'BOLD',
    description: 'Bold Expression',
    answer: 'I love it',
    percent: 75,
    opacity: 0.84,
    scale: 1.15,
  },
  {
    level: 5,
    index: 4,
    code: '05',
    label: 'MAXIMUM',
    description: 'Maximum Intensity',
    answer: 'Too intense',
    percent: 100,
    opacity: 1.0,
    scale: 1.28,
  },
]

// Curated Category & Character Metadata for all 13 stages
const FLAVOUR_ATTRIBUTES: Record<string, { category: string; character: string }> = {
  chillies: { category: 'SPICE', character: 'WARM • TINGLING' },
  coconut: { category: 'TROPICAL', character: 'SILKY • SWEET' },
  appleCooked: { category: 'ORCHARD', character: 'CARAMEL • BAKED' },
  caramelPopcorns: { category: 'CONFECTION', character: 'TOASTED • BUTTERY' },
  greenTea: { category: 'BOTANICAL', character: 'CRISP • TANNIC' },
  pear: { category: 'ORCHARD', character: 'FRESH • FLORAL' },
  freshGinger: { category: 'ROOTS', character: 'ZESTY • PUNGENT' },
  cumin: { category: 'TERROIR', character: 'EARTHY • ROASTED' },
  cinnamon: { category: 'BARK', character: 'AROMATIC • WARM' },
  burntBrinjal: { category: 'SAVORY', character: 'SMOKY • UMAMI' },
  burntWood: { category: 'CASK WOOD', character: 'CHARRED • PEATED' },
  lemongrass: { category: 'CITRUS', character: 'BRIGHT • HERBAL' },
  lassi: { category: 'DAIRY', character: 'CREAMY • SMOOTH' },
}

/**
 * Editorial Headline Renderer with Warm Champagne Gold Accents on the concluding subject
 */
function renderEditorialQuestion(text: string) {
  if (text.includes('confectionery lactones?')) {
    const parts = text.split('confectionery lactones?')
    return (
      <>
        <span>{parts[0]}</span>
        <span className="text-[#F5CE76] drop-shadow-[0_2px_12px_rgba(245,206,118,0.45)]">confectionery lactones?</span>
      </>
    )
  }
  if (text.includes('cultured dairy?')) {
    const parts = text.split('cultured dairy?')
    return (
      <>
        <span>{parts[0]}</span>
        <span className="text-[#F5CE76] drop-shadow-[0_2px_12px_rgba(245,206,118,0.45)]">cultured dairy?</span>
      </>
    )
  }
  if (text.includes('clean succulence?')) {
    const parts = text.split('clean succulence?')
    return (
      <>
        <span>{parts[0]}</span>
        <span className="text-[#F5CE76] drop-shadow-[0_2px_12px_rgba(245,206,118,0.45)]">clean succulence?</span>
      </>
    )
  }
  const words = text.split(' ')
  if (words.length > 5) {
    const splitPoint = Math.max(2, words.length - 2)
    return (
      <>
        <span>{words.slice(0, splitPoint).join(' ')} </span>
        <span className="text-[#F5CE76] drop-shadow-[0_2px_12px_rgba(245,206,118,0.45)]">
          {words.slice(splitPoint).join(' ')}
        </span>
      </>
    )
  }
  return <span>{text}</span>
}

export default function FlavorQuestionChamber({
  question,
  totalQuestions: _totalQuestions,
  currentIndex,
  selectedOptionId,
  revealTechnique,
  onSelectOption,
  onNext,
  onBack,
}: FlavorQuestionChamberProps) {
  const reduceMotion = useReducedMotion()
  const imagePedestalRef = useRef<HTMLDivElement>(null)
  const dialTrackRef = useRef<HTMLDivElement>(null)

  // Transition technique determination
  const transitionConfig = getRevealTechniqueForStage(currentIndex)
  const technique = revealTechnique || transitionConfig.technique

  // User satisfaction reward state
  const [isRewarded, setIsRewarded] = useState(false)
  const [rewardKey, setRewardKey] = useState(0)
  const rewardTimeoutRef = useRef<number | null>(null)

  // 3D Parallax tilt state for the image frame
  const [imageTilt, setImageTilt] = useState({ x: 0, y: 0 })
  const [isHoveringImage, setIsHoveringImage] = useState(false)

  // ── CANONICAL INTENSITY STATE (Single Source of Truth: 1..5) ──
  const [intensityLevel, setIntensityLevel] = useState<number>(() => {
    if (!selectedOptionId) return 3
    const idx = question.options.findIndex((o) => o.id === selectedOptionId)
    return idx >= 0 ? idx + 1 : 3
  })

  // ── VISUAL INDICATOR PERCENTAGE (0% to 100%) for real-time dragging & animation ──
  const [visualPercent, setVisualPercent] = useState<number>(() => {
    const initialLvl = !selectedOptionId
      ? 3
      : Math.max(1, question.options.findIndex((o) => o.id === selectedOptionId) + 1)
    return ((initialLvl - 1) / 4) * 100
  })

  // Animation duration (ms) for the indicator transition
  const [animDuration, setAnimDuration] = useState<number>(0)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  // Synchronize when question or selectedOptionId changes externally
  useEffect(() => {
    if (selectedOptionId) {
      const idx = question.options.findIndex((o) => o.id === selectedOptionId)
      if (idx >= 0) {
        const lvl = idx + 1
        setIntensityLevel(lvl)
        setVisualPercent(((lvl - 1) / 4) * 100)
      }
    } else {
      setIntensityLevel(3)
      setVisualPercent(50)
    }
  }, [question.id, selectedOptionId, question.options])

  const activeConfig = INTENSITY_LEVELS[intensityLevel - 1] ?? INTENSITY_LEVELS[2]
  const activeOption =
    question.options[activeConfig.index] ?? question.options[2] ?? question.options[0]

  const bgOpacity = activeConfig.opacity
  const bgAuraScale = activeConfig.scale
  const activeHue = activeOption?.hue ?? 38

  // Category and Character metadata
  const metaAttributes = FLAVOUR_ATTRIBUTES[question.id] || {
    category: question.stageName?.split(' ')[0] || 'ESSENCE',
    character: question.stageSubtitle?.replace('&', '•') || 'SMOOTH • BALANCED',
  }

  // Mouse move handler for 3D card tilt
  const handleImageMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduceMotion || !imagePedestalRef.current) return
      const rect = imagePedestalRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      setImageTilt({
        x: (y - 0.5) * -6,
        y: (x - 0.5) * 8,
      })
    },
    [reduceMotion]
  )

  const handleImageMouseLeave = useCallback(() => {
    setIsHoveringImage(false)
    setImageTilt({ x: 0, y: 0 })
  }, [])

  // ── CLICK-TO-MOVE ANIMATION HANDLER (Section 7 & 8) ──
  // Smoothly glides indicator with distance-proportional duration (700ms - 1100ms)
  const selectLevelWithAnimation = useCallback(
    (targetLevel: number) => {
      const clamped = Math.max(1, Math.min(5, targetLevel))
      const current = intensityLevel
      const distance = Math.abs(clamped - current)

      // Duration: 1 level: 720ms, 2 levels: 820ms, 3 levels: 960ms, 4 levels: 1100ms
      const duration =
        distance === 1 ? 720 : distance === 2 ? 820 : distance === 3 ? 960 : distance >= 4 ? 1100 : 350

      setAnimDuration(duration)
      setVisualPercent(((clamped - 1) / 4) * 100)
      setIntensityLevel(clamped)

      const targetOption = question.options[clamped - 1]
      if (targetOption) {
        onSelectOption(targetOption.id)
        barMusic.playDiscoveryRewardHarmonic()

        setIsRewarded(true)
        setRewardKey((k) => k + 1)
        if (rewardTimeoutRef.current) window.clearTimeout(rewardTimeoutRef.current)
        rewardTimeoutRef.current = window.setTimeout(() => {
          setIsRewarded(false)
        }, 1200)
      }
    },
    [intensityLevel, question.options, onSelectOption]
  )

  // ── CONTINUOUS DRAGGING HANDLERS (Section 9, 10, 11, 12, 14, 15) ──
  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    const track = dialTrackRef.current
    if (!track) return

    try {
      track.setPointerCapture(e.pointerId)
    } catch {}

    setIsDragging(true)
    setAnimDuration(0) // Instant 0ms response during active drag

    const rect = track.getBoundingClientRect()
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setVisualPercent(fraction * 100)

    const nearestLvl = Math.max(1, Math.min(5, Math.round(fraction * 4) + 1))
    if (nearestLvl !== intensityLevel) {
      setIntensityLevel(nearestLvl)
    }
  }

  const handleTrackPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const track = dialTrackRef.current
    if (!track) return

    const rect = track.getBoundingClientRect()
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setVisualPercent(fraction * 100)

    const nearestLvl = Math.max(1, Math.min(5, Math.round(fraction * 4) + 1))
    if (nearestLvl !== intensityLevel) {
      setIntensityLevel(nearestLvl)
    }
  }

  const handleTrackPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const track = dialTrackRef.current
    if (track) {
      try {
        if (track.hasPointerCapture(e.pointerId)) {
          track.releasePointerCapture(e.pointerId)
        }
      } catch {}
    }

    setIsDragging(false)

    // Snap to nearest discrete level (1..5)
    const fraction = visualPercent / 100
    const targetLevel = Math.max(1, Math.min(5, Math.round(fraction * 4) + 1))
    const snapPercent = ((targetLevel - 1) / 4) * 100

    setAnimDuration(380) // Crisp, luxury snap animation
    setVisualPercent(snapPercent)
    setIntensityLevel(targetLevel)

    const targetOption = question.options[targetLevel - 1]
    if (targetOption) {
      onSelectOption(targetOption.id)
      barMusic.playDiscoveryRewardHarmonic()

      setIsRewarded(true)
      setRewardKey((k) => k + 1)
      if (rewardTimeoutRef.current) window.clearTimeout(rewardTimeoutRef.current)
      rewardTimeoutRef.current = window.setTimeout(() => {
        setIsRewarded(false)
      }, 1200)
    }
  }

  // Global window listeners for drag fallback
  useEffect(() => {
    if (!isDragging) return

    const onWindowPointerMove = (e: PointerEvent) => {
      const track = dialTrackRef.current
      if (!track) return
      const rect = track.getBoundingClientRect()
      const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      setVisualPercent(fraction * 100)

      const nearestLvl = Math.max(1, Math.min(5, Math.round(fraction * 4) + 1))
      if (nearestLvl !== intensityLevel) {
        setIntensityLevel(nearestLvl)
      }
    }

    const onWindowPointerUp = () => {
      if (!isDragging) return
      setIsDragging(false)

      const fraction = visualPercent / 100
      const targetLevel = Math.max(1, Math.min(5, Math.round(fraction * 4) + 1))
      const snapPercent = ((targetLevel - 1) / 4) * 100

      setAnimDuration(380)
      setVisualPercent(snapPercent)
      setIntensityLevel(targetLevel)

      const targetOption = question.options[targetLevel - 1]
      if (targetOption) {
        onSelectOption(targetOption.id)
        barMusic.playDiscoveryRewardHarmonic()
      }
    }

    window.addEventListener('pointermove', onWindowPointerMove)
    window.addEventListener('pointerup', onWindowPointerUp)
    window.addEventListener('pointercancel', onWindowPointerUp)
    return () => {
      window.removeEventListener('pointermove', onWindowPointerMove)
      window.removeEventListener('pointerup', onWindowPointerUp)
      window.removeEventListener('pointercancel', onWindowPointerUp)
    }
  }, [isDragging, visualPercent, intensityLevel, question.options, onSelectOption])

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const num = parseInt(e.key, 10)
      if (num >= 1 && num <= 5) {
        selectLevelWithAnimation(num)
        return
      }

      if (e.key === 'ArrowLeft' && !e.shiftKey && !e.altKey) {
        selectLevelWithAnimation(intensityLevel - 1)
        return
      }
      if (e.key === 'ArrowRight' && !e.shiftKey && !e.altKey) {
        selectLevelWithAnimation(intensityLevel + 1)
        return
      }

      if (e.key === 'Backspace' && currentIndex > 0) {
        onBack()
        return
      }

      if (e.key === 'Enter') {
        barMusic.playChamberWalkTransition()
        onNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectLevelWithAnimation, intensityLevel, onNext, onBack, currentIndex])

  // Transition technique determination
  const isFocusPull = technique === 'focus-pull'
  const isDepthReveal = technique === 'depth-reveal'
  const isBreathing = technique === 'breathing'

  // Image source with solid fallback
  const resolvedImageSrc =
    typeof question.image === 'string'
      ? question.image
      : (question.image as any)?.imageS?.url || `/images/flavors/${question.id}.jpg` || '/images/tasting-bar-bg.jpg'

  return (
    <motion.div
      key={`chamber-container-${question.id}`}
      initial={
        isFocusPull
          ? { filter: 'blur(8px)', opacity: 0.3 }
          : isDepthReveal
          ? { opacity: 0, transform: 'perspective(1200px) translateZ(-40px)' }
          : isBreathing
          ? { opacity: 0.4, filter: 'brightness(0.8)' }
          : { opacity: 0 }
      }
      animate={{ filter: 'blur(0px)', opacity: 1, transform: 'perspective(1200px) translateZ(0px)' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-full min-h-0 flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 select-none"
    >
      {/* ── Dynamic Ambient Aura that deepens with higher affinity choices ── */}
      <motion.div
        animate={{
          opacity: 0.10 + bgOpacity * 0.30,
          scale: bgAuraScale,
        }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="pointer-events-none absolute -top-8 left-1/3 w-[520px] h-[380px] rounded-full blur-[140px] z-0"
        style={{
          background: `radial-gradient(ellipse at center, hsl(${activeHue}, 90%, 50%) 0%, hsl(${activeHue}, 70%, 35%) 50%, transparent 75%)`,
        }}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {/* MAIN EXPERIENCE: Left Tasting Pedestal + Right Decision Instrument       */}
      {/* ══════════════════════════════════════════════════════════════════════════ */}
      <div className="w-full max-w-6xl xl:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(320px,0.8fr)_minmax(560px,1.4fr)] gap-8 lg:gap-12 xl:gap-16 items-center min-h-0">
        {/* ──────────────────────────────────────────────────────────────────────── */}
        {/* LEFT ZONE: THE SENSORY OBJECT (Hero Image Pedestal + Plaque)             */}
        {/* ──────────────────────────────────────────────────────────────────────── */}
        <div
          ref={imagePedestalRef}
          onMouseMove={handleImageMouseMove}
          onMouseEnter={() => setIsHoveringImage(true)}
          onMouseLeave={handleImageMouseLeave}
          className="relative flex flex-col items-center justify-center shrink-0 w-full max-w-[320px] lg:max-w-[350px] mx-auto select-none"
          style={{
            transform: reduceMotion
              ? undefined
              : `perspective(1000px) rotateX(${imageTilt.x}deg) rotateY(${imageTilt.y}deg)`,
            transition: isHoveringImage ? 'none' : 'transform 0.4s ease-out',
          }}
        >
          {/* Circular Gold-Framed Tasting Object (Compact viewport-responsive sizing) */}
          <div className="relative w-[clamp(180px,21vh,230px)] aspect-square rounded-full flex items-center justify-center shrink-0">
            {/* Outer Specular Gold Ring */}
            <div className="absolute inset-0 rounded-full border-[2.5px] border-[#DFBA73] shadow-[0_0_28px_rgba(223,186,115,0.4),inset_0_0_16px_rgba(245,206,118,0.22)] pointer-events-none z-10" />

            {/* Secondary Fine Concentric Bezel */}
            <div className="absolute inset-1.5 rounded-full border border-[#FFF0C2]/45 pointer-events-none z-10" />

            {/* Ambient Backlight Halo */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-b from-[#F5CE76]/22 via-transparent to-transparent blur-xl pointer-events-none" />

            {/* Inner Masked Content Image */}
            <div className="relative w-full h-full rounded-full overflow-hidden bg-black/95">
              <motion.img
                src={resolvedImageSrc}
                alt={question.flavorName || 'Flavour'}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = `/images/flavors/${question.id}.jpg`
                }}
                animate={{
                  scale: isHoveringImage ? 1.05 : 1.0,
                  filter: `brightness(${0.92 + bgOpacity * 0.16}) contrast(1.08)`,
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full h-full object-cover object-center"
              />

              {/* Atmospheric Vignette */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.65)_85%,rgba(0,0,0,0.92)_100%)] pointer-events-none" />

              {/* Tactile Golden Specular Sweep */}
              {isRewarded && (
                <motion.div
                  key={`reward-pedestal-${rewardKey}`}
                  initial={{ x: '-150%', opacity: 0.9 }}
                  animate={{ x: '180%', opacity: 0 }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFF0C2]/60 to-transparent skew-x-12 pointer-events-none"
                />
              )}
            </div>
          </div>

          {/* Dark Marble Plinth Base */}
          <div className="relative -mt-3.5 w-[clamp(200px,23vh,250px)] h-4 rounded-b-lg bg-gradient-to-b from-[#1c1813] via-[#100e0a] to-[#080705] border-t border-[#DFBA73]/60 shadow-[0_8px_20px_rgba(0,0,0,0.95)] flex items-center justify-center shrink-0">
            <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#F5CE76] to-transparent shadow-[0_0_8px_#F5CE76]" />
            <div className="absolute -bottom-1 inset-x-6 h-2 bg-[#F5CE76]/15 blur-sm pointer-events-none rounded-full" />
          </div>

          {/* ── Overlapping Bronze / Smoked Glass Information Plaque (Height bounded to fit entirely above footer) ── */}
          <div className="relative -mt-3 z-20 w-[92%] sm:w-[94%] max-h-[135px] rounded-xl border border-[#DFBA73]/45 bg-gradient-to-b from-[#18140e]/95 via-[#100d09]/95 to-[#0b0907]/95 backdrop-blur-xl p-2.5 sm:p-3 shadow-[0_10px_28px_rgba(0,0,0,0.9)] shrink-0">
            {/* Four Corner Rivets */}
            <span className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full bg-[#DFBA73]/80 shadow-[0_0_3px_#DFBA73]" />
            <span className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-[#DFBA73]/80 shadow-[0_0_3px_#DFBA73]" />
            <span className="absolute bottom-1.5 left-1.5 w-1 h-1 rounded-full bg-[#DFBA73]/80 shadow-[0_0_3px_#DFBA73]" />
            <span className="absolute bottom-1.5 right-1.5 w-1 h-1 rounded-full bg-[#DFBA73]/80 shadow-[0_0_3px_#DFBA73]" />

            {/* FLAVOUR PROFILE */}
            <span className="font-mono text-[8px] tracking-[0.28em] uppercase text-[#F5CE76] font-bold block mb-0.5">
              FLAVOUR PROFILE
            </span>

            {/* Flavor Title (e.g. PEAR, COCONUT, LASSI) */}
            <h3 className="font-serif text-base sm:text-lg lg:text-[1.2rem] text-[#FAF7F2] font-normal tracking-wide uppercase leading-tight mb-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              {question.flavorName ? question.flavorName.toUpperCase() : 'TASTE PROFILE'}
            </h3>

            {/* Sensory Description Quote */}
            <p className="font-serif italic text-[10.5px] sm:text-[11.5px] text-[#E0DBD2]/90 leading-tight line-clamp-1 mb-2">
              &ldquo;{question.sommelierNote || question.stageSubtitle}&rdquo;
            </p>

            {/* Divider Rule */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#DFBA73]/30 to-transparent mb-1.5" />

            {/* Bottom 2 Columns: CATEGORY & CHARACTER */}
            <div className="grid grid-cols-2 gap-2 text-left">
              <div>
                <span className="font-mono text-[7px] sm:text-[7.5px] tracking-[0.22em] uppercase text-[#DFBA73] block mb-0.5 font-medium">
                  CATEGORY
                </span>
                <span className="font-sans text-[9.5px] sm:text-[10.5px] font-semibold uppercase text-white tracking-wider truncate block">
                  {metaAttributes.category}
                </span>
              </div>
              <div>
                <span className="font-mono text-[7px] sm:text-[7.5px] tracking-[0.22em] uppercase text-[#DFBA73] block mb-0.5 font-medium">
                  CHARACTER
                </span>
                <span className="font-sans text-[9.5px] sm:text-[10.5px] font-semibold uppercase text-white tracking-wider truncate block">
                  {metaAttributes.character}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────────────────── */}
        {/* RIGHT ZONE: THE TASTING DECISION (Question, Answers, Sensory Dial)        */}
        {/* Strict stable 4-row internal grid with dedicated zero-shift allocations    */}
        {/* ──────────────────────────────────────────────────────────────────────── */}
        <div className="min-w-0 w-full grid grid-rows-[24px_minmax(76px,92px)_100px_135px] gap-y-3 sm:gap-y-3.5">
          {/* ROW 1: Checkpoint Metadata (h-6 fixed, Zero Shift) */}
          <div className="h-6 flex items-center gap-2.5 shrink-0">
            <span className="px-2.5 py-0.5 rounded bg-[#F5CE76] text-black font-mono text-[9px] sm:text-[10px] font-bold tracking-wider uppercase shadow-[0_0_8px_rgba(245,206,118,0.5)]">
              CHECKPOINT {activeConfig.code} / 05
            </span>
            <div className="font-mono text-[9px] sm:text-[10px] tracking-[0.22em] text-[#F5CE76] font-semibold uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] truncate min-w-[280px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`eyebrow-${activeConfig.level}`}
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -2 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="inline-block"
                >
                  {activeConfig.label} · {activeConfig.level === 3 ? 'DEFAULT (MEDIUM)' : activeConfig.description.toUpperCase()}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* ROW 2: Question & Subtitle (min-h-[76px] max-h-[92px], Zero Shift) */}
          <div className="min-h-[76px] max-h-[92px] flex flex-col justify-center shrink-0">
            <h2 className="font-serif text-[clamp(1.35rem,1.9vw,2.15rem)] text-[#FAF7F2] font-normal tracking-tight leading-[1.2] max-w-[820px] drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] line-clamp-2">
              {renderEditorialQuestion(
                question.sommelierPrompt ||
                  question.prompt ||
                  'To what degree does your palate appreciate the velvety sweetness of toasted coconut and confectionery lactones?'
              )}
            </h2>
            <div className="w-full max-w-[820px] h-px bg-gradient-to-r from-[#DFBA73]/50 via-[#DFBA73]/20 to-transparent mt-1 mb-1" />
            <div className="font-mono text-[8px] sm:text-[8.5px] tracking-[0.28em] uppercase text-[#C6A15B] font-medium leading-none">
              CHOOSE THE INTENSITY THAT FEELS RIGHT
            </div>
          </div>

          {/* ROW 3: FIVE SENSORY ANSWERS (Fixed 100px height, 1-to-1 sync with canonical intensityLevel) */}
          <div className="h-[100px] min-h-[100px] max-h-[100px] relative w-full flex flex-col justify-center shrink-0">
            {/* Continuous Flowing Horizontal Sensory Wave Line (from center of node 1 [10%] to node 5 [90%]) */}
            <div className="absolute top-[28px] left-[10%] right-[10%] h-[1.5px] bg-gradient-to-r from-[#DFBA73]/30 via-[#F5CE76]/80 to-[#DFBA73]/30 pointer-events-none shadow-[0_0_6px_rgba(245,206,118,0.4)]" />

            {/* 5 Connected Sensory Nodes & Labels (Equal 5-column distribution, identical geometry) */}
            <div className="grid grid-cols-5 items-center relative z-10 w-full">
              {INTENSITY_LEVELS.map((lvl) => {
                const isSelected = intensityLevel === lvl.level
                const optText = question.options[lvl.index]?.label || lvl.answer

                return (
                  <button
                    key={`choice-${lvl.level}`}
                    type="button"
                    onClick={() => selectLevelWithAnimation(lvl.level)}
                    className="group flex flex-col items-center cursor-pointer select-none py-1 focus:outline-none w-full"
                    aria-label={`Select ${lvl.label}: ${optText}`}
                  >
                    {/* Fixed 24px x 24px Sensory Node Wrapper (Zero Shift on state toggle) */}
                    <div className="relative flex items-center justify-center w-6 h-6 mb-1">
                      {isSelected ? (
                        <>
                          <div className="absolute -inset-2 rounded-full bg-[#F5CE76]/35 blur-sm pointer-events-none animate-pulse-slow" />
                          <div className="w-3.5 h-3.5 rounded-full bg-[#F5CE76] shadow-[0_0_14px_#F5CE76,0_0_24px_rgba(245,206,118,0.7)] ring-1.5 ring-[#DFBA73] flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full bg-[#080807]" />
                          </div>
                        </>
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full bg-[#DFBA73]/30 border border-[#DFBA73]/60 group-hover:bg-[#F5CE76]/70 transition-colors duration-300 shadow-[0_0_6px_rgba(223,186,115,0.3)]" />
                      )}
                    </div>

                    {/* Fine Connection Hairline Dropping Down (Fixed height 10px) */}
                    <div
                      className={`w-px h-2.5 transition-colors duration-300 ${
                        isSelected
                          ? 'bg-[#F5CE76] shadow-[0_0_6px_#F5CE76]'
                          : 'bg-white/15 group-hover:bg-[#DFBA73]/50'
                      }`}
                    />

                    {/* Pure Typography Label (No scale transforms, identical line-height & padding) */}
                    <span
                      className={`font-serif text-xs sm:text-[13px] tracking-wide mt-1.5 leading-none transition-colors duration-300 text-center px-0.5 truncate max-w-full ${
                        isSelected
                          ? 'text-[#FAF7F2] font-semibold drop-shadow-[0_1px_8px_rgba(245,206,118,0.6)]'
                          : 'text-stone/55 group-hover:text-stone/90 font-normal'
                      }`}
                    >
                      {optText}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ROW 4: SENSORY CHECKPOINT DIAL (Fixed 135px height, Static Layout Boxes, Real-Time Continuous Drag Slider) */}
          <div
            className="h-[135px] min-h-[135px] max-h-[135px] w-full rounded-2xl border border-[#DFBA73]/30 bg-gradient-to-b from-[#14110c]/85 via-[#0b0907]/90 to-[#14110c]/85 backdrop-blur-xl px-4 py-2.5 shadow-[0_12px_36px_rgba(0,0,0,0.85)] flex flex-col justify-between shrink-0 relative"
            style={{
              boxShadow: `0 0 ${intensityLevel >= 4 ? '26px' : '12px'} hsla(${activeHue}, 85%, 50%, ${intensityLevel >= 4 ? 0.20 : 0.06})`,
              transition: 'box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {/* Header: SENSORY CHECKPOINT DIAL ~ LEVEL XX: XXXXX (Zero Layout Shift via fixed minimum width) */}
            <div className="flex items-center justify-between font-mono text-[8px] sm:text-[9px] tracking-[0.22em] uppercase shrink-0">
              <span className="text-[#DFBA73] font-semibold">SENSORY CHECKPOINT DIAL</span>
              <div className="text-[#F5CE76] font-bold flex items-center gap-1.5 drop-shadow-[0_0_8px_rgba(245,206,118,0.6)] min-w-[240px] justify-end">
                <span>~</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`header-level-${activeConfig.level}`}
                    initial={{ opacity: 0, filter: 'blur(3px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(3px)' }}
                    transition={{ duration: 0.26, ease: 'easeOut' }}
                    className="inline-block"
                  >
                    LEVEL {activeConfig.code}: {activeConfig.description.toUpperCase()}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Interactive Sinusoidal Wave Track & Draggable Calibration Slider */}
            <div className="relative w-full h-11 flex items-center px-4 sm:px-6 cursor-pointer select-none shrink-0">
              {/* Inner Track Boundary (0% to 100% calibration area) */}
              <div
                ref={dialTrackRef}
                onPointerDown={handleTrackPointerDown}
                onPointerMove={handleTrackPointerMove}
                onPointerUp={handleTrackPointerUp}
                onPointerCancel={handleTrackPointerUp}
                className="relative w-full h-8 flex items-center touch-none"
                style={{ touchAction: 'none' }}
              >
                {/* Sinusoidal Wave SVG Background (Mathematically passes through y=30 at 0%, 25%, 50%, 75%, 100%) */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                  preserveAspectRatio="none"
                  viewBox="0 0 500 60"
                >
                  <defs>
                    <linearGradient id="goldSineGradTrack" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#DFBA73" stopOpacity="0.4" />
                      <stop offset="35%" stopColor="#F5CE76" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="#FFF0C2" stopOpacity="1" />
                      <stop offset="65%" stopColor="#F5CE76" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#DFBA73" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>

                  {/* Fine Center Reference Hairline */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(223,186,115,0.18)" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Glowing Wave Path */}
                  <path
                    d="M 0,30 C 35,16 90,16 125,30 C 160,44 215,44 250,30 C 285,16 340,16 375,30 C 410,44 465,44 500,30"
                    fill="none"
                    stroke="url(#goldSineGradTrack)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>

                {/* 5 Distinct Checkpoints Nodes along the Wave (Positioned exactly at 0%, 25%, 50%, 75%, 100%) */}
                {INTENSITY_LEVELS.map((lvl) => {
                  const isActive = intensityLevel === lvl.level

                  return (
                    <button
                      key={`node-${lvl.level}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        selectLevelWithAnimation(lvl.level)
                      }}
                      style={{ left: `${lvl.percent}%` }}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 flex items-center justify-center w-7 h-7 group cursor-pointer focus:outline-none shrink-0"
                      aria-label={`Select ${lvl.code} ${lvl.label}`}
                    >
                      <div className="relative flex items-center justify-center">
                        {/* Static Subdued Node Circle */}
                        <div
                          className={`relative w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isActive
                              ? 'border-2 border-[#F5CE76] bg-black/90 shadow-[0_0_12px_#F5CE76]'
                              : 'border border-white/20 bg-black/75 group-hover:border-[#DFBA73]'
                          }`}
                        >
                          {lvl.level === 1 ? (
                            // Node 01: Botanical Leaf Glyph
                            <svg
                              className={`w-2.5 h-2.5 transition-colors ${isActive ? 'text-[#F5CE76]' : 'text-stone/50'}`}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                            </svg>
                          ) : lvl.level === 5 ? (
                            // Node 05: Elemental Flame Glyph
                            <svg
                              className={`w-2.5 h-2.5 transition-colors ${isActive ? 'text-[#F5CE76]' : 'text-stone/50'}`}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                            </svg>
                          ) : (
                            // Node 02, 03, 04: Subtle Golden Orb
                            <div
                              className={`rounded-full transition-all ${
                                isActive
                                  ? 'w-2 h-2 bg-gradient-to-r from-[#DFBA73] to-[#F5CE76] shadow-[0_0_6px_#F5CE76]'
                                  : 'w-1.5 h-1.5 bg-white/35 group-hover:bg-[#DFBA73]'
                              }`}
                            />
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}

                {/* ── GLIDING GLOWING SENSORY INDICATOR THUMB (Follows cursor continuous drag or animates on click) ── */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none z-20 flex items-center justify-center"
                  style={{ left: `${visualPercent}%` }}
                  animate={{ left: `${visualPercent}%` }}
                  transition={{
                    duration: isDragging ? 0 : animDuration / 1000,
                    ease: isDragging ? 'linear' : [0.22, 1, 0.36, 1],
                  }}
                >
                  {/* Outer Pulsing Aura Ring */}
                  <motion.div
                    animate={{
                      scale: isDragging ? [1.15, 1.35, 1.15] : [1, 1.18, 1],
                      opacity: isDragging ? 0.85 : 0.55,
                    }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -inset-3 rounded-full bg-[#F5CE76]/35 blur-md pointer-events-none"
                  />

                  {/* Primary Tactile Gold Jewel Thumb Ring */}
                  <div
                    className={`relative w-7 h-7 rounded-full border-2 border-[#FFF0C2] bg-[#14110c] flex items-center justify-center transition-all ${
                      isDragging
                        ? 'shadow-[0_0_24px_#F5CE76,0_0_36px_rgba(245,206,118,0.85)] scale-110'
                        : 'shadow-[0_0_18px_#F5CE76,inset_0_0_8px_rgba(245,206,118,0.5)]'
                    }`}
                  >
                    {/* Glowing Core Gem */}
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#DFBA73] to-[#FFF0C2] shadow-[0_0_8px_#FFF0C2]" />

                    {/* Reward Harmonic Ripple */}
                    {isRewarded && (
                      <motion.div
                        key={`reward-dial-ripple-${rewardKey}`}
                        initial={{ scale: 0.8, opacity: 0.9 }}
                        animate={{ scale: 2.2, opacity: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="pointer-events-none absolute -inset-1 rounded-full border-2 border-[#F5CE76]"
                      />
                    )}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Checkpoint Labels Row underneath Wave (Positioned precisely at 0%, 25%, 50%, 75%, 100%, Fixed h-5) */}
            <div className="relative w-full h-5 px-4 sm:px-6 font-mono text-[8px] sm:text-[8.5px] tracking-wider shrink-0">
              <div className="relative w-full h-full">
                {INTENSITY_LEVELS.map((lvl) => {
                  const isActive = intensityLevel === lvl.level
                  return (
                    <button
                      key={`label-${lvl.level}`}
                      type="button"
                      onClick={() => selectLevelWithAnimation(lvl.level)}
                      style={{ left: `${lvl.percent}%` }}
                      className={`absolute top-0 -translate-x-1/2 flex flex-col items-center cursor-pointer uppercase transition-colors duration-200 ${
                        isActive
                          ? 'text-[#F5CE76] font-bold drop-shadow-[0_0_6px_rgba(245,206,118,0.7)]'
                          : 'text-stone/55 hover:text-white font-medium'
                      }`}
                    >
                      <span className="font-semibold text-[7.5px] sm:text-[8px] leading-tight">{lvl.code}</span>
                      <span className="text-[8px] sm:text-[9px] tracking-widest leading-tight">{lvl.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
