import { motion } from 'framer-motion'
import type { QuestionOption } from '@/types'

interface SensoryCompassProps {
  /** The options for the current question — we visualize which taste dimensions they affect */
  options: QuestionOption[]
  /** Currently selected option ID, if any */
  selectedId?: string
  className?: string
}

const dimensions = ['complexity', 'smoothness', 'intensity', 'sweetness', 'smokiness'] as const
const dimensionLabels: Record<string, string> = {
  complexity: 'CMP',
  smoothness: 'SMT',
  intensity: 'INT',
  sweetness: 'SWT',
  smokiness: 'SMK',
}

export default function SensoryCompass({
  options,
  selectedId,
  className = '',
}: SensoryCompassProps) {
  const size = 120
  const center = size / 2
  const radius = 42

  // Calculate which dimensions are affected by any option in this question
  const dimensionActivity = dimensions.map((dim) => {
    const maxWeight = Math.max(
      ...options.map((opt) => Math.abs(opt.weights[dim] || 0))
    )
    return maxWeight / 2 // Normalize to 0–1
  })

  // If an option is selected, show its specific weights
  const selectedOption = selectedId ? options.find((o) => o.id === selectedId) : null
  const selectedWeights = dimensions.map((dim) => {
    if (!selectedOption) return 0
    const w = selectedOption.weights[dim] || 0
    return (w + 2) / 4 // Normalize -2..2 to 0..1
  })

  // Generate polygon points for the base and selected shapes
  const angleStep = (Math.PI * 2) / dimensions.length
  const startAngle = -Math.PI / 2 // Start from top

  const getPoint = (index: number, value: number) => {
    const angle = startAngle + index * angleStep
    const r = radius * 0.3 + radius * 0.7 * value
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  }

  const basePoints = dimensionActivity
    .map((v, i) => getPoint(i, v))
    .map((p) => `${p.x},${p.y}`)
    .join(' ')

  const selectedPoints = selectedWeights
    .map((v, i) => getPoint(i, v))
    .map((p) => `${p.x},${p.y}`)
    .join(' ')

  // Axis endpoints for the grid lines
  const axisEndpoints = dimensions.map((_, i) => {
    const angle = startAngle + i * angleStep
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    }
  })

  // Label positions (slightly beyond the axes)
  const labelPositions = dimensions.map((_, i) => {
    const angle = startAngle + i * angleStep
    const lr = radius + 14
    return {
      x: center + lr * Math.cos(angle),
      y: center + lr * Math.sin(angle),
    }
  })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`relative ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-[0_0_12px_rgba(198,161,91,0.08)]"
        aria-label="Sensory compass showing taste dimensions affected by this question"
      >
        {/* Outer glow ring */}
        <circle
          cx={center}
          cy={center}
          r={radius + 4}
          fill="none"
          stroke="rgba(198, 161, 91, 0.08)"
          strokeWidth="1"
          className="compass-ring"
        />

        {/* Concentric grid rings */}
        {[0.33, 0.66, 1].map((scale) => (
          <circle
            key={scale}
            cx={center}
            cy={center}
            r={radius * scale}
            fill="none"
            stroke="rgba(169, 163, 154, 0.08)"
            strokeWidth="0.5"
          />
        ))}

        {/* Axis lines */}
        {axisEndpoints.map((end, i) => (
          <line
            key={`axis-${i}`}
            x1={center}
            y1={center}
            x2={end.x}
            y2={end.y}
            stroke="rgba(169, 163, 154, 0.12)"
            strokeWidth="0.5"
          />
        ))}

        {/* Base activity polygon (which dimensions this question touches) */}
        <motion.polygon
          points={basePoints}
          fill="rgba(198, 161, 91, 0.06)"
          stroke="rgba(198, 161, 91, 0.2)"
          strokeWidth="0.75"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        />

        {/* Selected option polygon overlay */}
        {selectedOption && (
          <motion.polygon
            points={selectedPoints}
            fill="rgba(198, 161, 91, 0.15)"
            stroke="rgba(216, 189, 122, 0.6)"
            strokeWidth="1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: `${center}px ${center}px` }}
          />
        )}

        {/* Dimension endpoint dots */}
        {axisEndpoints.map((end, i) => (
          <motion.circle
            key={`dot-${i}`}
            cx={end.x}
            cy={end.y}
            r={dimensionActivity[i] > 0 ? 2.5 : 1.5}
            fill={
              dimensionActivity[i] > 0
                ? 'rgba(216, 189, 122, 0.7)'
                : 'rgba(169, 163, 154, 0.3)'
            }
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.7 + i * 0.06 }}
          />
        ))}

        {/* Center dot */}
        <circle
          cx={center}
          cy={center}
          r="2"
          fill="rgba(198, 161, 91, 0.5)"
        />

        {/* Dimension labels */}
        {labelPositions.map((pos, i) => (
          <text
            key={`label-${i}`}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={
              dimensionActivity[i] > 0
                ? 'rgba(216, 189, 122, 0.7)'
                : 'rgba(169, 163, 154, 0.35)'
            }
            fontSize="6.5"
            fontFamily="monospace"
            letterSpacing="0.08em"
          >
            {dimensionLabels[dimensions[i]]}
          </text>
        ))}
      </svg>
    </motion.div>
  )
}
