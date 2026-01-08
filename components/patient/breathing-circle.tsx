"use client"

import { useState, useEffect } from "react"

export function BreathingCircle() {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const breathingCycle = () => {
      // Inhale - 4 seconds
      setPhase("inhale")
      setScale(1.5)

      setTimeout(() => {
        // Hold - 4 seconds
        setPhase("hold")
      }, 4000)

      setTimeout(() => {
        // Exhale - 4 seconds
        setPhase("exhale")
        setScale(1)
      }, 8000)
    }

    breathingCycle()
    const interval = setInterval(breathingCycle, 12000)

    return () => clearInterval(interval)
  }, [])

  const phaseText = {
    inhale: "Breathe in...",
    hold: "Hold...",
    exhale: "Breathe out...",
  }

  return (
    <div className="relative flex flex-col items-center gap-10">
      {/* Breathing circle with soft colors */}
      <div className="relative">
        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full transition-transform duration-[4000ms] ease-in-out blur-xl opacity-40"
          style={{
            transform: `scale(${scale * 1.2})`,
            background: "radial-gradient(circle, rgba(125, 211, 192, 0.5) 0%, transparent 70%)",
            width: "280px",
            height: "280px",
            marginLeft: "-16px",
            marginTop: "-16px",
          }}
        />

        {/* Main circle */}
        <div
          className="w-56 h-56 rounded-full transition-transform duration-[4000ms] ease-in-out flex items-center justify-center"
          style={{
            transform: `scale(${scale})`,
            background: "linear-gradient(135deg, rgba(125, 211, 192, 0.4) 0%, rgba(168, 230, 207, 0.3) 100%)",
          }}
        >
          <div
            className="w-36 h-36 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(125, 211, 192, 0.5) 0%, rgba(168, 230, 207, 0.4) 100%)",
            }}
          >
            <div className="w-20 h-20 rounded-full bg-white/70 backdrop-blur-sm" />
          </div>
        </div>

        {/* Pulsing ring */}
        <div
          className="absolute inset-0 rounded-full border-2 animate-ping"
          style={{
            borderColor: "rgba(125, 211, 192, 0.3)",
            animationDuration: "4s",
          }}
        />
      </div>

      {/* Phase indicator */}
      <p className="text-xl text-gray-600 font-medium">{phaseText[phase]}</p>
    </div>
  )
}
