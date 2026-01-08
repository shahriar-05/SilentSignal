"use client"

import type { PatientData } from "@/lib/emotion-types"

interface PatientCardProps {
  patient: PatientData
  onClick: () => void
  isSelected: boolean
}

export function PatientCard({ patient, onClick, isSelected }: PatientCardProps) {
  const getDistressLabel = (level: string) => {
    switch (level) {
      case "calm":
        return "Low Distress"
      case "mild":
        return "Low Distress"
      case "moderate":
        return "Moderate Distress"
      case "elevated":
        return "Elevated Distress"
      default:
        return "Low Distress"
    }
  }

  const getDistressColor = (level: string) => {
    switch (level) {
      case "calm":
        return "bg-emerald-500"
      case "mild":
        return "bg-emerald-500"
      case "moderate":
        return "bg-amber-500"
      case "elevated":
        return "bg-red-500"
      default:
        return "bg-emerald-500"
    }
  }

  const timeSinceUpdate = () => {
    const seconds = Math.floor((Date.now() - new Date(patient.lastUpdate).getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${
        isSelected ? "bg-slate-700/50 border-l-2 border-l-blue-500" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="font-medium text-slate-100">{patient.name}</h3>
          <p className="text-xs text-slate-400">{patient.id}</p>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${
            patient.isConnected ? "bg-blue-600 text-white" : "bg-slate-600 text-slate-300"
          }`}
        >
          {patient.isConnected ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <div className={`w-2 h-2 rounded-full ${getDistressColor(patient.currentState.level)}`} />
        <span className="text-sm text-slate-300">{getDistressLabel(patient.currentState.level)}</span>
      </div>

      <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>Updated {timeSinceUpdate()}</span>
      </div>
    </button>
  )
}
