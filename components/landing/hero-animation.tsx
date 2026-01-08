"use client"

import { useEffect, useRef } from "react"

export function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Soft floating particles
    const particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      color: string
    }> = []

    const colors = [
      "rgba(99, 179, 176, 0.4)", // teal
      "rgba(147, 197, 195, 0.3)", // light teal
      "rgba(180, 210, 208, 0.25)", // pale teal
      "rgba(120, 160, 180, 0.3)", // blue-gray
    ]

    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        size: Math.random() * 60 + 30,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.3 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      particles.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < -particle.size) particle.x = canvas.offsetWidth + particle.size
        if (particle.x > canvas.offsetWidth + particle.size) particle.x = -particle.size
        if (particle.y < -particle.size) particle.y = canvas.offsetHeight + particle.size
        if (particle.y > canvas.offsetHeight + particle.size) particle.y = -particle.size

        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size)
        gradient.addColorStop(0, particle.color)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "linear-gradient(135deg, #f0f7f7 0%, #e8f4f3 50%, #f5f9f9 100%)" }}
    />
  )
}
