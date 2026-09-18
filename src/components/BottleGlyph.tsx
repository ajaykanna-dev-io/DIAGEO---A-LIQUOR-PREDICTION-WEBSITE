interface BottleGlyphProps {
  hue?: number
  className?: string
  glassOfLight?: boolean
}

/**
 * A restrained, editorial bottle silhouette rendered in SVG.
 * Stands in for cinematic product photography across the prototype —
 * lit from one side with a soft interior glow, deep contact shadow,
 * and a faint reflection, in keeping with the "controlled warm lighting"
 * direction from the brief.
 */
export default function BottleGlyph({ hue = 30, className = '', glassOfLight = true }: BottleGlyphProps) {
  const gradId = `liquid-${hue}`
  const glowId = `glow-${hue}`

  return (
    <svg
      viewBox="0 0 320 520"
      className={className}
      role="img"
      aria-label="Illustrated premium spirit bottle"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={`hsl(${hue}, 45%, 30%)`} />
          <stop offset="55%" stopColor={`hsl(${hue}, 55%, 18%)`} />
          <stop offset="100%" stopColor="#0b0b0a" />
        </linearGradient>
        <radialGradient id={glowId} cx="30%" cy="20%" r="70%">
          <stop offset="0%" stopColor={`hsl(${hue}, 60%, 45%)`} stopOpacity="0.35" />
          <stop offset="100%" stopColor={`hsl(${hue}, 60%, 45%)`} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* contact shadow */}
      <ellipse cx="160" cy="495" rx="90" ry="14" fill="#000" opacity="0.5" />

      {/* bottle body */}
      <path
        d="M120 150 L120 90 Q120 70 140 65 L140 40 L180 40 L180 65 Q200 70 200 90 L200 150
           Q235 185 235 240 L235 460 Q235 485 210 485 L110 485 Q85 485 85 460 L85 240
           Q85 185 120 150 Z"
        fill={`url(#${gradId})`}
        stroke="rgba(198,161,91,0.35)"
        strokeWidth="1"
      />

      {/* neck highlight */}
      <rect x="140" y="42" width="6" height="100" fill="rgba(243,239,230,0.08)" />

      {/* interior warm glow */}
      {glassOfLight && <ellipse cx="150" cy="220" rx="90" ry="140" fill={`url(#${glowId})`} />}

      {/* label plate */}
      <rect
        x="105"
        y="260"
        width="110"
        height="120"
        rx="1"
        fill="rgba(11,11,10,0.55)"
        stroke="rgba(198,161,91,0.5)"
        strokeWidth="0.75"
      />
      <line x1="120" y1="290" x2="200" y2="290" stroke="rgba(198,161,91,0.6)" strokeWidth="1" />
      <line x1="120" y1="345" x2="200" y2="345" stroke="rgba(198,161,91,0.6)" strokeWidth="1" />

      {/* cap */}
      <rect x="135" y="28" width="50" height="16" rx="2" fill="#0f0e0c" stroke="rgba(198,161,91,0.5)" />

      {/* thin rim highlight along the right edge, simulating raking light */}
      <path
        d="M200 150 Q235 185 235 240 L235 460 Q235 485 210 485"
        fill="none"
        stroke="rgba(216,189,122,0.25)"
        strokeWidth="1.5"
      />
    </svg>
  )
}
