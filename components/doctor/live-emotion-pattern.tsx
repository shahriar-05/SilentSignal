"use client"

import { useRef, useEffect, useCallback } from "react"
import type { EmotionLevel } from "@/lib/emotion-types"

interface LiveEmotionPatternProps {
  emotionLevel: EmotionLevel
  distressScore: number
}

export function LiveEmotionPattern({ emotionLevel, distressScore }: LiveEmotionPatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  interface WavePoint {
    x: number
    y: number
    baseY: number
    amplitude: number
    frequency: number
    phase: number
    speed: number
  }

  interface Dot {
    x: number
    y: number
    size: number
    alpha: number
    pulsePhase: number
  }

  const initWavePoints = useCallback(
    (canvas: HTMLCanvasElement) => {
      const points: WavePoint[] = []
      const pointCount = 40

      for (let i = 0; i < pointCount; i++) {
        const x = (canvas.width / pointCount) * i
        points.push({
          x,
          y: canvas.height * 0.5,
          baseY: canvas.height * 0.5,
          amplitude: 30 + Math.random() * 40,
          frequency: 0.02 + Math.random() * 0.02,
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + (distressScore / 100) * 1.5,
        })
      }
      return points
    },
    [distressScore],
  )

  const initDots = useCallback(
    (canvas: HTMLCanvasElement) => {
      const dots: Dot[] = []
      const dotCount = 15 + Math.floor(distressScore / 10)

      for (let i = 0; i < dotCount; i++) {
        dots.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 2 + Math.random() * 4,
          alpha: 0.2 + Math.random() * 0.4,
          pulsePhase: Math.random() * Math.PI * 2,
        })
      }
      return dots
    },
    [distressScore],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let wavePoints: WavePoint[] = []
    let dots: Dot[] = []

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      wavePoints = initWavePoints(canvas)
      dots = initDots(canvas)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    let time = 0

    // Movement speed increases with distress level
    const getSpeedMultiplier = () => {
      switch (emotionLevel) {
        case "calm":
          return 0.5
        case "mild":
          return 0.8
        case "moderate":
          return 1.2
        case "elevated":
          return 1.8
      }
    }

    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      const speedMultiplier = getSpeedMultiplier()

      // Dark navy/slate background
      ctx.fillStyle = "#1e293b"
      ctx.fillRect(0, 0, rect.width, rect.height)

      time += 0.02 * speedMultiplier

      // Update wave points - movement intensity reflects emotional state
      wavePoints.forEach((point, index) => {
        const waveOffset = Math.sin(time * point.speed + point.phase + index * point.frequency) * point.amplitude
        const secondaryWave = Math.cos(time * 0.5 + index * 0.1) * 20
        point.y = point.baseY + waveOffset + secondaryWave
      })

      // Draw flowing wave lines
      ctx.strokeStyle = "rgba(148, 163, 184, 0.3)"
      ctx.lineWidth = 1.5
      ctx.beginPath()

      if (wavePoints.length > 0) {
        ctx.moveTo(wavePoints[0].x, wavePoints[0].y)

        for (let i = 1; i < wavePoints.length - 2; i++) {
          const xc = (wavePoints[i].x + wavePoints[i + 1].x) / 2
          const yc = (wavePoints[i].y + wavePoints[i + 1].y) / 2
          ctx.quadraticCurveTo(wavePoints[i].x, wavePoints[i].y, xc, yc)
        }

        if (wavePoints.length >= 2) {
          ctx.quadraticCurveTo(
            wavePoints[wavePoints.length - 2].x,
            wavePoints[wavePoints.length - 2].y,
            wavePoints[wavePoints.length - 1].x,
            wavePoints[wavePoints.length - 1].y,
          )
        }
      }
      ctx.stroke()

      // Draw secondary wave (offset)
      ctx.strokeStyle = "rgba(148, 163, 184, 0.15)"
      ctx.lineWidth = 1
      ctx.beginPath()

      if (wavePoints.length > 0) {
        ctx.moveTo(wavePoints[0].x, wavePoints[0].y + 50)

        for (let i = 1; i < wavePoints.length - 2; i++) {
          const xc = (wavePoints[i].x + wavePoints[i + 1].x) / 2
          const yc = (wavePoints[i].y + wavePoints[i + 1].y) / 2 + 50
          ctx.quadraticCurveTo(wavePoints[i].x, wavePoints[i].y + 50, xc, yc)
        }
      }
      ctx.stroke()

      // Third wave line
      ctx.strokeStyle = "rgba(148, 163, 184, 0.1)"
      ctx.beginPath()

      if (wavePoints.length > 0) {
        ctx.moveTo(wavePoints[0].x, wavePoints[0].y - 30)

        for (let i = 1; i < wavePoints.length - 2; i++) {
          const xc = (wavePoints[i].x + wavePoints[i + 1].x) / 2
          const yc = (wavePoints[i].y + wavePoints[i + 1].y) / 2 - 30
          ctx.quadraticCurveTo(wavePoints[i].x, wavePoints[i].y - 30, xc, yc)
        }
      }
      ctx.stroke()

      // Draw scattered dots - more erratic movement when elevated
      dots.forEach((dot) => {
        dot.x += Math.sin(time + dot.pulsePhase) * 0.3 * speedMultiplier
        dot.y += Math.cos(time * 0.8 + dot.pulsePhase) * 0.2 * speedMultiplier

        // Wrap around
        if (dot.x < 0) dot.x = rect.width
        if (dot.x > rect.width) dot.x = 0
        if (dot.y < 0) dot.y = rect.height
        if (dot.y > rect.height) dot.y = 0

        const pulseAlpha = dot.alpha * (0.7 + Math.sin(time * 2 + dot.pulsePhase) * 0.3)

        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(203, 213, 225, ${pulseAlpha})`
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationRef.current)
    }
  }, [emotionLevel, distressScore, initWavePoints, initDots])

  return <canvas ref={canvasRef} className="w-full h-full rounded-lg" style={{ display: "block" }} />
}
