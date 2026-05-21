import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Play, Stop, FloppyDisk, Trash, Waveform, MusicNotes, Guitar, Sparkle, Gauge, SpeakerHigh, Heart, Smiley, Star } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { parseTunePattern, getSyllableExamples } from '@/lib/tune-parser'
import { globalSynthesizer, THEMES, type InstrumentType, type Theme } from '@/lib/audio-synthesizer'
import type { SavedMusic } from '@/lib/types'
import { WaveformVisualizer } from '@/components/WaveformVisualizer'
import { LayerMixer } from '@/components/LayerMixer'

const INSTRUMENTS: { value: InstrumentType; label: string; icon: string }[] = [
  { value: 'piano', label: '피아노', icon: '🎹' },
  { value: 'flute', label: '플루트', icon: '🎵' },
  { value: 'strings', label: '현악기', icon: '🎻' },
  { value: 'synth', label: '신디사이저', icon: '🎛️' },
  { value: 'guitar', label: '기타', icon: '🎸' },
  { value: 'bass', label: '베이스', icon: '🎸' },
  { value: 'organ', label: '오르간', icon: '🎹' },
  { value: 'drum', label: '드럼', icon: '🥁' },
  { value: 'electric', label: '일렉트릭', icon: '⚡' },
  { value: 'wobble', label: '워블', icon: '🌀' },
  { value: 'echo', label: '에코', icon: '🔊' },
  { value: 'laser', label: '레이저', icon: '✨' },
]

function App() {
  const [tunePattern, setTunePattern] = useState('')
  const [selectedTheme, setSelectedTheme] = useState<string>('playful')
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentType>('piano')
  const [baseKey, setBaseKey] = useState(60)
  const [customTempo, setCustomTempo] = useState(120)
  const [volume, setVolume] = useState(0.4)
  const [isPlaying, setIsPlaying] = useState(false)
  const [savedMusic, setSavedMusic] = useKV<SavedMusic[]>('saved-music', [])

  const safeSavedMusic = savedMusic || []
  const examples = getSyllableExamples()
  const baseTheme = THEMES[selectedTheme] || THEMES.playful
  const theme: Theme = { ...baseTheme, tempo: customTempo }

  useEffect(() => {
    globalSynthesizer.init()
  }, [])

  useEffect(() => {
    const themeData = THEMES[selectedTheme]
    if (themeData) {
      setCustomTempo(themeData.tempo)
    }
  }, [selectedTheme])

  useEffect(() => {
    globalSynthesizer.setVolume(volume)
  }, [volume])

  const handlePlay = async () => {
    if (!tunePattern.trim()) {
      toast.error('멜로디 패턴을 입력해주세요! 🎵')
      return
    }

    try {
      const parsed = parseTunePattern(tunePattern)
      
      if (parsed.notes.length === 0) {
        toast.error('패턴을 인식할 수 없어요 😢')
        return
      }

      setIsPlaying(true)
      globalSynthesizer.setCompletionCallback(() => {
        setIsPlaying(false)
      })

      await globalSynthesizer.playSequence(
        parsed.notes,
        selectedInstrument,
        theme,
        baseKey
      )

      toast.success('음악 재생중이에요! 🎶', {
        description: `${parsed.notes.length}개의 음표 with ${selectedInstrument}`
      })
    } catch (error) {
      console.error('Playback error:', error)
      toast.error('재생에 실패했어요 ㅠㅠ', {
        description: '다시 시도해주세요!'
      })
      setIsPlaying(false)
    }
  }

  const handleStop = () => {
    globalSynthesizer.stop()
    setIsPlaying(false)
    toast.info('재생 중지! ⏸️')
  }

  const handleSave = () => {
    if (!tunePattern.trim()) {
      toast.error('저장할 패턴을 입력해주세요!')
      return
    }

    const parsed = parseTunePattern(tunePattern)
    if (parsed.notes.length === 0) {
      toast.error('패턴을 인식할 수 없어요')
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
    toast.success('저장했어요! 💖', {
      description: '라이브러리에 추가되었어요'
    })
  }

  const handlePlaySaved = async (music: SavedMusic) => {
    try {
      const themeToUse = THEMES[music.theme] || theme
      
      setIsPlaying(true)
      globalSynthesizer.setCompletionCallback(() => {
        setIsPlaying(false)
      })
      
      await globalSynthesizer.playSequence(
        music.parsedTune.notes,
        music.instrument,
        themeToUse,
        music.baseKey
      )
      
      toast.success('저장된 음악 재생! 🎵')
    } catch (error) {
      console.error('Playback error:', error)
      toast.error('재생 실패 ㅠㅠ')
      setIsPlaying(false)
    }
  }

  const handleDelete = (id: string) => {
    setSavedMusic((current) => (current || []).filter(m => m.id !== id))
    toast.success('삭제했어요! 🗑️')
  }

  const loadExample = (example: string) => {
    setTunePattern(example)
    toast.info('예시 로드 완료! ✨', {
      description: '재생 버튼을 눌러보세요'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/10 dots-pattern">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mb-8 sm:mb-12 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Heart size={48} weight="fill" className="text-primary animate-bounce" />
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-normal text-primary">
              하모니아 ♪
            </h1>
            <Star size={48} weight="fill" className="text-accent animate-pulse" />
          </div>
          <p className="text-xl sm:text-2xl text-foreground font-medium">
            음악부 방과후 활동 🎵
          </p>
          <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-2">
            <Smiley weight="fill" className="text-accent" />
            멜로디 패턴으로 나만의 음악 만들기
          </p>
        </motion.header>

        <Tabs defaultValue="compose" className="space-y-6">
          <TabsList className="grid w-full sm:w-auto grid-cols-3 bg-white/60 backdrop-blur-sm border-2 border-primary/20 p-1.5">
            <TabsTrigger value="compose" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl">
              <Sparkle weight="fill" />
              작곡하기
            </TabsTrigger>
            <TabsTrigger value="mixer" className="gap-2 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground rounded-xl">
              <Waveform weight="fill" />
              믹서
            </TabsTrigger>
            <TabsTrigger value="library" className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-xl">
              <Guitar weight="fill" />
              내 음악
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 80, delay: 0.1 }}
            >
              <Card className="border-2 border-primary/20 shadow-xl bg-gradient-to-br from-white/90 to-primary/5 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-2xl">
                  <div className="flex items-center gap-2">
                    <Sparkle className="text-accent" weight="fill" size={24} />
                    <CardTitle className="text-2xl">나만의 멜로디 만들기</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    패턴을 입력하고 테마와 악기를 선택해보세요! ✨
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-3">
                    <Label htmlFor="tune-pattern" className="text-lg font-semibold flex items-center gap-2">
                      <MusicNotes weight="fill" className="text-primary" />
                      멜로디 패턴
                    </Label>
                    <Input
                      id="tune-pattern"
                      placeholder="예: pa pa..para paa paa 또는 도 레 미 파 솔"
                      value={tunePattern}
                      onChange={(e) => setTunePattern(e.target.value)}
                      className="text-base font-mono border-2 border-primary/30 focus:border-primary rounded-2xl h-12 bg-white/80"
                      disabled={isPlaying}
                    />
                    <p className="text-sm text-muted-foreground bg-secondary/20 p-3 rounded-xl border border-secondary/30">
                      💡 <strong>팁:</strong> sa, ri, ga, ma, pa, dha, ni 또는 도, 레, 미, 파, 솔, 라, 시를 사용하세요
                      <br />
                      점(..)을 추가하면 짧은 음표, 대시(-)를 추가하면 긴 음표가 돼요!
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="theme" className="text-lg font-semibold">
                        테마 / 분위기 🎨
                      </Label>
                      <Select value={selectedTheme} onValueChange={setSelectedTheme} disabled={isPlaying}>
                        <SelectTrigger id="theme" className="border-2 border-secondary/30 rounded-2xl h-11 bg-white/80">
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
                      <div className="flex gap-2">
                        <Badge variant="outline" className="bg-primary/10 border-primary/30 rounded-full">
                          다이내믹: {Math.round(theme.dynamics * 100)}%
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="instrument" className="text-lg font-semibold">
                        악기 선택 🎼
                      </Label>
                      <Select value={selectedInstrument} onValueChange={(v) => setSelectedInstrument(v as InstrumentType)} disabled={isPlaying}>
                        <SelectTrigger id="instrument" className="border-2 border-secondary/30 rounded-2xl h-11 bg-white/80">
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

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="tempo" className="text-lg font-semibold flex items-center gap-2">
                        <Gauge weight="fill" className="text-accent" />
                        템포 조절
                      </Label>
                      <Badge variant="secondary" className="font-mono text-base px-3 py-1 rounded-full bg-accent/20 border border-accent/30">
                        {customTempo} BPM
                      </Badge>
                    </div>
                    <Slider
                      id="tempo"
                      value={[customTempo]}
                      onValueChange={(val) => setCustomTempo(val[0])}
                      min={40}
                      max={200}
                      step={1}
                      className="w-full"
                      disabled={isPlaying}
                    />
                    <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
                      속도 조절: 40 BPM = 아주 느리게 🐢, 200 BPM = 매우 빠르게 🐇
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="volume" className="text-lg font-semibold flex items-center gap-2">
                        <SpeakerHigh weight="fill" className="text-accent" />
                        볼륨 조절
                      </Label>
                      <Badge variant="secondary" className="font-mono text-base px-3 py-1 rounded-full bg-secondary/30 border border-secondary/40">
                        {Math.round(volume * 100)}%
                      </Badge>
                    </div>
                    <Slider
                      id="volume"
                      value={[volume]}
                      onValueChange={(val) => setVolume(val[0])}
                      min={0}
                      max={1}
                      step={0.01}
                      className="w-full"
                      disabled={isPlaying}
                    />
                    <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
                      음량 조절: 0% = 무음 🔇, 100% = 최대 🔊
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="base-key" className="text-lg font-semibold">
                      기본 음높이 (MIDI 노트) 🎹
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="base-key"
                        type="number"
                        min={24}
                        max={96}
                        value={baseKey}
                        onChange={(e) => setBaseKey(parseInt(e.target.value) || 60)}
                        className="w-24 font-mono border-2 border-input rounded-xl"
                        disabled={isPlaying}
                      />
                      <span className="text-sm text-muted-foreground self-center bg-muted/50 px-3 py-2 rounded-lg">
                        C4 = 60, 숫자가 클수록 높은 소리!
                      </span>
                    </div>
                  </div>

                  <WaveformVisualizer
                    isPlaying={isPlaying}
                    audioContext={globalSynthesizer.getContext()}
                    analyser={globalSynthesizer.getAnalyser()}
                  />

                  <Separator className="bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handlePlay}
                      disabled={isPlaying || !tunePattern.trim()}
                      size="lg"
                      className="glow-primary gap-2 flex-1 sm:flex-none bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
                    >
                      <Play weight="fill" size={20} />
                      재생하기 ▶
                    </Button>
                    <Button
                      onClick={handleStop}
                      disabled={!isPlaying}
                      variant="secondary"
                      size="lg"
                      className="gap-2 rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95"
                    >
                      <Stop weight="fill" size={20} />
                      멈추기
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isPlaying || !tunePattern.trim()}
                      variant="outline"
                      size="lg"
                      className="gap-2 border-2 border-primary/30 rounded-2xl hover:bg-primary/10 shadow-md transition-all hover:scale-105 active:scale-95"
                    >
                      <FloppyDisk weight="fill" size={20} />
                      저장하기 💾
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 80, delay: 0.2 }}
            >
              <Card className="border-2 border-secondary/30 bg-gradient-to-br from-secondary/20 to-accent/10 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-secondary/20 to-accent/20 rounded-t-2xl">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <MusicNotes className="text-accent" weight="fill" />
                    예시 패턴 모음 📝
                  </CardTitle>
                  <CardDescription>클릭해서 바로 사용해보세요!</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {examples.map((example, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Button
                          variant="ghost"
                          className="justify-start font-mono text-sm h-auto py-3 px-4 w-full bg-white/60 hover:bg-white/80 border border-secondary/20 rounded-xl transition-all"
                          onClick={() => loadExample(example)}
                        >
                          {example}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            </div>
            </div>
          </TabsContent>

          <TabsContent value="mixer" className="space-y-6">
            <LayerMixer savedMusic={safeSavedMusic} />
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <Card className="border-2 border-accent/30 shadow-xl bg-gradient-to-br from-white/90 to-accent/10">
              <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Guitar className="text-accent" weight="fill" size={28} />
                    <CardTitle className="text-2xl">내 음악 보관함 🎼</CardTitle>
                  </div>
                  {safeSavedMusic.length > 0 && (
                    <Badge variant="secondary" className="font-mono text-base px-3 py-1.5 rounded-full bg-primary/20 border-2 border-primary/30">
                      {safeSavedMusic.length}개
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-base">저장한 작곡들</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {safeSavedMusic.length === 0 ? (
                  <div className="text-center py-16">
                    <MusicNotes size={80} weight="thin" className="mx-auto mb-4 text-muted-foreground animate-pulse" />
                    <p className="text-base text-muted-foreground">
                      아직 저장된 음악이 없어요 😊
                      <br />
                      첫 작품을 만들어보세요!
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                      {safeSavedMusic.map((music) => (
                        <motion.div
                          key={music.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          whileHover={{ scale: 1.03, y: -4 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          className="p-5 bg-gradient-to-br from-white/80 to-primary/5 rounded-2xl border-2 border-border/50 hover:border-accent/50 shadow-md hover:shadow-xl transition-all"
                        >
                          <div className="space-y-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base truncate font-mono mb-2 text-foreground">
                                {music.name}
                              </h4>
                              <div className="flex flex-wrap gap-1.5">
                                <Badge variant="secondary" className="text-xs bg-primary/10 border border-primary/30 rounded-full">
                                  {INSTRUMENTS.find(i => i.value === music.instrument)?.icon} {INSTRUMENTS.find(i => i.value === music.instrument)?.label}
                                </Badge>
                                <Badge variant="outline" className="text-xs bg-secondary/10 border-secondary/30 rounded-full">
                                  {THEMES[music.theme]?.name || music.theme}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                variant="default"
                                className="flex-1 gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 rounded-xl transition-all hover:scale-105 active:scale-95"
                                onClick={() => handlePlaySaved(music)}
                                disabled={isPlaying}
                              >
                                <Play weight="fill" className="h-4 w-4" />
                                재생
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="gap-2 rounded-xl transition-all hover:scale-105 active:scale-95"
                                onClick={() => handleDelete(music.id)}
                              >
                                <Trash className="h-4 w-4" />
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
