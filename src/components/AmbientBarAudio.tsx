import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { IoMusicalNotes, IoMusicalNotesOutline } from 'react-icons/io5'
import { barMusic } from '@/utils/barMusicEngine'

interface AmbientBarAudioProps {
  className?: string
  isMobile?: boolean
  showLabel?: boolean
}

/**
 * AmbientBarAudio
 * Speakeasy bar audio controller for DIAGEO Haute Distillerie.
 */
export default function AmbientBarAudio({ className = '', isMobile = false, showLabel: _showLabel = true }: AmbientBarAudioProps) {
  const [isPlaying, setIsPlaying] = useState(barMusic.getIsPlaying())
  const [isMuted, setIsMuted] = useState(barMusic.getIsMuted())

  useEffect(() => {
    const unsubscribe = barMusic.subscribe((playing, muted) => {
      setIsPlaying(playing)
      setIsMuted(muted)
    })
    return () => unsubscribe()
  }, [])

  const handleToggle = () => {
    barMusic.toggleMute()
  }

  const isSoundActive = isPlaying && !isMuted

  // Traditional equalizer bar animation keyframes
  const barHeights = [
    { active: ['3px', '13px', '6px', '15px', '5px', '11px', '3px'], duration: 1.15, delay: 0 },
    { active: ['11px', '4px', '15px', '7px', '14px', '4px', '11px'], duration: 0.95, delay: 0.16 },
    { active: ['5px', '15px', '4px', '12px', '6px', '14px', '5px'], duration: 1.25, delay: 0.08 },
    { active: ['14px', '6px', '11px', '3px', '13px', '6px', '14px'], duration: 1.05, delay: 0.22 },
  ]

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`group relative inline-flex items-center justify-center gap-2 sm:gap-2.5 rounded-full border transition-all duration-500 cursor-pointer overflow-hidden ${
        isMobile ? 'h-9 px-3' : 'h-8 sm:h-9 px-2.5 sm:px-3.5'
      } ${
        isSoundActive
          ? 'border-[#C6A15B] hover:border-[#F5CE76] bg-gradient-to-r from-[#17130e] via-[#241c12] to-[#17130e] hover:via-[#332718] text-[#FAF7F2] shadow-[0_4px_18px_rgba(0,0,0,0.85),0_0_16px_rgba(198,161,91,0.4)]'
          : 'border-[#C6A15B]/75 hover:border-[#E5C378] bg-gradient-to-r from-[#14110d] via-[#1c1610] to-[#14110d] hover:via-[#261e14] text-[#FAF7F2] shadow-[0_4px_16px_rgba(0,0,0,0.8),0_0_12px_rgba(198,161,91,0.25)]'
      } ${className}`}
      title={isSoundActive ? 'Bar Music Playing · Click to Mute' : 'Bar Music Muted · Click to Play'}
      aria-label={isSoundActive ? 'Mute Bar Music' : 'Unmute Bar Music'}
    >
      {/* Ambient gold light sweep on hover */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[#C6A15B]/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
        aria-hidden="true"
      />

      {/* Musical Note Icon in radiant logo gold palette */}
      <div className="relative flex items-center justify-center shrink-0">
        {isSoundActive ? (
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
            className="text-[#F5CE76] drop-shadow-[0_0_10px_rgba(198,161,91,0.7)]"
          >
            <IoMusicalNotes className={isMobile ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
          </motion.div>
        ) : (
          <div className="text-[#E5C378] group-hover:text-[#FFF8DB] transition-colors duration-300 drop-shadow-[0_0_8px_rgba(198,161,91,0.4)]">
            <IoMusicalNotesOutline className={isMobile ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
          </div>
        )}
      </div>

      {/* Traditional Scrolling / Dancing Equalizer Waveform in Gold Palette */}
      <div
        className="flex items-end gap-[2.5px] h-3.5 w-3.5 justify-center py-px shrink-0"
        aria-hidden="true"
      >
        {barHeights.map((bar, i) => (
          <motion.span
            key={i}
            animate={
              isSoundActive
                ? { height: bar.active }
                : { height: '3.5px' }
            }
            transition={
              isSoundActive
                ? {
                    duration: bar.duration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: bar.delay,
                  }
                : { duration: 0.3 }
            }
            className="w-[2px] rounded-full transition-colors duration-300 bg-gradient-to-t from-[#C6A15B] via-[#E5C378] to-[#FFF8DB] shadow-[0_0_6px_rgba(198,161,91,0.6)]"
          />
        ))}
      </div>
    </button>
  )
}
