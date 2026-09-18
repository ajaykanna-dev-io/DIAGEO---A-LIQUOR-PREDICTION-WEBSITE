import { useRef, useState, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { QuestionOption } from '@/types'

interface SensoryObjectProps {
  option: QuestionOption
  selected: boolean
  onSelect: (e: React.MouseEvent<HTMLElement>) => void
  disabled?: boolean
  index?: number
  className?: string
}

/**
 * SensoryObject
 * Replaces generic 2x2 quiz cards with physical, tactile luxury vessels
 * (crystal flacons, amber beakers, botanical flasks, peat chalices, bronze instruments).
 * Includes 3D parallax tilt, dynamic light sweep, liquid physics reaction,
 * and sommelier tasting note reveal on proximity/hover.
 */
export default function SensoryObject({
  option,
  selected,
  onSelect,
  disabled = false,
  index = 0,
  className = '',
}: SensoryObjectProps) {
  const reduceMotion = useReducedMotion()
  const containerRef = useRef<HTMLButtonElement | null>(null)

  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  // 3D Parallax tilt & directional light tracking
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (reduceMotion || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const relX = (e.clientX - rect.left) / rect.width
      const relY = (e.clientY - rect.top) / rect.height

      // Smooth tilt limits: max ±10 degrees
      setTilt({
        x: (relY - 0.5) * -14,
        y: (relX - 0.5) * 14,
      })

      // Glare follows cursor coordinates
      setGlarePos({
        x: relX * 100,
        y: relY * 100,
      })
    },
    [reduceMotion]
  )

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
    setGlarePos({ x: 50, y: 50 })
  }, [])

  return (
    <motion.button
      ref={containerRef}
      type="button"
      disabled={disabled}
      onClick={(e) => onSelect(e)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileTap={{ scale: 0.98 }}
      aria-pressed={selected}
      className={`group relative flex flex-col items-center justify-between text-center overflow-hidden rounded-md border p-3.5 sm:p-4 h-full w-full transition-all duration-500 ease-out cursor-pointer ${
        selected
          ? 'bg-[#181613] border-gold/80 shadow-[0_0_30px_rgba(198,161,91,0.22),0_10px_25px_rgba(0,0,0,0.7)]'
          : 'bg-[#100F0D]/85 border-stone/15 hover:border-gold/40 hover:bg-[#141311] hover:shadow-[0_10px_25px_rgba(0,0,0,0.5),0_0_20px_rgba(198,161,91,0.06)]'
      } ${className}`}
      style={{
        transform:
          isHovered && !reduceMotion
            ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-2px)`
            : selected
            ? 'translateY(-1px)'
            : undefined,
        transformStyle: 'preserve-3d',
        transition: isHovered
          ? 'transform 0.15s ease-out, border-color 0.4s, background-color 0.4s'
          : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s, background-color 0.4s',
      }}
    >
      {/* ── Internal Ambient Aura ── */}
      <div
        className="pointer-events-none absolute inset-0 rounded-md transition-opacity duration-700"
        style={{
          opacity: selected ? 0.25 : isHovered ? 0.15 : 0.05,
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, hsl(${option.hue}, 60%, 45%) 0%, transparent 68%)`,
        }}
        aria-hidden="true"
      />

      {/* ── Directional Specular Light Glare (Follows Cursor) ── */}
      {isHovered && !reduceMotion && (
        <div
          className="pointer-events-none absolute inset-0 rounded-md opacity-35 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.12) 0%, transparent 50%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* ── Top Indicator Circle (Matching Reference Image) ── */}
      <div className="relative z-10 w-full flex items-center justify-end h-4">
        {selected ? (
          <div className="w-2.5 h-2.5 rounded-full bg-[#FAF7F2] shadow-[0_0_10px_#FAF7F2]" />
        ) : (
          <div className="w-2.5 h-2.5 rounded-full border border-stone/30 group-hover:border-stone/50 transition-colors" />
        )}
      </div>

      {/* ── Central Tactile Sensory Vessel Illustration ── */}
      <div
        className="relative z-10 my-1 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center pointer-events-none"
        style={{ transform: 'translateZ(16px)' }}
      >
        <VesselGraphic
          type={option.objectType}
          hue={option.hue}
          selected={selected}
          isHovered={isHovered}
        />
      </div>

      {/* ── Sensory Option Typography (Consistent Vertical Blocks) ── */}
      <div
        className="relative z-10 w-full flex flex-col items-center"
        style={{ transform: 'translateZ(10px)' }}
      >
        {/* Primary Option Label */}
        <h3 className="font-display font-light text-lg sm:text-xl text-ivory tracking-wide leading-tight">
          {option.label}
        </h3>

        {/* Caption / Mood */}
        <p className="text-[11px] text-gold-light/90 font-mono tracking-wider mt-0.5">
          {option.caption}
        </p>

        {/* Sensory Descriptor (Poetic Sommelier Note — Fixed 2-Line Height) ── */}
        <p className="text-[11px] text-stone/75 line-clamp-2 max-w-[220px] font-sans leading-relaxed mt-1.5 text-center min-h-[34px] transition-colors duration-300 group-hover:text-stone/90">
          {option.sensoryDescriptor}
        </p>

        {/* Granular Tasting Note Chips (Aligned Bottom Row) ── */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
          {option.tastingNotes.slice(0, 3).map((note) => (
            <span
              key={note}
              className="text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-sm bg-[#161412]/95 border border-stone/20 text-stone/80"
            >
              {note}
            </span>
          ))}
        </div>
      </div>

      {/* ── Selected Affirmation Halo ── */}
      {selected && (
        <div
          className="pointer-events-none absolute inset-0 rounded-md border border-gold shadow-[inset_0_0_15px_rgba(198,161,91,0.18)]"
        />
      )}
    </motion.button>
  )
}

/**
 * VesselGraphic
 * Procedural SVG representations of luxury tasting instruments:
 * crystal flacon, amber vessel, botanical flask, peat chalice, bronze pipette, obsidian beaker, fluted glass.
 */
function VesselGraphic({
  type,
  hue,
  selected,
  isHovered,
}: {
  type: QuestionOption['objectType']
  hue: number
  selected: boolean
  isHovered: boolean
}) {
  const glowOpacity = selected ? 0.8 : isHovered ? 0.5 : 0.2

  switch (type) {
    case 'crystal-flacon':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          {/* Ambient back glow */}
          <ellipse
            cx="50"
            cy="52"
            rx="32"
            ry="36"
            fill={`hsla(${hue}, 65%, 60%, ${glowOpacity * 0.25})`}
          />
          {/* Stopper */}
          <polygon
            points="46,12 54,12 56,22 44,22"
            fill="#FFFFFF"
            fillOpacity="0.8"
            stroke="#C6A15B"
            strokeWidth="0.8"
          />
          <circle cx="50" cy="10" r="3" fill="#D8BD7A" />
          {/* Neck */}
          <rect
            x="45"
            y="22"
            width="10"
            height="10"
            fill="none"
            stroke="#D8BD7A"
            strokeWidth="1"
          />
          {/* Fluted Crystal Body */}
          <polygon
            points="32,40 68,40 76,82 24,82"
            fill="rgba(255,255,255,0.06)"
            stroke="#C6A15B"
            strokeWidth="1.2"
          />
          {/* Internal Liquid */}
          <polygon
            points="28,58 72,58 75,80 25,80"
            fill={`hsla(${hue}, 55%, 45%, 0.45)`}
          />
          {/* Facet Reflection Cuts */}
          <line
            x1="42"
            y1="40"
            x2="38"
            y2="82"
            stroke="#FFFFFF"
            strokeWidth="0.75"
            strokeOpacity="0.4"
          />
          <line
            x1="50"
            y1="40"
            x2="50"
            y2="82"
            stroke="#FFFFFF"
            strokeWidth="0.9"
            strokeOpacity="0.6"
          />
          <line
            x1="58"
            y1="40"
            x2="62"
            y2="82"
            stroke="#FFFFFF"
            strokeWidth="0.75"
            strokeOpacity="0.4"
          />
          {/* Pedestal Base */}
          <rect
            x="20"
            y="82"
            width="60"
            height="4"
            fill="#C6A15B"
            fillOpacity="0.4"
          />
        </svg>
      )

    case 'amber-vessel':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <circle
            cx="50"
            cy="55"
            r="35"
            fill={`hsla(${hue}, 70%, 50%, ${glowOpacity * 0.3})`}
          />
          {/* Heavy Rounded Amber Flask */}
          <path
            d="M 45,22 L 55,22 L 55,34 C 68,42 74,54 74,68 C 74,80 63,88 50,88 C 37,88 26,80 26,68 C 26,54 32,42 45,34 Z"
            fill={`hsla(${hue}, 50%, 25%, 0.45)`}
            stroke="#C6A15B"
            strokeWidth="1.2"
          />
          {/* Warm Amber Liquid Core */}
          <ellipse
            cx="50"
            cy="68"
            rx="20"
            ry="15"
            fill={`hsla(${hue}, 65%, 42%, 0.7)`}
          />
          {/* Specular Highlight Arc */}
          <path
            d="M 34,50 A 24,24 0 0,1 46,38"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeOpacity="0.6"
            strokeLinecap="round"
          />
          <circle cx="50" cy="20" r="4" fill="#9C7A4E" />
        </svg>
      )

    case 'botanical-flask':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <circle
            cx="50"
            cy="58"
            r="32"
            fill={`hsla(${hue}, 60%, 55%, ${glowOpacity * 0.25})`}
          />
          {/* Conical Erlenmeyer Glass */}
          <polygon
            points="46,24 54,24 76,82 24,82"
            fill="rgba(255,255,255,0.05)"
            stroke="#C6A15B"
            strokeWidth="1.2"
          />
          {/* Liquid */}
          <polygon
            points="34,60 66,60 74,80 26,80"
            fill={`hsla(${hue}, 50%, 45%, 0.4)`}
          />
          {/* Suspended Botanical Sprig */}
          <path
            d="M 50,78 Q 48,64 54,54"
            fill="none"
            stroke="#F3EFE6"
            strokeWidth="1"
            strokeOpacity="0.8"
          />
          <circle cx="54" cy="54" r="2.5" fill="#D8BD7A" />
          <circle cx="48" cy="62" r="2" fill="#D8BD7A" />
          <circle cx="53" cy="70" r="1.8" fill="#D8BD7A" />
          {/* Glass Rim */}
          <line
            x1="43"
            y1="24"
            x2="57"
            y2="24"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />
        </svg>
      )

    case 'peat-chalice':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          {/* Fiery Peat Smolder Aura */}
          <circle
            cx="50"
            cy="46"
            r="30"
            fill={`hsla(${hue}, 75%, 45%, ${glowOpacity * 0.35})`}
          />
          {/* Smoked Peat Vapor Wisp */}
          <path
            d="M 50,28 Q 44,18 52,10 T 48,2"
            fill="none"
            stroke="#D8BD7A"
            strokeWidth="1.2"
            strokeOpacity={isHovered ? 0.8 : 0.4}
            strokeDasharray="2 3"
          />
          {/* Dark Basalt Goblet Bowl */}
          <path
            d="M 28,30 Q 50,56 72,30 L 68,54 Q 50,74 32,54 Z"
            fill="rgba(24, 23, 20, 0.9)"
            stroke="#C6A15B"
            strokeWidth="1.2"
          />
          {/* Glowing Coal / Ember Interior */}
          <ellipse
            cx="50"
            cy="36"
            rx="16"
            ry="6"
            fill={`hsla(${hue}, 80%, 48%, 0.7)`}
          />
          {/* Stem & Heavy Base */}
          <rect x="48" y="70" width="4" height="14" fill="#9C7A4E" />
          <polygon points="34,88 66,88 62,84 38,84" fill="#C6A15B" />
        </svg>
      )

    case 'bronze-instrument':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <circle
            cx="50"
            cy="50"
            r="32"
            fill={`hsla(${hue}, 60%, 50%, ${glowOpacity * 0.25})`}
          />
          {/* Alchemical Pipette / Tasting Thimble */}
          {/* Top Pipette Bulb */}
          <circle cx="50" cy="18" r="7" fill="#C6A15B" fillOpacity="0.8" />
          {/* Vertical Shaft */}
          <rect
            x="48"
            y="25"
            width="4"
            height="46"
            fill="#D8BD7A"
            stroke="#9C7A4E"
            strokeWidth="0.6"
          />
          {/* Calibration notches */}
          <line x1="46" y1="36" x2="50" y2="36" stroke="#121110" strokeWidth="1" />
          <line x1="46" y1="44" x2="50" y2="44" stroke="#121110" strokeWidth="1" />
          <line x1="46" y1="52" x2="50" y2="52" stroke="#121110" strokeWidth="1" />
          {/* Suspended Spirit Droplet */}
          <path
            d="M 50,75 C 47,79 46,82 46,84 C 46,87 48,89 50,89 C 52,89 54,87 54,84 C 54,82 53,79 50,75 Z"
            fill={`hsla(${hue}, 70%, 55%, 0.9)`}
          />
        </svg>
      )

    case 'obsidian-beaker':
    default:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <circle
            cx="50"
            cy="56"
            r="32"
            fill={`hsla(${hue}, 60%, 50%, ${glowOpacity * 0.25})`}
          />
          {/* Brutalist Chiseled Obsidian Facets */}
          <polygon
            points="30,30 70,30 64,84 36,84"
            fill="rgba(18, 17, 16, 0.9)"
            stroke="#C6A15B"
            strokeWidth="1.2"
          />
          {/* Internal Luminous Well */}
          <polygon
            points="38,50 62,50 60,80 40,80"
            fill={`hsla(${hue}, 60%, 42%, 0.5)`}
          />
          {/* Sharp Chiseled Surface Line */}
          <line
            x1="50"
            y1="30"
            x2="48"
            y2="84"
            stroke="#FFFFFF"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />
          {/* Top Beveled Rim */}
          <polygon
            points="28,30 72,30 70,26 30,26"
            fill="#C6A15B"
            fillOpacity="0.5"
          />
        </svg>
      )
  }
}
