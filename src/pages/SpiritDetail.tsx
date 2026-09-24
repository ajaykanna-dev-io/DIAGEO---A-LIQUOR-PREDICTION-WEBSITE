import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from '@/components/Layout'
import SectionLabel from '@/components/SectionLabel'
import PrimaryButton from '@/components/PrimaryButton'
import BottleGlyph from '@/components/BottleGlyph'
import BottleMagnifier from '@/components/BottleMagnifier'
import TasteProfileBars from '@/components/TasteProfileBars'
import ParallaxImage from '@/components/ParallaxImage'
import { getSpiritById, getAlternativesWithMatch } from '@/data/spirits'

export default function SpiritDetail() {
  const { id } = useParams()
  const spirit = id ? getSpiritById(id) : undefined
  const [isInspecting, setIsInspecting] = useState(false)

  if (!spirit) return <Navigate to="/collection" replace />

  const related = getAlternativesWithMatch(spirit, 3)

  return (
    <Layout>
      {/* Hero */}
      <section className="px-4 sm:px-6 md:px-10 pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-24 max-w-7xl mx-auto grid md:grid-cols-12 gap-10 md:gap-14 lg:gap-16 items-center">
        {/* Left Column: Ultra-Premium Bespoke Vitrine & Bottle Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-6 relative w-full max-w-md sm:max-w-lg mx-auto"
        >
          {/* Subtle Ambient Radial Backlight Halo */}
          <div
            className="absolute -inset-6 sm:-inset-10 rounded-full bg-gradient-to-tr from-gold/[0.18] via-amber-600/[0.08] to-transparent blur-[85px] pointer-events-none"
            aria-hidden="true"
          />

          {/* Master Outer Archival Frame with Hairline Gold Border and Glass Elevation */}
          <div className="relative p-2 sm:p-2.5 rounded-sm bg-[#12100e]/85 backdrop-blur-md border border-gold/30 shadow-[0_30px_90px_rgba(0,0,0,0.95)] transition-all duration-700 hover:border-gold/50 group">
            {/* Bespoke Double-Notched Gold Corner Accents */}
            {/* Top-Left */}
            <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-gold/80 pointer-events-none" />
            <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-gold/40 pointer-events-none" />
            {/* Top-Right */}
            <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-gold/80 pointer-events-none" />
            <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-gold/40 pointer-events-none" />
            {/* Bottom-Left */}
            <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-gold/80 pointer-events-none" />
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-gold/40 pointer-events-none" />
            {/* Bottom-Right */}
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-gold/80 pointer-events-none" />
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-gold/40 pointer-events-none" />

            {/* Inner Vitrine Sanctuary Chamber */}
            <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[560px] rounded-xs bg-gradient-to-b from-[#181512] via-[#0d0c0a] to-[#050504] border border-gold/20 overflow-hidden flex flex-col items-center justify-between p-4 sm:p-5">
              {/* Subtle Atmospheric Radial Center Glow */}
              <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/[0.12] via-transparent to-transparent pointer-events-none"
                aria-hidden="true"
              />

              {/* Watermark Archival Seal in Background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05]">
                <svg
                  className="w-72 sm:w-80 h-72 sm:h-80 text-gold animate-[spin_120s_linear_infinite]"
                  viewBox="0 0 100 100"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="50" cy="50" r="46" strokeWidth="0.5" strokeDasharray="2 3" />
                  <circle cx="50" cy="50" r="38" strokeWidth="0.75" />
                  <circle cx="50" cy="50" r="28" strokeWidth="0.5" strokeDasharray="1 2" />
                  <path d="M50 2 L50 98 M2 50 L98 50 M16 16 L84 84 M16 84 L84 16" strokeWidth="0.35" />
                </svg>
              </div>

              {/* Top Vitrine Header / Archival Coordinates & Loupe Status */}
              <div className="relative z-10 w-full flex items-center justify-between font-mono text-[9px] sm:text-[10px] tracking-[0.28em] uppercase text-stone/60">
                {isInspecting ? (
                  <span className="flex items-center gap-1.5 text-[#E5C378]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] inline-block animate-ping" />
                    INSPECTING DETAILS · 2.7×
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-gold-light/90">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block animate-pulse" />
                    ARCHIVE BOTTLE
                  </span>
                )}
                <span className="text-stone/60">
                  {spirit.origin}
                </span>
              </div>

              {/* Center Floating Bottle Showcase on Illuminated Pedestal with Optical Loupe */}
              <div className="relative flex-1 w-full flex items-center justify-center min-h-0 my-1">
                {/* Concentric Architectural Pedestal Rings on Floor */}
                <div className="absolute bottom-1 sm:bottom-3 left-1/2 -translate-x-1/2 w-[220px] sm:w-[270px] h-[50px] pointer-events-none">
                  {/* Outer glowing ring */}
                  <div
                    className="w-full h-full rounded-full border border-dashed border-gold/30 animate-[spin_60s_linear_infinite]"
                    style={{ transform: 'rotateX(75deg)' }}
                  />
                  {/* Inner illuminated solid disc */}
                  <div
                    className="absolute inset-x-5 inset-y-1.5 rounded-full border border-gold/50 bg-gradient-to-t from-gold/25 via-gold/10 to-transparent shadow-[0_0_30px_rgba(198,161,91,0.35)]"
                    style={{ transform: 'rotateX(75deg)' }}
                  />
                </div>

                {/* Ambient Amber Glow Behind the Glass Body */}
                <div className="absolute w-44 h-64 rounded-full bg-gradient-to-t from-gold/20 via-amber-600/10 to-transparent blur-[45px] pointer-events-none" />

                {/* Floating Elevated Bottle with Pause-On-Inspect */}
                <motion.div
                  animate={{ y: isInspecting ? 0 : [-5, 5, -5] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10 h-full w-full flex items-center justify-center"
                >
                  {spirit.image ? (
                    <BottleMagnifier
                      src={spirit.image}
                      alt={spirit.fullName}
                      zoom={2.7}
                      lensSize={165}
                      onHoverChange={setIsInspecting}
                      className="max-h-[82%] sm:max-h-[86%] w-auto object-contain filter brightness-[1.05] contrast-[1.04] drop-shadow-[0_25px_35px_rgba(0,0,0,0.95)] drop-shadow-[0_8px_18px_rgba(198,161,91,0.22)] transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <BottleGlyph
                      hue={spirit.glyphHue}
                      className="h-3/4 drop-shadow-[0_30px_50px_rgba(0,0,0,0.7)]"
                    />
                  )}
                </motion.div>

                {/* Luminous Light Sweep Across Vitrine Glass */}
                {!isInspecting && (
                  <motion.div
                    animate={{ x: ['-150%', '250%'] }}
                    transition={{ duration: 5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-ivory/[0.07] to-transparent skew-x-[-22deg]"
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Bottom Pedestal Archival Ingot Plaque */}
              <div className="relative z-10 w-full flex items-center justify-between border-t border-gold/15 pt-2 sm:pt-2.5">
                <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-stone/50 truncate max-w-[55%]">
                  {spirit.cask || 'AUTHENTIC CASK'}
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-gold-light/90">
                  {spirit.abv || '40% ABV'} · {spirit.category}
                </span>
              </div>
            </div>
          </div>

          {/* Sommelier Inspection Hint Bar */}
          <div className="mt-3 flex items-center justify-center gap-2 text-center pointer-events-none">
            <span className="w-1 h-1 rounded-full bg-gold/60" />
            <p className="font-mono text-[10px] tracking-[0.22em] text-stone/60 uppercase">
              Hover bottle for 2.7× optical loupe
            </p>
            <span className="w-1 h-1 rounded-full bg-gold/60" />
          </div>
        </motion.div>

        {/* Right Column: Editorial Details */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-6 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="font-mono text-xs uppercase tracking-[0.28em] text-gold-light/90">
              {spirit.brand} · Reserve Archive
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-ivory tracking-tight leading-[1.08] mb-3">
            {spirit.fullName}
          </h1>

          <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone/70 mb-4">
            {spirit.category} · {spirit.origin} {spirit.abv ? `· ${spirit.abv}` : ''}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {spirit.descriptors.map((d) => (
              <span
                key={d}
                className="text-[11px] font-mono tracking-wider text-gold-light/95 bg-char/80 border border-gold/25 px-3 py-1 rounded-full"
              >
                {d}
              </span>
            ))}
          </div>

          <p className="text-stone leading-relaxed max-w-xl text-base sm:text-lg mb-8 font-light">
            {spirit.description}
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <PrimaryButton to="/discovery" variant="filled" arrow={false} flashy>
              Find Your Palate Match →
            </PrimaryButton>
            <PrimaryButton to="/collection" variant="ghost">
              Back to Collection
            </PrimaryButton>
          </div>
        </motion.div>
      </section>

      {/* Tasting & Character */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 md:px-10 overflow-hidden">
        <ParallaxImage src="/images/cta-bg.jpg" speed={0.15} overlay={0.88} />

        <div className="relative mx-auto max-w-5xl grid md:grid-cols-2 gap-10 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionLabel className="mb-6">Tasting Notes</SectionLabel>
            <ul className="flex flex-col gap-3">
              {spirit.tastingNotes.map((note) => (
                <li key={note} className="flex items-center gap-3 text-ivory">
                  <span className="h-1 w-1 rounded-full bg-gold" />
                  {note}
                </li>
              ))}
            </ul>

            <div className="mt-10 grid grid-cols-1 gap-4 text-sm">
              <DetailRow label="Serving Style" value={spirit.servingStyle} />
              <DetailRow label="Pairing" value={spirit.pairing} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionLabel className="mb-6">Character</SectionLabel>
            <TasteProfileBars profile={spirit.profile} />
          </motion.div>
        </div>
      </section>

      {/* Related Spirits */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 md:px-10">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionLabel className="mb-4">Related Spirits</SectionLabel>
            <h2 className="font-display text-2xl sm:text-3xl text-ivory mb-10 sm:mb-14">If you enjoy this, consider&hellip;</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {related.map(({ spirit: alt }, i) => (
              <motion.div
                key={alt.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={`/spirit/${alt.id}`}
                  className="group border border-gold/15 hover:border-gold/35 bg-surface spirit-card-hover block overflow-hidden transition-all duration-500"
                >
                  <div className="h-60 flex items-center justify-center bg-gradient-to-b from-char via-char/90 to-obsidian relative overflow-hidden p-6">
                    {/* Soft halo */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 group-hover:opacity-70 transition-opacity duration-700">
                      <div className="w-32 h-32 rounded-full bg-gold/[0.08] blur-[30px]" />
                    </div>

                    {alt.image ? (
                      <img
                        src={alt.image}
                        alt={alt.fullName}
                        className="relative z-10 max-h-44 max-w-[80%] object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.85)] transition-transform duration-700 ease-luxe group-hover:scale-[1.05]"
                        loading="lazy"
                      />
                    ) : (
                      <BottleGlyph
                        hue={alt.glyphHue}
                        className="h-40 transition-transform duration-700 ease-luxe group-hover:scale-[1.03]"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-xs uppercase tracking-widest2 text-gold-light/90 font-mono">{alt.brand}</p>
                    <p className="font-display text-xl text-ivory group-hover:text-gold-light transition-colors duration-300 mt-0.5">
                      {alt.name}
                    </p>
                    <p className="text-xs text-stone/70 mt-1 font-mono">{alt.category} · {alt.origin}</p>
                    <span className="mt-4 text-xs uppercase tracking-widest2 text-gold-light inline-flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-400">
                      Explore Expression →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-t border-gold/10 pt-4">
      <span className="text-xs uppercase tracking-widest2 text-stone">{label}</span>
      <span className="text-ivory">{value}</span>
    </div>
  )
}
