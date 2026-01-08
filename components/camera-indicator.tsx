"use client"

interface CameraIndicatorProps {
  isActive: boolean
}

export function CameraIndicator({ isActive }: CameraIndicatorProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-border/50">
      <div className={`w-2 h-2 rounded-full ${isActive ? "bg-calm animate-pulse" : "bg-muted-foreground/30"}`} />
      <span className="text-xs text-muted-foreground">{isActive ? "Camera active" : "Camera inactive"}</span>
    </div>
  )
}
