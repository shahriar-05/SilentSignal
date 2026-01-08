"use client"

import { useState, useEffect, useCallback } from "react"
import { PatientCard } from "@/components/doctor/patient-card"
import { PatientDetail } from "@/components/doctor/patient-detail"
import { AlertBanner } from "@/components/doctor/alert-banner"
import { useNotifications } from "@/hooks/use-notifications"
import { getEmotionLevel, type PatientData, type EmotionState } from "@/lib/emotion-types"
import type { EmergencyContact } from "@/lib/notification-service"

const MOCK_PATIENTS: PatientData[] = [
  {
    id: "P001",
    name: "Patient A",
    currentState: { level: "calm", distressScore: 18, timestamp: new Date() },
    isConnected: true,
    cameraActive: true,
    groundingModeActive: false,
    lastUpdate: new Date(),
  },
  {
    id: "P002",
    name: "Patient B",
    currentState: { level: "moderate", distressScore: 55, timestamp: new Date() },
    isConnected: true,
    cameraActive: true,
    groundingModeActive: true,
    lastUpdate: new Date(),
  },
  {
    id: "P003",
    name: "Patient C",
    currentState: { level: "calm", distressScore: 22, timestamp: new Date() },
    isConnected: true,
    cameraActive: true,
    groundingModeActive: false,
    lastUpdate: new Date(),
  },
  {
    id: "P004",
    name: "Patient D",
    currentState: { level: "moderate", distressScore: 48, timestamp: new Date() },
    isConnected: false,
    cameraActive: false,
    groundingModeActive: false,
    lastUpdate: new Date(Date.now() - 3606000),
  },
]

const MOCK_CONTACTS: Record<string, EmergencyContact[]> = {
  P001: [{ id: "c1", name: "Family Member 1", phone: "+880171234567", relationship: "Spouse" }],
  P002: [
    { id: "c2", name: "Family Member 1", phone: "+880181234567", relationship: "Parent" },
    { id: "c3", name: "Family Member 2", phone: "+880191234567", relationship: "Sibling" },
  ],
  P003: [{ id: "c4", name: "Family Member 1", phone: "+880161234567", relationship: "Parent" }],
}

export function DoctorDashboard() {
  const [patients, setPatients] = useState<PatientData[]>(MOCK_PATIENTS)
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(MOCK_PATIENTS[1])
  const [contacts] = useState<Record<string, EmergencyContact[]>>(MOCK_CONTACTS)

  const { sendNotification } = useNotifications()

  // Simulate real-time updates - movement patterns change based on emotional state
  useEffect(() => {
    const interval = setInterval(() => {
      setPatients((prevPatients) =>
        prevPatients.map((patient) => {
          if (!patient.isConnected) return patient

          const change = (Math.random() - 0.5) * 8
          const newScore = Math.max(0, Math.min(100, patient.currentState.distressScore + change))
          const newLevel = getEmotionLevel(newScore)

          const newState: EmotionState = {
            level: newLevel,
            distressScore: newScore,
            timestamp: new Date(),
          }

          return {
            ...patient,
            currentState: newState,
            groundingModeActive: newLevel === "elevated" || newLevel === "moderate",
            lastUpdate: new Date(),
          }
        }),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Update selected patient when patients list updates
  useEffect(() => {
    if (selectedPatient) {
      const updated = patients.find((p) => p.id === selectedPatient.id)
      if (updated) {
        setSelectedPatient(updated)
      }
    }
  }, [patients, selectedPatient])

  const handleSendAlert = useCallback(() => {
    if (!selectedPatient) return
    const patientContacts = contacts[selectedPatient.id] || []
    if (patientContacts.length > 0) {
      sendNotification(selectedPatient.id, selectedPatient.name, selectedPatient.currentState.level, patientContacts)
    }
  }, [selectedPatient, contacts, sendNotification])

  const activePatients = patients.filter((p) => p.isConnected).length

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      {/* Alert banner */}
      <AlertBanner alerts={[]} onDismiss={() => {}} />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              className="w-6 h-6 text-blue-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">SilentSignals</h1>
              <p className="text-xs text-slate-500">Doctor Monitoring Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>{activePatients} Active Patients</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Patient List */}
        <aside className="w-72 bg-slate-800 flex-shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-slate-700">
            <h2 className="text-xs font-medium text-slate-400 uppercase tracking-wide">Patients</h2>
          </div>

          <div className="divide-y divide-slate-700/50">
            {patients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onClick={() => setSelectedPatient(patient)}
                isSelected={selectedPatient?.id === patient.id}
              />
            ))}
          </div>
        </aside>

        {/* Main Panel - Patient Detail */}
        <main className="flex-1 overflow-y-auto">
          {selectedPatient ? (
            <PatientDetail
              patient={selectedPatient}
              onClose={() => setSelectedPatient(null)}
              contactCount={contacts[selectedPatient.id]?.length || 0}
              onSendAlert={handleSendAlert}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              <div className="text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-slate-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <p>Select a patient to view details</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
