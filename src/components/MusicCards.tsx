import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { MusicNotes, Sparkle, Trash } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import type { ChordProgression, Melody, Composition } from '@/lib/types'

interface ChordProgressionCardProps {
  progression: ChordProgression
  onDelete: (id: string) => void
}

export function ChordProgressionCard({ progression, onDelete }: ChordProgressionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 border-border/50 hover:border-accent/50 bg-gradient-to-br from-card to-card/80">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <MusicNotes className="text-accent flex-shrink-0" weight="fill" />
                <span className="truncate">{progression.name}</span>
              </CardTitle>
              <CardDescription className="mt-1">{progression.explanation}</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onDelete(progression.id)}
            >
              <Trash className="text-destructive" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="secondary" className="font-mono text-xs">
              {progression.key}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {progression.scale}
            </Badge>
            <Badge className="bg-accent/20 text-accent border-accent/30 text-xs">
              {progression.mood}
            </Badge>
            {progression.genre && (
              <Badge variant="secondary" className="text-xs">
                {progression.genre}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Chord Progression</h4>
              <div className="flex flex-wrap gap-2">
                {progression.chords.map((chord, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1, duration: 0.2 }}
                    className="font-mono text-lg font-semibold px-3 py-2 bg-primary/10 text-primary rounded-md border border-primary/20 hover:bg-primary/20 hover:scale-105 transition-all"
                  >
                    {chord}
                  </motion.div>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Roman Numeral Analysis</h4>
              <div className="flex flex-wrap gap-2">
                {progression.romanNumerals.map((numeral, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-sm px-2 py-1 bg-muted text-muted-foreground rounded"
                  >
                    {numeral}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface MelodyCardProps {
  melody: Melody
  onDelete: (id: string) => void
}

export function MelodyCard({ melody, onDelete }: MelodyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 border-border/50 hover:border-accent/50 bg-gradient-to-br from-card to-card/80">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkle className="text-accent flex-shrink-0" weight="fill" />
                <span className="truncate">{melody.name}</span>
              </CardTitle>
              <CardDescription className="mt-1">{melody.explanation}</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onDelete(melody.id)}
            >
              <Trash className="text-destructive" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="secondary" className="font-mono text-xs">
              {melody.key}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {melody.scale}
            </Badge>
            <Badge className="bg-accent/20 text-accent border-accent/30 text-xs">
              {melody.mood}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Melody Notes</h4>
              <div className="flex flex-wrap gap-1.5">
                {melody.notes.map((note, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.15 }}
                    className="font-mono text-sm px-2 py-1 bg-accent/10 text-accent rounded border border-accent/20"
                  >
                    {note}
                  </motion.span>
                ))}
              </div>
            </div>
            {melody.rhythm && melody.rhythm.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Rhythm Pattern</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {melody.rhythm.map((r, idx) => (
                      <span
                        key={idx}
                        className="font-mono text-sm px-2 py-1 bg-muted text-muted-foreground rounded"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface CompositionCardProps {
  composition: Composition
  onDelete: (id: string) => void
}

export function CompositionCard({ composition, onDelete }: CompositionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 border-border/50 hover:border-accent/50 bg-gradient-to-br from-card to-card/80">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <MusicNotes className="text-primary flex-shrink-0" weight="fill" />
                <span className="truncate">{composition.name}</span>
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onDelete(composition.id)}
            >
              <Trash className="text-destructive" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="secondary" className="font-mono text-xs">
              {composition.key}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {composition.tempo}
            </Badge>
            <Badge variant="outline" className="text-xs font-mono">
              {composition.timeSignature}
            </Badge>
            <Badge className="bg-accent/20 text-accent border-accent/30 text-xs">
              {composition.mood}
            </Badge>
            {composition.genre && (
              <Badge variant="secondary" className="text-xs">
                {composition.genre}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {composition.sections.map((section, idx) => (
              <div key={idx} className="p-3 bg-muted/30 rounded-lg border border-border/50">
                <h4 className="font-semibold text-sm mb-2 text-primary">{section.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{section.description}</p>
                {section.chords && section.chords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {section.chords.map((chord, cidx) => (
                      <span
                        key={cidx}
                        className="font-mono text-xs px-2 py-1 bg-primary/10 text-primary rounded"
                      >
                        {chord}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
