import { useState } from 'react'
import CinematicReveal from '../components/discovery/CinematicReveal'
import SensoryConstellation, { type SensoryNodeItem } from '../components/discovery/SensoryConstellation'
import { spirits } from '../data/spirits'

const ALL_SAMPLE_NOTES: SensoryNodeItem[] = [
  {
    id: 'citrus',
    label: 'CITRUS',
    sublabel: 'Orange Zest',
    image: '/images/sensory/sensory-citrus.jpg',
  },
  {
    id: 'vanilla',
    label: 'VANILLA',
    sublabel: 'Cream & Pods',
    image: '/images/sensory/sensory-vanilla.jpg',
  },
  {
    id: 'oak',
    label: 'OAK',
    sublabel: 'Charred Cask',
    image: '/images/sensory/sensory-oak.jpg',
  },
  {
    id: 'fruit',
    label: 'DRIED FRUITS',
    sublabel: 'Dates & Raisins',
    image: '/images/sensory/sensory-fruit.jpg',
  },
  {
    id: 'spice',
    label: 'SPICE',
    sublabel: 'Cinnamon & Star Anise',
    image: '/images/sensory/sensory-spice.jpg',
  },
  {
    id: 'smoke',
    label: 'PEAT SMOKE',
    sublabel: 'Highland Embers',
    image: '/images/sensory/sensory-smoke.jpg',
  },
  {
    id: 'honey',
    label: 'HEATHER HONEY',
    sublabel: 'Golden Amber Nectar',
    image: '/images/orbs/orb-3.jpg',
  },
]

export default function ConstellationTestPage() {
  const [noteCount, setNoteCount] = useState<number>(5)
  const [mode, setMode] = useState<'cinematic' | 'isolated'>('cinematic')
  const [converging, setConverging] = useState<boolean>(false)
  const [key, setKey] = useState<number>(0)

  const activeNotes = ALL_SAMPLE_NOTES.slice(0, noteCount)
  const sampleSpirit = spirits[0]

  return (
    <div className="relative w-screen h-[100svh] bg-[#080706] overflow-hidden select-none">
      {/* ── TOP-LEFT FLOATING TEST CONTROL PANEL ── */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[10000] flex flex-wrap items-center justify-center gap-2 bg-black/85 backdrop-blur-md px-4 py-2 rounded-full border border-[#C6A15B]/40 shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
        <span className="font-serif text-[10px] tracking-[0.2em] text-[#C6A15B] uppercase font-light mr-1">
          CONSTELLATION NODES:
        </span>

        {[3, 4, 5, 6, 7].map((num) => (
          <button
            key={num}
            onClick={() => {
              setNoteCount(num)
              setKey((prev) => prev + 1)
              setConverging(false)
            }}
            className={`px-2.5 py-1 rounded-full text-[10px] font-sans tracking-widest uppercase transition-all duration-300 ${
              noteCount === num
                ? 'bg-[#FFD700] text-black font-semibold shadow-[0_0_12px_rgba(255,215,0,0.6)]'
                : 'text-[#FAF7F2]/70 hover:text-[#FAF7F2] bg-white/5 border border-white/10'
            }`}
          >
            {num} Nodes
          </button>
        ))}

        <div className="w-px h-4 bg-white/20 mx-1" />

        <button
          onClick={() => {
            setMode((m) => (m === 'cinematic' ? 'isolated' : 'cinematic'))
            setKey((prev) => prev + 1)
          }}
          className="px-2.5 py-1 rounded-full text-[10px] font-sans tracking-widest uppercase bg-white/10 text-[#FFEAA5] hover:bg-white/20 transition-colors"
        >
          Mode: {mode === 'cinematic' ? 'Full Cinematic' : 'Isolated Glass'}
        </button>

        {mode === 'isolated' && (
          <button
            onClick={() => setConverging((c) => !c)}
            className="px-2.5 py-1 rounded-full text-[10px] font-sans tracking-widest uppercase bg-[#C6A15B]/20 text-[#FAF7F2] border border-[#C6A15B]/40"
          >
            {converging ? 'Reset' : 'Converge'}
          </button>
        )}

        <button
          onClick={() => setKey((k) => k + 1)}
          className="px-2 py-1 rounded-full text-[10px] font-sans tracking-widest uppercase text-[#FAF7F2]/60 hover:text-white"
        >
          ↻ Re-Enter
        </button>
      </div>

      {mode === 'cinematic' ? (
        <CinematicReveal
          key={`cinematic-${key}-${noteCount}`}
          result={sampleSpirit}
          sensoryNotes={activeNotes.map((n) => n.label)}
          noteCount={noteCount}
          onComplete={() => {}}
        />
      ) : (
        /* Isolated View to focus specifically on the Glass + Constellation */
        <div className="relative w-full h-full">
          {/* Cellar Plate Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/whisky-sanctuary-plate.jpg')",
              filter: 'brightness(0.9) contrast(1.1)',
            }}
          />

          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(6,5,4,0.6)_65%,rgba(6,5,4,0.95)_100%)] pointer-events-none" />

          {/* Central Glass Anchor at top-[56%] left-1/2 */}
          <div className="absolute top-[56%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-15 flex flex-col items-center justify-center pointer-events-none">
            {/* Luminous Inner Liquid Amber Core Glow */}
            <div className="w-36 h-36 rounded-full bg-gradient-to-t from-[#B86A18] via-[#EAA538]/60 to-transparent blur-2xl pointer-events-none" />
          </div>

          {/* Constellation Origin at top-[56%] left-1/2 */}
          <div className="absolute top-[56%] left-1/2 w-0 h-0 pointer-events-none z-25">
            <SensoryConstellation
              key={`isolated-${key}-${noteCount}`}
              notes={activeNotes}
              isConverging={converging}
              constellationKey={`isolated-${key}-${noteCount}`}
            />
          </div>
        </div>
      )}
    </div>
  )
}
