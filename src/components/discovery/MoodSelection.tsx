import { motion } from 'framer-motion'
import { moodOptions, MoodOption } from '../../data/discoveryStages'

interface MoodSelectionProps {
  selectedId?: string
  onSelect: (option: MoodOption) => void
}

/**
 * MoodSelection (Stage 01)
 * 4 tall atmospheric plinths with dark luxury imagery.
 * Hover subtly zooms and illuminates; selected state adds a refined champagne hairline.
 */
export default function MoodSelection({ selectedId, onSelect }: MoodSelectionProps) {
  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {moodOptions.map((option, idx) => {
        const isSelected = selectedId === option.id

        return (
          <motion.button
            key={option.id}
            type="button"
            onClick={() => onSelect(option)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
            aria-pressed={isSelected}
            className={`group relative flex flex-col justify-end text-left w-full h-[360px] sm:h-[420px] rounded-sm overflow-hidden p-6 cursor-pointer border transition-all duration-500 outline-none focus-visible:ring-1 focus-visible:ring-gold ${
              isSelected
                ? 'border-[#C6A15B] shadow-[0_0_30px_rgba(198,161,91,0.22)] ring-1 ring-[#C6A15B]/40'
                : 'border-white/10 hover:border-[#C6A15B]/50 hover:shadow-[0_0_20px_rgba(198,161,91,0.12)]'
            }`}
          >
            {/* Background Image Container with restrained zoom & brightness shift */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-[#0e0d0b]">
              <img
                src={option.image}
                alt={option.label}
                loading={idx === 0 ? 'eager' : 'lazy'}
                className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
                  isSelected
                    ? 'scale-105 brightness-105 contrast-110'
                    : 'scale-100 group-hover:scale-[1.03] brightness-80 group-hover:brightness-95 contrast-115'
                }`}
              />
            </div>

            {/* Cinematic Gradient Overlays for readable typography */}
            <div
              className="absolute inset-0 z-1 pointer-events-none bg-gradient-to-t from-[#080807] via-[#080807]/60 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-80"
              aria-hidden="true"
            />
            <div
              className={`absolute inset-0 z-1 pointer-events-none transition-opacity duration-700 ${
                isSelected
                  ? 'bg-[radial-gradient(ellipse_at_bottom,rgba(198,161,91,0.25)_0%,transparent_70%)] opacity-100'
                  : 'bg-[radial-gradient(ellipse_at_bottom,rgba(198,161,91,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-100'
              }`}
              aria-hidden="true"
            />

            {/* Top Indicator / Index */}
            <div className="relative z-10 mb-auto flex items-center justify-between w-full">
              <span className="text-[10px] font-mono tracking-widest text-stone/40 uppercase">
                0{idx + 1}
              </span>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  isSelected
                    ? 'border-[#C6A15B] bg-[#C6A15B] text-[#080807]'
                    : 'border-white/20 group-hover:border-[#C6A15B]/60 text-transparent'
                }`}
              >
                <span className="text-[9px] leading-none">✦</span>
              </div>
            </div>

            {/* Bottom Content & Typography */}
            <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-1">
              <h2
                className={`font-serif text-xl sm:text-2xl font-normal leading-snug mb-1.5 transition-colors duration-300 ${
                  isSelected ? 'text-[#FAF7F2]' : 'text-[#EAE6DF] group-hover:text-[#FAF7F2]'
                }`}
              >
                {option.label}
              </h2>
              <p className="text-[11px] sm:text-xs text-stone/60 font-sans leading-relaxed line-clamp-2">
                {option.subtitle}
              </p>
            </div>

            {/* Subtle Gold Edge Accent on Selection */}
            {isSelected && (
              <motion.div
                layoutId="mood-active-border"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C6A15B]"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
