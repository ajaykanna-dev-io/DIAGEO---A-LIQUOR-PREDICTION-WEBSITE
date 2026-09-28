import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SensoryTransitionMetadata } from '../../data/sensoryTransitionData'

interface SensoryMedallionProps {
  sensoryData: SensoryTransitionMetadata
  nextSensoryData?: SensoryTransitionMetadata | null
  questionId: string
  sommelierNote?: string
  transitionState?: 'active' | 'confirming' | 'exiting' | 'transitioning' | 'entering'
}

/**
 * SensoryMedallion — Luxury Horological Sensory Instrument & Detail Plaque
 *
 * Sized and centered to fit comfortably within the viewport's luxury frame:
 * 1. Front Circular Image Disc (310px) on the left (z-[20]) with clean gold bezel and NO artificial spots
 * 2. Overlapping Circular Information Plaque (280px) on the right (z-[10]) with ~50% overlap
 * 3. Both discs share the same vertical center line (Y = 173px)
 * 4. High-contrast, clean typography in the exposed right half with fluid AnimatePresence transitions
 * 5. "ROTATE TO EXPLORE" Callout (top-right) with curved gold arrow, stacked text, and drop-line
 * 6. Clean, delicate elliptical orbital gold ring with zero artificial flare spots
 * 7. Smooth pointer drag rotation and click-to-revolve focus
 */
export default function SensoryMedallion({
  sensoryData,
  nextSensoryData: _nextSensoryData,
  questionId,
  sommelierNote,
  transitionState = 'active',
}: SensoryMedallionProps) {
  // Drag / Rotation angle of the orbital mechanism
  const [rotationAngle, setRotationAngle] = useState<number>(0)
  // Whether user has revolvingly focused the information disc forward
  const [isInfoActive, setIsInfoActive] = useState<boolean>(false)
  // Dragging interaction state
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const dragStartXRef = useRef<number>(0)
  const startAngleRef = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Reset to default on question change
  useEffect(() => {
    if (transitionState === 'active') {
      setIsInfoActive(false)
      setRotationAngle(0)
    }
  }, [questionId, transitionState])

  const isTransitioning = transitionState !== 'active' && transitionState !== 'confirming'
  const calibrationText = sensoryData.sommelierCalibration || sommelierNote || sensoryData.description

  // Split title into two lines if it contains multiple words
  const titleWords = useMemo(() => {
    const raw = (sensoryData.title || '').trim()
    const words = raw.split(' ')
    if (words.length >= 2) {
      return { line1: words[0], line2: words.slice(1).join(' ') }
    }
    return { line1: raw, line2: '' }
  }, [sensoryData.title])

  // Pointer drag handling for horological rotation
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isTransitioning) return
    setIsDragging(true)
    dragStartXRef.current = e.clientX
    startAngleRef.current = rotationAngle
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || isTransitioning) return
    const deltaX = e.clientX - dragStartXRef.current
    const newAngle = startAngleRef.current + deltaX * 0.55
    setRotationAngle(newAngle)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    setIsDragging(false)
    try {
      ;(e.target as HTMLElement).releasePointerCapture?.(e.pointerId)
    } catch {}
  }

  // Toggle reveal on click
  const toggleDiscFocus = useCallback(() => {
    if (isTransitioning) return
    setIsInfoActive((prev) => !prev)
  }, [isTransitioning])

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative select-none w-full max-w-[480px] xl:max-w-[500px] h-[345px] sm:h-[355px] mx-auto flex items-center justify-center overflow-visible touch-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      aria-label="Sensory Medallion Showcase"
    >
      {/* ════════════════════════════════════════════════════════════
          LAYER 1: VOLUMETRIC CHAMPAGNE AMBIENT GLOW
         ════════════════════════════════════════════════════════════ */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full blur-[70px] z-[1] opacity-30 transition-opacity duration-700"
        style={{
          background:
            'radial-gradient(ellipse at 42% 50%, rgba(255, 215, 0, 0.25) 0%, rgba(212, 175, 55, 0.1) 45%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      
      {/* ════════════════════════════════════════════════════════════
          LAYER 3: CLEAN ELLIPTICAL ORBITAL GOLD RINGS (ANIMATED ENTRANCE + CONTINUOUS ROTATION)
         ════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-0 w-full h-full z-[5] overflow-visible"
      >
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 480 350"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="orbitalRingSoftGlow" x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Dynamic rotating orbital assembly */}
          <g transform={`rotate(${rotationAngle * 0.4}, 165, 173)`}>
            {/* Main glowing orbital ring */}
            <ellipse
              cx="165"
              cy="173"
              rx="172"
              ry="92"
              transform="rotate(-14 165 173)"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="1.5"
              strokeOpacity="0.65"
              filter="url(#orbitalRingSoftGlow)"
            />

            {/* Faint concentric precision orbital guide ring */}
            <ellipse
              cx="165"
              cy="173"
              rx="178"
              ry="98"
              transform="rotate(-14 165 173)"
              fill="none"
              stroke="#FFEAA5"
              strokeWidth="0.75"
              strokeOpacity="0.25"
              strokeDasharray="4 6"
            />

            {/* Secondary crossed celestial ellipse */}
            <ellipse
              cx="165"
              cy="173"
              rx="155"
              ry="74"
              transform="rotate(32 165 173)"
              fill="none"
              stroke="#E3C585"
              strokeWidth="0.75"
              strokeOpacity="0.2"
              strokeDasharray="3 7"
            />
          </g>
        </svg>
      </motion.div>

      {/* ════════════════════════════════════════════════════════════
          LAYER 4: REAR CIRCULAR INFORMATION PLAQUE (DETAIL DISC)
          - Positioned BEHIND main image with ~50% overlap
          - Deep obsidian black disc with metallic gold rim
          - Perfectly vertically centered with front disc at Y = 173px
         ════════════════════════════════════════════════════════════ */}
      <motion.div
        onClick={toggleDiscFocus}
        initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
        animate={{
          opacity: 1,
          filter: isInfoActive ? 'blur(0px) brightness(1.05)' : 'blur(0px) brightness(0.94)',
          scale: isInfoActive ? 1.04 : 1.0,
          zIndex: isInfoActive ? 28 : 10,
          x: isInfoActive ? -25 : 0,
        }}
        transition={{
          opacity: { duration: 1.05, delay: 0.22, ease: [0.22, 1, 0.36, 1] },
          filter: { duration: 1.05, delay: 0.22, ease: [0.22, 1, 0.36, 1] },
          scale: { type: 'spring', stiffness: 140, damping: 19 },
          x: { type: 'spring', stiffness: 140, damping: 19 },
        }}
        style={{
          position: 'absolute',
          left: '180px',
          top: '33px',
          width: '280px',
          height: '280px',
          aspectRatio: '1 / 1',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 72% 50%, #16120E 0%, #0D0A08 65%, #060504 100%)',
          border: '2px solid rgba(212, 175, 55, 0.85)',
          boxShadow: isInfoActive
            ? '0 0 30px rgba(255, 215, 0, 0.4), 0 0 50px rgba(0, 0, 0, 0.95), inset 0 0 14px rgba(10, 8, 6, 0.9)'
            : '0 0 20px rgba(212, 175, 55, 0.25), 0 0 40px rgba(0, 0, 0, 0.95), inset 0 0 14px rgba(10, 8, 6, 0.9)',
        }}
        className="info-disc cursor-pointer overflow-hidden flex flex-col justify-center select-none"
        title="Click to focus details"
      >
        {/* Inner concentric hairline ring */}
        <div className="absolute inset-[6px] rounded-full border border-[#D4AF37]/25 pointer-events-none" />

        {/* ── EXPOSED CONTENT COLUMN (Exposed right ~50% region with synchronized transitions) ── */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pl-[130px] pr-4 sm:pr-5 text-center pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={questionId || sensoryData.title}
              initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center justify-center w-full"
            >
              {/* Main Title (Stacked on 2 lines matching reference image) */}
              <h3 className="font-serif font-normal text-[15px] sm:text-[17px] text-[#FAF7F2] tracking-[0.18em] uppercase leading-[1.2] my-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                <div>{titleWords.line1}</div>
                {titleWords.line2 && <div className="mt-0.5">{titleWords.line2}</div>}
              </h3>

              {/* Centered Diamond Divider */}
              <div className="text-[#D4AF37] text-[7px] my-1 leading-none select-none">
                ◇
              </div>

              {/* 3 Sensory Descriptors with bullet dots */}
              <div className="flex flex-col items-center gap-1 my-1">
                {(sensoryData.notes || []).slice(0, 3).map((note, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="text-[#C6A15B] text-[5.5px] leading-none">•</span>
                    <span className="font-sans text-[8.5px] sm:text-[9.5px] font-medium tracking-[0.14em] text-[#D5C4A1] uppercase whitespace-nowrap">
                      {note}
                    </span>
                  </div>
                ))}
              </div>

              {/* Sommelier Calibration Header */}
              <span className="font-sans text-[7.5px] sm:text-[8px] tracking-[0.22em] text-[#D4AF37] uppercase font-medium leading-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] mt-2">
                SOMMELIER CALIBRATION
              </span>

              {/* Sommelier Calibration Quote (Italic serif) */}
              <p className="font-serif italic text-[9.5px] sm:text-[10px] text-[#E0D8C8] leading-snug text-center max-w-[130px] sm:max-w-[145px] mt-1 line-clamp-3">
                "{calibrationText}"
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ════════════════════════════════════════════════════════════
          LAYER 5: FRONT DOMINANT CIRCULAR SENSORY IMAGE DISC
          - Clean, rich 310px circle on the left (z-[20])
          - Double concentric gold border with zero artificial spots
          - Perfectly vertically centered with rear disc at Y = 173px
         ════════════════════════════════════════════════════════════ */}
      <motion.div
        onClick={() => {
          if (isInfoActive) setIsInfoActive(false)
        }}
        initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.975 }}
        animate={{
          opacity: 1,
          filter: isInfoActive ? 'blur(0px) brightness(0.8)' : 'blur(0px) brightness(1.0)',
          scale: isInfoActive ? 0.95 : 1.0,
          zIndex: isInfoActive ? 15 : 20,
        }}
        transition={{
          opacity: { duration: 1.1, delay: 0.18, ease: [0.22, 1, 0.36, 1] },
          filter: { duration: 1.1, delay: 0.18, ease: [0.22, 1, 0.36, 1] },
          scale: { type: 'spring', stiffness: 140, damping: 19 },
        }}
        style={{
          position: 'absolute',
          left: '10px',
          top: '18px',
          width: '310px',
          height: '310px',
          aspectRatio: '1 / 1',
          borderRadius: '50%',
        }}
        className="main-image-disc select-none cursor-pointer"
        title={isInfoActive ? 'Click to focus image' : 'Drag to rotate'}
      >
        {/* ── SOFT VOLUMETRIC RADIAL GOLD BLOOM AROUND RIM ── */}
        <div
          className="absolute -inset-2 rounded-full pointer-events-none"
          style={{
            boxShadow:
              '0 0 25px rgba(255, 215, 0, 0.45), 0 0 50px rgba(212, 175, 55, 0.2), inset 0 0 10px rgba(255, 230, 150, 0.3)',
          }}
        />

        {/* ── OUTER METALLIC GOLD BEZEL (2PX GOLD RIM) ── */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none z-[25]"
          style={{
            border: '2px solid #FFD700',
            boxShadow: 'inset 0 0 10px rgba(255, 215, 0, 0.35), 0 0 16px rgba(0, 0, 0, 0.85)',
          }}
        />

        {/* ── INNER CONCENTRIC GOLD HAIRLINE (INSET 5PX) ── */}
        <div
          className="absolute inset-[5px] rounded-full pointer-events-none z-[25]"
          style={{
            border: '1px solid rgba(255, 234, 165, 0.45)',
          }}
        />

        {/* ── CIRCULAR SENSORY IMAGE CONTAINER (PURE PHOTOGRAPHY, ZERO ARTIFICIAL SPOTS) ── */}
        <div className="absolute inset-0 rounded-full overflow-hidden z-[20] flex items-center justify-center bg-[#0A0908]">
          <motion.div
            key={sensoryData.imageUrl || questionId}
            initial={{ opacity: 0, scale: 0.94, filter: 'blur(8px)' }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: 'blur(0px) brightness(1.02) contrast(1.12) saturate(1.08)',
            }}
            transition={{
              duration: 0.8,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full h-full"
          >
            <motion.img
              src={sensoryData.imageUrl}
              alt={sensoryData.title}
              animate={{
                rotate: rotationAngle * 0.35,
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              className="pointer-events-none select-none rounded-full"
              draggable={false}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement
                const fallback = sensoryData.fallbackImageUrl || '/images/sensory/sensory-spice.jpg'
                if (target.src !== fallback && !target.src.endsWith(fallback)) {
                  target.src = fallback
                }
              }}
            />
          </motion.div>

          {/* ── SUBTLE NATURAL IMAGE EDGE VIGNETTE ── */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none z-[21]"
            style={{
              background:
                'radial-gradient(circle at center, transparent 60%, rgba(10, 8, 6, 0.35) 82%, rgba(10, 8, 6, 0.85) 100%)',
            }}
          />
        </div>
      </motion.div>

     

      {/* ── SUBTLE TRANSLUCENT DRIFTING SMOKE ON FAR LEFT ── */}
      <div className="pointer-events-none absolute -left-4 top-10 w-24 h-48 z-[22] overflow-hidden opacity-45">
        <motion.div
          animate={{ y: [-3, -18, -3], opacity: [0.3, 0.65, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full h-full bg-gradient-to-t from-transparent via-[#E8D196]/18 to-transparent blur-xl"
        />
      </div>
    </div>
  )
}
