import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Play, Stop, Trash, Stack, SpeakerHigh } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import type { SavedMusic } from '@/lib/types'
import { globalSynthesizer, THEMES } from '@/lib/audio-synthesizer'

interface MusicLayer {
  id: string
  music: SavedMusic
  volume: number
}

interface LayerMixerProps {
  savedMusic: SavedMusic[]
}

export function LayerMixer({ savedMusic }: LayerMixerProps) {
  const [layers, setLayers] = useKV<MusicLayer[]>('music-layers', [])
  const [isPlaying, setIsPlaying] = useState(false)
  const [draggedItem, setDraggedItem] = useState<SavedMusic | null>(null)

  const safeLayers = layers || []

  const handleDragStart = (music: SavedMusic) => {
    setDraggedItem(music)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedItem) return

    const existingLayer = safeLayers.find(l => l.music.id === draggedItem.id)
    if (existingLayer) {
      toast.error('Track already in mixer')
      setDraggedItem(null)
      return
    }

    const newLayer: MusicLayer = {
      id: `layer-${Date.now()}`,
      music: draggedItem,
      volume: 0.7,
    }

    setLayers((current) => [...(current || []), newLayer])
    toast.success('Track added to mixer', {
      description: draggedItem.name
    })
    setDraggedItem(null)
  }

  const handleVolumeChange = (layerId: string, newVolume: number) => {
    setLayers((current) =>
      (current || []).map(layer =>
        layer.id === layerId ? { ...layer, volume: newVolume } : layer
      )
    )
  }

  const handleRemoveLayer = (layerId: string) => {
    setLayers((current) => (current || []).filter(l => l.id !== layerId))
    toast.success('Track removed from mixer')
  }

  const handlePlayMix = async () => {
    if (safeLayers.length === 0) {
      toast.error('Add tracks to the mixer first')
      return
    }

    try {
      setIsPlaying(true)
      
      const playPromises = safeLayers.map(async (layer) => {
        const themeToUse = THEMES[layer.music.theme] || THEMES.playful
        await globalSynthesizer.playLayeredSequence(
          layer.music.parsedTune.notes,
          layer.music.instrument,
          themeToUse,
          layer.music.baseKey,
          layer.volume
        )
      })

      await Promise.all(playPromises)
      
      toast.success('Playing layered mix!', {
        description: `${safeLayers.length} tracks`
      })
    } catch (error) {
      console.error('Playback error:', error)
      toast.error('Playback failed')
    } finally {
      setIsPlaying(false)
    }
  }

  const handleStopMix = () => {
    globalSynthesizer.stop()
    setIsPlaying(false)
    toast.info('Mix stopped')
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50 shadow-lg bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Stack className="text-accent" weight="fill" />
            <CardTitle>Layer Mixer</CardTitle>
          </div>
          <CardDescription>
            Drag tracks from your library to layer and mix them together
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`min-h-[200px] rounded-lg border-2 border-dashed transition-colors ${
              draggedItem
                ? 'border-accent bg-accent/5'
                : 'border-border/50 bg-muted/20'
            }`}
          >
            {safeLayers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-center px-4">
                <Stack size={48} weight="thin" className="text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop tracks here to create layers
                  <br />
                  Mix multiple tracks with individual volume controls
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                <AnimatePresence mode="popLayout">
                  {safeLayers.map((layer, index) => (
                    <motion.div
                      key={layer.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-4 bg-card rounded-lg border border-border/50 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono">
                              Layer {index + 1}
                            </Badge>
                            <h4 className="font-semibold text-sm truncate font-mono">
                              {layer.music.name}
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            <Badge variant="secondary" className="text-xs">
                              {layer.music.instrument}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {THEMES[layer.music.theme]?.name || layer.music.theme}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 flex-shrink-0"
                          onClick={() => handleRemoveLayer(layer.id)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-3">
                        <SpeakerHigh className="text-muted-foreground flex-shrink-0" />
                        <Slider
                          value={[layer.volume]}
                          onValueChange={(val) => handleVolumeChange(layer.id, val[0])}
                          min={0}
                          max={1}
                          step={0.01}
                          className="flex-1"
                        />
                        <span className="text-xs text-muted-foreground font-mono w-12 text-right">
                          {Math.round(layer.volume * 100)}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handlePlayMix}
              disabled={isPlaying || safeLayers.length === 0}
              size="lg"
              className="glow-accent gap-2 flex-1 sm:flex-none"
            >
              <Play weight="fill" />
              Play Mix
            </Button>
            <Button
              onClick={handleStopMix}
              disabled={!isPlaying}
              variant="secondary"
              size="lg"
              className="gap-2"
            >
              <Stop weight="fill" />
              Stop
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Available Tracks</CardTitle>
          <CardDescription>Drag these tracks to the mixer above</CardDescription>
        </CardHeader>
        <CardContent>
          {savedMusic.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No saved tracks available
                <br />
                Create and save tracks first to use the mixer
              </p>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {savedMusic.map((music) => (
                <div
                  key={music.id}
                  draggable
                  onDragStart={() => handleDragStart(music)}
                  className="p-3 bg-card/50 rounded-lg border border-border/50 hover:border-accent/50 transition-colors cursor-grab active:cursor-grabbing"
                >
                  <h4 className="font-semibold text-sm truncate font-mono mb-1.5">
                    {music.name}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="text-xs">
                      {music.instrument}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {THEMES[music.theme]?.name || music.theme}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
