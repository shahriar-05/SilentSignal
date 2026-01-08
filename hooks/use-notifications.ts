"use client"

import { useState, useCallback } from "react"
import type { EmergencyContact } from "@/lib/notification-service"

interface Alert {
  id: string
  patientId: string
  patientName: string
  level: string
  timestamp: Date
  notificationsSent: number
  acknowledged: boolean
}

export function useNotifications() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isSending, setIsSending] = useState(false)

  const sendNotification = useCallback(
    async (patientId: string, patientName: string, distressLevel: string, contacts: EmergencyContact[]) => {
      setIsSending(true)

      try {
        const response = await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientId,
            patientName,
            distressLevel,
            contacts,
          }),
        })

        const data = await response.json()

        if (data.success) {
          const newAlert: Alert = {
            id: `alert-${Date.now()}`,
            patientId,
            patientName,
            level: distressLevel,
            timestamp: new Date(),
            notificationsSent: data.notifiedContacts,
            acknowledged: false,
          }

          setAlerts((prev) => [newAlert, ...prev])
          return { success: true, alert: newAlert }
        }

        return { success: false, error: data.error }
      } catch (error) {
        console.error("Failed to send notification:", error)
        return { success: false, error: "Network error" }
      } finally {
        setIsSending(false)
      }
    },
    [],
  )

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))
  }, [])

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }, [])

  return {
    alerts,
    isSending,
    sendNotification,
    acknowledgeAlert,
    dismissAlert,
  }
}
