export type EmotionLevel = "calm" | "mild" | "moderate" | "elevated"

export interface EmotionState {
  level: EmotionLevel
  distressScore: number // 0-100
  timestamp: Date
}

export interface PatientProfile {
  id: string
  name: string
  avatar?: string
  doctorId?: string
  doctorName?: string
  isEnrolled: boolean
  emergencyContacts: { name: string; phone: string }[]
}

export interface PatientData {
  id: string
  name: string
  currentState: EmotionState
  isConnected: boolean
  cameraActive: boolean
  groundingModeActive: boolean
  lastUpdate: Date
  profile?: PatientProfile
}

export const DISTRESS_THRESHOLDS = {
  calm: 25,
  mild: 50,
  moderate: 70,
  elevated: 100,
}

export function getEmotionLevel(score: number): EmotionLevel {
  if (score <= DISTRESS_THRESHOLDS.calm) return "calm"
  if (score <= DISTRESS_THRESHOLDS.mild) return "mild"
  if (score <= DISTRESS_THRESHOLDS.moderate) return "moderate"
  return "elevated"
}
