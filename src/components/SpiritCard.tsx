import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import BottleGlyph from './BottleGlyph'
import type { Spirit } from '@/types'

interface SpiritCardProps {
  spirit: Spirit
  large?: boolean
}

export default function SpiritCard({ spirit }: SpiritCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/spirit/${spirit.id}`}
        className="group flex flex-col border border-gold/15 bg-surface spirit-card-hover overflow-hidden transition-all duration-500 hover:border-gold/35"
      >
        <div className="relative flex items-center justify-center bg-gradient-to-b from-char via-char/90 to-obsidian overflow-hidden p-6 h-72 sm:h-80">
          {/* Subtle warm backlight halo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity duration-700">
            <div className="w-48 h-48 rounded-full bg-gold/[0.08] blur-[40px]" />
          </div>

          {spirit.image ? (
            <img
              src={spirit.image}
              alt={spirit.fullName}
              className="relative z-10 max-h-[85%] max-w-[85%] object-contain drop-shadow-[0_22px_35px_rgba(0,0,0,0.85)] transition-transform duration-700 ease-luxe group-hover:scale-[1.05]"
              loading="lazy"
            />
          ) : (
            <BottleGlyph
              hue={spirit.glyphHue}
              className="h-3/4 transition-transform duration-700 ease-luxe group-hover:scale-[1.03]"
            />
          )}
        </div>
        <div className="p-8 flex flex-col justify-center gap-2">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest2 text-gold-light/90 font-mono">{spirit.category}</p>
            {spirit.abv && <span className="text-[11px] font-mono text-stone/60">{spirit.abv}</span>}
          </div>
          <p className="font-display text-2xl sm:text-3xl text-ivory tracking-tight group-hover:text-gold-light transition-colors duration-400">
            {spirit.fullName}
          </p>
          <p className="text-xs uppercase tracking-wider text-stone/70 font-mono">{spirit.origin}</p>
          <p className="text-sm text-stone/80 mt-2 leading-relaxed max-w-md line-clamp-3">{spirit.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {spirit.descriptors.slice(0, 3).map((d) => (
              <span
                key={d}
                className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 border border-stone/15 text-stone/70 bg-char/40"
              >
                {d}
              </span>
            ))}
          </div>
          <span className="mt-5 text-xs uppercase tracking-widest2 text-gold-light inline-flex items-center gap-2">
            Explore Expression
            <span className="transition-transform duration-500 ease-luxe group-hover:translate-x-1.5">→</span>
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

