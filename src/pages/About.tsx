import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Layout from '@/components/Layout'
import SectionLabel from '@/components/SectionLabel'
import ParallaxImage from '@/components/ParallaxImage'

export default function About() {
  return (
    <Layout>
      {/* ════════════════════════════════════════════════════════════ */}
      {/* HERO SECTION: THE ART OF DISCOVERY */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-6 md:px-10 pt-28 sm:pt-36 md:pt-44 pb-16 sm:pb-20 max-w-5xl mx-auto text-center">
        {/* Subtle radial ambient glow */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[140px] opacity-15"
          style={{ background: 'radial-gradient(ellipse at center, #C6A15B 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <SectionLabel className="mb-4 sm:mb-6">HAUTE DISTILLERIE · PHILOSOPHY</SectionLabel>
          <h1 className="font-serif text-[clamp(2.5rem,5.5vw,5rem)] text-[#FAF7F2] font-normal tracking-tight leading-[1.08] mb-6 max-w-4xl mx-auto">
            The art of considered taste.
          </h1>
          <p className="text-stone/70 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-sans font-light leading-relaxed">
            A sanctuary built on the intimate dialogue between heritage casks, terroir nuances,
            and your singular sensory palate.
          </p>

          {/* Architectural Heritage Bar */}
          <div className="mt-12 pt-8 border-t border-white/10 max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center font-mono">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-gold-light/80 block mb-1">
                HERITAGE
              </span>
              <span className="text-xs sm:text-sm text-[#FAF7F2]">Haute Distillerie</span>
            </div>
            <div className="border-x border-white/10">
              <span className="text-[10px] tracking-[0.25em] uppercase text-gold-light/80 block mb-1">
                CELLAR
              </span>
              <span className="text-xs sm:text-sm text-[#FAF7F2]">Prestige Reserve</span>
            </div>
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-gold-light/80 block mb-1">
                EXPERIENCE
              </span>
              <span className="text-xs sm:text-sm text-[#FAF7F2]">Bespoke Discovery</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* CORE PHILOSOPHY & CRAFT IMAGE SECTION */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-6 md:px-10 pb-24 sm:pb-32 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-12 gap-10 sm:gap-14 md:gap-16 items-center">
          {/* Left Column: Story & Manifesto */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-6 flex flex-col justify-center text-left"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_#C6A15B]" />
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-gold-light/90">
                01 / BEYOND THE LABEL
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-normal leading-snug mb-6">
              Taste deserves more than a shelf recommendation.
            </h2>

            <p className="text-stone/80 font-sans leading-relaxed mb-5 text-sm sm:text-base font-light">
              Most people choose a spirit by bottle label, by marketing price, or by whatever a passing
              acquaintance once mentioned. We believe true taste deserves far deeper contemplation.
            </p>

            <p className="text-stone/80 font-sans leading-relaxed mb-5 text-sm sm:text-base font-light">
              DIAGEO was founded on an exacting premise: that a handful of thoughtful questions about
              mood, sensory texture, and occasion can illuminate more about what you will genuinely
              savor than any sommelier monologue ever could.
            </p>

            <p className="text-stone/80 font-sans leading-relaxed text-sm sm:text-base mb-8 font-light">
              Every recommendation is drawn from a meticulously curated catalog, weighed against the
              exact contours of your palate. No two discovery journeys ever unfold in the same cadence.
            </p>

            {/* Editorial Pull-Quote */}
            <div className="p-5 border-l-2 border-[#C6A15B] bg-[#0e0d0c] rounded-xs mb-8">
              <p className="font-serif italic text-base sm:text-lg text-gold-light leading-relaxed mb-2">
                &ldquo;A spirit is never merely a beverage. It is a moment in time, suspended in
                ancient oak and awakened by curiosity.&rdquo;
              </p>
              <span className="text-[10px] font-mono tracking-widest text-stone/50 uppercase">
                —— The DIAGEO Tasting Creed
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/discovery"
                className="group inline-flex items-center gap-3 px-7 py-4 rounded-sm bg-[#C6A15B] text-[#080807] font-mono font-medium text-xs tracking-[0.2em] uppercase hover:bg-[#D8BD7A] transition-all duration-300 shadow-[0_0_30px_rgba(198,161,91,0.35)] hover:-translate-y-0.5"
              >
                <span>Begin Tasting Ritual</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1 font-bold">
                  →
                </span>
              </Link>
              <Link
                to="/collection"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-sm border border-stone/25 hover:border-gold/40 text-stone/70 hover:text-ivory font-mono text-xs tracking-[0.2em] uppercase transition-colors"
              >
                Explore Cellar
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Ultra-Premium Master Blender Craft Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-6 relative"
          >
            {/* Outer Architectural Double Border */}
            <div className="relative p-3 bg-[#0d0c0b] border border-[#C6A15B]/25 rounded-sm shadow-[0_25px_70px_rgba(0,0,0,0.8)]">
              {/* Corner Gold Accent Markers */}
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-gold" />
              <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-gold" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-gold" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-gold" />

              {/* Image Container with Subtle Zoom & Film Grain Vignette */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xs bg-[#080807]">
                <img
                  src="/images/about-philosophy.webp"
                  alt="DIAGEO Master Blender inspecting aged spirit clarity in private cellar"
                  className="w-full h-full object-cover object-center filter contrast-110 brightness-95 hover:scale-102 transition-transform duration-700 ease-out"
                />

                {/* Layered Lighting Vignette */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080807] via-transparent to-transparent opacity-80"
                  aria-hidden="true"
                />

                {/* Refined Provenance Plaque Overlay */}
                <div className="absolute bottom-4 inset-x-4 p-4 bg-[#0a0a09]/90 border border-white/10 backdrop-blur-md rounded-xs">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-gold-light">
                      ARCHIVE NO. 1988 · PRIVATE CELLAR
                    </span>
                    <span className="text-[9px] font-mono text-stone/40">SCOTLAND</span>
                  </div>
                  <p className="text-xs font-serif text-[#FAF7F2] font-normal leading-snug">
                    Master Blender inspecting the clarity and viscosity of cask reserve spirits by candlelight.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* THE THREE PILLARS OF DISCOVERY */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 md:px-10 overflow-hidden border-t border-white/10">
        <ParallaxImage
          src="/images/cta-bg.jpg"
          speed={0.2}
          overlay={0.9}
        />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
            <SectionLabel className="mb-3">OUR THREE FOUNDATIONS</SectionLabel>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#FAF7F2] font-normal">
              Principles of the Sanctuary
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                number: '01',
                title: 'Considered',
                body: 'Every question in your tasting journey is crafted to reveal how your subconscious palate responds to warmth, sweetness, and oak.',
              },
              {
                number: '02',
                title: 'Curated',
                body: 'A catalog built entirely on authentic character and terroir provenance — only extraordinary expressions earn a place in our cellar.',
              },
              {
                number: '03',
                title: 'Personal',
                body: 'Your sensory match is calibrated to your exact moment. No algorithms push volume; every pour honors individual taste.',
              },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.2, delay: i * 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-[#0e0d0c]/80 border border-white/10 hover:border-[#C6A15B]/50 p-8 rounded-sm transition-all duration-500 hover:shadow-[0_0_30px_rgba(198,161,91,0.15)] hover:-translate-y-1"
              >
                <span className="text-[10px] font-mono tracking-widest text-gold-light/60 block mb-4">
                  {v.number}
                </span>
                <div className="h-px w-8 bg-gold mb-6 group-hover:w-12 transition-all duration-300" />
                <h3 className="font-serif text-2xl text-[#FAF7F2] mb-3 group-hover:text-gold transition-colors">
                  {v.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone/70 leading-relaxed font-sans font-light">
                  {v.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* FINAL INVITATION BANNER */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 px-4 sm:px-6 md:px-10 text-center bg-[#080807] border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-gold-light/80 block mb-3">
            YOUR PALATE AWAITS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-normal mb-6">
            Begin your personal tasting journey.
          </h2>
          <Link
            to="/discovery"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-sm bg-[#C6A15B] text-[#080807] font-mono font-medium text-xs tracking-[0.2em] uppercase hover:bg-[#D8BD7A] transition-all duration-300 shadow-[0_0_30px_rgba(198,161,91,0.35)]"
          >
            <span>Discover Your Spirit</span>
            <span className="font-bold">→</span>
          </Link>
        </div>
      </section>
    </Layout>
  )
}
