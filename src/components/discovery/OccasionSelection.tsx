import { motion } from 'framer-motion'
import { occasionOptions, OccasionOption } from '../../data/discoveryStages'

interface OccasionSelectionProps {
  selectedId?: string
  onSelect: (option: OccasionOption) => void
}

/**
 * OccasionSelection (Stage 03)
 * Editorial lifestyle cards capturing specific private moments, from quiet fireside evenings
 * to grand milestone celebrations and salon digestifs.
 */
export default function OccasionSelection({ selectedId, onSelect }: OccasionSelectionProps) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* 5-card layout: 3 on top, 2 on bottom centered, or responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-4 sm:mb-5">
        {occasionOptions.slice(0, 3).map((option, idx) => (
          <OccasionCard
            key={option.id}
            option={option}
            index={idx}
            isSelected={selectedId === option.id}
            onSelect={onSelect}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-3xl mx-auto">
        {occasionOptions.slice(3, 5).map((option, idx) => (
          <OccasionCard
            key={option.id}
            option={option}
            index={idx + 3}
            isSelected={selectedId === option.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}

function OccasionCard({
  option,
  index,
  isSelected,
  onSelect,
}: {
  option: OccasionOption
  index: number
  isSelected: boolean
  onSelect: (option: OccasionOption) => void
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(option)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      aria-pressed={isSelected}
      className={`group relative flex flex-col justify-between text-left h-[210px] sm:h-[230px] rounded-sm overflow-hidden p-5 cursor-pointer border transition-all duration-500 outline-none focus-visible:ring-1 focus-visible:ring-gold ${
        isSelected
          ? 'border-[#C6A15B] shadow-[0_0_24px_rgba(198,161,91,0.25)] ring-1 ring-[#C6A15B]/50'
          : 'border-white/10 hover:border-[#C6A15B]/50 hover:shadow-[0_0_18px_rgba(198,161,91,0.1)]'
      }`}
    >
      {/* Background Lifestyle Image */}
      <div className="absolute inset-0 z-0 bg-[#0a0a09] overflow-hidden">
        <img
          src={option.image}
          alt={option.label}
          loading="lazy"
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
            isSelected
              ? 'scale-105 brightness-100 contrast-110'
              : 'scale-100 group-hover:scale-[1.03] brightness-70 group-hover:brightness-90 contrast-110'
          }`}
        />
      </div>

      {/* Cinematic Gradient Vignette */}
      <div
        className="absolute inset-0 z-1 pointer-events-none bg-gradient-to-t from-[#080807] via-[#080807]/70 to-[#080807]/25"
        aria-hidden="true"
      />
      <div
        className={`absolute inset-0 z-1 pointer-events-none transition-opacity duration-500 ${
          isSelected
            ? 'bg-gradient-to-tr from-[#C6A15B]/20 via-transparent to-transparent opacity-100'
            : 'bg-gradient-to-tr from-[#C6A15B]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100'
        }`}
        aria-hidden="true"
      />

      {/* Top Setting Badge */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-stone/50 bg-[#080807]/70 px-2 py-0.5 rounded-xs border border-white/5">
          {option.setting}
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

      {/* Bottom Content: Title & Setting Subtitle */}
      <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-0.5">
        <h2
          className={`font-serif text-xl font-normal leading-snug mb-1 transition-colors duration-300 ${
            isSelected ? 'text-[#FAF7F2]' : 'text-[#EAE6DF] group-hover:text-[#FAF7F2]'
          }`}
        >
          {option.label}
        </h2>
        <p className="text-[11px] text-stone/50 font-sans line-clamp-1">
          {option.subtitle}
        </p>
      </div>
    </motion.button>
  )
}
