import { useState, useId } from 'react'
import { motion } from 'framer-motion'
import { CharacterState } from '../../data/discoveryStages'

interface CharacterSpectrumProps {
  value?: CharacterState
  onChange: (state: CharacterState) => void
  onConfirm?: () => void
}

/**
 * CharacterSpectrum (Stage 04)
 * Tactile dual-axis interactive spectrum replacing conventional cards.
 * Provides:
 * 1. LIGHT ───────── BALANCED ───────── BOLD (Body & Viscosity)
 * 2. SUBTLE ───────────── EXPRESSIVE (Aromatic Intensity)
 * With live sommelier commentary and smooth tactile pip interactions.
 */
export default function CharacterSpectrum({
  value = { weight: 50, expression: 50 },
  onChange,
  onConfirm,
}: CharacterSpectrumProps) {
  const [character, setCharacter] = useState<CharacterState>(value)
  const weightInputId = useId()
  const expressionInputId = useId()

  const handleWeightChange = (newWeight: number) => {
    const updated = { ...character, weight: newWeight }
    setCharacter(updated)
    onChange(updated)
  }

  const handleExpressionChange = (newExpression: number) => {
    const updated = { ...character, expression: newExpression }
    setCharacter(updated)
    onChange(updated)
  }

  // Live sommelier descriptions based on position
  const getWeightDescription = (val: number) => {
    if (val < 33) return 'Delicate, crystalline & featherweight silken texture.'
    if (val > 66) return 'Viscous, dense & full-bodied resonance with commanding finish.'
    return 'Harmonious equilibrium, poised mouthfeel & rounded elegance.'
  }

  const getExpressionDescription = (val: number) => {
    if (val < 40) return 'Whisper-soft nuances, veiled aromas & quiet contemplation.'
    if (val > 65) return 'Vivid, assertive aromatic bouquet radiating bold terroir & spirit.'
    return 'Layered complexity unfolding in deliberate, rhythmic cadence.'
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-2 sm:py-6 px-4">
      <div className="bg-[#0e0d0b]/80 border border-white/10 rounded-sm p-6 sm:p-10 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        {/* Subtle Architecture Crest */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_#C6A15B]" />
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase text-stone/60">
              Sensory Architecture · Tactile Balance
            </span>
          </div>
          <span className="text-[10px] font-mono tracking-widest text-gold-light/80 uppercase">
            Interactive Dual Spectrum
          </span>
        </div>

        {/* ── SPECTRUM 1: BODY & PALATE WEIGHT ── */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <label htmlFor={weightInputId} className="text-xs font-mono tracking-[0.25em] uppercase text-stone/40">
              01 · Palate Body
            </label>
            <span className="text-xs font-serif italic text-gold-light">
              {character.weight < 33
                ? 'Light & Crisp'
                : character.weight > 66
                ? 'Bold & Viscous'
                : 'Balanced & Silken'}
            </span>
          </div>

          {/* Interactive Spectrum Slider */}
          <div className="relative py-4 flex flex-col justify-center select-none">
            {/* Range Track Background */}
            <div className="relative w-full h-1 bg-[#1c1a17] rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#C6A15B]/30 via-[#C6A15B]/70 to-[#C6A15B]"
                style={{ width: `${character.weight}%` }}
              />
            </div>

            {/* Architectural Tick Marks */}
            <div className="absolute inset-x-0 flex justify-between pointer-events-none px-1">
              <span className="w-px h-3 bg-white/20 -translate-y-1" />
              <span className="w-px h-3 bg-white/30 -translate-y-1" />
              <span className="w-px h-3 bg-white/20 -translate-y-1" />
            </div>

            {/* Native range input for accessible dragging */}
            <input
              id={weightInputId}
              type="range"
              min="0"
              max="100"
              value={character.weight}
              onChange={(e) => handleWeightChange(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              aria-label="Palate body slider"
            />

            {/* Custom Luxury Tactile Thumb Pip */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-all duration-75 z-10"
              style={{ left: `${character.weight}%` }}
            >
              <div className="relative flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-[#080807] border border-[#C6A15B] shadow-[0_0_15px_rgba(198,161,91,0.5)] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#C6A15B]" />
                </div>
                <div className="absolute -top-6 text-[9px] font-mono text-gold-light/90">
                  {character.weight}%
                </div>
              </div>
            </div>
          </div>

          {/* Extreme Labels with Clickable Quick Select */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono tracking-widest mt-2 text-stone/50">
            <button
              type="button"
              onClick={() => handleWeightChange(0)}
              className={`hover:text-ivory transition-colors cursor-pointer ${
                character.weight <= 20 ? 'text-gold font-medium' : ''
              }`}
            >
              LIGHT
            </button>
            <button
              type="button"
              onClick={() => handleWeightChange(50)}
              className={`hover:text-ivory transition-colors cursor-pointer ${
                character.weight > 40 && character.weight < 60 ? 'text-gold font-medium' : ''
              }`}
            >
              BALANCED
            </button>
            <button
              type="button"
              onClick={() => handleWeightChange(100)}
              className={`hover:text-ivory transition-colors cursor-pointer ${
                character.weight >= 80 ? 'text-gold font-medium' : ''
              }`}
            >
              BOLD
            </button>
          </div>

          {/* Sommelier Descriptor */}
          <p className="mt-3 text-xs text-stone/40 font-sans italic tracking-wide">
            {getWeightDescription(character.weight)}
          </p>
        </div>

        {/* ── SPECTRUM 2: AROMATIC EXPRESSION ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label htmlFor={expressionInputId} className="text-xs font-mono tracking-[0.25em] uppercase text-stone/40">
              02 · Aromatic Expression
            </label>
            <span className="text-xs font-serif italic text-gold-light">
              {character.expression < 40
                ? 'Subtle & Veiled'
                : character.expression > 65
                ? 'Expressive & Terroir-Driven'
                : 'Balanced Cadence'}
            </span>
          </div>

          {/* Interactive Spectrum Slider */}
          <div className="relative py-4 flex flex-col justify-center select-none">
            {/* Range Track Background */}
            <div className="relative w-full h-1 bg-[#1c1a17] rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#C6A15B]/30 via-[#C6A15B]/70 to-[#C6A15B]"
                style={{ width: `${character.expression}%` }}
              />
            </div>

            {/* Architectural Tick Marks */}
            <div className="absolute inset-x-0 flex justify-between pointer-events-none px-1">
              <span className="w-px h-3 bg-white/20 -translate-y-1" />
              <span className="w-px h-3 bg-white/20 -translate-y-1" />
            </div>

            {/* Native range input */}
            <input
              id={expressionInputId}
              type="range"
              min="0"
              max="100"
              value={character.expression}
              onChange={(e) => handleExpressionChange(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              aria-label="Aromatic expression slider"
            />

            {/* Custom Luxury Tactile Thumb Pip */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-all duration-75 z-10"
              style={{ left: `${character.expression}%` }}
            >
              <div className="relative flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-[#080807] border border-[#C6A15B] shadow-[0_0_15px_rgba(198,161,91,0.5)] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#C6A15B]" />
                </div>
                <div className="absolute -top-6 text-[9px] font-mono text-gold-light/90">
                  {character.expression}%
                </div>
              </div>
            </div>
          </div>

          {/* Extreme Labels */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono tracking-widest mt-2 text-stone/50">
            <button
              type="button"
              onClick={() => handleExpressionChange(0)}
              className={`hover:text-ivory transition-colors cursor-pointer ${
                character.expression <= 30 ? 'text-gold font-medium' : ''
              }`}
            >
              SUBTLE
            </button>
            <button
              type="button"
              onClick={() => handleExpressionChange(100)}
              className={`hover:text-ivory transition-colors cursor-pointer ${
                character.expression >= 70 ? 'text-gold font-medium' : ''
              }`}
            >
              EXPRESSIVE
            </button>
          </div>

          {/* Sommelier Descriptor */}
          <p className="mt-3 text-xs text-stone/40 font-sans italic tracking-wide">
            {getExpressionDescription(character.expression)}
          </p>
        </div>

        {/* Tactile Summary Dossier */}
        <motion.div
          animate={{ opacity: 1 }}
          className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <div>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-stone/40 block mb-1">
              TASTING SPECIFICATION
            </span>
            <p className="font-serif text-sm sm:text-base text-[#FAF7F2]">
              Body index <span className="text-gold">{character.weight}</span> · Aromatic intensity{' '}
              <span className="text-gold">{character.expression}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-stone/40 uppercase tracking-widest border border-white/10 px-3 py-1.5 rounded-sm hidden sm:inline-block">
              Calibrated
            </span>

            {onConfirm && (
              <button
                type="button"
                onClick={onConfirm}
                className="group px-6 py-2.5 rounded-sm bg-[#C6A15B] hover:bg-[#D8BD7A] text-[#080807] font-mono text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 shadow-[0_0_20px_rgba(198,161,91,0.35)] hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
              >
                <span>Seal Character</span>
                <span className="font-bold group-hover:translate-x-1 transition-transform">→</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
