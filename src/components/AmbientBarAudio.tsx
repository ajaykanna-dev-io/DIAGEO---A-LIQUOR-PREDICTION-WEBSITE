import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { IoMusicalNotes, IoMusicalNotesOutline } from 'react-icons/io5'
import { barMusic } from '@/utils/barMusicEngine'

interface AmbientBarAudioProps {
  className?: string
  isMobile?: boolean
}

/**
 * AmbientBarAudio
 * Ultra-premium icon-only speakeasy bar audio controller for DIAGEO Haute Distillerie.
 * Displays only luxury react-icons and dynamic scrolling equalizer visualizer (no text).
 */
export default function AmbientBarAudio({ className = '', isMobile = false }: AmbientBarAudioProps) {
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
      className={`group relative inline-flex items-center justify-center gap-2 rounded-full border transition-all duration-500 cursor-pointer overflow-hidden ${
        isMobile ? 'h-10 px-4' : 'h-9 px-3'
      } ${
        isSoundActive
          ? 'border-[#C6A15B]/50 hover:border-[#C6A15B] bg-[#14110c]/90 hover:bg-[#1c1811] text-[#FAF7F2] shadow-[0_2px_18px_rgba(198,161,91,0.22)]'
          : 'border-white/10 hover:border-[#C6A15B]/40 bg-[#0c0b0a]/75 hover:bg-[#141210] text-stone hover:text-[#FAF7F2] shadow-[0_2px_10px_rgba(0,0,0,0.5)]'
      } ${className}`}
      title={isSoundActive ? 'Bar Music Playing · Click to Mute' : 'Bar Music Muted · Click to Play'}
      aria-label={isSoundActive ? 'Mute Bar Music' : 'Unmute Bar Music'}
    >
      {/* Ambient gold light sweep on hover */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[#C6A15B]/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
        aria-hidden="true"
      />

      {/* Musical Note Icon from react-icons */}
      <div className="relative flex items-center justify-center">
        {isSoundActive ? (
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
            className="text-[#E5C378] drop-shadow-[0_0_8px_rgba(198,161,91,0.5)]"
          >
            <IoMusicalNotes className={isMobile ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
          </motion.div>
        ) : (
          <div className="text-stone/50 group-hover:text-stone/80 transition-colors duration-300">
            <IoMusicalNotesOutline className={isMobile ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
          </div>
        )}
      </div>

      {/* Traditional Scrolling / Dancing Equalizer Waveform */}
      <div
        className="flex items-end gap-[2.5px] h-3.5 w-3.5 justify-center py-px"
        aria-hidden="true"
      >
        {barHeights.map((bar, i) => (
          <motion.span
            key={i}
            animate={
              isSoundActive
                ? { height: bar.active }
                : { height: '2.5px' }
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
            className={`w-[2px] rounded-full transition-colors duration-300 ${
              isSoundActive
                ? 'bg-gradient-to-t from-[#C6A15B] via-[#E5C378] to-[#FAF7F2] shadow-[0_0_5px_rgba(198,161,91,0.6)]'
                : 'bg-stone/30'
            }`}
          />
        ))}
      </div>
    </button>
  )
}
