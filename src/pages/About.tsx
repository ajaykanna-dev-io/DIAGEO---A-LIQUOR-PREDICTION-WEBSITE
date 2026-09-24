import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Layout from '@/components/Layout'
import ParallaxImage from '@/components/ParallaxImage'

export default function About() {
  return (
    <Layout>
      {/* ════════════════════════════════════════════════════════════ */}
      {/* 1. HERO SECTION: CINEMATIC ATMOSPHERE & PHILOSOPHY */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 md:px-12 pt-32 sm:pt-40 md:pt-48 pb-20 sm:pb-28 text-center overflow-hidden">
        {/* Layered Atmospheric Background */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none scale-105 transition-transform duration-1000"
          style={{ backgroundImage: "url('/images/highlands_estate_panorama.jpg')" }}
          aria-hidden="true"
        >
          {/* Multi-layered dark obsidian gradient overlays */}
          <div className="absolute inset-0 bg-[#0B0B0A]/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A] via-[#0B0B0A]/70 to-[#0B0B0A]/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0A] via-transparent to-[#0B0B0A]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(11,11,10,0.9)_75%)]" />
        </div>

        {/* Ambient Golden Halo Glow behind Hero Title */}
        <div
          className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] rounded-full blur-[150px] opacity-25"
          style={{ background: 'radial-gradient(ellipse at center, #C6A15B 0%, #9E7C38 45%, transparent 75%)' }}
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#C6A15B]/35 bg-black/60 backdrop-blur-md shadow-[0_4px_20px_rgba(198,161,91,0.15)] mb-6 sm:mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] shadow-[0_0_8px_#C6A15B] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.3em] uppercase text-[#E5C378] font-medium">
              HAUTE DISTILLERIE · PHILOSOPHY
            </span>
          </div>

          {/* Colored Golden Gradient Heading */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-normal tracking-tight leading-[1.08] mb-6 sm:mb-8 bg-gradient-to-r from-[#FFF8ED] via-[#E8C87A] to-[#C6A15B] bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(198,161,91,0.25)]">
            The art of considered taste.
          </h1>

          {/* Subtitle with harmonious font-sans typography */}
          <p className="text-stone/85 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-sans font-light leading-relaxed mb-12 sm:mb-16">
            A sanctuary built on the intimate dialogue between heritage casks, terroir nuances,
            and your singular sensory palate.
          </p>

          {/* Architectural Heritage Bar */}
          <div className="w-full max-w-3xl rounded-xl p-4 sm:p-8 bg-black/60 backdrop-blur-xl border border-[#C6A15B]/25 shadow-[0_20px_50px_rgba(0,0,0,0.7)] grid grid-cols-3 gap-2 sm:gap-4 text-center">
            <div>
              <span className="text-[8px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#C6A15B] block mb-1 font-sans font-semibold">
                HERITAGE
              </span>
              <span className="text-[11px] sm:text-sm md:text-base text-[#FAF7F2] font-serif font-medium leading-tight block">
                Haute Distillerie
              </span>
            </div>
            <div className="border-x border-white/10 px-1 sm:px-2">
              <span className="text-[8px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#C6A15B] block mb-1 font-sans font-semibold">
                CELLAR
              </span>
              <span className="text-[11px] sm:text-sm md:text-base text-[#FAF7F2] font-serif font-medium leading-tight block">
                Prestige Reserve
              </span>
            </div>
            <div>
              <span className="text-[8px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#C6A15B] block mb-1 font-sans font-semibold">
                EXPERIENCE
              </span>
              <span className="text-[11px] sm:text-sm md:text-base text-[#FAF7F2] font-serif font-medium leading-tight block">
                Bespoke Discovery
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* 2. CRAFT METRICS & DISTILLERY PROVENANCE BAR */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="relative py-12 px-4 sm:px-6 md:px-10 border-y border-[#C6A15B]/20 bg-[#0e0d0b]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 text-center">
          {[
            { value: '1824', label: 'DISTILLERY ORIGINS', sub: 'Two Centuries of Mastery' },
            { value: '400+', label: 'RARE CASK RESERVES', sub: 'Hand-Selected Maturation' },
            { value: '13', label: 'SENSORY DIMENSIONS', sub: 'Calibrated Palate Profiling' },
            { value: '0.01%', label: 'SELECTION PRECISION', sub: 'Exceptional Expressions Only' },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.12 }}
              className="space-y-1.5"
            >
              <span className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal bg-gradient-to-r from-[#FAF7F2] via-[#E5C378] to-[#C6A15B] bg-clip-text text-transparent">
                {stat.value}
              </span>
              <span className="block text-[10px] sm:text-[11px] font-sans tracking-[0.28em] text-[#C6A15B] uppercase font-semibold">
                {stat.label}
              </span>
              <span className="block text-xs text-stone/50 font-sans font-light">
                {stat.sub}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* 3. CORE PHILOSOPHY & MASTER BLENDER CRAFT SECTION */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 md:py-36 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle warm amber ambient glow */}
        <div
          className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-[150px] opacity-15"
          style={{ background: 'radial-gradient(circle, #C6A15B 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="grid md:grid-cols-12 gap-12 sm:gap-16 items-center relative z-10">
          {/* Left Column: Story & Manifesto */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-6 flex flex-col justify-center text-left"
          >
            {/* Step Counter Eyebrow */}
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-[#C6A15B] shadow-[0_0_10px_#C6A15B]" />
              <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.3em] uppercase text-[#E5C378] font-semibold">
                01 / BEYOND THE LABEL
              </span>
            </div>

            {/* Colored Heading */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.18] mb-6 bg-gradient-to-r from-[#FFFFFF] via-[#F2D792] to-[#C6A15B] bg-clip-text text-transparent">
              Taste deserves more than a shelf recommendation.
            </h2>

            <p className="text-stone/85 font-sans leading-relaxed mb-5 text-sm sm:text-base font-light">
              Most people choose a spirit by bottle label, by marketing price, or by whatever a passing
              acquaintance once mentioned. We believe true taste deserves far deeper contemplation.
            </p>

            <p className="text-stone/85 font-sans leading-relaxed mb-5 text-sm sm:text-base font-light">
              DIAGEO was founded on an exacting premise: that a handful of thoughtful questions about
              mood, sensory texture, and occasion can illuminate more about what you will genuinely
              savor than any sommelier monologue ever could.
            </p>

            <p className="text-stone/85 font-sans leading-relaxed text-sm sm:text-base mb-8 font-light">
              Every recommendation is drawn from a meticulously curated catalog, weighed against the
              exact contours of your palate. No two discovery journeys ever unfold in the same cadence.
            </p>

            {/* Editorial Pull-Quote Plaque */}
            <div className="p-6 sm:p-7 border-l-2 border-[#C6A15B] bg-gradient-to-r from-[#14120f] to-[#0c0b0a] rounded-r-xl border border-white/5 shadow-xl mb-10">
              <p className="font-serif italic text-lg sm:text-xl text-[#F2D792] leading-relaxed mb-3">
                &ldquo;A spirit is never merely a beverage. It is a moment in time, suspended in
                ancient oak and awakened by curiosity.&rdquo;
              </p>
              <span className="text-[10px] font-sans tracking-[0.28em] text-stone/50 uppercase font-medium">
                —— The DIAGEO Tasting Creed
              </span>
            </div>

            {/* Interactive CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/discovery"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-gradient-to-r from-[#C6A15B] to-[#E5C378] text-[#080807] font-sans font-semibold text-xs tracking-[0.2em] uppercase hover:shadow-[0_0_35px_rgba(198,161,91,0.45)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>Begin Tasting Ritual</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1 font-bold">
                  →
                </span>
              </Link>
              <Link
                to="/collection"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-lg border border-[#C6A15B]/30 hover:border-[#C6A15B] text-stone/80 hover:text-[#FAF7F2] font-sans font-medium text-xs tracking-[0.2em] uppercase bg-black/40 backdrop-blur-md transition-all duration-300"
              >
                Explore Cellar
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Master Blender Craft Image with Architectural Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-6 relative"
          >
            {/* Outer Architectural Double Border */}
            <div className="relative p-3.5 bg-gradient-to-b from-[#181510] to-[#0d0c0a] border border-[#C6A15B]/35 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.9)]">
              {/* Corner Gold Accent Markers */}
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#E5C378]" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#E5C378]" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#E5C378]" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#E5C378]" />

              {/* Image Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#080807]">
                <img
                  src="/images/about-philosophy.webp"
                  alt="DIAGEO Master Blender inspecting aged spirit clarity in private cellar"
                  className="w-full h-full object-cover object-center filter contrast-110 brightness-95 hover:scale-102 transition-transform duration-700 ease-out"
                />

                {/* Layered Lighting Vignette */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080807] via-transparent to-transparent opacity-85"
                  aria-hidden="true"
                />

                {/* Provenance Plaque Overlay */}
                <div className="absolute bottom-5 inset-x-5 p-4 sm:p-5 bg-black/85 border border-[#C6A15B]/30 backdrop-blur-xl rounded-lg shadow-2xl">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.28em] uppercase text-[#E5C378] font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] animate-pulse" />
                      ARCHIVE NO. 1988 · PRIVATE CELLAR
                    </span>
                    <span className="text-[9px] font-sans tracking-widest text-stone/50 uppercase">
                      SCOTLAND
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-serif text-[#FAF7F2] font-normal leading-relaxed">
                    Master Blender inspecting the clarity and viscosity of cask reserve spirits by candlelight.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* 4. THE THREE PILLARS OF DISCOVERY */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="relative py-28 sm:py-36 px-4 sm:px-6 md:px-12 overflow-hidden border-t border-[#C6A15B]/20">
        <ParallaxImage
          src="/images/tasting-bar-bg.jpg"
          speed={0.25}
          overlay={0.88}
        />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-4 h-px bg-[#C6A15B]/60" />
              <span className="text-[10px] font-sans tracking-[0.32em] uppercase text-[#C6A15B] font-semibold">
                OUR THREE FOUNDATIONS
              </span>
              <span className="w-4 h-px bg-[#C6A15B]/60" />
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight bg-gradient-to-r from-[#FFFBF0] via-[#E5C378] to-[#C6A15B] bg-clip-text text-transparent">
              Principles of the Sanctuary
            </h2>
          </div>

          {/* Cards Grid */}
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
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 1.0, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-gradient-to-b from-[#13110e]/90 via-[#0e0d0b]/90 to-[#070605]/95 border border-[#C6A15B]/25 hover:border-[#E5C378]/60 p-8 sm:p-10 rounded-xl backdrop-blur-xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(198,161,91,0.2)] hover:-translate-y-1.5"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-sans tracking-[0.3em] font-semibold text-[#C6A15B]">
                    {v.number}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#C6A15B]/40 group-hover:bg-[#C6A15B] group-hover:shadow-[0_0_8px_#C6A15B] transition-all" />
                </div>
                <div className="h-px w-10 bg-gradient-to-r from-[#C6A15B] to-transparent mb-6 group-hover:w-16 transition-all duration-500" />
                
                <h3 className="font-serif text-2xl sm:text-3xl font-normal mb-4 bg-gradient-to-r from-[#FAF7F2] to-[#D8BD7A] group-hover:from-[#FFF8DB] group-hover:to-[#E5C378] bg-clip-text text-transparent transition-all">
                  {v.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-stone/80 leading-relaxed font-sans font-light">
                  {v.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* 5. FINAL INVITATION CALL TO ACTION */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 md:px-12 text-center bg-gradient-to-b from-[#080807] via-[#100e0b] to-[#080807] border-t border-[#C6A15B]/20 overflow-hidden">
        {/* Ambient Center Glow */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full blur-[120px] opacity-20"
          style={{ background: 'radial-gradient(ellipse at center, #C6A15B 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.32em] uppercase text-[#C6A15B] block mb-4 font-semibold">
            YOUR PALATE AWAITS
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal mb-8 bg-gradient-to-r from-[#FFF5DC] via-[#E5C378] to-[#C6A15B] bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(198,161,91,0.2)]">
            Begin your personal tasting journey.
          </h2>
          <Link
            to="/discovery"
            className="inline-flex items-center gap-3 px-9 py-4 sm:py-5 rounded-lg bg-gradient-to-r from-[#C6A15B] to-[#E5C378] text-[#080807] font-sans font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase hover:shadow-[0_0_40px_rgba(198,161,91,0.5)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <span>Discover Your Spirit</span>
            <span className="font-bold text-base">→</span>
          </Link>
        </div>
      </section>
    </Layout>
  )
}

