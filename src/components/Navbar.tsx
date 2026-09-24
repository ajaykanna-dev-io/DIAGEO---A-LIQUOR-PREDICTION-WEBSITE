import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import AmbientBarAudio from '@/components/AmbientBarAudio'
import BrandSettlingLogo from '@/components/BrandSettlingLogo'

const links = [
  { to: '/discovery', label: 'Discover' },
  { to: '/collection', label: 'Collection' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ease-luxe ${
        scrolled
          ? 'bg-obsidian/95 backdrop-blur-md border-b border-gold/15 shadow-deep'
          : 'bg-obsidian/80 backdrop-blur-md border-b border-white/[0.05]'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10 h-16 sm:h-20 flex items-center justify-between gap-4 sm:gap-6">
        <BrandSettlingLogo/>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="hidden md:flex items-center gap-8 lg:gap-12"
        >
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `nav-link-sweep text-xs uppercase tracking-[0.15em] transition-colors duration-500 ${
                    isActive ? 'text-gold-light' : 'text-stone hover:text-ivory'
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </motion.ul>

        {/* Ambient Speakeasy Bar Music Controller (Replaced Login) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="hidden md:flex items-center"
        >
          <AmbientBarAudio />
        </motion.div>

        <MobileMenu />
      </nav>
    </header>
  )
}

function MobileMenu() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="md:hidden">
      <button
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="relative z-50 flex h-9 w-9 items-center justify-center p-1.5 focus:outline-none"
      >
        <div className="flex flex-col items-center justify-center gap-1.5 w-5">
          <span
            className={`block h-px w-5 bg-ivory transition-transform duration-500 ease-luxe ${
              open ? 'translate-y-[3.5px] rotate-45' : ''
            }`}
          />
          <span
            className={`block h-px w-5 bg-ivory transition-transform duration-500 ease-luxe ${
              open ? '-translate-y-[3.5px] -rotate-45' : ''
            }`}
          />
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-40 bg-obsidian/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8 sm:gap-10 px-6">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="font-display text-3xl sm:text-4xl tracking-[0.15em] text-ivory hover:text-gold-light transition-colors duration-500"
            >
              {l.label}
            </NavLink>
          ))}
          <div className="w-12 h-px bg-gold/30 my-2" />
          <AmbientBarAudio isMobile />
        </div>
      )}
    </div>
  )
}
