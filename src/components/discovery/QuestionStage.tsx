import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface QuestionStageProps {
  stageNumber: string
  title: string
  question: string
  subtitle?: string
  direction?: number
  children: ReactNode
}

/**
 * QuestionStage
 * Editorial typography wrapper and transition choreography for each stage of discovery.
 * Ensures consistent typographic hierarchy, generous breathing room, and intentional motion.
 */
export default function QuestionStage({
  stageNumber,
  title,
  question,
  subtitle,
  direction = 1,
  children,
}: QuestionStageProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${stageNumber}-${title}`}
        initial={{ opacity: 0, y: direction * 24, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: direction * -24, filter: 'blur(6px)' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full flex flex-col items-center"
      >
        {/* Editorial Stage Header */}
        <header className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center gap-3 mb-3"
          >
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase text-gold-light/90">
              {stageNumber}
            </span>
            <span className="h-px w-6 bg-gold/30" />
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase text-stone/50">
              {title}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="font-serif text-[clamp(1.75rem,4vw,3rem)] text-[#FAF7F2] font-normal tracking-tight leading-[1.15] mb-3"
          >
            {question}
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="text-stone/60 text-xs sm:text-sm tracking-wide font-sans max-w-md mx-auto"
            >
              {subtitle}
            </motion.p>
          )}
        </header>

        {/* Stage Content */}
        <div className="w-full">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
