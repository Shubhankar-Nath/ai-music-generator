export interface ParsedNote {
  syllable: string
  duration: number
  pitch: number
}

export interface ParsedTune {
  notes: ParsedNote[]
  totalDuration: number
}

const SYLLABLE_TO_PITCH: Record<string, number> = {
  'sa': 0,
  'ri': 2,
  're': 2,
  'ga': 4,
  'ma': 5,
  'pa': 7,
  'dha': 9,
  'ni': 11,
  'do': 0,
  'ra': 2,
  'mi': 4,
  'fa': 5,
  'so': 7,
  'sol': 7,
  'la': 9,
  'ti': 11,
  'si': 11,
}

const DURATION_MARKERS: Record<string, number> = {
  '.': 0.25,
  '-': 0.5,
  '': 1.0,
}

export function parseTunePattern(pattern: string): ParsedTune {
  if (!pattern || pattern.trim().length === 0) {
    return { notes: [], totalDuration: 0 }
  }

  const cleanPattern = pattern.toLowerCase().trim()
  const segments = cleanPattern.split(/\s+/)
  
  const notes: ParsedNote[] = []
  let totalDuration = 0

  for (const segment of segments) {
    if (segment.length === 0) continue

    let syllable = segment
    let durationMultiplier = 1.0
    let dots = 0

    while (syllable.endsWith('.')) {
      dots++
      syllable = syllable.slice(0, -1)
    }

    while (syllable.endsWith('-')) {
      durationMultiplier += 0.5
      syllable = syllable.slice(0, -1)
    }

    if (dots > 0) {
      durationMultiplier = dots * 0.25
    }

    let pitch = SYLLABLE_TO_PITCH[syllable]
    
    if (pitch === undefined) {
      const fuzzyMatch = findClosestSyllable(syllable)
      if (fuzzyMatch) {
        pitch = SYLLABLE_TO_PITCH[fuzzyMatch]
        syllable = fuzzyMatch
      } else {
        pitch = Math.floor(Math.random() * 12)
      }
    }

    const duration = durationMultiplier
    
    notes.push({
      syllable: segment,
      duration,
      pitch,
    })

    totalDuration += duration
  }

  return {
    notes,
    totalDuration,
  }
}

function findClosestSyllable(input: string): string | null {
  const syllables = Object.keys(SYLLABLE_TO_PITCH)
  
  for (const syl of syllables) {
    if (input.includes(syl) || syl.includes(input)) {
      return syl
    }
  }

  for (const syl of syllables) {
    if (levenshteinDistance(input, syl) <= 2) {
      return syl
    }
  }

  return null
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

export function getSyllableExamples(): string[] {
  return [
    'sa ri ga ma pa dha ni sa',
    'do re mi fa sol la ti do',
    'pa pa pa pa ma ma',
    'sa ga pa ni sa',
    'pa pa..para paa paa',
    'do mi sol do- mi-',
  ]
}
