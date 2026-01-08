"use client"

import { useRef, useEffect, useState } from "react"
import { Video, VideoOff, Eye } from "lucide-react"

interface LiveVideoPreviewProps {
  isActive: boolean
  onToggle: () => void
}

export function LiveVideoPreview({ isActive, onToggle }: LiveVideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasPermission, setHasPermission] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (isActive && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
            setHasPermission(true)
          }
        })
        .catch(() => {
          setHasPermission(false)
        })
    } else if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isActive])

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Camera status indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border transition-all duration-300 shadow-sm ${
            isActive
              ? "bg-white/60 border-white/40 text-foreground/70"
              : "bg-white/40 border-white/30 text-foreground/50"
          }`}
        >
          {isActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          <span className="text-sm">{isActive ? "Camera on" : "Camera off"}</span>
          {isActive && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
        </button>

        {/* Preview toggle */}
        {isActive && hasPermission && (
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/40 backdrop-blur-sm border border-white/30 text-foreground/60 hover:bg-white/60 transition-all duration-300"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm">{showPreview ? "Hide" : "Preview"}</span>
          </button>
        )}
      </div>

      {/* Video preview - small, non-intrusive */}
      {isActive && showPreview && (
        <div className="relative w-32 h-24 rounded-xl overflow-hidden shadow-lg border-2 border-white/50">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <p className="absolute bottom-1 left-0 right-0 text-center text-[10px] text-white/80">
            Only you can see this
          </p>
        </div>
      )}

      {/* Privacy notice */}
      <p className="text-xs text-foreground/40 text-center max-w-xs">
        Video is analyzed locally for emotional patterns. No video is recorded or transmitted.
      </p>
    </div>
  )
}
