import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import TastingCard, { TastingCardData } from './TastingCard'
import TastingDeckArc from './TastingDeckArc'

interface TastingDeckChamberProps {
  cards: TastingCardData[]
  stageNumber: number
  totalStages: number
  questionTitle: string
  questionPrompt: string
  questionSubtitle?: string
  initialSelectedId?: string
  onCardChosen: (card: TastingCardData) => void
}

type RitualPhase = 'dealing' | 'idle' | 'selected' | 'returning'

/**
 * TastingDeckChamber
 * Orchestrates the complete DIAGEO Tasting Deck dealing ritual:
 * 1. Cards physically deal sequentially from the bottom-center deck to center focus, then settle horizontally.
 * 2. On user selection, the chosen card receives center spotlight + vertical golden connection ray to deck.
 * 3. Cards converge into a physical deck stack and return downward into the bottom-center anchor.
 * 4. Automatically triggers progression without any manual "Next" button.
 */
interface RitualMotionOffsets {
  toCenterX: number
  toCenterY: number
  toArcX: number
  toArcY: number
}

export default function TastingDeckChamber({
  cards,
  stageNumber,
  totalStages,
  questionTitle,
  questionPrompt,
  questionSubtitle,
  initialSelectedId,
  onCardChosen,
}: TastingDeckChamberProps) {
  const [phase, setPhase] = useState<RitualPhase>('dealing')
  const [activeDealingIndex, setActiveDealingIndex] = useState<number>(0)
  const [selectedId, setSelectedId] = useState<string | undefined>(initialSelectedId)
  const [selectedMotion, setSelectedMotion] = useState<RitualMotionOffsets | null>(null)
  const [selectedRect, setSelectedRect] = useState<DOMRect | null>(null)
  const [origins, setOrigins] = useState<Record<string, RitualMotionOffsets>>({})
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false)
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const hasDealtRef = useRef(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Reduced motion preference check
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Measure whether cards overflow to the left or right
  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) {
      setCanScrollLeft(false)
      setCanScrollRight(false)
      return
    }
    const { scrollLeft, scrollWidth, clientWidth } = el
    const hasOverflow = scrollWidth > clientWidth + 6
    if (!hasOverflow) {
      setCanScrollLeft(false)
      setCanScrollRight(false)
      return
    }
    setCanScrollLeft(scrollLeft > 8)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8)
  }, [])

  // Calculate live geometric offsets from each card to chamber center and bottom deck arc
  const calculateOrigins = useCallback(() => {
    const container = containerRef.current
    if (!container) return {}

    const cRect = container.getBoundingClientRect()
    const cX = cRect.left + cRect.width / 2
    const cY = cRect.top + cRect.height / 2
    const aX = cX
    const aY = cRect.bottom - 42 // Bottom-center Tasting Deck Arc luminous pip

    const newOrigins: Record<string, RitualMotionOffsets> = {}

    cards.forEach((card, idx) => {
      const el = cardRefs.current.get(card.id)
      if (el) {
        const r = el.getBoundingClientRect()
        const cardX = r.left + r.width / 2
        const cardY = r.top + r.height / 2

        newOrigins[card.id] = {
          toCenterX: cX - cardX,
          toCenterY: cY - cardY,
          toArcX: aX - cardX,
          toArcY: aY - cardY,
        }
      } else {
        // High-precision geometric fallback based on horizontal index
        const step = 265
        const relX = (idx - (cards.length - 1) / 2) * step
        newOrigins[card.id] = {
          toCenterX: -relX,
          toCenterY: 0,
          toArcX: -relX,
          toArcY: 340,
        }
      }
    })

    return newOrigins
  }, [cards])

  // Reset dealing phase whenever stage/cards change
  useEffect(() => {
    setPhase('dealing')
    setActiveDealingIndex(0)
    setSelectedId(initialSelectedId)
    setSelectedMotion(null)
    setSelectedRect(null)
    hasDealtRef.current = false

    // 1. Initial geometric estimation
    const initialMap: Record<string, RitualMotionOffsets> = {}
    const step = 265
    cards.forEach((card, idx) => {
      const relX = (idx - (cards.length - 1) / 2) * step
      initialMap[card.id] = {
        toCenterX: -relX,
        toCenterY: 0,
        toArcX: -relX,
        toArcY: 340,
      }
    })
    setOrigins(initialMap)

    // 2. Refine with live DOM coordinates once mounted
    const raf = requestAnimationFrame(() => {
      const measured = calculateOrigins()
      if (Object.keys(measured).length > 0) {
        setOrigins((prev) => ({ ...prev, ...measured }))
      }
      updateScrollState()
    })

    const timers: NodeJS.Timeout[] = []

    if (prefersReducedMotion) {
      const t = setTimeout(() => {
        setPhase('idle')
        setActiveDealingIndex(-1)
        hasDealtRef.current = true
        updateScrollState()
      }, 350)
      timers.push(t)
    } else {
      // Step-by-step dealing choreography: each card emerges in front, zooms in center, then settles
      const stepDuration = 700
      cards.forEach((_, idx) => {
        if (idx > 0) {
          timers.push(
            setTimeout(() => {
              setActiveDealingIndex(idx)
            }, idx * stepDuration)
          )
        }
      })

      const totalDealDuration = cards.length * stepDuration + 400
      timers.push(
        setTimeout(() => {
          setPhase('idle')
          setActiveDealingIndex(-1)
          hasDealtRef.current = true
          updateScrollState()
        }, totalDealDuration)
      )
    }

    return () => {
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
    }
  }, [cards, initialSelectedId, prefersReducedMotion, calculateOrigins, updateScrollState])

  // Monitor scroll track updates
  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    updateScrollState()

    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState, phase])

  // Mouse wheel horizontal scroll support
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current && e.deltaY !== 0) {
      scrollContainerRef.current.scrollLeft += e.deltaY * 1.1
      updateScrollState()
    }
  }

  // Smooth scroll left / right navigation helpers
  const handleScrollBy = (offset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' })
      setTimeout(updateScrollState, 250)
    }
  }

  // Handle Card Click -> Glides to Middle (Zoomed In) -> Holds Focus -> Returns into Bottom Arc -> Advances
  const handleCardClick = useCallback(
    (card: TastingCardData) => {
      if (phase === 'selected' || phase === 'returning') return

      const cardEl = cardRefs.current.get(card.id)
      const container = containerRef.current
      if (cardEl && container) {
        const r = cardEl.getBoundingClientRect()
        const cRect = container.getBoundingClientRect()
        const cX = cRect.left + cRect.width / 2
        const cY = cRect.top + cRect.height / 2
        const cardX = r.left + r.width / 2
        const cardY = r.top + r.height / 2
        const aX = cX
        const aY = cRect.bottom - 42

        setSelectedMotion({
          toCenterX: cX - cardX,
          toCenterY: cY - cardY,
          toArcX: aX - cardX,
          toArcY: aY - cardY,
        })
        setSelectedRect(r)
      } else {
        const fallback = origins[card.id] || {
          toCenterX: 0,
          toCenterY: 0,
          toArcX: 0,
          toArcY: 340,
        }
        setSelectedMotion(fallback)
      }

      setSelectedId(card.id)
      setPhase('selected')

      // Phase 1 -> Phase 2: Hold center spotlight moment, then converge & return into the bottom arc
      const convergeTimer = setTimeout(() => {
        setPhase('returning')

        // Phase 3: Absorb into deck and advance to next dimension
        const advanceTimer = setTimeout(() => {
          onCardChosen(card)
        }, prefersReducedMotion ? 350 : 700)

        return () => clearTimeout(advanceTimer)
      }, prefersReducedMotion ? 300 : 900)

      return () => clearTimeout(convergeTimer)
    },
    [phase, origins, onCardChosen, prefersReducedMotion]
  )

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-0 flex flex-col justify-between items-center select-none overflow-hidden pt-1 pb-1"
    >
      {/* ════════════════════════════════════════════════════════════ */}
      {/* 1. EDITORIAL QUESTION HEADER */}
      {/* ════════════════════════════════════════════════════════════ */}
      <motion.header
        animate={{
          opacity: phase === 'returning' ? 0 : 1,
          y: phase === 'returning' ? -12 : 0,
        }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full text-center max-w-3xl mx-auto px-4 shrink-0 mb-1 sm:mb-2"
      >
        <div className="flex items-center justify-center gap-3 mb-1">
          <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.35em] uppercase text-gold-light/90">
            TASTE DIMENSION 0{stageNumber}
          </span>
          <span className="h-px w-6 bg-gold/30" />
          <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.35em] uppercase text-stone/50">
            {questionTitle}
          </span>
        </div>

        <h1 className="font-serif text-[clamp(1.4rem,2.8vw,2.25rem)] text-[#FAF7F2] font-normal tracking-tight leading-[1.12] mb-1 px-2">
          {questionPrompt}
        </h1>

        {questionSubtitle && (
          <p className="text-stone/60 text-[11px] sm:text-xs font-sans font-light tracking-wide max-w-md mx-auto">
            {questionSubtitle}
          </p>
        )}
      </motion.header>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* 2. CARD DEALING & PRESENTATION HORIZON */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div className="relative w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden px-2 sm:px-4">
        {/* Subtle Horizontal Scroll Edge Vignettes */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 z-20 bg-gradient-to-r from-[#080807] via-[#080807]/60 to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 z-20 bg-gradient-to-l from-[#080807] via-[#080807]/60 to-transparent"
          aria-hidden="true"
        />

        {/* ── Left Navigation Chevron ── */}
        <button
          type="button"
          onClick={() => handleScrollBy(-280)}
          disabled={!canScrollLeft}
          aria-label="Scroll cards left"
          className={`hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full items-center justify-center transition-all duration-300 ${
            canScrollLeft
              ? 'bg-[#C6A15B] text-[#080807] border border-[#C6A15B] shadow-[0_0_20px_rgba(198,161,91,0.5)] cursor-pointer hover:bg-[#D8BD7A] hover:scale-105 active:scale-95'
              : 'bg-transparent text-stone/30 border border-stone/20 cursor-default opacity-40'
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* ── Right Navigation Chevron (Active Gold when element present on right) ── */}
        <button
          type="button"
          onClick={() => handleScrollBy(280)}
          disabled={!canScrollRight}
          aria-label="Scroll cards right"
          className={`hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full items-center justify-center transition-all duration-300 ${
            canScrollRight
              ? 'bg-[#C6A15B] text-[#080807] border border-[#C6A15B] shadow-[0_0_20px_rgba(198,161,91,0.5)] cursor-pointer hover:bg-[#D8BD7A] hover:scale-105 active:scale-95'
              : 'bg-transparent text-stone/30 border border-stone/20 cursor-default opacity-40'
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Horizontal Scrolling Track (Strictly Flex-Nowrap Single Row) */}
        <div
          ref={scrollContainerRef}
          onWheel={handleWheel}
          className="relative z-10 w-full h-full flex items-center overflow-x-auto overflow-y-hidden px-4 sm:px-12 py-1 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="m-auto flex items-center gap-3 sm:gap-4 md:gap-5 flex-nowrap py-2">
            {cards.map((card, idx) => {
              const isSelected = selectedId === card.id
              const isDimmed = phase === 'selected' && !isSelected
              const isNewArrival = phase === 'dealing' && activeDealingIndex === idx
              const isAlreadyDealt = phase === 'dealing' && activeDealingIndex > idx
              const isUpcoming = phase === 'dealing' && activeDealingIndex < idx

              const origin = origins[card.id] || {
                toArcX: -(idx - (cards.length - 1) / 2) * 265,
                toArcY: 340,
                toCenterX: -(idx - (cards.length - 1) / 2) * 265,
                toCenterY: 0,
              }

              // Precise Stacking Order:
              // 1. Selected card: zIndex 60 (highest)
              // 2. New arrival card: zIndex 40 (emerges in FRONT of all previous cards)
              // 3. Already dealt cards: zIndex 10 (positioned BEHIND the new arrival card)
              // 4. Idle state: zIndex 10 (all cards level)
              let cardZIndex = 10
              if (isSelected) {
                cardZIndex = 60
              } else if (isNewArrival) {
                cardZIndex = 40
              } else if (isAlreadyDealt) {
                cardZIndex = 10
              } else if (isUpcoming) {
                cardZIndex = 1
              }

              // Determine Motion Coordinates for Dealing, Center Zoom, and Returning to Arc
              const getAnimationVariants = () => {
                if (prefersReducedMotion) {
                  return {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 },
                  }
                }

                // Phase: RETURNING (From center or row, descend into the bottom-center arc)
                if (phase === 'returning') {
                  if (isSelected && selectedMotion) {
                    // Selected card moves directly from viewport center into the bottom arc!
                    return {
                      x: selectedMotion.toArcX,
                      y: selectedMotion.toArcY,
                      scale: 0.15,
                      opacity: 0,
                      transition: {
                        duration: 0.65,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    }
                  }

                  // Unselected cards converge into the bottom arc
                  return {
                    x: origin.toArcX,
                    y: origin.toArcY,
                    scale: 0.15,
                    opacity: 0,
                    transition: {
                      duration: 0.55,
                      delay: 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  }
                }

                // Phase: SELECTED (Selected card glides to viewport center and zooms in!)
                if (phase === 'selected') {
                  if (isSelected && selectedMotion) {
                    return {
                      x: selectedMotion.toCenterX,
                      y: selectedMotion.toCenterY,
                      scale: 1.15,
                      opacity: 1,
                      zIndex: 60,
                      transition: {
                        duration: 0.55,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    }
                  }

                  // Other cards gently dim and recede
                  return {
                    x: 0,
                    y: 0,
                    scale: 0.92,
                    opacity: 0.15,
                    transition: {
                      duration: 0.45,
                      ease: 'easeOut',
                    },
                  }
                }

                // Phase: DEALING (Sequential emergence in front of the window)
                if (phase === 'dealing') {
                  if (isNewArrival) {
                    // Card emerges in the FRONT of the window from bottom arc to center focus, then settles into row
                    return {
                      x: [origin.toArcX, origin.toCenterX, 0],
                      y: [origin.toArcY, origin.toCenterY - 18, 0],
                      scale: [0.15, 1.15, 1],
                      opacity: [0, 1, 1],
                      transition: {
                        duration: 0.78,
                        times: [0, 0.48, 1],
                        ease: [0.16, 1, 0.3, 1],
                      },
                    }
                  }

                  if (isAlreadyDealt) {
                    // Card has already arrived: positioned BEHIND the new arrival card
                    return {
                      x: 0,
                      y: 0,
                      scale: 0.98,
                      opacity: 0.85,
                      transition: {
                        duration: 0.35,
                        ease: 'easeOut',
                      },
                    }
                  }

                  // Upcoming card: stays hidden in bottom arc until its turn
                  return {
                    x: origin.toArcX,
                    y: origin.toArcY,
                    scale: 0.15,
                    opacity: 0,
                    transition: { duration: 0.2 },
                  }
                }

                // Phase: IDLE (All cards presented side-by-side with full brightness)
                return {
                  x: 0,
                  y: 0,
                  scale: 1,
                  opacity: 1,
                  transition: {
                    duration: 0.4,
                    ease: 'easeOut',
                  },
                }
              }

              return (
                <motion.div
                  key={card.id}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : {
                          x: origin.toArcX,
                          y: origin.toArcY,
                          scale: 0.15,
                          opacity: 0,
                        }
                  }
                  animate={getAnimationVariants()}
                  className="flex items-center justify-center shrink-0 relative transition-all duration-300"
                  style={{
                    zIndex: cardZIndex,
                  }}
                >
                  <TastingCard
                    ref={(node) => {
                      if (node) cardRefs.current.set(card.id, node)
                      else cardRefs.current.delete(card.id)
                    }}
                    card={card}
                    index={idx}
                    totalCards={cards.length}
                    isSelected={isSelected}
                    isDimmed={isDimmed}
                    disabled={phase === 'dealing' || phase === 'returning' || phase === 'selected'}
                    onClick={() => handleCardClick(card)}
                  />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* 3. PERMANENT BOTTOM-CENTER TASTING DECK ANCHOR */}
      {/* ════════════════════════════════════════════════════════════ */}
      <footer className="relative w-full shrink-0 flex flex-col items-center justify-end z-30 pb-1">
        <TastingDeckArc
          isActive={phase === 'dealing' || phase === 'selected' || phase === 'returning'}
          selectedCardRect={phase === 'selected' ? selectedRect : null}
          isCardCentered={phase === 'selected' || phase === 'returning'}
          currentStageNumber={stageNumber}
          totalStages={totalStages}
        />
      </footer>
    </div>
  )
}
