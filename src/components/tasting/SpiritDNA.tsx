import { useMemo, useRef, useState, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Answers } from '@/types'
import { questions } from '@/data/questions'

interface SpiritDNAProps {
  answers: Answers
  currentStep: number
  pulseTrigger?: number
  size?: number
  className?: string
  interactive?: boolean
  onClick?: () => void
}

/**
 * SpiritDNA
 * A persistent evolving digital art installation representing the user's growing Spirit Profile.
 * Transmutes from a pure, unblemished crystal distillation vessel into an intricate,
 * multi-layered celestial sculpture containing internal vapor, liquid viscosity,
 * crystalline orbital rings, acoustic waveforms, and an alchemical keystone monogram.
 */
export default function SpiritDNA({
  answers,
  currentStep = 0,
  pulseTrigger = 0,
  size = 280,
  className = '',
  interactive = true,
  onClick,
}: SpiritDNAProps) {
  const reduceMotion = useReducedMotion()
  const vesselRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  // Calculate answered states and profile traits
  const answeredCount = Object.keys(answers).length
  const totalStages = questions.length

  // Extract sensory qualities chosen so far
  const selectedOptions = useMemo(() => {
    return questions
      .map((q) => {
        const optionId = answers[q.id]
        return q.options.find((o) => o.id === optionId)
      })
      .filter(Boolean)
  }, [answers])

  // Dynamic dominant hue derived from selected options
  const dominantHue = useMemo(() => {
    if (selectedOptions.length === 0) return 38 // warm champagne gold default
    const sum = selectedOptions.reduce((acc, opt) => acc + (opt?.hue ?? 38), 0)
    return Math.round(sum / selectedOptions.length)
  }, [selectedOptions])

  // Derived layer activations
  const hasAtmosphere = Boolean(answers['evening'])
  const hasTexture = Boolean(answers['feel'])
  const hasEssence = Boolean(answers['flavor'])
  const hasHorizon = Boolean(answers['palate'])
  const hasIntensity = Boolean(answers['intensity'])
  const hasOccasion = Boolean(answers['occasion'])
  const hasCharacter = Boolean(answers['atmosphere'])
  const hasKeystone = Boolean(answers['priority'])

  // Tilt interaction
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduceMotion || !interactive || !vesselRef.current) return
      const rect = vesselRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setTilt({
        x: y * -18,
        y: x * 18,
      })
    },
    [reduceMotion, interactive]
  )

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
  }, [])

  return (
    <div
      ref={vesselRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative flex items-center justify-center select-none ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
      style={{
        width: size,
        height: size,
        perspective: '900px',
      }}
      role="region"
      aria-label="Personal Spirit DNA Vessel"
    >
      {/* ── Outer Resonance Rings (Occasion / Acoustic Waveform) ── */}
      {hasOccasion && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.2, 0.45, 0.2],
            scale: [1, 1.08, 1],
            rotate: 360,
          }}
          transition={{
            opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 40, repeat: Infinity, ease: 'linear' },
          }}
          className="absolute inset-0 rounded-full border border-gold/20 pointer-events-none"
          style={{
            borderColor: `hsla(${dominantHue}, 50%, 60%, 0.25)`,
            boxShadow: `0 0 35px hsla(${dominantHue}, 60%, 50%, 0.08)`,
          }}
        />
      )}

      {/* ── Secondary Pulsing Aura Triggered on New Selection ── */}
      <motion.div
        key={`pulse-${pulseTrigger}`}
        initial={{ scale: 0.85, opacity: 0.8 }}
        animate={{ scale: 1.25, opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, hsla(${dominantHue}, 65%, 55%, 0.35) 0%, transparent 70%)`,
        }}
      />

      {/* ── 3D Physical Vessel Container ── */}
      <motion.div
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          scale: isHovered ? 1.04 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 160,
          damping: 24,
        }}
        className="relative w-full h-full flex items-center justify-center transform-gpu"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <svg
          viewBox="0 0 240 240"
          className="w-full h-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            {/* Ambient glass core radial glow */}
            <radialGradient id="vesselGlow" cx="45%" cy="40%" r="55%">
              <stop
                offset="0%"
                stopColor={`hsla(${dominantHue}, 70%, 75%, ${
                  hasIntensity ? 0.35 : hasAtmosphere ? 0.22 : 0.12
                })`}
              />
              <stop
                offset="50%"
                stopColor={`hsla(${dominantHue}, 50%, 45%, ${
                  hasIntensity ? 0.18 : hasAtmosphere ? 0.12 : 0.06
                })`}
              />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            {/* Liquid body gradient */}
            <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                stopColor={`hsla(${dominantHue}, 55%, 55%, ${
                  hasTexture ? 0.45 : 0.2
                })`}
              />
              <stop
                offset="100%"
                stopColor={`hsla(${dominantHue - 15}, 65%, 30%, ${
                  hasTexture ? 0.8 : 0.45
                })`}
              />
            </linearGradient>

            {/* Prismatic rim reflection */}
            <linearGradient id="crystalRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
              <stop offset="25%" stopColor="#D8BD7A" stopOpacity="0.4" />
              <stop offset="60%" stopColor="transparent" />
              <stop offset="85%" stopColor="#C6A15B" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.8" />
            </linearGradient>

            {/* Subtle vapor filter for Stage 3 */}
            <filter id="vaporBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          {/* ── Layer 1: Ambient Backdrop Halo ── */}
          <circle cx="120" cy="120" r="105" fill="url(#vesselGlow)" />

          {/* ── Cardinal Compass Axis Markers (Matching Reference Image) ── */}
          <g stroke="#D8BD7A" strokeWidth="1.2" strokeOpacity="0.75" strokeLinecap="round">
            {/* North (12 o'clock) */}
            <line x1="120" y1="12" x2="120" y2="24" />
            {/* South (6 o'clock) */}
            <line x1="120" y1="216" x2="120" y2="228" />
            {/* West (9 o'clock) */}
            <line x1="12" y1="120" x2="24" y2="120" />
            {/* East (3 o'clock) */}
            <line x1="216" y1="120" x2="228" y2="120" />
          </g>

          {/* ── Permanent Crystalline Orbital Rings (Matching Reference Image) ── */}
          <g className="origin-center">
            {/* Tilted Ring 1 */}
            <motion.ellipse
              cx="120"
              cy="120"
              rx="98"
              ry="44"
              fill="none"
              stroke={`hsla(${dominantHue}, 50%, 70%, 0.32)`}
              strokeWidth="0.8"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              style={{ originX: '120px', originY: '120px' }}
            />
            {/* Tilted Ring 2 (Dashed Counter-rotating) */}
            <motion.ellipse
              cx="120"
              cy="120"
              rx="92"
              ry="36"
              fill="none"
              stroke={`hsla(${dominantHue + 15}, 55%, 75%, 0.25)`}
              strokeWidth="0.75"
              strokeDasharray="4 5"
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
              style={{ originX: '120px', originY: '120px' }}
            />
          </g>

          {/* ── Additional Horizon Rings ── */}
          {hasHorizon && (
            <g className="origin-center">
              <circle
                cx="120"
                cy="120"
                r="102"
                fill="none"
                stroke={`hsla(${dominantHue}, 60%, 80%, 0.2)`}
                strokeWidth="0.5"
                strokeDasharray="2 6"
              />
            </g>
          )}

          {/* ── Layer 3: Main Distillation Vessel Silhouette ── */}
          {/* Glass Outer Wall */}
          <circle
            cx="120"
            cy="120"
            r="82"
            fill="rgba(14, 13, 11, 0.6)"
            stroke="url(#crystalRim)"
            strokeWidth="1.2"
          />

          {/* ── Layer 4: Internal Organic Amber Liquid & Fluid Wave ── */}
          <g>
            {/* Ambient liquid depth */}
            <motion.path
              d="M 43,142 Q 120,134 197,142 A 82,82 0 0,1 43,142 Z"
              fill="url(#liquidGrad)"
              animate={{
                opacity: [0.85, 0.98, 0.85],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Extremely slow organic wave meniscus surface */}
            <motion.path
              d="M 43,142 Q 120,136 197,142"
              fill="none"
              stroke={`hsla(${dominantHue}, 65%, 72%, 0.5)`}
              strokeWidth="1.2"
              strokeLinecap="round"
              animate={{
                y: [-1.5, 1.5, -1.5],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
          </g>

          {/* ── Layer 5: Aromatic Vapor Wisps (Flavor / Essence) ── */}
          {hasEssence && (
            <g filter="url(#vaporBlur)">
              <motion.path
                d="M 85,130 Q 110,95 125,108 T 160,85"
                fill="none"
                stroke={`hsla(${dominantHue}, 70%, 75%, 0.45)`}
                strokeWidth="4"
                strokeLinecap="round"
                animate={{
                  y: [-4, 4, -4],
                  opacity: [0.35, 0.7, 0.35],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.circle
                cx="105"
                cy="112"
                r="3.5"
                fill={`hsla(${dominantHue}, 75%, 80%, 0.6)`}
                animate={{ y: [-4, 4, -4], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.circle
                cx="135"
                cy="98"
                r="2.5"
                fill={`hsla(${dominantHue}, 75%, 80%, 0.5)`}
                animate={{ y: [3, -5, 3], opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </g>
          )}

          {/* ── Layer 6: Prismatic Specular Glass Flare ── */}
          <path
            d="M 68,72 A 74,74 0 0,1 155,54"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeOpacity="0.5"
            strokeLinecap="round"
          />
          <path
            d="M 64,84 A 74,74 0 0,1 92,62"
            fill="none"
            stroke="#D8BD7A"
            strokeWidth="0.9"
            strokeOpacity="0.35"
            strokeLinecap="round"
          />

          {/* ── Layer 7: Character Refraction Halo (Stage 7) ── */}
          {hasCharacter && (
            <circle
              cx="120"
              cy="120"
              r="76"
              fill="none"
              stroke={`hsla(${dominantHue}, 60%, 75%, 0.4)`}
              strokeWidth="0.6"
              strokeDasharray="1.5 5"
            />
          )}

          {/* ── Layer 8: Alchemical Keystone Monogram Seal (Stage 8) ── */}
          {hasKeystone ? (
            <g className="transition-all duration-700">
              <circle
                cx="120"
                cy="120"
                r="18"
                fill="rgba(11, 11, 10, 0.85)"
                stroke="#D8BD7A"
                strokeWidth="1.2"
              />
              <text
                x="120"
                y="124"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#F3EFE6"
                fontSize="10"
                fontFamily="serif"
                letterSpacing="0.2em"
                className="font-display font-light"
              >
                D
              </text>
              <circle
                cx="120"
                cy="120"
                r="22"
                fill="none"
                stroke="#C6A15B"
                strokeWidth="0.5"
                strokeDasharray="2 3"
              />
            </g>
          ) : (
            /* Subtle center distillation focal pip */
            <motion.circle
              cx="120"
              cy="120"
              r="2"
              fill="#D8BD7A"
              animate={{
                opacity: [0.4, 0.85, 0.4],
                scale: [0.95, 1.15, 0.95],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ originX: '120px', originY: '120px' }}
            />
          )}
        </svg>

        {/* Floating Coordinates Metadata Tag */}
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2 whitespace-nowrap pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="text-[9px] uppercase tracking-[0.25em] font-mono text-stone/70">
            {hasKeystone
              ? 'PROFILE SYNTHESIZED'
              : `SPIRIT DNA · STAGE 0${currentStep + 1} (${answeredCount}/${totalStages})`}
          </span>
        </div>
      </motion.div>
    </div>
  )
}
