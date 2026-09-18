import { motion } from 'framer-motion'

interface ProgressIndicatorProps {
  current: number
  total: number
}

/**
 * Premium progress indicator with step numbers and a smooth animated bar.
 *
 * Layout:
 *   01 — 02 — 03 — 04 — 05 — 06 — 07 — 08
 *   ━━━━━━━━━━━━━━━━━━━━━●━━━━━━━━━━━━━━━━
 */
export default function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  const progress = (current / total) * 100

  return (
    <div className="flex flex-col items-end gap-3" aria-label={`Question ${current} of ${total}`}>
      {/* Step numbers */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => {
          const step = i + 1
          const done = step <= current
          return (
            <div key={step} className="flex items-center gap-1.5">
              <span
                className={`text-[0.6rem] tabular-nums transition-colors duration-600 ${
                  done ? 'text-gold-light' : 'text-stone/30'
                }`}
              >
                {String(step).padStart(2, '0')}
              </span>
              {step < total && (
                <span
                  className={`block h-px w-3 md:w-5 transition-colors duration-600 ${
                    step < current ? 'bg-gold/50' : 'bg-stone/12'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Animated progress bar */}
      <div className="w-full h-px bg-stone/10 relative overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gold/60"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  )
}
