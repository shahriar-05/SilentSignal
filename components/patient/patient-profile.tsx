"use client"

import { useState } from "react"
import { User, UserPlus, Check } from "lucide-react"
import type { PatientProfile } from "@/lib/emotion-types"

interface PatientProfileViewProps {
  profile: PatientProfile
  onEnrollDoctor: (code: string) => void
  onClose: () => void
}

export function PatientProfileView({ profile, onEnrollDoctor, onClose }: PatientProfileViewProps) {
  const [enrollCode, setEnrollCode] = useState("")
  const [showEnroll, setShowEnroll] = useState(false)

  const handleEnroll = () => {
    if (enrollCode.length === 6) {
      onEnrollDoctor(enrollCode)
      setShowEnroll(false)
      setEnrollCode("")
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center border-b border-gray-100">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
            <User className="w-10 h-10 text-teal-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">{profile.name}</h2>
          <p className="text-sm text-gray-500 mt-1">Patient ID: {profile.id}</p>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Doctor enrollment status */}
          <div className="p-4 rounded-2xl bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Doctor Connection</p>
                {profile.isEnrolled ? (
                  <p className="text-sm text-gray-500 mt-0.5">Connected to Dr. {profile.doctorName}</p>
                ) : (
                  <p className="text-sm text-gray-400 mt-0.5">Not yet connected</p>
                )}
              </div>
              {profile.isEnrolled ? (
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
              ) : (
                <button
                  onClick={() => setShowEnroll(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-teal-500 text-white text-sm font-medium hover:bg-teal-600 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Enroll
                </button>
              )}
            </div>

            {/* Enrollment form */}
            {showEnroll && !profile.isEnrolled && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Enter the 6-digit code from your doctor</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={enrollCode}
                    onChange={(e) => setEnrollCode(e.target.value.toUpperCase())}
                    placeholder="ABC123"
                    className="flex-1 px-4 py-2 rounded-xl bg-white border border-gray-200 text-center font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    onClick={handleEnroll}
                    disabled={enrollCode.length !== 6}
                    className="px-4 py-2 rounded-xl bg-teal-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-600 transition-colors"
                  >
                    Connect
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Emergency contacts */}
          <div className="p-4 rounded-2xl bg-gray-50">
            <p className="text-sm font-medium text-gray-700 mb-2">Emergency Contacts</p>
            {profile.emergencyContacts.length > 0 ? (
              <div className="space-y-2">
                {profile.emergencyContacts.map((contact, i) => (
                  <div key={i} className="flex items-center justify-between text-sm text-gray-600">
                    <span>{contact.name}</span>
                    <span className="text-gray-400">{contact.phone}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No contacts added</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
