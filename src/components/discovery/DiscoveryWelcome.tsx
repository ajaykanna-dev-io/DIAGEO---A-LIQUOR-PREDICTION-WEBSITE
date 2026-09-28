import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ────────────────────────────────────────────────────────────────────────────
 *  SENSORY DIMENSIONS DATA — Exact 3D Perspective Slanted Vertices (1920x1080)
 * ──────────────────────────────────────────────────────────────────────── */

interface Point {
  x: number
  y: number
}

interface SensoryStele {
  id: string
  num: string
  label: string
  subtitle: string
  notes: string[]
  accent: string
  // 4 perspective polygon vertices in 1920x1080
  tl: Point
  tr: Point
  br: Point
  bl: Point
  bottomCenter: Point
}

const SENSORY_STELES: SensoryStele[] = [
  {
    id: 'aroma',
    num: '01',
    label: 'AROMA',
    subtitle: 'Charred Oak & Peat Smoke',
    notes: ['Virgin Cask Smoke', 'Toasted Hickory', 'Campfire Ember'],
    accent: '#E8A84C',
    tl: { x: 752, y: 196 },
    tr: { x: 856, y: 246 },
    br: { x: 856, y: 636 },
    bl: { x: 752, y: 636 },
    bottomCenter: { x: 804, y: 636 },
  },
  {
    id: 'flavour',
    num: '02',
    label: 'FLAVOUR',
    subtitle: 'Jasmine & Botanical Honey',
    notes: ['Vanilla Pod', 'White Gardenia', 'Rare Wild Blossom'],
    accent: '#F3D279',
    tl: { x: 890, y: 272 },
    tr: { x: 974, y: 312 },
    br: { x: 974, y: 648 },
    bl: { x: 890, y: 648 },
    bottomCenter: { x: 932, y: 648 },
  },
  {
    id: 'texture',
    num: '03',
    label: 'TEXTURE',
    subtitle: 'Sunlit Citrus & Silken Viscosity',
    notes: ['Candied Peel', 'Velvet Mouthfeel', 'Golden Nectar'],
    accent: '#FFA733',
    tl: { x: 998, y: 352 },
    tr: { x: 1068, y: 382 },
    br: { x: 1068, y: 658 },
    bl: { x: 998, y: 658 },
    bottomCenter: { x: 1033, y: 658 },
  },
  {
    id: 'warmth',
    num: '04',
    label: 'WARMTH',
    subtitle: 'Toasted Cinnamon & Fiery Spice',
    notes: ['Winter Clove', 'Cracked Pepper', 'Radiant Heat'],
    accent: '#FF7A33',
    tl: { x: 1516, y: 382 },
    tr: { x: 1586, y: 352 },
    br: { x: 1586, y: 658 },
    bl: { x: 1516, y: 658 },
    bottomCenter: { x: 1551, y: 658 },
  },
  {
    id: 'depth',
    num: '05',
    label: 'DEPTH',
    subtitle: 'Liquid Caramel & Roasted Malt',
    notes: ['PX Sherry Cask', 'Burnt Toffee', 'Rich Treacle'],
    accent: '#DCA048',
    tl: { x: 1618, y: 312 },
    tr: { x: 1702, y: 272 },
    br: { x: 1702, y: 648 },
    bl: { x: 1618, y: 648 },
    bottomCenter: { x: 1660, y: 648 },
  },
  {
    id: 'character',
    num: '06',
    label: 'CHARACTER',
    subtitle: 'Wild Blackberries & Cask Tannins',
    notes: ['Dark Forest Fruit', 'Dried Fig', 'European Oak'],
    accent: '#B85D88',
    tl: { x: 1762, y: 246 },
    tr: { x: 1866, y: 196 },
    br: { x: 1866, y: 636 },
    bl: { x: 1762, y: 636 },
    bottomCenter: { x: 1814, y: 636 },
  },
]

/* ────────────────────────────────────────────────────────────────────────────
 *  UNIVERSAL 16:9 COVER DIMENSION HOOK
 * ──────────────────────────────────────────────────────────────────────── */

function useCoverDimensions(frameRef: React.RefObject<HTMLDivElement>) {
  const [dims, setDims] = useState({ width: 1920, height: 1080, left: 0, top: 0 })

  useEffect(() => {
    function handleResize() {
      if (!frameRef.current) return
      const rect = frameRef.current.getBoundingClientRect()
      const W = rect.width
      const H = rect.height
      const ratio = 1920 / 1080
      if (W / H > ratio) {
        const h = W / ratio
        setDims({ width: W, height: h, left: 0, top: (H - h) / 2 })
      } else {
        const w = H * ratio
        setDims({ width: w, height: H, left: (W - w) / 2, top: 0 })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [frameRef])

  return dims
}

/* ────────────────────────────────────────────────────────────────────────────
 *  ETHEREAL AROMA STREAM — Golden spiraling vapor rising from the hero glass
 * ──────────────────────────────────────────────────────────────────────── */

function HeroAromaStream({ activeStele }: { activeStele: SensoryStele | null }) {
  return (
    <div
      className="absolute pointer-events-none z-[12] overflow-visible"
      style={{
        left: '66.15%',
        top: '28%',
        width: '12%',
        height: '34%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <svg
        viewBox="0 0 200 300"
        fill="none"
        className="w-full h-full overflow-visible"
        style={{
          filter: activeStele
            ? `drop-shadow(0 0 16px ${activeStele.accent}88)`
            : 'drop-shadow(0 0 12px rgba(232, 209, 150, 0.45))',
          transition: 'filter 0.5s ease',
        }}
      >
        <defs>
          <linearGradient id="goldVaporGrad1" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#C6A15B" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#E8D196" stopOpacity="0.6" />
            <stop offset="80%" stopColor="#D4BC74" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#C6A15B" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="goldVaporGrad2" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FFA733" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#E8D196" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.path
          d="M 95 270 Q 115 220 90 170 T 110 80 Q 120 40 100 10"
          stroke="url(#goldVaporGrad1)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          animate={{
            y: [0, -12, 0],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.path
          d="M 105 270 Q 75 230 110 180 T 85 90 Q 75 50 115 15"
          stroke="url(#goldVaporGrad2)"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          animate={{
            y: [0, -16, 0],
            opacity: [0.4, 0.75, 0.4],
          }}
          transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />

        <motion.path
          d="M 100 270 Q 125 240 105 195 T 120 110 Q 130 65 110 25"
          stroke="url(#goldVaporGrad1)"
          strokeWidth="1.2"
          fill="none"
          strokeDasharray="4 6"
          strokeLinecap="round"
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </svg>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
 *  FLOATING AMBER GOLD PARTICLES
 * ──────────────────────────────────────────────────────────────────────── */

function AtmosphericEmbers() {
  const embers = useMemo(() => {
    return Array.from({ length: 42 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: 20 + Math.random() * 80,
      size: 1.2 + Math.random() * 2.6,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 6,
      opacity: 0.2 + Math.random() * 0.5,
      driftX: -20 + Math.random() * 40,
    }))
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[9]" aria-hidden="true">
      {embers.map((p) => (
        <motion.div
          key={p.id}
          animate={{
            y: [0, -120 - Math.random() * 80],
            x: [0, p.driftX, 0],
            opacity: [0, p.opacity, p.opacity * 0.8, 0],
            scale: [0.8, 1.2, 0.6],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeOut',
          }}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background:
              p.id % 3 === 0
                ? 'radial-gradient(circle, #FFF2CE 0%, #E8D196 60%, transparent 100%)'
                : 'radial-gradient(circle, #FFA733 0%, #C6A15B 50%, transparent 100%)',
            boxShadow: `0 0 ${p.size * 3}px rgba(198,161,91,0.5)`,
          }}
        />
      ))}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
 *  MAIN DISCOVERY WELCOME COMPONENT
 * ──────────────────────────────────────────────────────────────────────── */

interface DiscoveryWelcomeProps {
  onBegin: () => void
}

export default function DiscoveryWelcome({ onBegin }: DiscoveryWelcomeProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [activeSteleId, setActiveSteleId] = useState<string | null>(null)
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 })
  const frameRef = useRef<HTMLDivElement>(null)

  // Calibrate covered 16:9 canvas strictly inside the outer architectural frame
  const coverDims = useCoverDimensions(frameRef)

  // Staggered entrance animation
  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 150)
    return () => clearTimeout(t)
  }, [])

  // Auto-cycle through the 6 steles when user is idle
  useEffect(() => {
    if (isTransitioning) return
    const interval = setInterval(() => {
      setActiveSteleId((curr) => {
        if (!curr) return SENSORY_STELES[0].id
        const idx = SENSORY_STELES.findIndex((s) => s.id === curr)
        const nextIdx = (idx + 1) % SENSORY_STELES.length
        return SENSORY_STELES[nextIdx].id
      })
    }, 4500)
    return () => clearInterval(interval)
  }, [isTransitioning])

  // Parallax tracking
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    const x = (clientX / innerWidth - 0.5) * 14
    const y = (clientY / innerHeight - 0.5) * 10
    setMouseParallax({ x, y })
  }, [])

  // Start discovery trigger
  const handleBeginClick = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      onBegin()
    }, 1600)
  }, [isTransitioning, onBegin])

  const activeStele = useMemo(() => {
    return SENSORY_STELES.find((s) => s.id === activeSteleId) || null
  }, [activeSteleId])

  return (
    <div
      onMouseMove={handleMouseMove}
      className="fixed inset-0 w-screen h-[100svh] overflow-hidden text-[#FAF7F2] select-none bg-[#030201] flex items-center justify-center p-3 sm:p-5 md:p-6"
      style={{
        perspective: '1200px',
      }}
    >
      {/* ── ARCHITECTURAL FRAME CONTAINER (NO IMAGE BLEED OUTSIDE) ── */}
      <div
        ref={frameRef}
        className="relative w-full h-full rounded-sm overflow-hidden flex flex-col justify-between"
        style={{
          boxShadow: '0 0 60px rgba(0,0,0,0.98), inset 0 0 0 1px rgba(198,161,91,0.2)',
        }}
      >
        {/* ── 1. 16:9 LOCKED SANCTUARY ALTAR CANVAS (CONTAINED INSIDE FRAME) ── */}
        <motion.div
          animate={{
            scale: isTransitioning ? 1.06 : 1,
            x: mouseParallax.x * -0.5,
            y: mouseParallax.y * -0.5,
            filter: isTransitioning
              ? 'brightness(1.8) blur(6px)'
              : 'brightness(1.0) blur(0px)',
          }}
          transition={{
            scale: { duration: 1.6, ease: [0.16, 1, 0.3, 1] },
            x: { duration: 0.8, ease: 'easeOut' },
            y: { duration: 0.8, ease: 'easeOut' },
            filter: { duration: 1.2 },
          }}
          className="absolute pointer-events-none z-0 overflow-hidden"
          style={{
            width: `${coverDims.width}px`,
            height: `${coverDims.height}px`,
            left: `${coverDims.left}px`,
            top: `${coverDims.top}px`,
          }}
          aria-hidden="true"
        >
          {/* Background Image — Contained cleanly inside frame */}
          <img
            src="/images/taste-discovery-altar-1080p.jpg"
            alt="Whisky Sanctuary Vault Altar"
            className="w-full h-full object-cover block"
          />

          {/* Dynamic Atmospheric Light Pulse on the Archway Portal */}
          <motion.div
            animate={{
              opacity: [0.25, 0.45, 0.25],
              scale: [0.98, 1.03, 0.98],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute pointer-events-none z-[1]"
            style={{
              left: '66%',
              top: '32%',
              transform: 'translate(-50%, -50%)',
              width: '45%',
              height: '60%',
              background:
                'radial-gradient(ellipse at center, rgba(232, 209, 150, 0.35) 0%, rgba(198, 161, 91, 0.12) 40%, transparent 75%)',
              filter: 'blur(48px)',
            }}
          />

          {/* Hero Aroma Vapor Spiral — Locked directly over the Glencairn Glass */}
          <HeroAromaStream activeStele={activeStele} />

          {/* ── GLOWING THEME OF GOLD (STRICTLY AT BOTTOM EDGE — ZERO CARD BODY WASH) ── */}
          <svg
            viewBox="0 0 1920 1080"
            className="absolute inset-0 w-full h-full pointer-events-none z-[15] overflow-visible hidden md:block"
          >
            <defs>
              {/* Focused Pedestal Baseline Glow Filter */}
              <filter id="bottomPedestalGlow" x="-20%" y="-40%" width="140%" height="250%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="wideBlur" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="tightBlur" />
                <feMerge>
                  <feMergeNode in="wideBlur" />
                  <feMergeNode in="tightBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {SENSORY_STELES.map((stele) => {
              const isActive = activeSteleId === stele.id
              const pts = `${stele.tl.x},${stele.tl.y} ${stele.tr.x},${stele.tr.y} ${stele.br.x},${stele.br.y} ${stele.bl.x},${stele.bl.y}`

              return (
                <g
                  key={stele.id}
                  className="pointer-events-auto cursor-pointer"
                  onMouseEnter={() => setActiveSteleId(stele.id)}
                  onClick={() => setActiveSteleId(stele.id)}
                >
                  {/* Invisible hit area covering exact slanted card */}
                  <polygon points={pts} fill="transparent" />

                  {/* GLOWING EFFECT: STRICTLY AT THE BOTTOM OF EACH CARD */}
                  {isActive && (
                    <g>
                      {/* 1. Downward Altar Floor Reflection (radiating beneath the bottom edge) */}
                      <ellipse
                        cx={(stele.bl.x + stele.br.x) / 2}
                        cy={stele.bl.y + 4}
                        rx={(stele.br.x - stele.bl.x) * 0.55}
                        ry="7"
                        fill={stele.accent}
                        opacity="0.65"
                        filter="url(#bottomPedestalGlow)"
                      />

                      {/* 2. Soft Gold Ambient Glow Line along Bottom Edge */}
                      <line
                        x1={stele.bl.x}
                        y1={stele.bl.y}
                        x2={stele.br.x}
                        y2={stele.br.y}
                        stroke="#C6A15B"
                        strokeWidth="5"
                        strokeLinecap="round"
                        filter="url(#bottomPedestalGlow)"
                        opacity="0.8"
                      />

                      {/* 3. Radiant Pure Gold Beam Line along Bottom Edge */}
                      <line
                        x1={stele.bl.x}
                        y1={stele.bl.y}
                        x2={stele.br.x}
                        y2={stele.br.y}
                        stroke="#E8D196"
                        strokeWidth="3"
                        strokeLinecap="round"
                        opacity="0.95"
                      />

                      {/* 4. Intense White-Gold Core Highlight along Bottom Edge */}
                      <line
                        x1={stele.bl.x + 2}
                        y1={stele.bl.y}
                        x2={stele.br.x - 2}
                        y2={stele.br.y}
                        stroke="#FFFDF5"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        opacity="1"
                      />
                    </g>
                  )}
                </g>
              )
            })}
          </svg>

          {/* ── SENSORY DESCRIPTOR POPOVER (Positioned cleanly below active card) ── */}
          <div className="absolute inset-0 pointer-events-none z-[16] hidden md:block">
            {activeStele && (
              <motion.div
                key={activeStele.id}
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="absolute p-3.5 rounded-lg border border-[#C6A15B]/50 bg-[#030201]/95 backdrop-blur-xl shadow-[0_12px_36px_rgba(0,0,0,0.95)] z-30 pointer-events-none"
                style={{
                  left: `${Math.min(84, Math.max(48, (activeStele.bottomCenter.x / 1920) * 100))}%`,
                  top: `${(activeStele.bottomCenter.y / 1080) * 100 + 1.5}%`,
                  transform: 'translateX(-50%)',
                  width: '260px',
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-sans text-[8px] tracking-[0.3em] uppercase text-[#C6A15B] font-semibold">
                    {activeStele.num} / {activeStele.label}
                  </span>
                  <span
                    className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
                    style={{ background: activeStele.accent, color: activeStele.accent }}
                  />
                </div>
                <p className="font-serif italic text-[12px] sm:text-[13px] text-[#FFF0D0] mb-2 leading-snug">
                  {activeStele.subtitle}
                </p>
                <div className="flex flex-wrap gap-1">
                  {activeStele.notes.map((note, ni) => (
                    <span
                      key={ni}
                      className="px-1.5 py-0.5 rounded text-[8px] tracking-wide text-[#FAF7F2]/85 bg-[#C6A15B]/15 border border-[#C6A15B]/25 font-sans"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ── 2. ARCHITECTURAL LUXURY SHADOW ON THE LEFT ── */}
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            background:
              'linear-gradient(90deg, #030201 0%, #030201 35%, rgba(3,2,1,0.92) 37.5%, rgba(3,2,1,0.4) 40%, transparent 42%)',
          }}
          aria-hidden="true"
        />

        {/* Top & Bottom Cinematic Vignettes */}
        <div
          className="absolute inset-0 pointer-events-none z-[3]"
          style={{
            background:
              'radial-gradient(ellipse 90% 85% at 50% 50%, transparent 40%, rgba(3,2,1,0.6) 80%, rgba(3,2,1,0.95) 100%)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40 pointer-events-none z-[3]"
          style={{
            background: 'linear-gradient(to top, #030201 0%, rgba(3,2,1,0.6) 50%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        {/* ── 3. FLOATING PARTICLES & GOLD DUST MOTES ── */}
        <AtmosphericEmbers />

        {/* ── 4. ARCHITECTURAL OUTER BORDER FRAME (PROPERLY INSET WITH ZERO TOP CLIPPING) ── */}
        <div className="absolute inset-5 sm:inset-7 md:inset-9 pointer-events-none z-[30]" aria-hidden="true">
          {/* Top-Left Corner Bracket ┌ */}
          <div className="absolute top-0 left-0">
            <div className="w-5 sm:w-7 h-[1.5px] bg-[#C6A15B]" />
            <div className="w-[1.5px] h-5 sm:h-7 bg-[#C6A15B]" />
          </div>

          {/* Top-Right Corner Bracket ┐ */}
          <div className="absolute top-0 right-0 flex flex-col items-end">
            <div className="w-5 sm:w-7 h-[1.5px] bg-[#C6A15B]" />
            <div className="w-[1.5px] h-5 sm:h-7 bg-[#C6A15B]" />
          </div>

          {/* Bottom-Left Corner Bracket └ */}
          <div className="absolute bottom-0 left-0 flex flex-col justify-end">
            <div className="w-[1.5px] h-5 sm:h-7 bg-[#C6A15B]" />
            <div className="w-5 sm:w-7 h-[1.5px] bg-[#C6A15B]" />
          </div>

          {/* Bottom-Right Corner Bracket ┘ */}
          <div className="absolute bottom-0 right-0 flex flex-col items-end justify-end">
            <div className="w-[1.5px] h-5 sm:h-7 bg-[#C6A15B]" />
            <div className="w-5 sm:w-7 h-[1.5px] bg-[#C6A15B]" />
          </div>

          {/* Left Vertical Framing Line */}
          <div className="absolute top-7 bottom-7 left-0 w-px bg-gradient-to-b from-[#C6A15B]/50 via-[#C6A15B]/20 to-[#C6A15B]/50" />

          {/* Right Vertical Framing Line */}
          <div className="absolute top-7 bottom-7 right-0 w-px bg-gradient-to-b from-[#C6A15B]/50 via-[#C6A15B]/20 to-[#C6A15B]/50" />

          {/* Bottom Horizontal Framing Line */}
          <div className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-[#C6A15B]/50 via-[#C6A15B]/20 to-[#C6A15B]/50" />

          {/* Top Horizontal Framing Line — Perfectly centered vertically with logo and labels */}
          <div className="absolute top-0 left-7 right-7 h-px flex items-center">
            {/* Line before logo */}
            <div className="w-3 sm:w-6 h-px bg-[#C6A15B]/50 shrink-0" />

            {/* Nº8 Reserve Logo Badge (Fully visible, zero clipping) */}
            <div className="pointer-events-auto px-3 sm:px-4 py-1 flex items-center shrink-0">
              <img
                src="/images/logo-BJ7D25WF.webp"
                alt="Nº8 Reserve"
                className="h-8 sm:h-10 w-auto object-contain drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]"
              />
            </div>

            {/* Line after logo */}
            <div className="w-3 sm:w-6 h-px bg-[#C6A15B]/40 shrink-0" />

            {/* Eyebrow Label (Fully visible, zero clipping) */}
            <span className="font-sans text-[8px] sm:text-[9.5px] tracking-[0.45em] text-[#C6A15B] uppercase font-semibold px-3 sm:px-4 shrink-0 hidden md:inline-block">
              AN EXCEPTIONAL EXPERIENCE AWAITS
            </span>

            {/* Long connecting line to center diamond */}
            <div className="flex-1 h-px bg-gradient-to-r from-[#C6A15B]/40 to-[#C6A15B]/50 min-w-[16px]" />

            {/* Central Luxury Gold Diamond Ornament ◇ (Fully visible) */}
            <div className="mx-3 sm:mx-4 w-2 sm:w-2.5 h-2 sm:h-2.5 rotate-45 border border-[#C6A15B] bg-[#030201] shrink-0 shadow-[0_0_8px_rgba(198,161,91,0.5)]" />

            {/* Long connecting line from center diamond towards right */}
            <div className="flex-1 h-px bg-gradient-to-r from-[#C6A15B]/50 to-[#C6A15B]/40 min-w-[16px]" />

            {/* TASTE DISCOVERY Badge (Fully visible) */}
            <div className="pointer-events-auto flex items-center gap-2 px-3 sm:px-4 py-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8D196] shadow-[0_0_8px_rgba(232,209,150,0.8)] animate-pulse" />
              <span className="font-sans text-[8.5px] sm:text-[10px] tracking-[0.4em] text-[#E8D196] uppercase font-semibold">
                TASTE DISCOVERY
              </span>
            </div>

            {/* Final line to top-right corner */}
            <div className="w-3 sm:w-6 h-px bg-[#C6A15B]/50 shrink-0" />
          </div>
        </div>

        {/* ── 5. EDITORIAL HERO SECTION (LEFT ALIGNED INSIDE FRAME) ── */}
        <div className="relative z-[20] w-full max-w-[1720px] mx-auto my-auto flex items-center px-8 sm:px-14 lg:px-20 pointer-events-none">
          <div className="w-full max-w-[600px] pointer-events-auto">
            {/* Main Title — Grand Luxury Serif Typography */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 24 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="font-serif text-[clamp(2.3rem,4.2vw,4.4rem)] leading-[1.08] text-[#FAF7F2] font-normal tracking-tight mb-6 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]"
            >
              ARE YOU READY
              <br />
              TO DISCOVER
              <br />
              <span
                className="bg-gradient-to-r from-[#FFF0D0] via-[#E8D196] to-[#C6A15B] bg-clip-text text-transparent font-medium inline-block mt-1"
                style={{
                  filter: 'drop-shadow(0 0 25px rgba(232,209,150,0.3))',
                }}
              >
                YOUR TASTE?
              </span>
            </motion.h1>

            {/* Subtitle / Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 16 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-serif italic text-[15px] sm:text-[17px] text-[#FAF7F2]/75 leading-relaxed max-w-[480px] mb-9 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
            >
              Explore your palate through aroma, texture, warmth, depth and character.
            </motion.p>

            {/* Primary CTA — Ultra-Luxurious Pill Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex items-center gap-6"
            >
              <button
                type="button"
                onClick={handleBeginClick}
                disabled={isTransitioning}
                className="group relative flex items-center gap-6 pl-9 pr-4 py-3.5 rounded-full cursor-pointer focus:outline-none transition-all duration-500 disabled:cursor-wait"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(198,161,91,0.2) 0%, rgba(198,161,91,0.06) 100%)',
                  border: '1.5px solid rgba(232, 209, 150, 0.45)',
                  boxShadow:
                    '0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(198,161,91,0.15), inset 0 1px 1px rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                {/* Shimmer light pass */}
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                  <motion.div
                    animate={{ x: ['-120%', '220%'] }}
                    transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
                    className="absolute inset-y-0 w-2/5"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, rgba(255,240,208,0.18), transparent)',
                    }}
                  />
                </div>

                {/* Button text */}
                <span className="relative font-sans text-[11px] sm:text-[12px] tracking-[0.4em] text-[#FFF0D0] uppercase font-semibold group-hover:text-white transition-colors duration-300">
                  LET'S BEGIN
                </span>

                {/* Glowing Arrow Disc */}
                <span
                  className="relative flex items-center justify-center w-10 h-10 rounded-full border border-[#E8D196]/60 group-hover:border-[#FFF0D0] group-hover:scale-105 transition-all duration-300"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(198,161,91,0.3) 0%, rgba(10,8,6,0.5) 100%)',
                    boxShadow: '0 0 14px rgba(198,161,91,0.3)',
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="text-[#E8D196] group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5"
                  >
                    <path
                      d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                {/* Hover bloom aura */}
                <div
                  className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow:
                      '0 0 35px rgba(232,209,150,0.35), 0 0 70px rgba(198,161,91,0.15)',
                  }}
                />
              </button>
            </motion.div>

            {/* Bottom Stage Progress Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex items-center gap-4 mt-10 text-[#C6A15B]/50"
            >
              <span className="font-sans text-[11px] tracking-[0.25em] text-[#E8D196] font-medium">
                01
              </span>
              <div className="w-16 h-px bg-gradient-to-r from-[#E8D196]/80 via-[#C6A15B]/40 to-transparent" />
              <span className="font-sans text-[11px] tracking-[0.25em] text-[#C6A15B]/40 font-medium">
                05
              </span>
              <span className="text-[9px] tracking-[0.4em] uppercase text-[#C6A15B]/40 ml-2 hidden sm:inline">
                SENSORY CALIBRATION
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── 6. CINEMATIC FULLSCREEN TRANSITION ON BEGIN ── */}
      <AnimatePresence>
        {isTransitioning && (
          <>
            {/* Golden radial flare expanding from the altar */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 2.5, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed pointer-events-none z-[60]"
              style={{
                left: '60%',
                top: '40%',
                transform: 'translate(-50%, -50%)',
                width: '60vw',
                height: '60vw',
                background:
                  'radial-gradient(circle, rgba(232, 209, 150, 0.95) 0%, rgba(198, 161, 91, 0.6) 40%, transparent 75%)',
                filter: 'blur(30px)',
              }}
            />

            {/* Seamless fade to black for question screen entrance */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="fixed inset-0 bg-[#030201] z-[70] pointer-events-none"
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
