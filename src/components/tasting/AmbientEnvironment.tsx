import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface AmbientEnvironmentProps {
  hue?: number
  intensity?: number
  stageIndex?: number
  children?: React.ReactNode
  className?: string
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  baseAlpha: number
  phase: number
}

/**
 * AmbientEnvironment
 * A persistent, living atmosphere reminiscent of a private luxury distillery tasting room
 * and contemporary light installation. Provides organic volumetric illumination,
 * drifting cellar dust motes, subtle room acoustics visualizers, and cursor parallax.
 */
export default function AmbientEnvironment({
  hue = 38,
  intensity = 0.5,
  stageIndex = 0,
  children,
  className = '',
}: AmbientEnvironmentProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const reduceMotion = useReducedMotion()

  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  // Mouse move handler for luxury subtle parallax
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduceMotion) return
      const { innerWidth, innerHeight } = window
      setMousePos({
        x: e.clientX / innerWidth,
        y: e.clientY / innerHeight,
      })
    },
    [reduceMotion]
  )

  // Floating cellar dust motes / vapor particles simulation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Generate dust motes
    const count = reduceMotion ? 12 : 36
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -0.15 - Math.random() * 0.2,
      radius: 0.6 + Math.random() * 1.6,
      alpha: 0.05 + Math.random() * 0.25,
      baseAlpha: 0.05 + Math.random() * 0.25,
      phase: Math.random() * Math.PI * 2,
    }))

    let time = 0

    const render = () => {
      time += 0.01

      ctx.clearRect(0, 0, width, height)

      // Draw subtle particles
      particles.forEach((p) => {
        p.x += p.vx + Math.sin(time + p.phase) * 0.15
        p.y += p.vy

        // Wrap around viewport
        if (p.y < -10) p.y = height + 10
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10

        // Gentle breathing alpha
        const alpha = p.baseAlpha * (0.7 + 0.3 * Math.sin(time * 0.8 + p.phase))

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${hue}, 40%, 75%, ${alpha})`
        ctx.shadowColor = `hsla(${hue}, 60%, 55%, ${alpha * 0.8})`
        ctx.shadowBlur = p.radius * 4
        ctx.fill()
        ctx.shadowBlur = 0
      })

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [hue, reduceMotion])

  // Parallax offsets calculated from mouse
  const parallaxX = (mousePos.x - 0.5) * 20
  const parallaxY = (mousePos.y - 0.5) * 15

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative min-h-screen w-full bg-[#080807] text-[#FAF7F2] overflow-y-auto overflow-x-hidden transition-colors duration-1000 ease-out ${className}`}
    >
      {/* ── Cinematic Spirits Tasting Room Background Layer (Matching Reference Image) ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-left sm:bg-center opacity-40 mix-blend-screen filter contrast-125 brightness-90"
        style={{
          backgroundImage: "url('/images/tasting-bar-bg.jpg')",
        }}
        aria-hidden="true"
      />

      {/* ── Deep Obsidian / Dark Espresso Atmospheric Overlay ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-r from-[#080807]/92 via-[#0c0b09]/80 to-[#080807]/90 mix-blend-multiply"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-[#080807]/85 via-transparent to-[#080807]/95"
        aria-hidden="true"
      />

      {/* ── Volumetric Overhead Spotlight (Private Sommelier Room Downlight) ── */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden z-0"
        aria-hidden="true"
      >
        {/* Primary warm focal downlight */}
        <motion.div
          animate={{
            x: parallaxX * 0.6,
            y: parallaxY * 0.6,
            opacity: 0.12 + intensity * 0.08,
            scale: 1 + stageIndex * 0.02,
          }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] md:w-[1100px] h-[750px] rounded-full blur-[140px] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, hsla(${hue}, 65%, 45%, 0.42) 0%, hsla(${hue}, 45%, 25%, 0.12) 45%, transparent 75%)`,
          }}
        />

        {/* Secondary subtle floor glow */}
        <motion.div
          animate={{
            x: -parallaxX * 0.4,
            y: -parallaxY * 0.4,
            opacity: 0.06 + intensity * 0.04,
          }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[500px] rounded-full blur-[120px] pointer-events-none"
          style={{
            background: `radial-gradient(circle, hsla(${hue + 15}, 50%, 35%, 0.25) 0%, transparent 70%)`,
          }}
        />

        {/* Deep architectural vignette framing the sanctuary */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(8,8,7,0.75)_80%,rgba(8,8,7,0.98)_100%)] pointer-events-none" />

        {/* Subtle horizontal plinth baseline light */}
        <div className="absolute top-[68%] inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C6A15B]/15 to-transparent pointer-events-none" />
      </div>

      {/* ── Persistent Canvas Layer: Cellar Motes & Spirit Vapor ── */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0 opacity-80"
        aria-hidden="true"
      />

      {/* ── Living Content Horizon ── */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between">
        {children}
      </div>
    </div>
  )
}
