import { motion, useReducedMotion } from 'framer-motion'
import type { TasteProfile } from '@/types'

interface TasteDNAProps {
  profile: TasteProfile
  size?: number
  className?: string
}

const dims: { key: keyof TasteProfile; label: string }[] = [
  { key: 'complexity', label: 'COMPLEXITY' },
  { key: 'smoothness', label: 'SMOOTHNESS' },
  { key: 'sweetness', label: 'SWEETNESS' },
  { key: 'intensity', label: 'INTENSITY' },
  { key: 'smokiness', label: 'SMOKINESS' },
]

function point(center: number, radius: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: center + radius * Math.cos(rad),
    y: center + radius * Math.sin(rad),
  }
}

/**
 * Minimalist Flavor Constellation / Fingerprint
 * An ethereal artistic visualization resembling a celestial celestial map.
 */
export default function TasteDNA({ profile, size = 380, className = '' }: TasteDNAProps) {
  const reduceMotion = useReducedMotion()
  const center = size / 2
  const maxRadius = size * 0.35
  const angleStep = 360 / dims.length
  const startAngle = -90

  const outerPoints = dims.map((_, i) => point(center, maxRadius, startAngle + i * angleStep))
  const dataPoints = dims.map((d, i) =>
    point(center, (profile[d.key] / 100) * maxRadius, startAngle + i * angleStep),
  )

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  const rings = [0.33, 0.66, 1.0]

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-auto max-w-[340px] sm:max-w-md select-none overflow-visible"
        role="img"
        aria-label="Artistic flavor constellation"
      >
        <defs>
          <radialGradient id="constellationGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C6A15B" stopOpacity="0.12" />
            <stop offset="70%" stopColor="#C6A15B" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#C6A15B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient background aura */}
        <circle cx={center} cy={center} r={maxRadius * 1.15} fill="url(#constellationGlow)" />

        {/* Delicate orbital rings */}
        {rings.map((r) => (
          <circle
            key={r}
            cx={center}
            cy={center}
            r={maxRadius * r}
            fill="none"
            stroke="rgba(198,161,91,0.12)"
            strokeWidth="0.75"
            strokeDasharray={r === 1.0 ? '2 4' : undefined}
          />
        ))}

        {/* Axis rays */}
        {outerPoints.map((p, i) => (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="rgba(198,161,91,0.15)"
            strokeWidth="0.75"
          />
        ))}

        {/* Polygon constellation body */}
        <motion.path
          d={toPath(dataPoints)}
          initial={reduceMotion ? undefined : { scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          fill="rgba(198,161,91,0.14)"
          stroke="#C6A15B"
          strokeWidth="1.2"
          style={{ originX: `${center}px`, originY: `${center}px` }}
        />

        {/* Star node markers */}
        {dataPoints.map((p, i) => (
          <g key={i}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="2.5"
              fill="#F3EFE6"
              initial={reduceMotion ? undefined : { cx: center, cy: center, opacity: 0 }}
              animate={{ cx: p.x, cy: p.y, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.25 + i * 0.05 }}
            />
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="6"
              fill="none"
              stroke="rgba(198,161,91,0.4)"
              strokeWidth="0.5"
              initial={reduceMotion ? undefined : { cx: center, cy: center, opacity: 0 }}
              animate={{ cx: p.x, cy: p.y, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 + i * 0.05 }}
            />
          </g>
        ))}

        {/* Attribute typography */}
        {dims.map((d, i) => {
          const p = point(center, maxRadius + 22, startAngle + i * angleStep)
          return (
            <text
              key={d.key}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#A9A39A"
              fontSize="9"
              letterSpacing="0.16em"
              fontFamily="monospace"
              className="select-none"
            >
              {d.label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
