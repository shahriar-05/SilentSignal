"use client"

import { useState, useEffect } from "react"

interface Alert {
  id: string
  patientName: string
  patientId: string
  timestamp: Date
  message: string
}

interface AlertBannerProps {
  alerts: Alert[]
  onDismiss: (id: string) => void
}

export function AlertBanner({ alerts, onDismiss }: AlertBannerProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (alerts.length > 0) {
      setVisible(true)
    }
  }, [alerts])

  if (!visible || alerts.length === 0) return null

  const latestAlert = alerts[0]

  return (
    <div className="bg-elevated/10 border-b border-elevated/30 px-4 py-3 animate-in slide-in-from-top duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-elevated/20 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-elevated"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-elevated">
              Alert: {latestAlert.patientName} ({latestAlert.patientId})
            </p>
            <p className="text-sm text-muted-foreground">{latestAlert.message}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">{new Date(latestAlert.timestamp).toLocaleTimeString()}</span>
          {alerts.length > 1 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-elevated/20 text-elevated">
              +{alerts.length - 1} more
            </span>
          )}
          <button
            onClick={() => onDismiss(latestAlert.id)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss alert"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
