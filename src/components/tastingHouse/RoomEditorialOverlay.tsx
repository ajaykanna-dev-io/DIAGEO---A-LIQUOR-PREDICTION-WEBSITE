import { useState, useRef, useMemo, MouseEvent, TouchEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5'
import AmbientBarAudio from '@/components/AmbientBarAudio'
import { DiscoveryOption } from '@/data/discoveryStages'
import { barMusic } from '@/utils/barMusicEngine'

interface RoomEditorialOverlayProps {
  stageNumber: number
  totalStages: number
  stageTitle: string
  questionPrompt: string
  questionSubtitle?: string
  options: DiscoveryOption[]
  selectedOptionId?: string
  onSelectOption: (id: string) => void
  isWalking: boolean
  isEntering: boolean
  onContinue: () => void
  onBack?: () => void
  isMobile?: boolean
  mobileFocusedIndex?: number
  onPrevMobileFrame?: () => void
  onNextMobileFrame?: () => void
  onSelectMobileIndex?: (idx: number) => void
}

/**
 * RoomEditorialOverlay — Ultra-Luxury Editorial Overlay
 * Features:
 * - Elevated brandmark and dimension progress header
 * - High-contrast editorial question hierarchy positioned for open spatial sightlines
 * - Interactive 3D Magnetic Spatial Forward Control with 3D perspective tilt, champagne glow, and sound triggers
 * - Mobile-responsive center exhibition gallery with touch swipe, flank controls, and diamond pips
 * - Harmonized option selection pills with crystal audio feedback
 */
export default function RoomEditorialOverlay({
  stageNumber,
  totalStages,
  stageTitle,
  questionPrompt,
  questionSubtitle,
  options,
  selectedOptionId,
  onSelectOption,
  isWalking,
  isEntering,
  onContinue,
  onBack,
  isMobile = false,
  mobileFocusedIndex = 0,
  onPrevMobileFrame,
  onNextMobileFrame,
  onSelectMobileIndex,
}: RoomEditorialOverlayProps) {
  const hasSelection = Boolean(selectedOptionId)

  // 3D Magnetic Tilt State for the Forward Button
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Dynamic Step Forward Title & Progress based on finished questions
  const stepForwardTitle = useMemo(() => {
    if (!hasSelection) {
      return `SELECT A TASTING DISPLAY`
    }
    switch (stageNumber) {
      case 1:
        return 'STEP FORWARD TO CHAMBER 02'
      case 2:
        return 'STEP FORWARD TO CHAMBER 03'
      case 3:
        return 'STEP FORWARD TO CHAMBER 04'
      case 4:
      default:
        return 'STEP FORWARD TO SPIRIT REVELATION'
    }
  }, [hasSelection, stageNumber])

  const stepForwardSubtitle = useMemo(() => {
    if (!hasSelection) {
      return `Dimension 0${stageNumber} of 0${totalStages} · Choose your notes`
    }
    if (stageNumber >= totalStages) {
      return 'All 4 Dimensions Discovered · Enter Sacred Chamber'
    }
    return `0${stageNumber} of 0${totalStages} Dimensions Discovered`
  }, [hasSelection, stageNumber, totalStages])

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || !hasSelection) return
    const rect = buttonRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setRotateX(-y * 0.18)
    setRotateY(x * 0.18)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
    setIsHovered(false)
  }

  const handleSelectWithChime = (id: string, idx?: number) => {
    barMusic.playCrystalSelectionChime()
    onSelectOption(id)
    if (typeof idx === 'number') {
      onSelectMobileIndex?.(idx)
    }
  }

  const handleForwardWithTransition = () => {
    if (!hasSelection || isWalking) return
    barMusic.playChamberWalkTransition()
    onContinue()
  }

  // Mobile Touch Swipe Handling
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    const deltaY = e.changedTouches[0].clientY - touchStartY.current

    // Only process horizontal swipes (> 35px, mostly horizontal)
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX < 0) {
        onNextMobileFrame?.()
      } else {
        onPrevMobileFrame?.()
      }
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-3 sm:p-8 select-none"
    >
      {/* ════════════════════════════════════════════════════════════ */}
      {/* TOP BAR: Minimal Brandmark & Progress                      */}
      {/* ════════════════════════════════════════════════════════════ */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isWalking ? 0 : 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full flex items-center justify-between pointer-events-auto"
      >
        {/* Brand Crest */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-display text-base sm:text-xl tracking-[0.3em] text-[#FAF7F2] font-light">
            DIAGEO
          </span>
          <span className="h-3 w-px bg-white/20 hidden sm:inline-block" />
          <span className="text-[9px] uppercase tracking-[0.3em] font-mono text-[#8F877C] hidden sm:inline-block">
            Tasting Sanctuary
          </span>
        </div>

        {/* Dimension Index & Sound Engine */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2.5 font-mono text-[11px] sm:text-xs tracking-widest text-[#8F877C]">
            <span className="text-[#C6A15B] font-medium">0{stageNumber}</span>
            <span className="text-white/25">/</span>
            <span className="text-white/50">0{totalStages}</span>
            <span className="h-2 w-px bg-white/20 hidden sm:inline-block" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A69E92] hidden sm:inline-block">
              {stageTitle}
            </span>
          </div>

          <AmbientBarAudio />

          {/* ── Haute Distillerie Close Button (Matches Music Button Theme) ── */}
          <Link
            to="/"
            className="group relative inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/10 hover:border-[#C6A15B]/50 bg-[#0c0b0a]/75 hover:bg-[#14110c]/90 text-stone/60 hover:text-[#FAF7F2] shadow-[0_2px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_2px_18px_rgba(198,161,91,0.22)] transition-all duration-500 cursor-pointer overflow-hidden"
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

          {onBack && stageNumber > 1 && (
            <button
              type="button"
              onClick={onBack}
              className="py-1 px-2.5 sm:py-1.5 sm:px-3.5 rounded-full border border-white/10 hover:border-[#C6A15B]/40 bg-black/50 backdrop-blur-md text-stone/60 hover:text-white text-[9px] uppercase font-mono tracking-[0.25em] transition-all cursor-pointer"
            >
              ← Back
            </button>
          )}
        </div>
      </motion.header>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* UPPER-CENTER: Refined Editorial Question in Architecture   */}
      {/* Compact on mobile so 3D art frame has open sightline       */}
      {/* ════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{
          opacity: isWalking || isEntering ? 0 : 1,
          y: isWalking ? -20 : 0,
        }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex flex-col items-center text-center max-w-xl mx-auto pt-1 sm:pt-4 pointer-events-none px-3"
      >
        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] shadow-[0_0_8px_#C6A15B]" />
          <span className="text-[10px] sm:text-xs font-mono tracking-[0.35em] uppercase text-[#D8BD7A] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Taste Dimension 0{stageNumber}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] shadow-[0_0_8px_#C6A15B]" />
        </div>

        <h2 className="font-serif text-[clamp(1.3rem,4.5vw,2.4rem)] text-[#FAF7F2] font-normal tracking-tight leading-[1.12] mb-1 sm:mb-2 drop-shadow-[0_2px_18px_rgba(0,0,0,0.95)]">
          {questionPrompt}
        </h2>

        {questionSubtitle && (
          <p className="text-[#A69E92] text-[11px] sm:text-sm font-sans font-light tracking-wide max-w-md drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] line-clamp-2">
            {questionSubtitle}
          </p>
        )}
      </motion.div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* CENTER MOBILE FLANK CONTROLS: Luxury Nav Arrows for 3D Art */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div className="sm:hidden flex items-center justify-between w-full px-1 pointer-events-none my-auto z-20">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onPrevMobileFrame?.()
          }}
          className="pointer-events-auto flex items-center justify-center w-8 h-8 rounded-full bg-[#0d0c0a]/80 border border-[#C6A15B]/35 hover:border-[#C6A15B] text-[#FAF7F2] shadow-[0_4px_16px_rgba(0,0,0,0.7)] backdrop-blur-md active:scale-90 transition-all cursor-pointer"
          aria-label="Previous Tasting Display"
        >
          <IoChevronBack className="w-4 h-4 text-[#C6A15B]" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onNextMobileFrame?.()
          }}
          className="pointer-events-auto flex items-center justify-center w-8 h-8 rounded-full bg-[#0d0c0a]/80 border border-[#C6A15B]/35 hover:border-[#C6A15B] text-[#FAF7F2] shadow-[0_4px_16px_rgba(0,0,0,0.7)] backdrop-blur-md active:scale-90 transition-all cursor-pointer"
          aria-label="Next Tasting Display"
        >
          <IoChevronForward className="w-4 h-4 text-[#C6A15B]" />
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* BOTTOM: Dual Selection Chips & 3D Magnetic Spatial Control  */}
      {/* ════════════════════════════════════════════════════════════ */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isWalking ? 0 : 1,
          y: isWalking ? 20 : 0,
        }}
        transition={{ duration: 0.5 }}
        className="w-full flex flex-col items-center pointer-events-auto pb-3 sm:pb-4 gap-2 sm:gap-3 perspective-[800px]"
      >
        {/* Mobile Luxury Frame Indicator Dots */}
        <div className="flex sm:hidden items-center justify-center gap-3 pb-1 pointer-events-auto">
          {options.map((opt, i) => {
            const isCurrent = i === (mobileFocusedIndex ?? 0)
            const isChosen = selectedOptionId === opt.id
            return (
              <button
                key={`mobile-pip-${opt.id}`}
                type="button"
                onClick={() => onSelectMobileIndex?.(i)}
                className="p-1 cursor-pointer focus:outline-none flex items-center justify-center"
                aria-label={`Select display 0${i + 1}: ${opt.label}`}
              >
                <span
                  className={`block transition-all duration-300 ${
                    isCurrent
                      ? 'w-2.5 h-2.5 rotate-45 bg-[#C6A15B] shadow-[0_0_10px_rgba(198,161,91,0.9)] scale-110'
                      : isChosen
                      ? 'w-2 h-2 rotate-45 bg-[#C6A15B]/65'
                      : 'w-1.5 h-1.5 rotate-45 bg-white/20 hover:bg-white/40'
                  }`}
                />
              </button>
            )
          })}
        </div>

        {/* Synchronized Tasting Options Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-2xl px-2">
          {options.map((opt, idx) => {
            const isSelected = selectedOptionId === opt.id
            const isMobileFocused = isMobile && idx === mobileFocusedIndex
            const numTag = `0${idx + 1}`
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectWithChime(opt.id, idx)}
                className={`group flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border text-[11px] sm:text-xs font-sans transition-all duration-300 cursor-pointer backdrop-blur-md ${
                  isSelected
                    ? 'border-[#C6A15B] bg-[#C6A15B]/25 text-[#FAF7F2] shadow-[0_0_25px_rgba(198,161,91,0.35)] scale-[1.02]'
                    : isMobileFocused
                    ? 'border-[#C6A15B]/60 bg-[#C6A15B]/10 text-[#FAF7F2]'
                    : 'border-white/10 hover:border-[#C6A15B]/40 bg-black/50 text-[#A69E92] hover:text-[#FAF7F2]'
                }`}
              >
                <span className={`font-mono text-[9px] sm:text-[10px] ${isSelected ? 'text-[#C6A15B]' : 'text-stone/50'}`}>
                  {numTag}
                </span>
                <span className="font-light tracking-wide">{opt.label}</span>
                {isSelected && <span className="text-[#C6A15B] text-xs font-bold">✓</span>}
              </button>
            )
          })}
        </div>

        {/* ── Enhanced 3D Interactive Magnetic "Step Forward" Control ── */}
        <motion.button
          ref={buttonRef}
          type="button"
          onClick={handleForwardWithTransition}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          animate={{
            rotateX,
            rotateY,
            scale: isHovered && hasSelection ? 1.04 : 1.0,
            y: hasSelection ? 0 : 3,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{ transformStyle: 'preserve-3d' }}
          disabled={!hasSelection || isWalking}
          className={`relative group flex flex-col items-center px-9 py-3 rounded-full border transition-all duration-500 overflow-hidden cursor-pointer ${
            hasSelection && !isWalking
              ? 'border-[#C6A15B] bg-gradient-to-b from-[#221a13]/95 via-[#140f0c]/98 to-[#090706] shadow-[0_0_45px_rgba(198,161,91,0.45)] text-[#FAF7F2]'
              : 'border-white/10 bg-black/40 text-stone/40 cursor-not-allowed'
          }`}
          aria-label={stepForwardTitle}
        >
          {/* Internal Ambient Sheen */}
          {hasSelection && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C6A15B]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          )}

          {/* Micro Progress Bar Segments (1 of 4, 2 of 4, 3 of 4, 4 of 4) */}
          <div
            className="flex items-center gap-1.5 mb-1.5 relative z-10"
            style={{ transform: 'translateZ(20px)' }}
          >
            {Array.from({ length: totalStages }).map((_, i) => {
              const isFinished = hasSelection ? i < stageNumber : i < stageNumber - 1
              return (
                <div
                  key={i}
                  className={`h-[2.5px] rounded-full transition-all duration-500 ${
                    isFinished
                      ? 'w-7 bg-[#C6A15B] shadow-[0_0_8px_#C6A15B]'
                      : 'w-4 bg-white/20'
                  }`}
                />
              )
            })}
          </div>

          {/* Button Content with 3D Depth */}
          <div
            className="flex items-center gap-3 relative z-10"
            style={{ transform: 'translateZ(25px)' }}
          >
            <span className="text-[11px] sm:text-xs font-mono tracking-[0.32em] uppercase font-semibold text-[#FAF7F2]">
              {stepForwardTitle}
            </span>
            <span
              className={`text-sm text-[#C6A15B] transition-transform duration-500 font-bold ${
                hasSelection ? 'group-hover:translate-x-2' : ''
              }`}
            >
              →
            </span>
          </div>

          {/* Subtitle Indicating Questions Finished */}
          <span
            className="text-[9px] font-mono tracking-[0.22em] uppercase text-[#D8BD7A]/90 mt-0.5 relative z-10"
            style={{ transform: 'translateZ(18px)' }}
          >
            {stepForwardSubtitle}
          </span>

          {/* Glowing Champagne Perimeter Accent */}
          {hasSelection && (
            <motion.div
              animate={{ opacity: [0.45, 0.9, 0.45] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -inset-px rounded-full border border-[#C6A15B]/60 pointer-events-none"
            />
          )}
        </motion.button>
      </motion.footer>
    </div>
  )
}
