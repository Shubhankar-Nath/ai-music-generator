import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Play, Stop, FloppyDisk, Trash, Waveform, MusicNotes, Guitar, Sparkle } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { parseTunePattern, getSyllableExamples } from '@/lib/tune-parser'
import { globalSynthesizer, THEMES, type InstrumentType, type Theme } from '@/lib/audio-synthesizer'
import type { SavedMusic } from '@/lib/types'

const INSTRUMENTS: { value: InstrumentType; label: string; icon: string }[] = [
  { value: 'piano', label: 'Piano', icon: '🎹' },
  { value: 'flute', label: 'Flute', icon: '🎵' },
  { value: 'strings', label: 'Strings', icon: '🎻' },
  { value: 'synth', label: 'Synth', icon: '🎛️' },
  { value: 'guitar', label: 'Guitar', icon: '🎸' },
  { value: 'bass', label: 'Bass', icon: '🎸' },
  { value: 'organ', label: 'Organ', icon: '🎹' },
]

function App() {
  const [tunePattern, setTunePattern] = useState('')
  const [selectedTheme, setSelectedTheme] = useState<string>('playful')
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentType>('piano')
  const [baseKey, setBaseKey] = useState(60)
  const [isPlaying, setIsPlaying] = useState(false)
  const [savedMusic, setSavedMusic] = useKV<SavedMusic[]>('saved-music', [])

  const safeSavedMusic = savedMusic || []
  const examples = getSyllableExamples()
  const theme = THEMES[selectedTheme] || THEMES.playful

  useEffect(() => {
    globalSynthesizer.init()
  }, [])

  const handlePlay = async () => {
    if (!tunePattern.trim()) {
      toast.error('Please enter a tune pattern')
      return
    }

    try {
      setIsPlaying(true)
      const parsed = parseTunePattern(tunePattern)
      
      if (parsed.notes.length === 0) {
        toast.error('Could not parse tune pattern')
        setIsPlaying(false)
        return
      }

      await globalSynthesizer.playSequence(
        parsed.notes,
        selectedInstrument,
        theme,
        baseKey
      )

      toast.success('Playing your music!', {
        description: `${parsed.notes.length} notes with ${selectedInstrument}`
      })
    } catch (error) {
      console.error('Playback error:', error)
      toast.error('Playback failed', {
        description: 'Please try again'
      })
    } finally {
      setIsPlaying(false)
    }
  }

  const handleStop = () => {
    globalSynthesizer.stop()
    setIsPlaying(false)
    toast.info('Playback stopped')
  }

  const handleSave = () => {
    if (!tunePattern.trim()) {
      toast.error('Please enter a tune pattern to save')
      return
    }

    const parsed = parseTunePattern(tunePattern)
    if (parsed.notes.length === 0) {
      toast.error('Could not parse tune pattern')
      return
    }

    const newMusic: SavedMusic = {
      id: Date.now().toString(),
      name: tunePattern.slice(0, 30) + (tunePattern.length > 30 ? '...' : ''),
      tunePattern,
      parsedTune: parsed,
      instrument: selectedInstrument,
      theme: selectedTheme,
      baseKey,
      createdAt: Date.now(),
    }

    setSavedMusic((current) => [newMusic, ...(current || [])])
    toast.success('Music saved!', {
      description: 'Added to your library'
    })
  }

  const handlePlaySaved = async (music: SavedMusic) => {
    try {
      setIsPlaying(true)
      const themeToUse = THEMES[music.theme] || theme
      await globalSynthesizer.playSequence(
        music.parsedTune.notes,
        music.instrument,
        themeToUse,
        music.baseKey
      )
      toast.success('Playing saved music!')
    } catch (error) {
      console.error('Playback error:', error)
      toast.error('Playback failed')
    } finally {
      setIsPlaying(false)
    }
  }

  const handleDelete = (id: string) => {
    setSavedMusic((current) => (current || []).filter(m => m.id !== id))
    toast.success('Deleted from library')
  }

  const loadExample = (example: string) => {
    setTunePattern(example)
    toast.info('Example loaded', {
      description: 'Click Play to hear it'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Waveform size={44} weight="fill" className="text-accent" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Harmonia
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-Powered Music Synthesis Engine
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Create music from tune patterns, themes, and instruments
          </p>
        </motion.header>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-border/50 shadow-lg bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkle className="text-accent" weight="fill" />
                    <CardTitle>Compose Your Music</CardTitle>
                  </div>
                  <CardDescription>
                    Enter tune patterns, select a theme, and choose your instrument
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="tune-pattern" className="text-base font-semibold">
                      Tune Pattern
                    </Label>
                    <Input
                      id="tune-pattern"
                      placeholder="e.g., pa pa..para paa paa OR sa ri ga ma pa"
                      value={tunePattern}
                      onChange={(e) => setTunePattern(e.target.value)}
                      className="text-base font-mono"
                      disabled={isPlaying}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use syllables like: sa, ri, ga, ma, pa, dha, ni (or) do, re, mi, fa, sol, la, ti
                      <br />
                      Add dots (..) for shorter notes, dashes (-) for longer notes
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme" className="text-base font-semibold">
                        Theme / Mood
                      </Label>
                      <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                        <SelectTrigger id="theme">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(THEMES).map(([key, t]) => (
                            <SelectItem key={key} value={key}>
                              {t.name} - {t.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="font-mono">{theme.tempo} BPM</Badge>
                        <Badge variant="outline">Dynamics: {Math.round(theme.dynamics * 100)}%</Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instrument" className="text-base font-semibold">
                        Instrument
                      </Label>
                      <Select value={selectedInstrument} onValueChange={(v) => setSelectedInstrument(v as InstrumentType)}>
                        <SelectTrigger id="instrument">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {INSTRUMENTS.map((inst) => (
                            <SelectItem key={inst.value} value={inst.value}>
                              {inst.icon} {inst.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="base-key" className="text-base font-semibold">
                      Base Key (MIDI Note)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="base-key"
                        type="number"
                        min={24}
                        max={96}
                        value={baseKey}
                        onChange={(e) => setBaseKey(parseInt(e.target.value) || 60)}
                        className="w-24 font-mono"
                      />
                      <span className="text-sm text-muted-foreground self-center">
                        (C4 = 60, Higher = Higher Pitch)
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handlePlay}
                      disabled={isPlaying || !tunePattern.trim()}
                      size="lg"
                      className="glow-accent gap-2 flex-1 sm:flex-none"
                    >
                      <Play weight="fill" />
                      Play Music
                    </Button>
                    <Button
                      onClick={handleStop}
                      disabled={!isPlaying}
                      variant="secondary"
                      size="lg"
                      className="gap-2"
                    >
                      <Stop weight="fill" />
                      Stop
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isPlaying || !tunePattern.trim()}
                      variant="outline"
                      size="lg"
                      className="gap-2"
                    >
                      <FloppyDisk weight="fill" />
                      Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-border/50 bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MusicNotes className="text-primary" weight="fill" />
                    Example Patterns
                  </CardTitle>
                  <CardDescription>Click to try these tune patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {examples.map((example, idx) => (
                      <Button
                        key={idx}
                        variant="ghost"
                        className="justify-start font-mono text-sm h-auto py-2"
                        onClick={() => loadExample(example)}
                      >
                        {example}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-border/50 shadow-lg sticky top-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Guitar className="text-accent" weight="fill" />
                      <CardTitle>Your Library</CardTitle>
                    </div>
                    {safeSavedMusic.length > 0 && (
                      <Badge variant="secondary" className="font-mono">
                        {safeSavedMusic.length}
                      </Badge>
                    )}
                  </div>
                  <CardDescription>Saved compositions</CardDescription>
                </CardHeader>
                <CardContent>
                  {safeSavedMusic.length === 0 ? (
                    <div className="text-center py-8">
                      <MusicNotes size={48} weight="thin" className="mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        No saved music yet
                        <br />
                        Create and save your first piece!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      <AnimatePresence mode="popLayout">
                        {safeSavedMusic.map((music) => (
                          <motion.div
                            key={music.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="p-3 bg-muted/50 rounded-lg border border-border/50 hover:border-accent/50 transition-colors group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm truncate font-mono">
                                  {music.name}
                                </h4>
                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                  <Badge variant="secondary" className="text-xs">
                                    {INSTRUMENTS.find(i => i.value === music.instrument)?.icon} {music.instrument}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {THEMES[music.theme]?.name || music.theme}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() => handlePlaySaved(music)}
                                  disabled={isPlaying}
                                >
                                  <Play weight="fill" className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => handleDelete(music.id)}
                                >
                                  <Trash className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
