"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AlertHistoryItem {
  id: string
  patientId: string
  patientName: string
  level: string
  timestamp: Date
  notificationsSent: number
  acknowledged: boolean
}

interface AlertHistoryProps {
  alerts: AlertHistoryItem[]
  onAcknowledge: (id: string) => void
}

export function AlertHistory({ alerts, onAcknowledge }: AlertHistoryProps) {
  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Alert History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm">No alerts recorded</p>
            <p className="text-xs mt-1">All patients are stable</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Alert History</CardTitle>
        <span className="text-xs text-muted-foreground">{alerts.length} alerts</span>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${
                alert.acknowledged ? "bg-muted/30 border-border" : "bg-elevated/5 border-elevated/30"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">{alert.patientName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(alert.timestamp).toLocaleString()} · {alert.notificationsSent} SMS sent
                  </p>
                </div>
                {!alert.acknowledged && (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Acknowledge
                  </button>
                )}
                {alert.acknowledged && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Acknowledged
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
