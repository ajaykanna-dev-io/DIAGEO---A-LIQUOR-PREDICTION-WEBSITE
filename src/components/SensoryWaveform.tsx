import { motion } from 'framer-motion'

interface SensoryWaveformProps {
  /** Question index (0-7) determines waveform character */
  questionIndex: number
  /** Hue to tint the waveform, matches question atmosphere */
  hue: number
  className?: string
}

// Each question maps to a distinct waveform "personality"
// These paths represent different sensory characters
const waveformPaths: string[] = [
  // Q1: Evening — smooth, undulating, warm
  'M0,25 C20,10 40,40 60,25 C80,10 100,40 120,25 C140,10 160,40 180,25 C200,10 220,40 240,25 C260,10 280,40 300,25 C320,10 340,40 360,25 C380,10 400,40 420,25 C440,10 460,40 480,25',
  // Q2: Feel — sharp peaks, textured
  'M0,25 C10,5 20,45 40,25 C50,5 60,45 80,20 C90,0 100,50 120,25 C130,5 140,45 160,25 C170,5 180,45 200,20 C210,0 220,50 240,25 C250,5 260,45 280,25 C290,5 300,45 320,20 C330,0 340,50 360,25 C370,5 380,45 400,25 C410,5 420,45 440,20 C450,0 460,50 480,25',
  // Q3: Flavor — organic, asymmetric waves
  'M0,30 C25,5 50,35 75,20 C100,5 120,45 150,25 C175,5 200,35 225,15 C250,5 270,45 300,30 C325,5 350,35 375,20 C400,5 420,45 450,25 C460,15 470,35 480,30',
  // Q4: Palate — complex, multi-frequency
  'M0,25 C15,10 25,40 40,25 C50,15 55,35 70,25 C85,5 95,45 110,20 C125,10 135,40 150,25 C165,15 175,35 190,25 C200,5 210,45 230,20 C245,10 255,40 270,25 C285,15 295,35 310,25 C320,5 330,45 350,20 C365,10 375,40 390,25 C405,15 415,35 430,25 C440,5 450,45 470,20 C475,15 478,35 480,25',
  // Q5: Intensity — bold, deep troughs
  'M0,25 C30,0 60,50 90,25 C120,0 150,50 180,25 C210,0 240,50 270,25 C300,0 330,50 360,25 C390,0 420,50 450,25 C460,10 470,40 480,25',
  // Q6: Occasion — gentle, elegant sine
  'M0,25 C40,12 80,38 120,25 C160,12 200,38 240,25 C280,12 320,38 360,25 C400,12 440,38 480,25',
  // Q7: Atmosphere — mysterious, variable amplitude
  'M0,25 C20,18 35,32 50,25 C65,5 80,45 100,25 C115,20 125,30 140,25 C155,2 170,48 195,25 C210,18 225,32 240,25 C255,5 270,45 290,25 C305,20 315,30 330,25 C345,2 360,48 385,25 C400,18 415,32 430,25 C445,5 460,45 480,25',
  // Q8: Priority — decisive, staccato rhythm
  'M0,25 C10,5 20,25 30,25 C40,45 50,25 60,25 C70,5 80,25 100,25 C110,45 120,25 130,25 C140,5 150,25 170,25 C180,45 190,25 200,25 C210,5 220,25 240,25 C250,45 260,25 270,25 C280,5 290,25 310,25 C320,45 330,25 340,25 C350,5 360,25 380,25 C390,45 400,25 410,25 C420,5 430,25 450,25 C460,45 470,25 480,25',
]

export default function SensoryWaveform({
  questionIndex,
  hue,
  className = '',
}: SensoryWaveformProps) {
  const pathData = waveformPaths[questionIndex % waveformPaths.length]

  return (
    <div className={`waveform-container w-full max-w-md h-10 relative ${className}`}>
      <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewBox="0 0 480 50"
        fill="none"
        preserveAspectRatio="none"
        className="w-[200%] h-full animate-waveform"
        aria-hidden="true"
      >
        {/* Primary waveform line */}
        <motion.path
          d={pathData}
          stroke={`hsla(${hue}, 45%, 55%, 0.35)`}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Ghost echo line offset — adds depth */}
        <motion.path
          d={pathData}
          stroke={`hsla(${hue}, 40%, 60%, 0.12)`}
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          style={{ transform: 'translateY(3px)' }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.svg>

      {/* Center pulse dot */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
        style={{
          backgroundColor: `hsla(${hue}, 50%, 60%, 0.7)`,
          boxShadow: `0 0 8px hsla(${hue}, 50%, 60%, 0.4)`,
        }}
      />
    </div>
  )
}
