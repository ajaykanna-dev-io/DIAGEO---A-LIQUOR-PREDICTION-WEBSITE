import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const navLinks = [
  { to: '/discovery', label: 'Taste Discovery' },
  { to: '/collection', label: 'The Reserve Collection' },
  { to: '/about', label: 'The DIAGEO House' },
  { to: '/privacy', label: 'Privacy & Discretion' },
  { to: '/terms', label: 'Terms & Protocol' },
]

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      className="relative border-t border-gold/15 bg-obsidian overflow-hidden"
    >
      {/* Cinematic Photorealistic Background Still Life */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <img
          src="/images/footer-bg.jpg"
          alt=""
          className="w-full h-full object-cover object-right md:object-center opacity-85 filter brightness-[0.88] contrast-[1.05]"
          loading="lazy"
        />
        {/* Editorial atmospheric darkening scrims for pristine text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/85 to-obsidian/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/90 to-transparent md:w-3/4" />
        {/* Subtle top hairline golden accent */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      </div>

      {/* Structured 3-Column Architectural Layout with Pristine Top Alignment */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-10 pt-14 sm:pt-16 md:pt-20 pb-12 sm:pb-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-14 items-start">
        
        {/* Column 1: Brand & Atelier Mission (Cols 1-5) */}
        <div className="md:col-span-5 flex flex-col items-start">
          <Link
            to="/"
            className="font-display text-2xl tracking-[0.2em] text-ivory transition-opacity duration-500 hover:opacity-80 inline-block"
          >
            DIAGEO
          </Link>
          <div className="flex items-center gap-2 mt-3">
            <span className="w-1 h-1 rounded-full bg-gold-light/60" />
            <p className="text-xs uppercase tracking-[0.18em] text-gold-light/90 font-mono">
              Spirits &amp; Taste Discovery
            </p>
          </div>
          <p className="mt-4 text-xs text-stone/75 leading-relaxed max-w-sm font-sans">
            A bespoke taste-discovery journey guiding curious palates through the world&rsquo;s most extraordinary reserve houses.
          </p>
          <div className="w-12 h-px bg-gradient-to-r from-gold/30 to-transparent mt-6" />
        </div>

        {/* Column 2: The Tasting Creed (Cols 6-8) */}
        <div className="md:col-span-4 flex flex-col items-start md:border-l md:border-stone/10 md:pl-8 border-t border-stone/10 pt-6 md:border-t-0 md:pt-0 w-full">
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold-light/70 font-mono block mb-3">
            Tasting Creed
          </span>
          <p className="font-display text-lg sm:text-xl md:text-2xl italic tracking-[0.05em] text-ivory/95 leading-snug">
            &ldquo;More than a drink.
            <br />
            <span className="text-gold-light/90 not-italic font-normal">A reflection of you.&rdquo;</span>
          </p>
          <p className="text-xs text-stone/50 font-mono mt-3">
            Curated for discerning palates worldwide.
          </p>
        </div>

        {/* Column 3: Navigation Links (Cols 9-12) */}
        <div className="md:col-span-3 flex flex-col items-start md:border-l md:border-stone/10 md:pl-8 border-t border-stone/10 pt-6 md:border-t-0 md:pt-0 w-full">
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold-light/70 font-mono block mb-4">
            Navigation
          </span>
          <nav className="flex flex-col gap-2.5 sm:gap-3 font-mono text-xs w-full">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="footer-link-sweep uppercase tracking-[0.15em] text-stone/80 hover:text-ivory transition-colors duration-400 inline-flex items-center gap-2 group py-0.5"
              >
                <span className="text-gold-light/40 text-[9px] transition-transform duration-300 group-hover:translate-x-0.5">
                  ·
                </span>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

      </div>

      <div className="relative z-10 hairline" />

      {/* Bottom Disclaimer & Copyright */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-10 py-6 sm:py-7 flex flex-col sm:flex-row gap-3 items-center justify-between text-center sm:text-left font-mono text-[0.7rem] text-stone/55">
        <p>
          © {new Date().getFullYear()} <span className="font-display text-xs tracking-[0.15em] text-ivory/80">DIAGEO</span>. Crafted with bespoke restraint.
        </p>
        <p className="text-stone/50">
          Please savor with intention and enjoy responsibly.
        </p>
      </div>
    </motion.footer>
  )
}
