import { NextResponse } from "next/server"
import {
  sendSMSNotification,
  generateAlertMessage,
  logAlert,
  type EmergencyContact,
  type NotificationPayload,
} from "@/lib/notification-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { patientId, patientName, distressLevel, contacts } = body

    // Validate required fields
    if (!patientId || !patientName || !distressLevel) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const payload: NotificationPayload = {
      patientId,
      patientName,
      distressLevel,
      timestamp: new Date(),
      message: generateAlertMessage(patientName),
    }

    // Log the alert
    logAlert(payload)

    // Send SMS if contacts provided
    if (contacts && contacts.length > 0) {
      const result = await sendSMSNotification(contacts as EmergencyContact[], payload)

      return NextResponse.json({
        success: true,
        message: "Alert processed",
        smsSent: result.success,
        notifiedContacts: result.sentTo.length,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Alert logged (no contacts to notify)",
      smsSent: false,
      notifiedContacts: 0,
    })
  } catch (error) {
    console.error("[API] Notification error:", error)
    return NextResponse.json({ error: "Failed to process notification" }, { status: 500 })
  }
}
