import { forwardRef } from 'react'
import { motion } from 'framer-motion'

export interface TastingCardData {
  id: string
  label: string
  subtitle?: string
  image: string
  badge?: string
  accentHue?: number
  accentColor?: string
}

interface TastingCardProps {
  card: TastingCardData
  index: number
  totalCards: number
  isSelected: boolean
  isDimmed: boolean
  disabled: boolean
  onClick: () => void
}

/**
 * TastingCard
 * Collector's Tasting Card designed with tactile luxury materials:
 * - Deep obsidian frame with subtle inner vignette
 * - Thin champagne border with corner refinements
 * - High-contrast editorial typography and sensory micro-labels
 * - Restrained hover elevation and spotlight selection state
 */
const TastingCard = forwardRef<HTMLButtonElement, TastingCardProps>(
  ({ card, index, isSelected, isDimmed, disabled, onClick }, ref) => {
    return (
      <motion.button
        ref={ref}
        type="button"
        onClick={onClick}
        disabled={disabled}
        whileHover={
          !disabled && !isSelected
            ? {
                y: -4,
                scale: 1.018,
                transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
              }
            : undefined
        }
        aria-pressed={isSelected}
        className={`group relative flex flex-col justify-between text-left rounded-sm overflow-hidden cursor-pointer select-none transition-all duration-500 outline-none focus-visible:ring-1 focus-visible:ring-gold shrink-0 ${
          /* Strictly horizontal row card sizing: fits effortlessly within fixed 100svh viewport */
          'w-[220px] sm:w-[240px] md:w-[250px] lg:w-[260px] h-[300px] sm:h-[320px] md:h-[340px] lg:h-[355px]'
        } ${
          isSelected
            ? 'z-30 border-[#C6A15B] shadow-[0_0_35px_rgba(198,161,91,0.35),0_20px_50px_rgba(0,0,0,0.9)] ring-1 ring-[#C6A15B]/50'
            : isDimmed
            ? 'opacity-30 border-white/5 scale-[0.97] pointer-events-none'
            : 'border-white/10 hover:border-[#C6A15B]/60 shadow-[0_15px_35px_rgba(0,0,0,0.7)] hover:shadow-[0_0_25px_rgba(198,161,91,0.15)]'
        } bg-[#0c0b0a] border`}
        style={{
          borderColor: isSelected && card.accentColor ? card.accentColor : undefined,
        }}
      >
        {/* Background Editorial Image with Restrained Zoom */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#090807]">
          <img
            src={card.image}
            alt={card.label}
            loading={index === 0 ? 'eager' : 'lazy'}
            className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
              isSelected
                ? 'scale-105 brightness-105 contrast-110'
                : 'scale-100 group-hover:scale-[1.03] brightness-75 group-hover:brightness-95 contrast-110'
            }`}
          />
        </div>

        {/* Cinematic Vignette Layers */}
        <div
          className="absolute inset-0 z-1 pointer-events-none bg-gradient-to-t from-[#080807] via-[#080807]/60 to-[#080807]/20 opacity-90 transition-opacity duration-500 group-hover:opacity-80"
          aria-hidden="true"
        />
        <div
          className={`absolute inset-0 z-1 pointer-events-none transition-opacity duration-700 ${
            isSelected
              ? 'bg-[radial-gradient(ellipse_at_bottom,rgba(198,161,91,0.3)_0%,transparent_70%)] opacity-100'
              : 'bg-[radial-gradient(ellipse_at_bottom,rgba(198,161,91,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-100'
          }`}
          aria-hidden="true"
        />

        {/* Top Bar: Card Number & Sensory Badge / Check Pip */}
        <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-stone/40 uppercase">
              0{index + 1}
            </span>
            {card.badge && (
              <span className="text-[8px] font-mono tracking-[0.2em] uppercase text-gold-light/90 bg-[#080807]/70 px-1.5 py-0.5 rounded-xs border border-white/5">
                {card.badge}
              </span>
            )}
          </div>

          <div
            className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300 ${
              isSelected
                ? 'border-[#C6A15B] bg-[#C6A15B] text-[#080807] shadow-[0_0_10px_#C6A15B]'
                : 'border-white/20 group-hover:border-[#C6A15B]/60 text-transparent'
            }`}
          >
            <span className="text-[9px] leading-none font-bold">✦</span>
          </div>
        </div>

        {/* Bottom Content: Title & Nuanced Subtitle */}
        <div className="relative z-10 p-4 sm:p-5 pt-0 transition-transform duration-500 group-hover:-translate-y-1">
          <h3
            className={`font-serif text-lg sm:text-xl md:text-2xl font-normal leading-snug mb-1 transition-colors duration-300 ${
              isSelected ? 'text-[#FAF7F2]' : 'text-[#EAE6DF] group-hover:text-[#FAF7F2]'
            }`}
          >
            {card.label}
          </h3>

          {card.subtitle && (
            <p className="text-[11px] sm:text-xs text-stone/60 font-sans leading-relaxed line-clamp-2">
              {card.subtitle}
            </p>
          )}

          {isSelected && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2.5 flex items-center gap-1.5 font-mono text-[9px] tracking-[0.25em] uppercase text-gold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span>Taste Captured</span>
            </motion.div>
          )}
        </div>

        {/* Bottom Edge Gold Accent */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-0.5 transition-opacity duration-500 ${
            isSelected ? 'opacity-100 bg-[#C6A15B]' : 'opacity-0 group-hover:opacity-60 bg-[#C6A15B]/60'
          }`}
        />
      </motion.button>
    )
  }
)

TastingCard.displayName = 'TastingCard'
export default TastingCard
