/**
 * Haute Distillerie — Ultra-Luxury Speakeasy Bar Ambient Music Engine
 *
 * Studio-Grade Procedural Lounge Jazz Soundscape synthesized via Web Audio API:
 * - Vintage Rhodes Suitcase Electric Piano (multi-harmonic FM timbre, hammer tines & stereo tremolo)
 * - Deep Plucked Upright Acoustic Jazz Bass (woody resonance & finger attack)
 * - Ambient Velvet Cellar Strings / Analog Pad (soft cinematic harmonic beds)
 * - Authentic Brushed Jazz Drums & Swing Ride Cymbal (swishing brushes & swing sizzle)
 * - Pentatonic Vibraphone / Wine Glass Bell Counter-Melodies
 * - Antique Turntable Vinyl Warmth & Micro-Crackles
 * - Default autoplay with silent policy unlock on first user gesture
 */

type SoundStateListener = (isPlaying: boolean, isMuted: boolean) => void

interface ChordBar {
  bass: number
  notes: number[]
  pad: number[]
  chime?: number
}

class BarMusicEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private musicGain: GainNode | null = null
  private rhythmGain: GainNode | null = null
  private padGain: GainNode | null = null
  private vinylGain: GainNode | null = null
  private delayL: DelayNode | null = null
  private delayR: DelayNode | null = null

  private isRunning: boolean = true
  private muted: boolean = false
  private hasUnlockedAudio: boolean = false
  private barTimer: number | null = null
  private vinylTimer: number | null = null
  private currentBarIndex: number = 0

  private listeners: Set<SoundStateListener> = new Set()

  // 8-Bar Sophisticated Speakeasy Modal Jazz Lounge Progression (Hz)
  private progression: ChordBar[] = [
    // 0: Cm9 (Smoky Speakeasy cellar)
    { bass: 65.41, notes: [155.56, 196.0, 233.08, 293.66, 392.0], pad: [130.81, 196.0, 293.66], chime: 587.33 },
    // 1: Fm9 (Velvet Booth)
    { bass: 87.31, notes: [174.61, 207.65, 261.63, 311.13, 392.0], pad: [174.61, 261.63, 349.23], chime: 698.46 },
    // 2: Bb13 (Warm Copper Alembic)
    { bass: 58.27, notes: [146.83, 233.08, 293.66, 349.23, 440.0], pad: [116.54, 233.08, 349.23], chime: 523.25 },
    // 3: Ebmaj9 (Golden Reserve Oak)
    { bass: 77.78, notes: [155.56, 196.0, 233.08, 293.66, 349.23], pad: [155.56, 233.08, 311.13], chime: 622.25 },
    // 4: Abmaj7#11 (Botanical Flora & Smoke)
    { bass: 51.91, notes: [130.81, 207.65, 261.63, 293.66, 392.0], pad: [103.83, 207.65, 293.66], chime: 783.99 },
    // 5: Dm7b5 (Single Malt Peat)
    { bass: 73.42, notes: [146.83, 174.61, 207.65, 261.63, 349.23], pad: [146.83, 207.65, 293.66], chime: 523.25 },
    // 6: G7alt (Cinnamon & Spiced Rye)
    { bass: 98.0, notes: [174.61, 246.94, 311.13, 415.3, 493.88], pad: [196.0, 246.94, 392.0], chime: 739.99 },
    // 7: Cm11 (Velvet Resolution)
    { bass: 65.41, notes: [155.56, 196.0, 233.08, 349.23, 523.25], pad: [130.81, 196.0, 349.23], chime: 659.25 },
  ]

  constructor() {
    // Default to PLAY mode unless user explicitly muted in a previous visit
    try {
      const saved = localStorage.getItem('diageo_bar_music_state')
      if (saved === 'muted') {
        this.muted = true
      } else {
        this.muted = false
      }
    } catch {
      this.muted = false
    }

    // Auto-initialize immediately on client load
    if (typeof window !== 'undefined') {
      // Setup audio graph
      this.initAudio()

      // Listen for first interaction to unlock browser autoplay policy smoothly
      this.setupAutoplayUnlock()
    }
  }

  public subscribe(listener: SoundStateListener): () => void {
    this.listeners.add(listener)
    listener(this.isRunning, this.muted)
    return () => this.listeners.delete(listener)
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isRunning, this.muted))
  }

  public getIsPlaying(): boolean {
    return this.isRunning
  }

  public getIsMuted(): boolean {
    return this.muted
  }

  private initAudio() {
    if (this.ctx) return

    try {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioContextClass()

      // Master Output with gentle warm saturation curve
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.38, this.ctx.currentTime)
      this.masterGain.connect(this.ctx.destination)

      // Rhodes / Keys Sub-bus
      this.musicGain = this.ctx.createGain()
      this.musicGain.gain.setValueAtTime(0.85, this.ctx.currentTime)
      this.musicGain.connect(this.masterGain)

      // Ambient Cellar Strings / Pad Sub-bus
      this.padGain = this.ctx.createGain()
      this.padGain.gain.setValueAtTime(0.24, this.ctx.currentTime)
      this.padGain.connect(this.masterGain)

      // Brushed Drums & Ride Cymbal Sub-bus
      this.rhythmGain = this.ctx.createGain()
      this.rhythmGain.gain.setValueAtTime(0.28, this.ctx.currentTime)
      this.rhythmGain.connect(this.masterGain)

      // Antique Vinyl Dust Sub-bus
      this.vinylGain = this.ctx.createGain()
      this.vinylGain.gain.setValueAtTime(0.08, this.ctx.currentTime)
      this.vinylGain.connect(this.masterGain)

      // Studio Stereo Reverb & Cross-Delay Line
      this.delayL = this.ctx.createDelay()
      this.delayR = this.ctx.createDelay()
      this.delayL.delayTime.value = 0.28
      this.delayR.delayTime.value = 0.44

      const feedbackL = this.ctx.createGain()
      const feedbackR = this.ctx.createGain()
      feedbackL.gain.value = 0.24
      feedbackR.gain.value = 0.2

      const roomFilter = this.ctx.createBiquadFilter()
      roomFilter.type = 'lowpass'
      roomFilter.frequency.value = 1600
      roomFilter.Q.value = 0.7

      this.delayL.connect(feedbackL)
      feedbackL.connect(this.delayR)
      this.delayR.connect(feedbackR)
      feedbackR.connect(this.delayL)

      this.delayL.connect(roomFilter)
      this.delayR.connect(roomFilter)
      roomFilter.connect(this.masterGain)

      // Start vinyl groove ambience and musical cycle immediately
      this.startVinylAtmosphere()
      this.playBarCycle()
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Browser Autoplay Policy: Automatically resume AudioContext
   * upon the very first user interaction anywhere on the website.
   */
  private setupAutoplayUnlock() {
    if (this.hasUnlockedAudio) return

    const unlock = () => {
      if (this.ctx && this.ctx.state === 'suspended' && !this.muted) {
        this.ctx.resume().then(() => {
          this.hasUnlockedAudio = true
          this.notify()
        }).catch(() => {})
      } else {
        this.hasUnlockedAudio = true
      }

      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('click', unlock)
      window.removeEventListener('touchstart', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('scroll', unlock)
    }

    window.addEventListener('pointerdown', unlock, { passive: true })
    window.addEventListener('click', unlock, { passive: true })
    window.addEventListener('touchstart', unlock, { passive: true })
    window.addEventListener('keydown', unlock, { passive: true })
    window.addEventListener('scroll', unlock, { passive: true })

    // If context is already running (e.g. Chrome user gesture remembered), mark unlocked
    if (this.ctx && this.ctx.state === 'running') {
      this.hasUnlockedAudio = true
    }
  }

  public async start() {
    this.initAudio()
    if (!this.ctx) return

    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume()
      } catch {}
    }

    this.isRunning = true
    this.muted = false
    try {
      localStorage.setItem('diageo_bar_music_state', 'playing')
    } catch {}

    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(0.38, this.ctx.currentTime, 0.15)
    }

    this.notify()
  }

  public toggleMute() {
    this.initAudio()
    if (!this.ctx) return

    this.muted = !this.muted
    try {
      localStorage.setItem('diageo_bar_music_state', this.muted ? 'muted' : 'playing')
    } catch {}

    const now = this.ctx.currentTime
    if (this.muted) {
      // Buttery smooth fade out to silence
      if (this.masterGain) {
        this.masterGain.gain.setTargetAtTime(0, now, 0.12)
      }
    } else {
      // Resume if suspended
      if (this.ctx.state === 'suspended') {
        this.ctx.resume()
      }
      this.isRunning = true
      // Gentle swell back into the music
      if (this.masterGain) {
        this.masterGain.gain.setTargetAtTime(0.38, now, 0.2)
      }
    }

    this.notify()
  }

  public setMute(muted: boolean) {
    if (this.muted === muted) return
    this.toggleMute()
  }

  /**
   * Continuous Jazz Bar Cycle (4 beats per bar, 62 BPM lounge tempo)
   */
  private playBarCycle = () => {
    if (!this.isRunning || !this.ctx || !this.musicGain) return

    const now = this.ctx.currentTime
    const bar = this.progression[this.currentBarIndex]
    const barDuration = 3.87 // ~62 BPM
    const beatDuration = barDuration / 4

    // 1. Plucked Upright Jazz Bass
    this.playUprightBass(bar.bass, now, barDuration * 0.95)

    // 2. Ambient Cellar Strings / Pad Swell
    this.playAmbientPad(bar.pad, now, barDuration)

    // 3. Vintage Rhodes Electric Piano Chords (Rolled jazz strum)
    bar.notes.forEach((freq, idx) => {
      const strumOffset = idx * 0.042 // 42ms humanized roll
      this.playRhodesNote(freq, now + strumOffset, barDuration * 0.85, idx)
    })

    // 4. Subtle Vibraphone Chime Accent on beat 3.5
    if (bar.chime) {
      const chimeTime = now + beatDuration * 2.5
      this.playVibraphoneChime(bar.chime, chimeTime)
    }

    // 5. Authentic Speakeasy Brushed Jazz Rhythm (4 beats)
    this.scheduleBrushedRhythm(now, beatDuration)

    // Advance to next bar in progression
    this.currentBarIndex = (this.currentBarIndex + 1) % this.progression.length

    // Schedule next bar
    this.barTimer = window.setTimeout(this.playBarCycle, barDuration * 1000)
  }

  /**
   * Synthesizes Warm Vintage Rhodes Electric Piano with Multi-Harmonic Voicing
   */
  private playRhodesNote(freq: number, time: number, duration: number, voiceIndex: number) {
    if (!this.ctx || !this.musicGain) return

    // Fundamental Body (Warm Triangle)
    const oscBody = this.ctx.createOscillator()
    oscBody.type = 'triangle'
    oscBody.frequency.setValueAtTime(freq, time)

    // Bell-Tine Sparkle (Sine with slight warm detune)
    const oscTine = this.ctx.createOscillator()
    oscTine.type = 'sine'
    oscTine.frequency.setValueAtTime(freq * 2.01, time)

    // Sub-warmth
    const oscSub = this.ctx.createOscillator()
    oscSub.type = 'sine'
    oscSub.frequency.setValueAtTime(freq, time)

    // Dynamic Low-Pass Filter simulating physical hammer striking metal tines
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1600, time)
    filter.frequency.exponentialRampToValueAtTime(480, time + duration * 0.7)
    filter.Q.value = 1.8

    // Amplitude Envelope
    const noteGain = this.ctx.createGain()
    noteGain.gain.setValueAtTime(0.0001, time)
    // Quick, soft hammer attack (14ms)
    noteGain.gain.exponentialRampToValueAtTime(0.22, time + 0.014)
    // Warm vintage decay
    noteGain.gain.exponentialRampToValueAtTime(0.065, time + 1.4)
    // Natural acoustic release
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration)

    // Suitcase Rhodes Stereo Tremolo (Gentle 2.6Hz LFO)
    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null
    if (panner) {
      const basePan = ((voiceIndex - 2) / 3) * 0.35
      panner.pan.setValueAtTime(basePan, time)
    }

    // Connect audio nodes
    oscBody.connect(filter)
    oscTine.connect(filter)
    oscSub.connect(filter)
    filter.connect(noteGain)

    if (panner) {
      noteGain.connect(panner)
      panner.connect(this.musicGain)
      if (this.delayL) panner.connect(this.delayL)
    } else {
      noteGain.connect(this.musicGain)
      if (this.delayL) noteGain.connect(this.delayL)
    }

    oscBody.start(time)
    oscTine.start(time)
    oscSub.start(time)

    oscBody.stop(time + duration)
    oscTine.stop(time + duration)
    oscSub.stop(time + duration)
  }

  /**
   * Deep Woody Upright Acoustic Jazz Bass
   */
  private playUprightBass(freq: number, time: number, duration: number) {
    if (!this.ctx || !this.musicGain) return

    const osc = this.ctx.createOscillator()
    osc.type = 'sine'
    // Subtle acoustic finger release pitch bend (-8 cents settling into note)
    osc.frequency.setValueAtTime(freq * 1.01, time)
    osc.frequency.exponentialRampToValueAtTime(freq, time + 0.04)

    // Wood body warm lowpass
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(260, time)
    filter.frequency.exponentialRampToValueAtTime(90, time + duration * 0.7)
    filter.Q.value = 1.4

    // Pluck attack transient (tiny click simulating finger on gut string)
    const attackOsc = this.ctx.createOscillator()
    attackOsc.type = 'triangle'
    attackOsc.frequency.setValueAtTime(140, time)

    const bassGain = this.ctx.createGain()
    bassGain.gain.setValueAtTime(0.0001, time)
    bassGain.gain.exponentialRampToValueAtTime(0.42, time + 0.024)
    bassGain.gain.exponentialRampToValueAtTime(0.12, time + 0.8)
    bassGain.gain.exponentialRampToValueAtTime(0.0001, time + duration)

    osc.connect(filter)
    attackOsc.connect(filter)
    filter.connect(bassGain)
    bassGain.connect(this.musicGain)

    osc.start(time)
    attackOsc.start(time)
    osc.stop(time + duration)
    attackOsc.stop(time + 0.04)
  }

  /**
   * Ambient Velvet Cellar Strings / Pad Swell
   */
  private playAmbientPad(notes: number[], time: number, duration: number) {
    if (!this.ctx || !this.padGain) return

    notes.forEach((freq) => {
      const osc = this.ctx!.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq * 0.5, time) // 1 octave below for deep richness

      const filter = this.ctx!.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(320, time)

      const gain = this.ctx!.createGain()
      gain.gain.setValueAtTime(0.0001, time)
      // Soft cinematic swell (1.2s attack)
      gain.gain.exponentialRampToValueAtTime(0.14, time + 1.2)
      // Long gentle release
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration + 0.5)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.padGain!)

      osc.start(time)
      osc.stop(time + duration + 0.6)
    })
  }

  /**
   * Pentatonic Vibraphone / Crystal Glass Chime
   */
  private playVibraphoneChime(freq: number, time: number) {
    if (!this.ctx || !this.musicGain) return

    const osc = this.ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, time)

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(freq, time)
    filter.Q.value = 6.0

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.0001, time)
    gain.gain.exponentialRampToValueAtTime(0.09, time + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 2.4)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.musicGain)
    if (this.delayR) gain.connect(this.delayR)

    osc.start(time)
    osc.stop(time + 2.5)
  }

  /**
   * Speakeasy Brushed Jazz Drums & Swing Ride Cymbal
   */
  private scheduleBrushedRhythm(barStart: number, beat: number) {
    if (!this.ctx || !this.rhythmGain) return

    // Beat 1: Soft Lounge Kick + Ride Sizzle
    this.playSoftKick(barStart)
    this.playRideCymbal(barStart, 0.08)

    // Beat 2: Soft Brushed Snare Sweep + Ride Sizzle
    this.playBrushSnare(barStart + beat)
    this.playRideCymbal(barStart + beat, 0.06)

    // Beat 2.66 (Swing triplet): Gentle Ride Tap
    this.playRideCymbal(barStart + beat * 1.66, 0.045)

    // Beat 3: Subtle Ride Cymbal Tap
    this.playRideCymbal(barStart + beat * 2, 0.065)

    // Beat 4: Soft Brushed Snare Sweep + Ride Sizzle
    this.playBrushSnare(barStart + beat * 3)
    this.playRideCymbal(barStart + beat * 3, 0.06)

    // Beat 4.66 (Swing triplet): Gentle Ride Tap
    this.playRideCymbal(barStart + beat * 3.66, 0.05)
  }

  /**
   * Soft Brushed Snare Sweep (Filtered Velvet Noise)
   */
  private playBrushSnare(time: number) {
    if (!this.ctx || !this.rhythmGain) return

    const bufferSize = Math.floor(this.ctx.sampleRate * 0.18)
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4))
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(2200, time)
    filter.Q.value = 1.2

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.0001, time)
    gain.gain.exponentialRampToValueAtTime(0.06, time + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.rhythmGain)

    noise.start(time)
  }

  /**
   * Delicate Ride Cymbal Sizzle
   */
  private playRideCymbal(time: number, volume: number) {
    if (!this.ctx || !this.rhythmGain) return

    const bufferSize = Math.floor(this.ctx.sampleRate * 0.22)
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25))
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(7500, time)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.0001, time)
    gain.gain.exponentialRampToValueAtTime(volume, time + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.22)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.rhythmGain)

    noise.start(time)
  }

  /**
   * Soft Velvet Low Kick
   */
  private playSoftKick(time: number) {
    if (!this.ctx || !this.rhythmGain) return

    const osc = this.ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(75, time)
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.12)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.0001, time)
    gain.gain.exponentialRampToValueAtTime(0.18, time + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.22)

    osc.connect(gain)
    gain.connect(this.rhythmGain)

    osc.start(time)
    osc.stop(time + 0.24)
  }

  /**
   * Procedural Antique Turntable Vinyl Warmth & Dust
   */
  private startVinylAtmosphere() {
    if (!this.ctx || !this.vinylGain) return

    const triggerCrackle = () => {
      if (!this.isRunning || !this.ctx || !this.vinylGain) return

      if (!this.muted && Math.random() < 0.55) {
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.015)
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
        const data = buffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3))
        }

        const noise = this.ctx.createBufferSource()
        noise.buffer = buffer

        const filter = this.ctx.createBiquadFilter()
        filter.type = 'bandpass'
        filter.frequency.value = 1600 + Math.random() * 2400
        filter.Q.value = 4.0

        const tickGain = this.ctx.createGain()
        tickGain.gain.value = 0.025 + Math.random() * 0.035

        noise.connect(filter)
        filter.connect(tickGain)
        tickGain.connect(this.vinylGain)

        noise.start()
      }

      this.vinylTimer = window.setTimeout(triggerCrackle, 140 + Math.random() * 320)
    }

    triggerCrackle()
  }

  /**
   * Delicate crystal glass chime when selecting a tasting frame
   */
  public playCrystalSelectionChime() {
    try {
      if (!this.ctx || this.ctx.state === 'suspended' || this.muted) return

      const now = this.ctx.currentTime
      const osc1 = this.ctx.createOscillator()
      const osc2 = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(1318.51, now) // E6 crystal harmonic
      osc1.frequency.exponentialRampToValueAtTime(1316.0, now + 1.2)

      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(2637.02, now) // E7 overtone
      osc2.frequency.exponentialRampToValueAtTime(2630.0, now + 0.8)

      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.05, now + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4)

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(this.masterGain || this.ctx.destination)

      osc1.start(now)
      osc2.start(now)
      osc1.stop(now + 1.5)
      osc2.stop(now + 1.5)
    } catch {}
  }

  /**
   * Warm cinematic threshold transition when walking to next chamber
   */
  public playChamberWalkTransition() {
    try {
      if (!this.ctx || this.ctx.state === 'suspended' || this.muted) return

      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(58.27, now) // Bb1 deep cello cellar resonance
      osc.frequency.exponentialRampToValueAtTime(82.41, now + 2.0)

      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.4)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2)

      osc.connect(gain)
      gain.connect(this.masterGain || this.ctx.destination)

      osc.start(now)
      osc.stop(now + 2.3)
    } catch {}
  }

  public stop() {
    if (!this.isRunning) return
    this.isRunning = false

    if (this.barTimer) {
      clearTimeout(this.barTimer)
      this.barTimer = null
    }
    if (this.vinylTimer) {
      clearTimeout(this.vinylTimer)
      this.vinylTimer = null
    }

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1)
    }

    this.notify()
  }
}

// Global Singleton instance for seamless cross-route audio persistence
export const barMusic = new BarMusicEngine()
