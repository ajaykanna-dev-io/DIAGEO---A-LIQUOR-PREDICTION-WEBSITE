import { motion } from 'framer-motion'
import { flavourOptions, FlavourOption } from '../../data/discoveryStages'

interface FlavourSelectionProps {
  selectedId?: string
  onSelect: (option: FlavourOption) => void
}

/**
 * FlavourSelection (Stage 02)
 * Sensory ingredient-inspired interactive tiles arranged in a balanced 3x2 grid.
 * Features sensory tasting notes, dark macro imagery, and warm champagne highlights.
 */
export default function FlavourSelection({ selectedId, onSelect }: FlavourSelectionProps) {
  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {flavourOptions.map((option, idx) => {
        const isSelected = selectedId === option.id

        return (
          <motion.button
            key={option.id}
            type="button"
            onClick={() => onSelect(option)}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
            aria-pressed={isSelected}
            className={`group relative flex flex-col justify-between text-left h-[200px] sm:h-[220px] rounded-sm overflow-hidden p-5 cursor-pointer border transition-all duration-500 outline-none focus-visible:ring-1 focus-visible:ring-gold ${
              isSelected
                ? 'border-[#C6A15B] shadow-[0_0_24px_rgba(198,161,91,0.22)] ring-1 ring-[#C6A15B]/50'
                : 'border-white/10 hover:border-[#C6A15B]/50 hover:shadow-[0_0_18px_rgba(198,161,91,0.1)]'
            }`}
          >
            {/* Background Texture & Sensory Ingredient Image */}
            <div className="absolute inset-0 z-0 bg-[#0c0b0a] overflow-hidden">
              <img
                src={option.image}
                alt={option.label}
                loading="lazy"
                className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
                  isSelected
                    ? 'scale-105 brightness-100 contrast-110'
                    : 'scale-100 group-hover:scale-[1.03] brightness-70 group-hover:brightness-90 contrast-115'
                }`}
              />
            </div>

            {/* Gradient Overlays */}
            <div
              className="absolute inset-0 z-1 pointer-events-none bg-gradient-to-t from-[#080807] via-[#080807]/75 to-[#080807]/30"
              aria-hidden="true"
            />
            <div
              className={`absolute inset-0 z-1 pointer-events-none transition-opacity duration-500 ${
                isSelected
                  ? 'bg-gradient-to-br from-[#C6A15B]/20 via-transparent to-[#080807]/80 opacity-100'
                  : 'bg-gradient-to-br from-[#C6A15B]/10 via-transparent to-[#080807]/80 opacity-0 group-hover:opacity-100'
              }`}
              aria-hidden="true"
            />

            {/* Top Bar: Sensory Note Tag & Selector Pip */}
            <div className="relative z-10 flex items-center justify-between w-full">
              <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-gold-light/80 bg-[#080807]/60 px-2 py-0.5 rounded-xs border border-white/5">
                PALATE NOTE
              </span>
              <div
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  isSelected
                    ? 'border-[#C6A15B] bg-[#C6A15B] text-[#080807]'
                    : 'border-white/20 group-hover:border-[#C6A15B]/60 text-transparent'
                }`}
              >
                <span className="text-[8px] leading-none">✦</span>
              </div>
            </div>

            {/* Bottom Content: Title & Tasting Notes */}
            <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-0.5">
              <h2
                className={`font-serif text-xl font-normal leading-tight mb-1 transition-colors duration-300 ${
                  isSelected ? 'text-[#FAF7F2]' : 'text-[#EAE6DF] group-hover:text-[#FAF7F2]'
                }`}
              >
                {option.label}
              </h2>
              <p className="text-[11px] font-mono text-gold-light/80 mb-1 tracking-wider uppercase">
                {option.subtitle}
              </p>
              <p className="text-[11px] text-stone/50 font-sans italic line-clamp-1">
                "{option.tastingNote}"
              </p>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
