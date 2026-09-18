import { motion } from 'framer-motion'

interface TastingDeckArcProps {
  isActive?: boolean
  selectedCardRect?: DOMRect | null
  isCardCentered?: boolean
  currentStageNumber?: number
  totalStages?: number
}

/**
 * TastingDeckArc
 * The bottom-center visual anchor representing "DIAGEO — THE TASTING DECK".
 * Features:
 * - Elegant semi-circular arc with thin champagne gold hairline
 * - Luminous center pip that breathes and flares on card emergence and return
 * - Subtle radial ambient glow
 * - Dynamic vertical golden light thread connecting selected card to deck
 */
export default function TastingDeckArc({
  isActive = false,
  selectedCardRect,
  isCardCentered = false,
  currentStageNumber = 1,
  totalStages = 5,
}: TastingDeckArcProps) {
  return (
    <div className="relative w-full flex flex-col items-center justify-end pointer-events-none select-none pb-2 sm:pb-3">
      {/* Dynamic Golden Beam connecting Selected Card to Deck */}
      {(selectedCardRect || isCardCentered) && (
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: [0, 0.95, 0.7], scaleY: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed z-40 pointer-events-none origin-top"
          style={{
            left: isCardCentered ? '50%' : `${(selectedCardRect?.left ?? 0) + (selectedCardRect?.width ?? 0) / 2}px`,
            transform: isCardCentered ? 'translateX(-50%)' : undefined,
            top: isCardCentered ? 'calc(50% + 180px)' : `${selectedCardRect?.bottom ?? 0}px`,
            width: '1.5px',
            bottom: '42px',
            background: 'linear-gradient(to bottom, rgba(198,161,91,0.9) 0%, rgba(198,161,91,0.4) 70%, #C6A15B 100%)',
            boxShadow: '0 0 14px rgba(198,161,91,0.7)',
          }}
        />
      )}

      {/* Atmospheric Radial Deck Glow */}
      <motion.div
        animate={{
          opacity: isActive ? 0.35 : 0.18,
          scale: isActive ? 1.15 : 1,
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute bottom-0 w-[420px] h-[140px] rounded-full blur-[60px]"
        style={{
          background: 'radial-gradient(ellipse at bottom, rgba(198,161,91,0.4) 0%, rgba(198,161,91,0.1) 40%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* The Architectural Deck Arc (Curved champagne hairline) */}
      <div className="relative flex flex-col items-center">
        <svg
          width="320"
          height="36"
          viewBox="0 0 320 36"
          fill="none"
          className="overflow-visible"
        >
          {/* Subtle Outer Arc Glow */}
          <path
            d="M 10 36 C 60 12, 110 4, 160 4 C 210 4, 260 12, 310 36"
            stroke="#C6A15B"
            strokeWidth="2.5"
            strokeOpacity={isActive ? '0.4' : '0.15'}
            className="filter blur-[2px] transition-all duration-500"
          />

          {/* Crisp Hairline Arc */}
          <path
            d="M 10 36 C 60 12, 110 4, 160 4 C 210 4, 260 12, 310 36"
            stroke="url(#deckArcGradient)"
            strokeWidth="1"
            strokeLinecap="round"
          />

          <defs>
            <linearGradient id="deckArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C6A15B" stopOpacity="0" />
              <stop offset="25%" stopColor="#C6A15B" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#FAF7F2" stopOpacity="0.9" />
              <stop offset="75%" stopColor="#C6A15B" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#C6A15B" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Luminous Center Deck Pip */}
        <motion.div
          animate={{
            scale: isActive ? [1, 1.6, 1.2] : [1, 1.2, 1],
            boxShadow: isActive
              ? '0 0 16px 3px rgba(198,161,91,0.9)'
              : '0 0 8px 1px rgba(198,161,91,0.5)',
          }}
          transition={{ duration: isActive ? 0.4 : 3, repeat: isActive ? 0 : Infinity, ease: 'easeInOut' }}
          className="absolute -top-1 w-2 h-2 rounded-full bg-[#FAF7F2] border border-[#C6A15B]"
        />

        {/* Deck Micro-Engraving */}
        <div className="mt-1 flex items-center gap-3 text-[9px] font-mono tracking-[0.3em] uppercase text-stone/50">
          <span className="text-gold-light/70">DIAGEO</span>
          <span className="w-1 h-1 rounded-full bg-stone/30" />
          <span>TASTING DECK</span>
          <span className="w-1 h-1 rounded-full bg-stone/30" />
          <span className="text-gold-light/60">0{currentStageNumber} / 0{totalStages}</span>
        </div>
      </div>
    </div>
  )
}
