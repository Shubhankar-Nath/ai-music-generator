import type { InstrumentType } from './audio-synthesizer'
import type { ParsedTune } from './tune-parser'

export interface SavedMusic {
  id: string
  name: string
  tunePattern: string
  parsedTune: ParsedTune
  instrument: InstrumentType
  theme: string
  baseKey: number
  createdAt: number
}

export interface ChordProgression {
  id: string
  name: string
  chords: string[]
  romanNumerals: string[]
  key: string
  scale: string
  mood: string
  explanation: string
  genre?: string
}

export interface Melody {
  id: string
  name: string
  notes: string[]
  rhythm: string[]
  key: string
  scale: string
  mood: string
  explanation: string
}

export interface Composition {
  id: string
  name: string
  sections: CompositionSection[]
  key: string
  tempo: string
  timeSignature: string
  mood: string
  genre?: string
}

export interface CompositionSection {
  name: string
  chords?: string[]
  melody?: string[]
  description: string
}

export interface AIGenerationResult {
  type: 'chords' | 'melody' | 'composition' | 'explanation'
  key: string
  scale: string
  mood: string
  content: unknown
  explanation: string
}
