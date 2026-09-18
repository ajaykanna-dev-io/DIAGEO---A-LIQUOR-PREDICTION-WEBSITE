import { motion } from 'framer-motion'
import { spiritOptions, SpiritOption } from '../../data/discoveryStages'

interface SpiritSelectionProps {
  selectedId?: string
  onSelect: (option: SpiritOption) => void
  onHoverSpirit?: (ambientHue?: number) => void
}

/**
 * SpiritSelection (Stage 05)
 * Typographic spirit worlds with live ambient lighting reaction.
 * Replaces ordinary cards with high-contrast luxury serif titles, evocative terroir origins,
 * and dark editorial photography that shifts the room's atmosphere on hover.
 */
export default function SpiritSelection({
  selectedId,
  onSelect,
  onHoverSpirit,
}: SpiritSelectionProps) {
  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {spiritOptions.map((option, idx) => {
        const isSelected = selectedId === option.id

        return (
          <motion.button
            key={option.id}
            type="button"
            onClick={() => {
              onSelect(option)
              onHoverSpirit?.(option.ambientHue)
            }}
            onMouseEnter={() => onHoverSpirit?.(option.ambientHue)}
            onMouseLeave={() => onHoverSpirit?.(undefined)}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
            aria-pressed={isSelected}
            className={`group relative flex flex-col justify-between text-left h-[260px] sm:h-[300px] rounded-sm overflow-hidden p-6 cursor-pointer border transition-all duration-500 outline-none focus-visible:ring-1 focus-visible:ring-gold ${
              isSelected
                ? 'shadow-[0_0_35px_rgba(198,161,91,0.25)] ring-1'
                : 'border-white/10 hover:shadow-[0_0_25px_rgba(198,161,91,0.12)]'
            }`}
            style={{
              borderColor: isSelected ? option.accentColor : undefined,
              boxShadow: isSelected ? `0 0 30px ${option.accentColor}33` : undefined,
            }}
          >
            {/* Background Editorial Terroir Image */}
            <div className="absolute inset-0 z-0 bg-[#0c0b0a] overflow-hidden">
              <img
                src={option.image}
                alt={option.name}
                loading="lazy"
                className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
                  isSelected
                    ? 'scale-105 brightness-105 contrast-110'
                    : 'scale-100 group-hover:scale-[1.03] brightness-65 group-hover:brightness-90 contrast-115'
                }`}
              />
            </div>

            {/* Layered Cinematic Vignette */}
            <div
              className="absolute inset-0 z-1 pointer-events-none bg-gradient-to-t from-[#080807] via-[#080807]/70 to-[#080807]/30"
              aria-hidden="true"
            />
            <div
              className={`absolute inset-0 z-1 pointer-events-none transition-opacity duration-700 ${
                isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
              style={{
                background: `radial-gradient(ellipse at bottom right, ${option.accentColor}25 0%, transparent 70%)`,
              }}
              aria-hidden="true"
            />

            {/* Top Bar: Terroir Sub-label & Pip */}
            <div className="relative z-10 flex items-center justify-between w-full">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-stone/50">
                {option.heritage}
              </span>
              <div
                className="w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300"
                style={{
                  borderColor: isSelected ? option.accentColor : 'rgba(255,255,255,0.2)',
                  backgroundColor: isSelected ? option.accentColor : 'transparent',
                  color: isSelected ? '#080807' : 'transparent',
                }}
              >
                <span className="text-[9px] leading-none font-bold">✦</span>
              </div>
            </div>

            {/* Bottom Content: High-Contrast Monumental Spirit Typography */}
            <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-1">
              <h2
                className="font-serif text-3xl sm:text-4xl font-normal tracking-wide leading-none mb-2 transition-colors duration-300"
                style={{
                  color: isSelected ? '#FAF7F2' : '#EAE6DF',
                }}
              >
                {option.name}
              </h2>
              <p className="text-xs text-stone/45 font-sans leading-relaxed line-clamp-2">
                {option.tagline}
              </p>
            </div>

            {/* Bottom Color Accent Hairline */}
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-500"
              style={{
                backgroundColor: option.accentColor,
                opacity: isSelected ? 1 : 0,
              }}
            />
          </motion.button>
        )
      })}
    </div>
  )
}
