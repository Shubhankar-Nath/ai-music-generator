import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface WaveformVisualizerProps {
  isPlaying: boolean
  audioContext: AudioContext | null
  analyser: AnalyserNode | null
}

export function WaveformVisualizer({ isPlaying, audioContext, analyser }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    if (!isPlaying || !analyser || !canvasRef.current) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.fillStyle = 'oklch(0.12 0.03 280 / 0.3)'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
      }
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!isPlaying) return

      animationFrameRef.current = requestAnimationFrame(draw)

      analyser.getByteTimeDomainData(dataArray)

      const width = canvas.width
      const height = canvas.height

      ctx.fillStyle = 'oklch(0.12 0.03 280 / 0.3)'
      ctx.fillRect(0, 0, width, height)

      ctx.lineWidth = 2
      ctx.strokeStyle = 'oklch(0.70 0.25 180)'
      ctx.shadowBlur = 10
      ctx.shadowColor = 'oklch(0.70 0.25 180 / 0.5)'

      ctx.beginPath()

      const sliceWidth = width / bufferLength
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * height) / 2

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }

        x += sliceWidth
      }

      ctx.lineTo(width, height / 2)
      ctx.stroke()
    }

    draw()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPlaying, analyser])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full h-32 rounded-lg overflow-hidden border border-border/50 bg-card/30"
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={128}
        className="w-full h-full"
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Waveform appears during playback</p>
        </div>
      )}
    </motion.div>
  )
}
