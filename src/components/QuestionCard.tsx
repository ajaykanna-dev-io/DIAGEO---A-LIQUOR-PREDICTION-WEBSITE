import { useState, useRef, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { QuestionOption } from '@/types'

interface QuestionCardProps {
  option: QuestionOption
  selected: boolean
  onSelect: () => void
  hue: number
  /** Stagger delay for sequential card entrance */
  delay?: number
}

// Sensory descriptors mapped to option characteristics
const sensoryDescriptors: Record<string, string> = {
  refined: '✦ Velvet & Wood',
  vibrant: '⚡ Zest & Glow',
  adventurous: '◈ Spice & Ember',
  relaxed: '○ Honey & Silk',
  silk: '○ Cashmere Texture',
  bold: '◈ Assertive Oak',
  bright: '✦ Citrus Blossom',
  smoky: '▲ Peat Smoke',
  sweet: '○ Rich Caramel',
  spiced: '◈ Clove & Cinnamon',
  'smoky-flavor': '▲ Elemental Peat',
  fresh: '✦ Crisp Botanical',
  classic: '○ Time-Honored',
  curious: '✦ Layered Nuance',
  'adventurous-palate': '◈ Complex Cask',
  fearless: '▲ Deep Cask Strength',
  light: '○ Gentle & Clean',
  balanced: '✦ Poised Harmony',
  rich: '◈ Heavy Single Cask',
  intense: '▲ Pure Peat & Fire',
  celebration: '✦ Toast & Spark',
  solitude: '○ Private Sanctuary',
  conversation: '◈ Unhurried Dialogue',
  unwinding: '○ Sunset Release',
  neat: '✦ Pure Glass',
  water: '○ Opened Layers',
  ice: '◈ Chilled Rock',
  cocktail: '✦ Crafted Serve',
  'quiet-evening': '○ Private Sanctuary',
  dinner: '◈ Curated Pairing',
  'late-night': '▲ Midnight Reserve',
  warm: '○ Inviting Warmth',
  mysterious: '◈ Shadow & Depth',
  elegant: '✦ Precise Grace',
  energetic: '⚡ Living Energy',
  'smoothness-priority': '○ Effortless Pour',
  'complexity-priority': '◈ Infinite Layers',
  'character-priority': '▲ Bold Identity',
  'depth-priority': '✦ Hidden Depths',
}

export default function QuestionCard({
  option,
  selected,
  onSelect,
  hue,
  delay = 0,
}: QuestionCardProps) {
  const reduceMotion = useReducedMotion()
  const sensoryTag = sensoryDescriptors[option.id] || '✦ Sensory Note'
  const cardRef = useRef<HTMLButtonElement>(null)

  // Parallax tilt state
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glare, setGlare] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  // Ripple state
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const rippleCounter = useRef(0)

  // Mouse tracking for parallax tilt
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (reduceMotion || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    // Tilt range: ±6 degrees
    setTilt({
      x: (y - 0.5) * -12,
      y: (x - 0.5) * 12,
    })
    // Glare follows cursor
    setGlare({ x: x * 100, y: y * 100 })
  }, [reduceMotion])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
    setGlare({ x: 50, y: 50 })
  }, [])

  // Click handler with ripple
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const id = ++rippleCounter.current
        setRipples((prev) => [...prev, { id, x, y }])
        // Clean up ripple after animation
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id))
        }, 800)
      }
      onSelect()
    },
    [onSelect]
  )

  return (
    <motion.button
      ref={cardRef}
      type="button"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={reduceMotion ? undefined : { opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.985 }}
      aria-pressed={selected}
      className={`parallax-card group relative flex flex-col justify-between overflow-hidden border text-left
        px-4 py-3.5 sm:px-6 sm:py-5 min-h-[92px] sm:min-h-[115px] md:min-h-[130px] rounded-sm transition-all duration-500 ease-out cursor-pointer
        ${
          selected
            ? 'golden-border-trace border-gold/60 bg-surface2/95 shadow-[0_0_40px_rgba(198,161,91,0.18),0_8px_32px_rgba(0,0,0,0.4)] scale-[1.02]'
            : 'border-stone/15 bg-surface/60 hover:border-gold/35 hover:bg-surface2/50 hover:shadow-[0_12px_36px_rgba(0,0,0,0.4)]'
        }`}
      style={{
        transform: isHovered && !reduceMotion
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${selected ? 'scale(1.02)' : ''}`
          : selected
          ? 'scale(1.02)'
          : undefined,
        transition: isHovered ? 'transform 0.15s ease-out' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Ripple effects from click point */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="card-ripple"
          style={{
            left: ripple.x - 30,
            top: ripple.y - 30,
            width: 60,
            height: 60,
          }}
        />
      ))}

      {/* Sensory atmospheric radial backdrop tint — follows cursor on hover */}
      <div
        className="absolute inset-0 opacity-[0.12] transition-opacity duration-500 group-hover:opacity-[0.28] pointer-events-none rounded-sm"
        style={{
          background: isHovered
            ? `radial-gradient(circle at ${glare.x}% ${glare.y}%, hsl(${hue} 55% 35%) 0%, transparent 65%)`
            : `radial-gradient(100% 100% at 20% 0%, hsl(${hue} 55% 32%) 0%, transparent 70%)`,
          transition: 'background 0.2s ease-out, opacity 0.5s ease-out',
        }}
        aria-hidden="true"
      />

      {/* Glassmorphism overlay for selected state */}
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 pointer-events-none rounded-sm"
          style={{
            background: `linear-gradient(135deg, rgba(198,161,91,0.06) 0%, transparent 50%, rgba(198,161,91,0.04) 100%)`,
            backdropFilter: 'blur(1px)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Hover glare effect — subtle directional light */}
      {isHovered && !reduceMotion && (
        <div
          className="absolute inset-0 pointer-events-none rounded-sm transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.04) 0%, transparent 50%)`,
            opacity: 0.8,
          }}
          aria-hidden="true"
        />
      )}

      {/* Top Row: Option Title + Sensory Selection Glyph */}
      <div className="relative z-10 flex items-center justify-between gap-2.5">
        <span className="font-display font-light text-lg sm:text-xl md:text-2xl text-ivory tracking-wide">
          {option.label}
        </span>

        {/* Sensory indicator — morphs from ring to filled glowing circle on selection */}
        <div
          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-400 ${
            selected
              ? 'border-gold bg-gold text-obsidian shadow-[0_0_16px_rgba(198,161,91,0.7),0_0_32px_rgba(198,161,91,0.3)]'
              : 'border-stone/30 group-hover:border-gold/60 group-hover:shadow-[0_0_8px_rgba(198,161,91,0.15)]'
          }`}
        >
          {selected && (
            <motion.span
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-[11px] font-bold leading-none"
            >
              ✓
            </motion.span>
          )}
        </div>
      </div>

      {/* Bottom Row: Sensory Caption + Aroma Tag */}
      <div className="relative z-10 flex items-end justify-between gap-2 mt-2 pt-2 border-t border-stone/10">
        <p className="text-xs sm:text-sm text-stone/85 font-sans leading-snug">{option.caption}</p>

        <motion.span
          animate={{
            color: selected
              ? 'rgba(216, 189, 122, 1)'
              : isHovered
              ? 'rgba(216, 189, 122, 0.9)'
              : 'rgba(216, 189, 122, 0.65)',
          }}
          className="text-[10px] uppercase tracking-wider font-mono flex-shrink-0 transition-colors duration-300"
        >
          {sensoryTag}
        </motion.span>
      </div>

      {/* Bottom accent glow line — animated sweep on selection */}
      <motion.span
        animate={{
          width: selected ? '100%' : isHovered ? '33%' : '0%',
          opacity: selected ? 1 : isHovered ? 0.7 : 0,
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-gold/60 via-gold to-gold-light"
      />

      {/* Selected glow halo at bottom */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-[10%] right-[10%] h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(198,161,91,0.4), transparent)',
            boxShadow: '0 2px 20px 4px rgba(198,161,91,0.12)',
          }}
          aria-hidden="true"
        />
      )}
    </motion.button>
  )
}
