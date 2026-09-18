import { motion } from 'framer-motion'
import Layout from '@/components/Layout'
import SectionLabel from '@/components/SectionLabel'
import CollectionGrid from '@/components/CollectionGrid'
import { spirits } from '@/data/spirits'

export default function Collection() {
  return (
    <Layout>
      <section className="px-4 sm:px-6 md:px-10 pt-28 sm:pt-36 md:pt-48 pb-12 sm:pb-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Editorial Header */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <SectionLabel className="mb-4 sm:mb-5">The Collection</SectionLabel>
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-ivory text-balance leading-[1.06]">
              A curated world of spirits.
            </h1>
            <p className="mt-6 sm:mt-8 text-stone max-w-lg leading-relaxed text-base sm:text-lg">
              Six categories, each represented by expressions chosen for character rather than
              volume. Explore by category, or let discovery choose for you.
            </p>

            {/* Animated gold divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 sm:mt-12 h-px w-full max-w-md bg-gradient-to-r from-gold/40 via-gold/20 to-transparent origin-left"
            />
          </motion.div>

          {/* Right Column: Collection Hero Group with Minimalist Rich Border */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative flex items-center justify-center lg:justify-end"
          >
            {/* Subtle atmospheric warm amber halo */}
            <div
              className="absolute -inset-4 rounded-full bg-gradient-to-tr from-gold/[0.12] via-amber-600/[0.04] to-transparent blur-[80px] pointer-events-none"
              aria-hidden="true"
            />

            {/* Minimalist Premium Frame */}
            <div className="relative w-full max-w-lg group">
              {/* Outer hairline metallic gold border with soft glass elevation */}
              <div className="relative p-2 sm:p-2.5 rounded-sm bg-surface/40 backdrop-blur-md border border-gold/25 shadow-[0_25px_60px_rgba(0,0,0,0.85)] transition-all duration-700 hover:border-gold/45">
                
                {/* Minimalist corner accents for bespoke quiet luxury */}
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-gold/70 pointer-events-none" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-gold/70 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-gold/70 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-gold/70 pointer-events-none" />

                {/* Inner image container with fine inner hairline */}
                <div className="relative overflow-hidden rounded-xs bg-char/90 border border-gold/15">
                  <img
                    src="/images/collection-hero-group.jpg"
                    alt="Diageo Reserve Spirits Collection"
                    className="w-full h-auto object-cover filter brightness-[1.03] contrast-[1.02] transition-transform duration-1000 ease-out group-hover:scale-[1.025]"
                    loading="eager"
                  />

                  {/* Ground vignette gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-obsidian/90 via-obsidian/40 to-transparent pointer-events-none" />

                  {/* Minimalist refined editorial caption */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-[10px] sm:text-[11px] font-mono tracking-widest2 text-stone/85 pointer-events-none">
                    <span className="text-gold-light flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-light inline-block animate-pulse" />
                      THE RESERVE COLLECTION
                    </span>
                    <span className="text-stone/60 uppercase">Ten Curated Houses</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 sm:px-6 md:px-10 pb-20 sm:pb-32 lg:pb-40 max-w-7xl mx-auto">
        <CollectionGrid spirits={spirits} />
      </section>
    </Layout>
  )
}
