// Notification service for SMS and alert management
// In production, this would integrate with a Bangladesh-compatible SMS gateway

export interface EmergencyContact {
  id: string
  name: string
  phone: string
  relationship: string
}

export interface NotificationPayload {
  patientId: string
  patientName: string
  distressLevel: string
  timestamp: Date
  message: string
}

// Mock SMS sending function - in production, integrate with local SMS gateway
export async function sendSMSNotification(
  contacts: EmergencyContact[],
  payload: NotificationPayload,
): Promise<{ success: boolean; sentTo: string[] }> {
  // Simulate SMS sending
  console.log(`[SMS] Sending alert for patient ${payload.patientName}`)

  const sentTo: string[] = []

  for (const contact of contacts) {
    // In production: integrate with SMS gateway API
    // Example gateways for Bangladesh: SSL Wireless, Infobip, Twilio
    console.log(`[SMS] Notifying ${contact.name} (${contact.phone}): ${payload.message}`)
    sentTo.push(contact.phone)
  }

  return {
    success: true,
    sentTo,
  }
}

// Generate non-alarming notification message
export function generateAlertMessage(patientName: string): string {
  return `Alert: Elevated emotional distress detected for ${patientName}. Please check in when you can.`
}

// Log alert to system (for audit trail)
export function logAlert(payload: NotificationPayload): void {
  console.log(
    `[ALERT LOG] ${new Date().toISOString()} - Patient: ${payload.patientId} - Level: ${payload.distressLevel}`,
  )
}
