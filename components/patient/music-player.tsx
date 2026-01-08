"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX } from "lucide-react"

interface MusicPlayerProps {
  autoPlay?: boolean
}

export function MusicPlayer({ autoPlay = true }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorsRef = useRef<OscillatorNode[]>([])
  const gainRef = useRef<GainNode | null>(null)

  // Generate ambient calming tones using Web Audio API
  const startAmbientSound = () => {
    if (audioContextRef.current) return

    const ctx = new AudioContext()
    audioContextRef.current = ctx

    const masterGain = ctx.createGain()
    masterGain.gain.value = 0.15
    masterGain.connect(ctx.destination)
    gainRef.current = masterGain

    // Create gentle ambient drone with multiple frequencies
    const frequencies = [174, 285, 396] // Solfeggio frequencies for calming

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = "sine"
      osc.frequency.value = freq
      gain.gain.value = 0.3 - i * 0.08

      // Slow tremolo effect
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      lfo.frequency.value = 0.1 + i * 0.05
      lfoGain.gain.value = 0.1
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

  const stopAmbientSound = () => {
    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop()
      } catch {
        // Already stopped
      }
    })
    oscillatorsRef.current = []

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    setIsPlaying(false)
  }

  const toggleSound = () => {
    setHasInteracted(true)
    if (isPlaying) {
      stopAmbientSound()
    } else {
      startAmbientSound()
    }
  }

  // Auto-play prompt on first interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (autoPlay && !hasInteracted) {
        setHasInteracted(true)
        startAmbientSound()
      }
      document.removeEventListener("click", handleFirstInteraction)
      document.removeEventListener("touchstart", handleFirstInteraction)
    }

    document.addEventListener("click", handleFirstInteraction)
    document.addEventListener("touchstart", handleFirstInteraction)

    return () => {
      document.removeEventListener("click", handleFirstInteraction)
      document.removeEventListener("touchstart", handleFirstInteraction)
      stopAmbientSound()
    }
  }, [autoPlay, hasInteracted])

  return (
    <button
      onClick={toggleSound}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 text-foreground/70 hover:bg-white/80 transition-all duration-300 shadow-sm"
      aria-label={isPlaying ? "Mute calming sounds" : "Play calming sounds"}
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-4 h-4" />
          <div className="flex gap-0.5 items-end h-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-foreground/50 rounded-full animate-pulse"
                style={{
                  height: `${6 + Math.random() * 10}px`,
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: "0.8s",
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4" />
          <span className="text-sm">Sound off</span>
        </>
      )}
    </button>
  )
}
