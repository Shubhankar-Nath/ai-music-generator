export const SCALES = {
  major: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  minor: ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'],
  dorian: ['C', 'D', 'Eb', 'F', 'G', 'A', 'Bb'],
  phrygian: ['C', 'Db', 'Eb', 'F', 'G', 'Ab', 'Bb'],
  lydian: ['C', 'D', 'E', 'F#', 'G', 'A', 'B'],
  mixolydian: ['C', 'D', 'E', 'F', 'G', 'A', 'Bb'],
  locrian: ['C', 'Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb'],
  harmonicMinor: ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'B'],
  melodicMinor: ['C', 'D', 'Eb', 'F', 'G', 'A', 'B'],
  pentatonicMajor: ['C', 'D', 'E', 'G', 'A'],
  pentatonicMinor: ['C', 'Eb', 'F', 'G', 'Bb'],
  blues: ['C', 'Eb', 'F', 'F#', 'G', 'Bb'],
  wholeTone: ['C', 'D', 'E', 'F#', 'G#', 'A#'],
  diminished: ['C', 'D', 'Eb', 'F', 'Gb', 'Ab', 'A', 'B'],
}

export const CHORD_TYPES = {
  major: { suffix: '', intervals: [0, 4, 7], description: 'Major triad - bright and stable' },
  minor: { suffix: 'm', intervals: [0, 3, 7], description: 'Minor triad - darker and introspective' },
  diminished: { suffix: 'dim', intervals: [0, 3, 6], description: 'Diminished - tense and unstable' },
  augmented: { suffix: 'aug', intervals: [0, 4, 8], description: 'Augmented - mysterious and floating' },
  major7: { suffix: 'maj7', intervals: [0, 4, 7, 11], description: 'Major 7th - jazz and sophisticated' },
  minor7: { suffix: 'm7', intervals: [0, 3, 7, 10], description: 'Minor 7th - smooth and mellow' },
  dominant7: { suffix: '7', intervals: [0, 4, 7, 10], description: 'Dominant 7th - tension wanting resolution' },
  halfDiminished7: { suffix: 'm7b5', intervals: [0, 3, 6, 10], description: 'Half-diminished - jazzy and complex' },
  diminished7: { suffix: 'dim7', intervals: [0, 3, 6, 9], description: 'Fully diminished - very tense' },
  sus2: { suffix: 'sus2', intervals: [0, 2, 7], description: 'Suspended 2nd - open and airy' },
  sus4: { suffix: 'sus4', intervals: [0, 5, 7], description: 'Suspended 4th - anticipatory' },
  add9: { suffix: 'add9', intervals: [0, 4, 7, 14], description: 'Added 9th - rich and colorful' },
  sixth: { suffix: '6', intervals: [0, 4, 7, 9], description: '6th chord - vintage and jazzy' },
  ninth: { suffix: '9', intervals: [0, 4, 7, 10, 14], description: '9th chord - lush and extended' },
}

export const KEYS = [
  'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'
]

export const MOODS = {
  happy: {
    description: 'Bright, uplifting, joyful',
    preferredScales: ['major', 'lydian', 'mixolydian'],
    preferredChords: ['major', 'major7', 'sixth', 'add9'],
    tempo: 'medium-fast',
  },
  sad: {
    description: 'Melancholic, introspective, emotional',
    preferredScales: ['minor', 'dorian', 'phrygian'],
    preferredChords: ['minor', 'minor7', 'diminished'],
    tempo: 'slow',
  },
  mysterious: {
    description: 'Enigmatic, suspenseful, haunting',
    preferredScales: ['phrygian', 'locrian', 'wholeTone', 'diminished'],
    preferredChords: ['diminished', 'augmented', 'halfDiminished7'],
    tempo: 'slow-medium',
  },
  energetic: {
    description: 'Powerful, driving, intense',
    preferredScales: ['major', 'mixolydian', 'pentatonicMajor'],
    preferredChords: ['major', 'dominant7', 'sus4'],
    tempo: 'fast',
  },
  peaceful: {
    description: 'Calm, serene, gentle',
    preferredScales: ['major', 'lydian', 'pentatonicMajor'],
    preferredChords: ['major', 'sus2', 'add9', 'major7'],
    tempo: 'slow',
  },
  dramatic: {
    description: 'Intense, theatrical, powerful',
    preferredScales: ['harmonicMinor', 'phrygian', 'minor'],
    preferredChords: ['minor', 'diminished', 'dominant7', 'augmented'],
    tempo: 'medium',
  },
  jazzy: {
    description: 'Sophisticated, smooth, complex',
    preferredScales: ['dorian', 'melodicMinor', 'major'],
    preferredChords: ['major7', 'minor7', 'ninth', 'halfDiminished7', 'dominant7'],
    tempo: 'medium',
  },
  nostalgic: {
    description: 'Wistful, reminiscent, bittersweet',
    preferredScales: ['minor', 'dorian'],
    preferredChords: ['minor7', 'sixth', 'add9'],
    tempo: 'slow-medium',
  },
}

export const GENRES = {
  classical: {
    description: 'Traditional Western art music',
    characteristics: 'Complex harmony, structured forms, dynamic contrast',
    commonProgressions: ['I-IV-V-I', 'I-vi-IV-V', 'ii-V-I'],
  },
  jazz: {
    description: 'Improvisation-based American music',
    characteristics: 'Extended chords, swing rhythm, complex harmony',
    commonProgressions: ['ii-V-I', 'I-vi-ii-V', 'iii-vi-ii-V-I'],
  },
  pop: {
    description: 'Contemporary popular music',
    characteristics: 'Catchy melodies, simple structures, verse-chorus form',
    commonProgressions: ['I-V-vi-IV', 'I-IV-V-IV', 'vi-IV-I-V'],
  },
  rock: {
    description: 'Guitar-driven popular music',
    characteristics: 'Power chords, strong backbeat, electric instruments',
    commonProgressions: ['I-IV-V', 'I-bVII-IV', 'i-bVI-bVII'],
  },
  blues: {
    description: 'African-American roots music',
    characteristics: '12-bar form, blue notes, call and response',
    commonProgressions: ['I-I-I-I-IV-IV-I-I-V-IV-I-V', 'I-IV-I-V'],
  },
  electronic: {
    description: 'Synthesizer and computer-based music',
    characteristics: 'Repetitive patterns, electronic timbres, programmed rhythms',
    commonProgressions: ['i-bVII-bVI-bVII', 'i-v-bVI-bVII', 'I-V-vi-IV'],
  },
  ambient: {
    description: 'Atmospheric, mood-focused music',
    characteristics: 'Slow evolution, textural focus, minimal rhythm',
    commonProgressions: ['I-IV-I-V', 'vi-IV-I-V', 'I-V-IV-V'],
  },
  folk: {
    description: 'Traditional acoustic music',
    characteristics: 'Simple chords, storytelling, acoustic instruments',
    commonProgressions: ['I-IV-I-V', 'I-V-vi-IV', 'I-IV-V'],
  },
}

export const COMMON_PROGRESSIONS = [
  { name: 'I-IV-V-I', description: 'The most fundamental progression in Western music', romanNumerals: ['I', 'IV', 'V', 'I'] },
  { name: 'I-V-vi-IV', description: 'The "pop-punk progression" - extremely popular in modern music', romanNumerals: ['I', 'V', 'vi', 'IV'] },
  { name: 'ii-V-I', description: 'The essential jazz progression', romanNumerals: ['ii', 'V', 'I'] },
  { name: 'I-vi-IV-V', description: 'The "50s progression" - classic doo-wop', romanNumerals: ['I', 'vi', 'IV', 'V'] },
  { name: 'i-bVI-bVII-i', description: 'Dark and modern, used in rock and electronic', romanNumerals: ['i', 'bVI', 'bVII', 'i'] },
  { name: 'I-IV-vi-V', description: 'Emotional and uplifting', romanNumerals: ['I', 'IV', 'vi', 'V'] },
  { name: 'vi-IV-I-V', description: 'The "sensitive female chord progression"', romanNumerals: ['vi', 'IV', 'I', 'V'] },
  { name: 'I-iii-IV-V', description: 'Classic progression with rising motion', romanNumerals: ['I', 'iii', 'IV', 'V'] },
]

export const RHYTHM_PATTERNS = {
  quarter: { name: 'Quarter Notes', notation: '♩ ♩ ♩ ♩', description: 'Steady, even rhythm' },
  eighth: { name: 'Eighth Notes', notation: '♪♪ ♪♪ ♪♪ ♪♪', description: 'Faster, flowing rhythm' },
  dotted: { name: 'Dotted Rhythm', notation: '♩. ♪ ♩. ♪', description: 'Bouncy, uneven feel' },
  syncopated: { name: 'Syncopated', notation: '♪ ♩ ♪ ♪ ♩', description: 'Off-beat emphasis, jazzy' },
  triplet: { name: 'Triplets', notation: '♪♪♪ ♪♪♪', description: 'Three notes per beat' },
  swing: { name: 'Swing', notation: '♪̇ ♪ ♪̇ ♪', description: 'Jazz shuffle feel' },
}

export function buildMusicTheoryPrompt(userRequest: string) {
  const genres = Object.keys(GENRES).join(', ')
  const moods = Object.keys(MOODS).join(', ')
  
  return window.spark.llmPrompt`You are an expert music theorist and composer with deep knowledge of harmony, melody, rhythm, and composition across all genres and styles.

Your knowledge includes:

SCALES: Major, Minor (Natural, Harmonic, Melodic), Modes (Dorian, Phrygian, Lydian, Mixolydian, Locrian), Pentatonic, Blues, Whole Tone, Diminished

CHORD TYPES: Triads (major, minor, diminished, augmented), 7th chords (major7, minor7, dominant7, half-diminished, diminished7), Suspended (sus2, sus4), Extended (9th, 11th, 13th), Added tone chords

HARMONIC CONCEPTS: Circle of fifths, voice leading, functional harmony, modal interchange, secondary dominants, borrowed chords, chromatic mediant relationships, tritone substitutions

MELODIC CONCEPTS: Contour, intervals, sequences, motifs, phrases, call and response, tension and release, approach notes, embellishments

RHYTHMIC CONCEPTS: Time signatures, syncopation, polyrhythm, swing, groove, rhythmic displacement

GENRES: ${genres}
MOODS: ${moods}

User Request: ${userRequest}

Analyze the request and generate appropriate musical content. If generating:
- CHORD PROGRESSIONS: Provide 4-8 chords with Roman numeral analysis, explanation of why they work together, and the emotional effect
- MELODIES: Provide note sequences with rhythm, explain the melodic contour and how it relates to harmony
- FULL COMPOSITIONS: Provide structure (intro, verse, chorus, etc.) with chords and melodic ideas for each section
- THEORY EXPLANATIONS: Explain concepts clearly with examples

Format your response as JSON with this structure:
{
  "type": "chords" | "melody" | "composition" | "explanation",
  "key": "the musical key",
  "scale": "the scale/mode used",
  "mood": "the emotional character",
  "content": {
    ... (structure depends on type)
  },
  "explanation": "why this works musically and how to use it"
}`
}
