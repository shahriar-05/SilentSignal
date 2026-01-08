"use client"

import { useRef, useEffect } from "react"
import type { EmotionLevel } from "@/lib/emotion-types"

interface SoothingBackgroundProps {
  emotionLevel: EmotionLevel
}

// Soft, calming color palettes
const PALETTES: Record<EmotionLevel, { bg: string; colors: string[] }> = {
  calm: {
    bg: "linear-gradient(135deg, #e8f5f0 0%, #f0f9f6 50%, #e5f2ed 100%)",
    colors: ["#7dd3c0", "#a8e6cf", "#b8f0d8", "#c7f5e0"],
  },
  mild: {
    bg: "linear-gradient(135deg, #e8f4f8 0%, #f0f8fb 50%, #e5f1f5 100%)",
    colors: ["#87ceeb", "#a8d8ea", "#b8e2f0", "#c8ecf5"],
  },
  moderate: {
    bg: "linear-gradient(135deg, #fef5e8 0%, #fef9f0 50%, #fdf3e5 100%)",
    colors: ["#f0c878", "#f5d8a0", "#f8e2b8", "#faecd0"],
  },
  elevated: {
    bg: "linear-gradient(135deg, #fef0e8 0%, #fef6f0 50%, #fdede5 100%)",
    colors: ["#e8a87c", "#f0bc90", "#f5c8a0", "#fad4b0"],
  },
}

export function SoothingBackground({ emotionLevel }: SoothingBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio
      canvas.height = window.innerHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener("resize", resize)

    const palette = PALETTES[emotionLevel]
    const blobs: {
      x: number
      y: number
      size: number
      color: string
      phase: number
      speed: number
    }[] = []

    // Create gentle floating blobs
    for (let i = 0; i < 8; i++) {
      blobs.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 100 + Math.random() * 200,
        color: palette.colors[i % palette.colors.length],
        phase: Math.random() * Math.PI * 2,
        speed: 0.0003 + Math.random() * 0.0003, // Very slow breathing-like motion
      })
    }

    let time = 0
    const animate = () => {
      time += 1
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      blobs.forEach((blob) => {
        // Slow breathing motion
        const breathe = Math.sin(time * blob.speed + blob.phase)
        const x = blob.x + Math.sin(time * 0.0002 + blob.phase) * 30
        const y = blob.y + Math.cos(time * 0.0002 + blob.phase) * 30
        const size = blob.size * (1 + breathe * 0.15)

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size)
        gradient.addColorStop(0, blob.color + "40")
        gradient.addColorStop(0.5, blob.color + "20")
        gradient.addColorStop(1, blob.color + "00")

        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [emotionLevel])

  const palette = PALETTES[emotionLevel]

  return (
    <div className="absolute inset-0" style={{ background: palette.bg }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
