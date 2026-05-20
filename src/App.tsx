import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Lightning, MusicNotes, Waveform, BookOpen, Sparkle } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { ChordProgressionCard, MelodyCard, CompositionCard } from '@/components/MusicCards'
import { buildMusicTheoryPrompt } from '@/lib/music-theory'
import type { ChordProgression, Melody, Composition } from '@/lib/types'

function App() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('generate')
  
  const [chordProgressions, setChordProgressions] = useKV<ChordProgression[]>('chord-progressions', [])
  const [melodies, setMelodies] = useKV<Melody[]>('melodies', [])
  const [compositions, setCompositions] = useKV<Composition[]>('compositions', [])

  const safeChordProgressions = chordProgressions || []
  const safeMelodies = melodies || []
  const safeCompositions = compositions || []

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    try {
      const musicPrompt = buildMusicTheoryPrompt(prompt)
      const response = await window.spark.llm(musicPrompt, 'gpt-4o', true)
      const result = JSON.parse(response)

      if (result.type === 'chords') {
        const newProgression: ChordProgression = {
          id: Date.now().toString(),
          name: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
          chords: result.content.chords || [],
          romanNumerals: result.content.romanNumerals || [],
          key: result.key,
          scale: result.scale,
          mood: result.mood,
          explanation: result.explanation,
          genre: result.content.genre,
        }
        setChordProgressions((current) => [newProgression, ...(current || [])])
        toast.success('Chord progression generated!', {
          description: `Created ${newProgression.chords.length} chord progression in ${newProgression.key}`
        })
        setActiveTab('library')
      } else if (result.type === 'melody') {
        const newMelody: Melody = {
          id: Date.now().toString(),
          name: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
          notes: result.content.notes || [],
          rhythm: result.content.rhythm || [],
          key: result.key,
          scale: result.scale,
          mood: result.mood,
          explanation: result.explanation,
        }
        setMelodies((current) => [newMelody, ...(current || [])])
        toast.success('Melody generated!', {
          description: `Created melody in ${newMelody.key} ${newMelody.scale}`
        })
        setActiveTab('library')
      } else if (result.type === 'composition') {
        const newComposition: Composition = {
          id: Date.now().toString(),
          name: result.content.name || prompt.slice(0, 50),
          sections: result.content.sections || [],
          key: result.key,
          tempo: result.content.tempo || 'Medium',
          timeSignature: result.content.timeSignature || '4/4',
          mood: result.mood,
          genre: result.content.genre,
        }
        setCompositions((current) => [newComposition, ...(current || [])])
        toast.success('Composition generated!', {
          description: `Created ${newComposition.sections.length}-section composition`
        })
        setActiveTab('library')
      } else {
        toast.info('Music Theory Explanation', {
          description: result.explanation.slice(0, 100) + '...'
        })
      }

      setPrompt('')
    } catch (error) {
      console.error('Generation error:', error)
      toast.error('Generation failed', {
        description: 'Please try again with a different prompt'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const deleteChordProgression = (id: string) => {
    setChordProgressions((current) => (current || []).filter(p => p.id !== id))
    toast.success('Deleted chord progression')
  }

  const deleteMelody = (id: string) => {
    setMelodies((current) => (current || []).filter(m => m.id !== id))
    toast.success('Deleted melody')
  }

  const deleteComposition = (id: string) => {
    setCompositions((current) => (current || []).filter(c => c.id !== id))
    toast.success('Deleted composition')
  }

  const totalItems = safeChordProgressions.length + safeMelodies.length + safeCompositions.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <MusicNotes size={40} weight="fill" className="text-accent" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Harmonia
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI-Powered Music Composition Assistant
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Generate chord progressions, melodies, and complete compositions using advanced music theory
          </p>
        </motion.header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12">
            <TabsTrigger value="generate" className="text-base gap-2">
              <Lightning weight="fill" />
              <span className="hidden sm:inline">Generate</span>
            </TabsTrigger>
            <TabsTrigger value="library" className="text-base gap-2">
              <BookOpen weight="fill" />
              <span className="hidden sm:inline">Library</span>
              {totalItems > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-accent/20 text-accent rounded-full text-xs font-mono">
                  {totalItems}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-border/50 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkle className="text-accent" weight="fill" />
                  <h2 className="text-xl font-semibold">Describe Your Music</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Tell the AI what you want to create. Be as specific or creative as you like!
                </p>
                
                <Textarea
                  id="music-prompt"
                  placeholder="Examples:&#10;• A sad piano chord progression in C minor&#10;• Happy melody in G major pentatonic scale&#10;• Jazz chord progression with 7th chords&#10;• Energetic rock composition with verse and chorus&#10;• Mysterious ambient soundscape in dorian mode"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[140px] text-base resize-none font-medium"
                  disabled={isGenerating}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      handleGenerate()
                    }
                  }}
                />
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-muted-foreground">
                    Tip: Press Cmd/Ctrl + Enter to generate
                  </span>
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    size="lg"
                    className="glow-primary gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Sparkle weight="fill" />
                        </motion.div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Lightning weight="fill" />
                        Generate Music
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 bg-primary/5 border border-primary/20 rounded-lg"
                >
                  <MusicNotes className="text-primary mb-2" size={24} weight="fill" />
                  <h3 className="font-semibold text-sm mb-1">Chord Progressions</h3>
                  <p className="text-xs text-muted-foreground">
                    Generate harmonic foundations with Roman numeral analysis
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-accent/5 border border-accent/20 rounded-lg"
                >
                  <Waveform className="text-accent mb-2" size={24} weight="fill" />
                  <h3 className="font-semibold text-sm mb-1">Melodies</h3>
                  <p className="text-xs text-muted-foreground">
                    Create melodic lines with rhythm patterns and scales
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 bg-secondary/5 border border-secondary/20 rounded-lg"
                >
                  <BookOpen className="text-foreground mb-2" size={24} weight="fill" />
                  <h3 className="font-semibold text-sm mb-1">Full Compositions</h3>
                  <p className="text-xs text-muted-foreground">
                    Complete song structures with multiple sections
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            {totalItems === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 px-4"
              >
                <MusicNotes size={64} weight="thin" className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No music yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start generating chord progressions, melodies, and compositions to build your library
                </p>
                <Button onClick={() => setActiveTab('generate')} variant="default" className="gap-2">
                  <Lightning weight="fill" />
                  Create Your First Music
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {safeChordProgressions.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <MusicNotes className="text-primary" weight="fill" />
                      <h2 className="text-2xl font-semibold">Chord Progressions</h2>
                      <span className="text-sm text-muted-foreground">({safeChordProgressions.length})</span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <AnimatePresence mode="popLayout">
                        {safeChordProgressions.map((progression) => (
                          <ChordProgressionCard
                            key={progression.id}
                            progression={progression}
                            onDelete={deleteChordProgression}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {safeMelodies.length > 0 && (
                  <>
                    {safeChordProgressions.length > 0 && <Separator className="my-8" />}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Waveform className="text-accent" weight="fill" />
                        <h2 className="text-2xl font-semibold">Melodies</h2>
                        <span className="text-sm text-muted-foreground">({safeMelodies.length})</span>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="popLayout">
                          {safeMelodies.map((melody) => (
                            <MelodyCard
                              key={melody.id}
                              melody={melody}
                              onDelete={deleteMelody}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  </>
                )}

                {safeCompositions.length > 0 && (
                  <>
                    {(safeChordProgressions.length > 0 || safeMelodies.length > 0) && <Separator className="my-8" />}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="text-foreground" weight="fill" />
                        <h2 className="text-2xl font-semibold">Compositions</h2>
                        <span className="text-sm text-muted-foreground">({safeCompositions.length})</span>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <AnimatePresence mode="popLayout">
                          {safeCompositions.map((composition) => (
                            <CompositionCard
                              key={composition.id}
                              composition={composition}
                              onDelete={deleteComposition}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
