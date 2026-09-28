import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface SensoryNodeItem {
  id: string
  label: string
  sublabel?: string
  image: string
}

export interface SensoryConstellationProps {
  notes: SensoryNodeItem[]
  isConverging?: boolean
  constellationKey?: string | number
  className?: string
  onNodeClick?: (note: SensoryNodeItem, index: number) => void
}

interface ResponsiveGeometry {
  radiusX: number
  radiusY: number
  baseNodeSize: number
  labelFontSize: number
}

/**
 * Calculates responsive semi-spherical ellipse radii and node dimensions
 * based on viewport width.
 */
function getResponsiveGeometry(viewportWidth: number): ResponsiveGeometry {
  if (viewportWidth < 640) {
    // Mobile viewport
    return {
      radiusX: 168,
      radiusY: 135,
      baseNodeSize: 66,
      labelFontSize: 8,
    }
  }
  if (viewportWidth < 1024) {
    // Tablet viewport
    return {
      radiusX: 300,
      radiusY: 200,
      baseNodeSize: 86,
      labelFontSize: 9,
    }
  }
  if (viewportWidth < 1440) {
    // Standard Desktop (1024 - 1439px)
    return {
      radiusX: 410,
      radiusY: 270,
      baseNodeSize: 104,
      labelFontSize: 10,
    }
  }
  // Large / Ultra-Wide Desktop (>= 1440px)
  return {
    radiusX: 440,
    radiusY: 290,
    baseNodeSize: 112,
    labelFontSize: 10.5,
  }
}

/**
 * Determines the angular span (in degrees) across the upper semi-sphere.
 * Centered strictly at -90° (top-center).
 *
 * 3 notes: 100° span (angles: -140°, -90°, -40°)
 * 4 notes: 114° span (angles: -147°, -109°, -71°, -33° — symmetrical split across center)
 * 5 notes: 120° span (angles: -150°, -120°, -90°, -60°, -30° — exact match to reference specification)
 * 6 notes: 128° span (angles: -154°, -128.4°, -102.8°, -77.2°, -51.6°, -26° — symmetrical split)
 * 7 notes: 134° span (angles: -157°, -134.7°, -112.3°, -90°, -67.7°, -45.3°, -23° — middle at -90°)
 */
function getArcSpan(count: number): number {
  switch (count) {
    case 3:
      return 100
    case 4:
      return 114
    case 5:
      return 120
    case 6:
      return 128
    case 7:
      return 134
    default:
      return Math.min(138, 90 + count * 6.5)
  }
}

/**
 * SensoryConstellation — Premium Semi-Spherical Constellation System
 *
 * Replaces all arbitrary and random positioning with a mathematically controlled
 * elliptical arc orbiting the central whisky glass anchor.
 *
 * Core Features:
 * 1. Mathematically derived elliptical arc: x = rx * cos(angle), y = ry * sin(angle)
 * 2. Guaranteed vertical symmetry:
 *    - Odd count: middle node locked at -90° (top-center)
 *    - Even count: split symmetrically across -90° (equidistant pairs)
 * 3. 3D depth curvature:
 *    - Center node: scale 1.0, opacity 1.0
 *    - Inner nodes: scale ~0.91, opacity ~0.91
 *    - Outer nodes: scale ~0.82, opacity ~0.82
 * 4. Luxury Medallion Anatomy:
 *    Outer glow → Thin gold gradient bezel (1.5px) → Dark separation ring (2px) →
 *    Sensory image → Specular highlight & inner rim → Gold diamond accent pip
 * 5. Astronomical Connecting Orbital Path:
 *    Ultra-thin champagne-gold SVG arc connecting the constellation with micro graduation ticks.
 * 6. Subtle Floating Orbital Movement:
 *    Individual translateY ±5px floating motion with staggered duration (4.8s - 7.0s).
 * 7. Emerge & Convergence Transitions:
 *    Emerges from center/behind glass with 1100ms cubic-bezier and staggers;
 *    converges seamlessly to (0, 0) of glass upon distillation completion.
 */
export default function SensoryConstellation({
  notes,
  isConverging = false,
  constellationKey = 'default',
  className = '',
  onNodeClick,
}: SensoryConstellationProps) {
  // Listen to window resize for responsive geometry
  const [viewportWidth, setViewportWidth] = useState(() => {
    if (typeof window !== 'undefined') return window.innerWidth
    return 1280
  })

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const geo = useMemo(() => getResponsiveGeometry(viewportWidth), [viewportWidth])

  // Derive mathematical positioning for each sensory note along the upper elliptical arc
  const positionedNodes = useMemo(() => {
    const count = notes.length
    if (count === 0) return []

    const span = getArcSpan(count)
    const startAngle = -90 - span / 2
    const step = count > 1 ? span / (count - 1) : 0

    return notes.map((note, index) => {
      // Calculate angle along the arc (in degrees, where -90° is top-center)
      const angle = count === 1 ? -90 : startAngle + index * step
      const rad = (angle * Math.PI) / 180

      // Cartesian coordinates relative to the glass center (0, 0)
      const x = Math.round(geo.radiusX * Math.cos(rad))
      const y = Math.round(geo.radiusY * Math.sin(rad))

      // Normalized distance from vertical top-center (-90°) from 0 (center) to 1.0 (outermost)
      const distFromCenter = span > 0 ? Math.abs(angle - -90) / (span / 2) : 0

      // Depth hierarchy: center is larger and fully opaque, outer nodes have subtle depth falloff
      const depthScale = Number((1.0 - distFromCenter * 0.18).toFixed(3))
      const depthOpacity = Number((1.0 - distFromCenter * 0.18).toFixed(3))
      const nodeDiameter = Math.round(geo.baseNodeSize * depthScale)
      const zIndex = Math.round(30 - distFromCenter * 8)

      // Stagger entrance delay: 80-120ms per node
      const delay = 0.2 + index * 0.09

      // Floating bob duration: unique per node between 4.8s and 6.8s
      const bobDuration = 4.8 + (index * 0.65) % 2.0

      return {
        ...note,
        index,
        angle,
        x,
        y,
        distFromCenter,
        depthScale,
        depthOpacity,
        nodeDiameter,
        zIndex,
        delay,
        bobDuration,
      }
    })
  }, [notes, geo])

  // Construct SVG connecting orbital path passing through all sensory node centers
  const orbitalSvgData = useMemo(() => {
    const count = notes.length
    if (count === 0) return null

    const span = getArcSpan(count)
    const startAngle = -90 - span / 2
    const step = count > 1 ? span / (count - 1) : 0

    // Extend arc slightly past outer nodes (8° pad) for refined celestial lead-in
    const arcPad = Math.min(9, step * 0.32)
    const angleStart = startAngle - arcPad
    const angleEnd = startAngle + span + arcPad

    const radStart = (angleStart * Math.PI) / 180
    const radEnd = (angleEnd * Math.PI) / 180

    const x1 = geo.radiusX * Math.cos(radStart)
    const y1 = geo.radiusY * Math.sin(radStart)
    const x2 = geo.radiusX * Math.cos(radEnd)
    const y2 = geo.radiusY * Math.sin(radEnd)

    // Primary SVG arc path from left to right along upper semi-sphere
    const primaryArc = `M ${x1} ${y1} A ${geo.radiusX} ${geo.radiusY} 0 0 1 ${x2} ${y2}`

    // Concentric secondary faint guide track (4% larger radius)
    const secRx = geo.radiusX * 1.04
    const secRy = geo.radiusY * 1.04
    const xSec1 = secRx * Math.cos(radStart)
    const ySec1 = secRy * Math.sin(radStart)
    const xSec2 = secRx * Math.cos(radEnd)
    const ySec2 = secRy * Math.sin(radEnd)
    const secondaryArc = `M ${xSec1} ${ySec1} A ${secRx} ${secRy} 0 0 1 ${xSec2} ${ySec2}`

    // Subtle graduation ticks along the arc (luxury horological watch dial detailing)
    const ticksCount = 9
    const graduationTicks = Array.from({ length: ticksCount }).map((_, idx) => {
      const tickAngle = startAngle + (span / (ticksCount - 1)) * idx
      const rad = (tickAngle * Math.PI) / 180
      const tickInnerR = 0.978
      const tickOuterR = 1.022
      return {
        id: idx,
        x1: geo.radiusX * tickInnerR * Math.cos(rad),
        y1: geo.radiusY * tickInnerR * Math.sin(rad),
        x2: geo.radiusX * tickOuterR * Math.cos(rad),
        y2: geo.radiusY * tickOuterR * Math.sin(rad),
        isCenter: Math.abs(tickAngle - -90) < 2,
      }
    })

    return {
      primaryArc,
      secondaryArc,
      graduationTicks,
      x1,
      y1,
      x2,
      y2,
    }
  }, [notes.length, geo])

  return (
    <div
      className={`absolute w-0 h-0 pointer-events-none select-none ${className}`}
      style={{
        // Origin is mathematically positioned at the center of the central whisky glass
        left: 0,
        top: 0,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`constellation-${constellationKey}-${notes.length}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 0.85,
            filter: 'blur(8px)',
            transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
          }}
          className="relative w-0 h-0 overflow-visible"
        >
          {/* ── 1. CONNECTING ORBITAL PATH SVG (LUXURY HOROLOGICAL TRACK) ── */}
          {orbitalSvgData && (
            <motion.svg
              initial={{ opacity: 0 }}
              animate={{
                opacity: isConverging ? 0 : 0.85,
                scale: isConverging ? 0.7 : 1,
              }}
              transition={{
                duration: isConverging ? 0.45 : 1.2,
                ease: [0.22, 1, 0.36, 1],
                delay: isConverging ? 0 : 0.15,
              }}
              className="absolute pointer-events-none overflow-visible z-10"
              style={{
                position: 'absolute',
                left: `-${geo.radiusX + 80}px`,
                top: `-${geo.radiusY + 60}px`,
                width: `${(geo.radiusX + 80) * 2}px`,
                height: `${(geo.radiusY + 60) * 2}px`,
                transformOrigin: `${geo.radiusX + 80}px ${geo.radiusY + 60}px`,
              }}
              viewBox={`-${geo.radiusX + 80} -${geo.radiusY + 60} ${(geo.radiusX + 80) * 2} ${(geo.radiusY + 60) * 2}`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="orbitalArcGrad"
                  gradientUnits="userSpaceOnUse"
                  x1={orbitalSvgData.x1}
                  y1={orbitalSvgData.y1}
                  x2={orbitalSvgData.x2}
                  y2={orbitalSvgData.y2}
                >
                  <stop offset="0%" stopColor="#C6A15B" stopOpacity="0.15" />
                  <stop offset="15%" stopColor="#E3C585" stopOpacity="0.75" />
                  <stop offset="50%" stopColor="#FFEAA5" stopOpacity="0.95" />
                  <stop offset="85%" stopColor="#E3C585" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#C6A15B" stopOpacity="0.15" />
                </linearGradient>
              </defs>

              {/* Secondary Faint Outer Orbit Rail */}
              <path
                d={orbitalSvgData.secondaryArc}
                stroke="#C6A15B"
                strokeWidth="1"
                strokeDasharray="2 7"
                strokeOpacity="0.45"
              />

              {/* Primary Constellation Arc Path (Passing through each node center) */}
              <path
                d={orbitalSvgData.primaryArc}
                stroke="url(#orbitalArcGrad)"
                strokeWidth="1.6"
                strokeDasharray="4 6"
              />

              {/* Horological Celestial Graduation Ticks */}
              {orbitalSvgData.graduationTicks.map((tick) => (
                <line
                  key={tick.id}
                  x1={tick.x1}
                  y1={tick.y1}
                  x2={tick.x2}
                  y2={tick.y2}
                  stroke={tick.isCenter ? '#FFEAA5' : '#E3C585'}
                  strokeWidth={tick.isCenter ? 1.8 : 1.2}
                  strokeOpacity={tick.isCenter ? 0.95 : 0.65}
                />
              ))}

              {/* Astronomical orbital node pips */}
              {positionedNodes.map((node) => (
                <g key={`pip-${node.id}`}>
                  <circle cx={node.x} cy={node.y} r="3.5" fill="#FFEAA5" opacity="0.85" />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="6.5"
                    stroke="#FFEAA5"
                    strokeWidth="0.8"
                    opacity="0.45"
                    strokeDasharray="1 3"
                  />
                </g>
              ))}
            </motion.svg>
          )}

          {/* ── 2. MATHEMATICALLY POSITIONED SENSORY MEDALLION NODES ── */}
          {positionedNodes.map((node) => {
            return (
              <motion.div
                key={node.id}
                initial={{
                  opacity: 0,
                  scale: 0.75,
                  filter: 'blur(8px)',
                  // Emerge outward from center/behind the hero glass
                  x: node.x * 0.35,
                  y: node.y * 0.35,
                }}
                animate={{
                  opacity: isConverging ? 0 : node.depthOpacity,
                  scale: isConverging ? 0.22 : 1,
                  filter: isConverging ? 'blur(6px)' : 'blur(0px)',
                  // Smoothly glide into final calculated position, or converge to (0,0) of glass
                  x: isConverging ? 0 : node.x,
                  y: isConverging ? 0 : node.y,
                }}
                transition={{
                  opacity: {
                    delay: isConverging ? 0 : node.delay,
                    duration: isConverging ? 0.45 : 0.75,
                    ease: [0.22, 1, 0.36, 1],
                  },
                  scale: {
                    delay: isConverging ? 0 : node.delay,
                    duration: isConverging ? 0.45 : 1.1,
                    ease: [0.22, 1, 0.36, 1],
                  },
                  filter: {
                    delay: isConverging ? 0 : node.delay,
                    duration: isConverging ? 0.45 : 0.8,
                  },
                  x: {
                    delay: isConverging ? 0 : node.delay,
                    duration: isConverging ? 0.5 : 1.1,
                    ease: isConverging ? [0.4, 0, 0.2, 1] : [0.22, 1, 0.36, 1],
                  },
                  y: {
                    delay: isConverging ? 0 : node.delay,
                    duration: isConverging ? 0.5 : 1.1,
                    ease: isConverging ? [0.4, 0, 0.2, 1] : [0.22, 1, 0.36, 1],
                  },
                }}
                className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2"
                style={{
                  zIndex: node.zIndex,
                  width: `${node.nodeDiameter}px`,
                  pointerEvents: isConverging ? 'none' : 'auto',
                }}
                onClick={() => onNodeClick?.(node, node.index)}
              >
                {/* ── SUBTLE FLOATING ORBITAL BOB (±5px over 4.8s–6.8s) ── */}
                <motion.div
                  animate={{
                    y: isConverging ? 0 : [-5, 5, -5],
                  }}
                  transition={{
                    duration: node.bobDuration,
                    repeat: isConverging ? 0 : Infinity,
                    ease: 'easeInOut',
                    delay: node.index * 0.14,
                  }}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  {/* ── PREMIUM SENSORY MEDALLION ARTIFACT ── */}
                  <div
                    className="relative rounded-full transition-transform duration-300 ease-out group-hover:scale-105"
                    style={{
                      width: `${node.nodeDiameter}px`,
                      height: `${node.nodeDiameter}px`,
                      // Layer 1: Outer Celestial Glow
                      boxShadow: `0 0 24px rgba(227, 197, 133, ${0.4 * node.depthOpacity}), 0 6px 18px rgba(0, 0, 0, 0.95)`,
                    }}
                  >
                    {/* Layer 2: Thin Gold Outer Ring Bezel (1.5px multi-stop gradient) */}
                    <div
                      className="absolute inset-0 rounded-full p-[1.5px]"
                      style={{
                        background:
                          'linear-gradient(135deg, #FFEAA5 0%, #C6A15B 35%, #593D15 75%, #FFEAA5 100%)',
                      }}
                    >
                      {/* Layer 3: Dark Separation Ring (2px Obsidian Isolation) */}
                      <div className="w-full h-full rounded-full p-[2px] bg-[#0A0908]">
                        {/* Layer 4: High-Res Sensory Image Disc */}
                        <div className="relative w-full h-full rounded-full overflow-hidden bg-black/90">
                          <img
                            src={node.image}
                            alt={node.label}
                            className="w-full h-full object-cover object-center filter brightness-105 contrast-105 select-none"
                            draggable={false}
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />

                          {/* Layer 5: Subtle Inner Specular Sheen & Edge Highlight */}
                          <div className="absolute inset-0 rounded-full border border-white/25 pointer-events-none" />
                          <div className="absolute top-[8%] left-[14%] w-[32%] h-[18%] rounded-full bg-white/40 blur-[0.7px] pointer-events-none rotate-[-28deg]" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-white/10 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Layer 6: Miniature Gold Diamond Accent Marker on Top Rim */}
                    <div className="absolute -top-[3.5px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 border border-[#FFEAA5] bg-[#E3C585] shadow-[0_0_6px_rgba(255,234,165,0.9)] pointer-events-none" />

                    {/* Subtle Pulsing Halo Aura on Hover */}
                    <div className="absolute -inset-1.5 rounded-full border border-[#FFD77A]/0 group-hover:border-[#FFD77A]/40 transition-colors duration-300 pointer-events-none" />
                  </div>

                  {/* ── LABEL DIRECTLY UNDERNEATH SENSORY NODE ── */}
                  <div className="flex flex-col items-center mt-2 sm:mt-2.5 text-center pointer-events-none">
                    <span
                      className="font-sans uppercase font-light text-[#FFEAA5] drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] whitespace-nowrap"
                      style={{
                        fontSize: `${geo.labelFontSize}px`,
                        letterSpacing: '0.18em',
                      }}
                    >
                      {node.label}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
