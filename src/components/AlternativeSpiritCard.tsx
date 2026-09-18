import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import BottleGlyph from './BottleGlyph'
import type { Spirit } from '@/types'

interface AlternativeSpiritCardProps {
  spirit: Spirit
  match: number
  /** Stagger delay for sequential entrance */
  delay?: number
}

export default function AlternativeSpiritCard({ spirit, match, delay = 0 }: AlternativeSpiritCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col border border-gold/15 bg-surface hover:border-gold/35 spirit-card-hover transition-all duration-500 overflow-hidden"
    >
      <div className="relative h-64 flex items-center justify-center overflow-hidden bg-gradient-to-b from-char via-char/90 to-obsidian p-6">
        {/* Subtle glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 group-hover:opacity-70 transition-opacity duration-700">
          <div className="w-36 h-36 rounded-full bg-gold/[0.08] blur-[30px]" />
        </div>

        {spirit.image ? (
          <img
            src={spirit.image}
            alt={spirit.fullName}
            className="relative z-10 max-h-52 max-w-full object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.85)] transition-transform duration-700 ease-luxe group-hover:scale-[1.05]"
            loading="lazy"
          />
        ) : (
          <BottleGlyph
            hue={spirit.glyphHue}
            className="h-44 transition-transform duration-700 ease-luxe group-hover:scale-[1.03]"
          />
        )}
        <div className="absolute top-4 right-4 bg-char/80 backdrop-blur-sm border border-gold/20 px-2.5 py-1 rounded-sm">
          <span className="font-display text-xl text-gold-light">{match}%</span>
        </div>
      </div>
      <div className="p-6 flex flex-col gap-1">
        <p className="text-xs uppercase tracking-widest2 text-gold-light/80 font-mono">{spirit.brand}</p>
        <p className="font-display text-2xl text-ivory group-hover:text-gold-light transition-colors duration-300">
          {spirit.name}
        </p>
        <p className="text-xs text-stone/70 mt-1 font-mono">
          {spirit.category} · {spirit.origin}
        </p>
        <Link
          to={`/spirit/${spirit.id}`}
          className="mt-5 text-xs uppercase tracking-widest2 text-gold-light inline-flex items-center gap-2 group/link"
        >
          Explore Expression
          <span className="transition-transform duration-500 ease-luxe group-hover/link:translate-x-1">→</span>
        </Link>
      </div>
    </motion.div>
  )
}

