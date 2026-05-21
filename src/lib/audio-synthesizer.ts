import type { ParsedNote } from './tune-parser'

export type InstrumentType = 'piano' | 'flute' | 'strings' | 'synth' | 'guitar' | 'bass' | 'organ'

export interface Theme {
  name: string
  tempo: number
  dynamics: number
  reverb: number
  description: string
}

export const THEMES: Record<string, Theme> = {
  'slow-fine': {
    name: 'Slow and Fine',
    tempo: 60,
    dynamics: 0.5,
    reverb: 0.4,
    description: 'Gentle, deliberate, and refined'
  },
  'energetic': {
    name: 'Energetic',
    tempo: 140,
    dynamics: 0.8,
    reverb: 0.2,
    description: 'Fast-paced and vibrant'
  },
  'mysterious': {
    name: 'Mysterious',
    tempo: 80,
    dynamics: 0.4,
    reverb: 0.7,
    description: 'Enigmatic and atmospheric'
  },
  'playful': {
    name: 'Playful',
    tempo: 120,
    dynamics: 0.6,
    reverb: 0.3,
    description: 'Light and bouncy'
  },
  'dramatic': {
    name: 'Dramatic',
    tempo: 90,
    dynamics: 0.9,
    reverb: 0.5,
    description: 'Powerful and intense'
  },
  'peaceful': {
    name: 'Peaceful',
    tempo: 70,
    dynamics: 0.3,
    reverb: 0.6,
    description: 'Calm and serene'
  },
}

export class AudioSynthesizer {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private analyser: AnalyserNode | null = null
  private isPlaying = false
  private scheduledNotes: { source: OscillatorNode; envelope: GainNode }[] = []

  constructor() {
    if (typeof window !== 'undefined' && window.AudioContext) {
      this.audioContext = new AudioContext()
      this.masterGain = this.audioContext.createGain()
      this.masterGain.gain.value = 0.4
      
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 2048
      
      this.masterGain.connect(this.analyser)
      this.analyser.connect(this.audioContext.destination)
    }
  }

  async init() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
  }

  stop() {
    this.isPlaying = false
    this.scheduledNotes.forEach(({ source }) => {
      try {
        source.stop()
      } catch (e) {
      }
    })
    this.scheduledNotes = []
  }

  async playSequence(
    notes: ParsedNote[],
    instrument: InstrumentType,
    theme: Theme,
    baseKey = 60
  ): Promise<void> {
    if (!this.audioContext || !this.masterGain) {
      throw new Error('Audio context not initialized')
    }

    await this.init()
    this.stop()
    this.isPlaying = true

    const beatDuration = 60 / theme.tempo
    let currentTime = this.audioContext.currentTime + 0.1

    for (let i = 0; i < notes.length; i++) {
      if (!this.isPlaying) break

      const note = notes[i]
      const frequency = this.midiToFreq(baseKey + note.pitch)
      const duration = note.duration * beatDuration

      this.playNote(
        frequency,
        duration,
        currentTime,
        instrument,
        theme.dynamics,
        theme.reverb
      )

      currentTime += duration
    }
  }

  private playNote(
    frequency: number,
    duration: number,
    startTime: number,
    instrument: InstrumentType,
    dynamics: number,
    reverbAmount: number
  ) {
    if (!this.audioContext || !this.masterGain) return

    const oscillator = this.audioContext.createOscillator()
    const envelope = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()
    
    const instrumentConfig = this.getInstrumentConfig(instrument)
    
    oscillator.type = instrumentConfig.waveform
    oscillator.frequency.setValueAtTime(frequency, startTime)

    if (instrumentConfig.detune) {
      oscillator.detune.setValueAtTime(instrumentConfig.detune, startTime)
    }

    filter.type = instrumentConfig.filterType
    filter.frequency.setValueAtTime(instrumentConfig.filterFreq, startTime)
    filter.Q.setValueAtTime(instrumentConfig.filterQ, startTime)

    oscillator.connect(envelope)
    envelope.connect(filter)
    
    if (reverbAmount > 0) {
      const convolver = this.createSimpleReverb(reverbAmount)
      const dryGain = this.audioContext.createGain()
      const wetGain = this.audioContext.createGain()
      
      dryGain.gain.value = 1 - reverbAmount
      wetGain.gain.value = reverbAmount
      
      filter.connect(dryGain)
      filter.connect(convolver)
      convolver.connect(wetGain)
      
      dryGain.connect(this.masterGain)
      wetGain.connect(this.masterGain)
    } else {
      filter.connect(this.masterGain)
    }

    const attackTime = instrumentConfig.attack
    const decayTime = instrumentConfig.decay
    const sustainLevel = instrumentConfig.sustain * dynamics
    const releaseTime = instrumentConfig.release

    envelope.gain.setValueAtTime(0, startTime)
    envelope.gain.linearRampToValueAtTime(dynamics, startTime + attackTime)
    envelope.gain.linearRampToValueAtTime(
      sustainLevel,
      startTime + attackTime + decayTime
    )
    envelope.gain.setValueAtTime(
      sustainLevel,
      startTime + duration - releaseTime
    )
    envelope.gain.linearRampToValueAtTime(0, startTime + duration)

    oscillator.start(startTime)
    oscillator.stop(startTime + duration + 0.1)

    this.scheduledNotes.push({ source: oscillator, envelope })

    oscillator.onended = () => {
      oscillator.disconnect()
      envelope.disconnect()
      filter.disconnect()
    }
  }

  private getInstrumentConfig(instrument: InstrumentType) {
    const configs = {
      piano: {
        waveform: 'triangle' as OscillatorType,
        attack: 0.01,
        decay: 0.1,
        sustain: 0.3,
        release: 0.2,
        filterType: 'lowpass' as BiquadFilterType,
        filterFreq: 2000,
        filterQ: 1,
        detune: 0,
      },
      flute: {
        waveform: 'sine' as OscillatorType,
        attack: 0.05,
        decay: 0.05,
        sustain: 0.8,
        release: 0.1,
        filterType: 'lowpass' as BiquadFilterType,
        filterFreq: 3000,
        filterQ: 2,
        detune: 0,
      },
      strings: {
        waveform: 'sawtooth' as OscillatorType,
        attack: 0.15,
        decay: 0.1,
        sustain: 0.7,
        release: 0.3,
        filterType: 'lowpass' as BiquadFilterType,
        filterFreq: 1500,
        filterQ: 3,
        detune: 0,
      },
      synth: {
        waveform: 'square' as OscillatorType,
        attack: 0.02,
        decay: 0.05,
        sustain: 0.6,
        release: 0.15,
        filterType: 'lowpass' as BiquadFilterType,
        filterFreq: 2500,
        filterQ: 5,
        detune: 0,
      },
      guitar: {
        waveform: 'triangle' as OscillatorType,
        attack: 0.01,
        decay: 0.2,
        sustain: 0.4,
        release: 0.3,
        filterType: 'bandpass' as BiquadFilterType,
        filterFreq: 1800,
        filterQ: 2,
        detune: -10,
      },
      bass: {
        waveform: 'sawtooth' as OscillatorType,
        attack: 0.01,
        decay: 0.1,
        sustain: 0.5,
        release: 0.2,
        filterType: 'lowpass' as BiquadFilterType,
        filterFreq: 800,
        filterQ: 1,
        detune: 0,
      },
      organ: {
        waveform: 'sine' as OscillatorType,
        attack: 0.05,
        decay: 0.05,
        sustain: 0.9,
        release: 0.1,
        filterType: 'lowpass' as BiquadFilterType,
        filterFreq: 4000,
        filterQ: 1,
        detune: 0,
      },
    }

    return configs[instrument] || configs.piano
  }

  private createSimpleReverb(reverbAmount: number): ConvolverNode {
    if (!this.audioContext) throw new Error('Audio context not available')

    const convolver = this.audioContext.createConvolver()
    const rate = this.audioContext.sampleRate
    const length = rate * 2 * reverbAmount
    const impulse = this.audioContext.createBuffer(2, length, rate)

    const left = impulse.getChannelData(0)
    const right = impulse.getChannelData(1)

    for (let i = 0; i < length; i++) {
      const decay = Math.pow(1 - i / length, 2)
      left[i] = (Math.random() * 2 - 1) * decay
      right[i] = (Math.random() * 2 - 1) * decay
    }

    convolver.buffer = impulse
    return convolver
  }

  private midiToFreq(midiNote: number): number {
    return 440 * Math.pow(2, (midiNote - 69) / 12)
  }

  async playLayeredSequence(
    notes: ParsedNote[],
    instrument: InstrumentType,
    theme: Theme,
    baseKey = 60,
    volume = 1.0
  ): Promise<void> {
    if (!this.audioContext || !this.masterGain) {
      throw new Error('Audio context not initialized')
    }

    await this.init()
    this.isPlaying = true

    const layerGain = this.audioContext.createGain()
    layerGain.gain.value = volume * 0.4
    layerGain.connect(this.masterGain)

    const beatDuration = 60 / theme.tempo
    let currentTime = this.audioContext.currentTime + 0.1

    for (let i = 0; i < notes.length; i++) {
      if (!this.isPlaying) break

      const note = notes[i]
      const frequency = this.midiToFreq(baseKey + note.pitch)
      const duration = note.duration * beatDuration

      this.playNoteToTarget(
        frequency,
        duration,
        currentTime,
        instrument,
        theme.dynamics,
        theme.reverb,
        layerGain
      )

      currentTime += duration
    }
  }

  private playNoteToTarget(
    frequency: number,
    duration: number,
    startTime: number,
    instrument: InstrumentType,
    dynamics: number,
    reverbAmount: number,
    targetNode: AudioNode
  ) {
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const envelope = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()
    
    const instrumentConfig = this.getInstrumentConfig(instrument)
    
    oscillator.type = instrumentConfig.waveform
    oscillator.frequency.setValueAtTime(frequency, startTime)

    if (instrumentConfig.detune) {
      oscillator.detune.setValueAtTime(instrumentConfig.detune, startTime)
    }

    filter.type = instrumentConfig.filterType
    filter.frequency.setValueAtTime(instrumentConfig.filterFreq, startTime)
    filter.Q.setValueAtTime(instrumentConfig.filterQ, startTime)

    oscillator.connect(envelope)
    envelope.connect(filter)
    filter.connect(targetNode)

    const attackTime = instrumentConfig.attack
    const decayTime = instrumentConfig.decay
    const sustainLevel = instrumentConfig.sustain * dynamics
    const releaseTime = instrumentConfig.release

    envelope.gain.setValueAtTime(0, startTime)
    envelope.gain.linearRampToValueAtTime(dynamics, startTime + attackTime)
    envelope.gain.linearRampToValueAtTime(
      sustainLevel,
      startTime + attackTime + decayTime
    )
    envelope.gain.setValueAtTime(
      sustainLevel,
      startTime + duration - releaseTime
    )
    envelope.gain.linearRampToValueAtTime(0, startTime + duration)

    oscillator.start(startTime)
    oscillator.stop(startTime + duration + 0.1)

    this.scheduledNotes.push({ source: oscillator, envelope })

    oscillator.onended = () => {
      oscillator.disconnect()
      envelope.disconnect()
      filter.disconnect()
    }
  }

  getContext(): AudioContext | null {
    return this.audioContext
  }

  getAnalyser(): AnalyserNode | null {
    return this.analyser
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying
  }
}

export const globalSynthesizer = new AudioSynthesizer()
