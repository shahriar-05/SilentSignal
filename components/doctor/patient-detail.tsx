"use client"

import { LiveEmotionPattern } from "./live-emotion-pattern"
import type { PatientData } from "@/lib/emotion-types"

interface PatientDetailProps {
  patient: PatientData
  onClose: () => void
  contactCount: number
  onSendAlert: () => void
}

export function PatientDetail({ patient, onClose, contactCount, onSendAlert }: PatientDetailProps) {
  const getDistressLabel = (level: string) => {
    switch (level) {
      case "calm":
        return "Low"
      case "mild":
        return "Low"
      case "moderate":
        return "Moderate"
      case "elevated":
        return "Elevated"
      default:
        return "Low"
    }
  }

  const getDistressColor = (level: string) => {
    switch (level) {
      case "calm":
        return "text-emerald-600"
      case "mild":
        return "text-emerald-600"
      case "moderate":
        return "text-amber-600"
      case "elevated":
        return "text-red-600"
      default:
        return "text-emerald-600"
    }
  }

  const getModeLabel = () => {
    if (patient.groundingModeActive) return "Grounding"
    return "Normal"
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{patient.name}</h2>
            <p className="text-sm text-slate-500 mt-1">Patient ID: {patient.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onSendAlert}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Send SMS Alert
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              Contact Patient
            </button>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Camera Status</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${patient.cameraActive ? "bg-emerald-500" : "bg-slate-400"}`} />
              <span className="text-sm font-medium text-slate-900">{patient.cameraActive ? "Active" : "Inactive"}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Distress Level</p>
            <span className={`text-sm font-medium ${getDistressColor(patient.currentState.level)}`}>
              {getDistressLabel(patient.currentState.level)}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Mode</p>
            <span className="text-sm font-medium text-slate-900">{getModeLabel()}</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Family Contacts</p>
            <span className="text-sm font-medium text-slate-900">{contactCount} registered</span>
          </div>
        </div>
      </div>

      {/* Live Emotional Pattern */}
      <div className="flex-1 p-6 flex flex-col min-h-0">
        <h3 className="text-xs text-slate-500 uppercase tracking-wide mb-4">Live Emotional Pattern</h3>

        <div className="flex-1 rounded-lg overflow-hidden min-h-[300px]">
          <LiveEmotionPattern
            emotionLevel={patient.currentState.level}
            distressScore={patient.currentState.distressScore}
          />
        </div>

        <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
          <span>Pattern represents current emotional state</span>
          <span>No video feed is transmitted</span>
        </div>
      </div>
    </div>
  )
}
