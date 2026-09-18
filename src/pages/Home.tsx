import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import Layout from '@/components/Layout'
import PrimaryButton from '@/components/PrimaryButton'
import SectionLabel from '@/components/SectionLabel'
import BottleGlyph from '@/components/BottleGlyph'
import ParallaxImage from '@/components/ParallaxImage'
import { spirits } from '@/data/spirits'

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Philosophy />
      <FeaturedSpirits />
      <ClosingCTA />
    </Layout>
  )
}

/* ─────────── Hero ─────────── */

function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const bottleScale = useTransform(scrollYProgress, [0, 1], [1, 1.04])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-obsidian"
    >
      <ParallaxImage
        src="/images/hero-bg.jpg"
        speed={0.3}
        overlay={0.72}
        gradientDirection="to bottom"
      />

      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 md:px-10 pt-24 sm:pt-28 pb-12 sm:pb-16 grid md:grid-cols-2 gap-10 md:gap-16 lg:gap-20 items-center"
      >
        {/* Text — staggered entrance */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionLabel className="mb-6 sm:mb-8">The Art of Discovery</SectionLabel>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.04] text-balance"
          >
            <span className="golden-flash-text">
              Discover
              <br />
              your spirit.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 sm:mt-8 max-w-md text-stone leading-relaxed text-base sm:text-lg"
          >
            A personalized journey through the world&rsquo;s finest spirits — guided by your
            taste, not a catalog.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 sm:mt-14"
          >
            <PrimaryButton to="/discovery" variant="outline" flashy>
              Begin the Experience
            </PrimaryButton>
          </motion.div>
        </div>

        {/* Group Collection Spirits Showcase — replacing plain bottle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center"
        >
          {/* Ambient warm amber/gold atmospheric halo */}
          <div className="absolute h-80 w-80 md:h-[480px] md:w-[480px] rounded-full bg-gradient-to-tr from-gold/[0.14] via-amber-600/[0.06] to-transparent blur-[90px] pointer-events-none" />

          <motion.div
            style={{ scale: bottleScale }}
            className="relative w-full max-w-lg lg:max-w-xl group"
          >
            {/* Ultra-luxury obsidian showcase frame */}
            <div className="relative rounded-sm overflow-hidden border border-gold/30 bg-char/80 shadow-[0_30px_70px_rgba(0,0,0,0.85)] transition-all duration-700 hover:border-gold/50">
              <img
                src="/images/collection-hero-group.jpg"
                alt="Diageo Curated Collection Spirits"
                className="w-full h-auto object-cover filter brightness-[1.04] contrast-[1.03] transition-transform duration-1000 ease-out group-hover:scale-[1.025]"
              />

              {/* Delicate inner hairline frame */}
              <div className="absolute inset-0 ring-1 ring-inset ring-gold/20 pointer-events-none" />

              {/* Bottom ground gradient */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-obsidian/95 via-obsidian/50 to-transparent pointer-events-none" />


            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator — simple, no bounce */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-stone/50">
        <span className="text-[0.6rem] uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-10 w-px bg-gold/25" />
      </div>
    </section>
  )
}

/* ─────────── Philosophy ─────────── */

function Philosophy() {
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 md:px-10 py-20 sm:py-32 lg:py-40 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <SectionLabel className="mb-6 sm:mb-8">Luxury Through Restraint</SectionLabel>
        <p className="font-display text-2xl sm:text-4xl md:text-5xl text-ivory leading-snug text-balance">
          Eight considered questions. One spirit that feels, unmistakably, like you.
        </p>
      </motion.div>

      {/* Gold divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mt-10 sm:mt-14 mb-14 sm:mb-20 h-px w-32 bg-gradient-to-r from-transparent via-gold/40 to-transparent origin-center"
      />

      <div className="grid gap-10 sm:gap-12 md:grid-cols-3 text-left">
        {[
          {
            title: 'A private tasting',
            body: 'No forms, no filters — a conversation about mood, flavor, and occasion, held at your pace.',
          },
          {
            title: 'A considered match',
            body: 'Your answers form a taste profile, weighed against a curated catalog of the world\u2019s finest spirits.',
          },
          {
            title: 'A lasting discovery',
            body: 'Beyond the match — tasting notes, pairing guidance, and kindred spirits worth exploring next.',
          },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="h-px w-10 bg-gold mb-5" />
            <p className="font-display text-2xl text-ivory mb-3">{item.title}</p>
            <p className="text-sm text-stone leading-relaxed">{item.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ─────────── Featured Spirits ─────────── */

function FeaturedSpirits() {
  const featured = spirits.slice(0, 3)
  return (
    <section className="relative py-20 sm:py-32 lg:py-40 overflow-hidden">
      <ParallaxImage
        src="/images/spirits-bg.jpg"
        speed={0.2}
        overlay={0.84}
        gradientDirection="to bottom"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
        <div className="flex items-end justify-between mb-12 sm:mb-16 flex-wrap gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionLabel className="mb-3 sm:mb-4">The Collection</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ivory">A glimpse of what awaits.</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <PrimaryButton to="/collection" variant="ghost">
              View the full collection
            </PrimaryButton>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {featured.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={`/spirit/${s.id}`}
                className="group block border border-gold/15 bg-surface/80 backdrop-blur-sm spirit-card-hover overflow-hidden transition-all duration-500 hover:border-gold/40"
              >
                <div className="h-64 flex items-center justify-center bg-gradient-to-b from-char via-char/90 to-obsidian relative overflow-hidden p-6">
                  {/* Soft halo */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 group-hover:opacity-70 transition-opacity duration-700">
                    <div className="w-32 h-32 rounded-full bg-gold/[0.08] blur-[30px]" />
                  </div>

                  {s.image ? (
                    <img
                      src={s.image}
                      alt={s.fullName}
                      className="relative z-10 max-h-52 max-w-full object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.85)] transition-transform duration-700 ease-luxe group-hover:scale-[1.05]"
                      loading="lazy"
                    />
                  ) : (
                    <BottleGlyph
                      hue={s.glyphHue}
                      className="h-48 transition-transform duration-700 ease-luxe group-hover:scale-[1.03]"
                    />
                  )}
                </div>
                <div className="p-7">
                  <p className="text-xs uppercase tracking-widest2 text-gold-light/90 font-mono">{s.category}</p>
                  <p className="font-display text-2xl text-ivory mt-1 group-hover:text-gold-light transition-colors duration-300">
                    {s.fullName}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest2 text-gold-light opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                    Explore Expression
                    <span className="transition-transform duration-500 ease-luxe group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────── Closing CTA ─────────── */

function ClosingCTA() {
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 md:px-10 py-20 sm:py-32 lg:py-40 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-ivory text-balance mb-8 sm:mb-10">
          Your spirit is waiting to be found.
        </h2>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <PrimaryButton to="/discovery" variant="filled" arrow={false} flashy>
          Begin the Experience →
        </PrimaryButton>
      </motion.div>
    </section>
  )
}
