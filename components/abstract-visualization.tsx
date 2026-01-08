"use client"

import { useRef, useEffect, useCallback } from "react"
import type { EmotionLevel } from "@/lib/emotion-types"

interface AbstractVisualizationProps {
  emotionLevel: EmotionLevel
  distressScore: number
  className?: string
}

// Color palettes for different emotional states - soft, calming gradients
const COLOR_PALETTES: Record<EmotionLevel, string[]> = {
  calm: ["#7dd3c0", "#a8e6cf", "#c7f0db", "#e8f8f5"],
  mild: ["#87ceeb", "#a8d8ea", "#c5e8f0", "#e0f4f8"],
  moderate: ["#f0b87a", "#f5cba7", "#fae5d3", "#fef9e7"],
  elevated: ["#e8a87c", "#f0b27a", "#f5cba7", "#fdebd0"],
}

export function AbstractVisualization({ emotionLevel, distressScore, className = "" }: AbstractVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])

  interface Particle {
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    color: string
    alpha: number
    pulsePhase: number
  }

  const initParticles = useCallback(
    (canvas: HTMLCanvasElement) => {
      const particles: Particle[] = []
      const colors = COLOR_PALETTES[emotionLevel]
      const particleCount = 30 + Math.floor(distressScore / 5)

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 20 + Math.random() * 60,
          speedX: (Math.random() - 0.5) * (0.3 + distressScore / 200),
          speedY: (Math.random() - 0.5) * (0.3 + distressScore / 200),
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.1 + Math.random() * 0.3,
          pulsePhase: Math.random() * Math.PI * 2,
        })
      }
      return particles
    },
    [emotionLevel, distressScore],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      particlesRef.current = initParticles(canvas)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    let time = 0
    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.fillStyle = emotionLevel === "elevated" ? "rgba(254, 249, 231, 0.08)" : "rgba(248, 250, 252, 0.08)"
      ctx.fillRect(0, 0, rect.width, rect.height)

      time += 0.01

      particlesRef.current.forEach((particle) => {
        // Update position with gentle wave motion
        particle.x += particle.speedX + Math.sin(time + particle.pulsePhase) * 0.2
        particle.y += particle.speedY + Math.cos(time + particle.pulsePhase) * 0.2

        // Wrap around edges smoothly
        if (particle.x < -particle.size) particle.x = rect.width + particle.size
        if (particle.x > rect.width + particle.size) particle.x = -particle.size
        if (particle.y < -particle.size) particle.y = rect.height + particle.size
        if (particle.y > rect.height + particle.size) particle.y = -particle.size

        // Pulsing size
        const pulseSize = particle.size * (1 + Math.sin(time * 0.5 + particle.pulsePhase) * 0.15)

        // Draw soft blob
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, pulseSize)
        gradient.addColorStop(0, particle.color + "80")
        gradient.addColorStop(0.5, particle.color + "40")
        gradient.addColorStop(1, particle.color + "00")

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationRef.current)
    }
  }, [emotionLevel, distressScore, initParticles])

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} style={{ display: "block" }} />
}
