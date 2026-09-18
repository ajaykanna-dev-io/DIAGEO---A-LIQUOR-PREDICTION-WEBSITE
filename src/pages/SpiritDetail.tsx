import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from '@/components/Layout'
import SectionLabel from '@/components/SectionLabel'
import PrimaryButton from '@/components/PrimaryButton'
import BottleGlyph from '@/components/BottleGlyph'
import TasteProfileBars from '@/components/TasteProfileBars'
import ParallaxImage from '@/components/ParallaxImage'
import { getSpiritById, getAlternativesWithMatch } from '@/data/spirits'

export default function SpiritDetail() {
  const { id } = useParams()
  const spirit = id ? getSpiritById(id) : undefined

  if (!spirit) return <Navigate to="/collection" replace />

  const related = getAlternativesWithMatch(spirit, 3)

  return (
    <Layout>
      {/* Hero */}
      <section className="px-4 sm:px-6 md:px-10 pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-24 max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center bg-gradient-to-b from-char via-char/80 to-obsidian py-12 sm:py-16 md:py-20 px-4 sm:px-8 overflow-hidden border border-gold/15 rounded-sm"
        >
          <div className="absolute h-64 w-64 rounded-full bg-gold/[0.06] blur-[60px]" />
          {spirit.image ? (
            <img
              src={spirit.image}
              alt={spirit.fullName}
              className="relative max-h-[280px] sm:max-h-[360px] md:max-h-[440px] w-auto object-contain drop-shadow-[0_32px_55px_rgba(0,0,0,0.9)] transition-transform duration-700 ease-out hover:scale-[1.03]"
            />
          ) : (
            <BottleGlyph hue={spirit.glyphHue} className="relative h-72 sm:h-96 drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)]" />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionLabel className="mb-3">{spirit.brand}</SectionLabel>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-ivory mb-4">{spirit.name}</h1>
          <p className="text-sm text-stone mb-1">{spirit.category} · {spirit.origin}</p>
          <p className="text-gold-light text-xs sm:text-sm tracking-wide mb-6">{spirit.descriptors.join(' · ')}</p>
          <p className="text-stone leading-relaxed max-w-md text-sm sm:text-base">{spirit.description}</p>

          <div className="mt-8 sm:mt-10 flex flex-wrap gap-4">
            <PrimaryButton to="/discovery" variant="filled" arrow={false}>
              Find Your Own Match →
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
