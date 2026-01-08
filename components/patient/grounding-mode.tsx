"use client"

import { useState, useEffect, useRef } from "react"
import { BreathingCircle } from "@/components/patient/breathing-circle"

interface GroundingModeProps {
  onClose: () => void
  canClose: boolean
}

export function GroundingMode({ onClose, canClose }: GroundingModeProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorsRef = useRef<OscillatorNode[]>([])

  useEffect(() => {
    const startCalming = () => {
      if (audioContextRef.current) return

      const ctx = new AudioContext()
      audioContextRef.current = ctx

      const masterGain = ctx.createGain()
      masterGain.gain.value = 0.12
      masterGain.connect(ctx.destination)

      // Soothing frequencies
      const frequencies = [174, 285, 396, 528]

      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = "sine"
        osc.frequency.value = freq
        gain.gain.value = 0.25 - i * 0.05

        const lfo = ctx.createOscillator()
        const lfoGain = ctx.createGain()
        lfo.frequency.value = 0.08 + i * 0.02
        lfoGain.gain.value = 0.08
        lfo.connect(lfoGain)
        lfoGain.connect(gain.gain)
        lfo.start()

        osc.connect(gain)
        gain.connect(masterGain)
        osc.start()

        oscillatorsRef.current.push(osc)
      })

      setIsPlaying(true)
    }

    // Start on first interaction or automatically
    const timer = setTimeout(startCalming, 500)

    return () => {
      clearTimeout(timer)
      oscillatorsRef.current.forEach((osc) => {
        try {
          osc.stop()
        } catch {}
      })
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Soft gradient background */}
      <div
        className="absolute inset-0 transition-all duration-[3000ms]"
        style={{
          background: "linear-gradient(135deg, #e8f5f0 0%, #d4ede5 25%, #e0f2ec 50%, #d8efe8 75%, #e5f4ef 100%)",
        }}
      />

      {/* Slow breathing animation overlay */}
      <div
        className="absolute inset-0 opacity-30 animate-pulse"
        style={{
          animationDuration: "8s",
          background: "radial-gradient(ellipse at center, rgba(125, 211, 192, 0.3) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-md text-center space-y-10">
        {/* Breathing circle */}
        <BreathingCircle />

        {/* Supportive message */}
        <div className="space-y-4">
          <p className="text-2xl font-medium text-gray-700">Take a moment</p>
          <p className="text-gray-500 text-lg leading-relaxed">Breathe with the circle. Support has been notified.</p>
        </div>

        {/* Audio indicator */}
        {isPlaying && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="flex gap-0.5 items-end h-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full animate-pulse"
                  style={{
                    height: `${6 + Math.random() * 10}px`,
                    backgroundColor: "rgba(125, 211, 192, 0.6)",
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: "1.2s",
                  }}
                />
              ))}
            </div>
            <span>Calming sounds playing</span>
          </div>
        )}

        {/* Close button - only when calm */}
        {canClose && (
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-4"
          >
            I feel better now
          </button>
        )}
      </div>

      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-lg font-semibold text-gray-600">System active: you are not alone.</p>
      </div>
    </div>
  )
}
