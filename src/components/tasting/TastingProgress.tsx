import { questions } from '@/data/questions'
import type { Answers } from '@/types'

interface TastingProgressProps {
  currentStep: number
  answers: Answers
  onJumpToStep?: (index: number) => void
  className?: string
}

/**
 * TastingProgress
 * Replaces standard "Question 4 of 8" survey progress bars with a refined,
 * understated luxury tasting journey timeline.
 */
export default function TastingProgress({
  currentStep,
  answers,
  onJumpToStep,
  className = '',
}: TastingProgressProps) {
  return (
    <nav
      aria-label="Tasting Ritual Progression"
      className={`relative w-full max-w-2xl mx-auto flex items-center justify-between px-1 sm:px-3 ${className}`}
    >
      {/* ── Background Subtle Hairline Rail ── */}
      <div className="absolute inset-x-3 top-[11px] h-px bg-[#C6A15B]/15 pointer-events-none" />

      {/* ── Milestone Nodes ── */}
      <div className="relative z-10 w-full flex items-center justify-between">
        {questions.map((q, idx) => {
          const isAnswered = Boolean(answers[q.id])
          const isCurrent = idx === currentStep
          const isAccessible =
            idx <= currentStep ||
            questions.slice(0, idx).every((prevQ) => Boolean(answers[prevQ.id]))

          return (
            <button
              key={q.id}
              type="button"
              disabled={!isAccessible}
              onClick={() => onJumpToStep?.(idx)}
              className={`group relative flex flex-col items-center focus:outline-none transition-all duration-300 ${
                isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-35'
              }`}
              title={`Stage 0${idx + 1}: ${q.stageName}`}
            >
              {/* Top Node Indicator */}
              <div className="flex items-center justify-center h-6 mb-1">
                {isCurrent ? (
                  <div className="w-4 h-4 rounded-full border border-gold/80 bg-gold/20 flex items-center justify-center shadow-[0_0_12px_rgba(198,161,91,0.5)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                  </div>
                ) : (
                  <div
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      isAnswered
                        ? 'bg-gold-light/70'
                        : 'bg-[#181714] border border-stone/40'
                    }`}
                  />
                )}
              </div>

              {/* Stage Chapter Label */}
              <span
                className={`text-[8px] sm:text-[9px] uppercase font-mono tracking-widest transition-colors duration-300 whitespace-nowrap ${
                  isCurrent
                    ? 'text-gold-light font-medium underline decoration-gold/70 decoration-1 underline-offset-4'
                    : isAnswered
                    ? 'text-stone/75 group-hover:text-ivory'
                    : 'text-stone/35'
                }`}
              >
                <span className="inline md:hidden">0{idx + 1}</span>
                <span className="hidden md:inline">{q.stageName}</span>
              </span>
            </button>
          )
        })}

        {/* Final Terminal: Revelation */}
        <div className="relative flex flex-col items-center opacity-40">
          <div className="flex items-center justify-center h-6 mb-1">
            <div className="w-1.5 h-1.5 rotate-45 border border-gold/40 bg-[#080807]" />
          </div>
          <span className="text-[8px] sm:text-[9px] uppercase font-mono tracking-widest text-stone/40 hidden md:inline">
            REVELATION
          </span>
          <span className="text-[8px] uppercase font-mono tracking-widest text-stone/40 inline md:hidden">
            ✦
          </span>
        </div>
      </div>
    </nav>
  )
}
