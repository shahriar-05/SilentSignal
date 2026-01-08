"use client"

import { useState, useEffect } from "react"
import { User, LogOut } from "lucide-react"
import { SoothingBackground } from "@/components/patient/soothing-background"
import { MusicPlayer } from "@/components/patient/music-player"
import { LiveVideoPreview } from "@/components/patient/live-video-preview"
import { PatientProfileView } from "@/components/patient/patient-profile"
import { GroundingMode } from "@/components/patient/grounding-mode"
import { getEmotionLevel, type EmotionLevel, type PatientProfile } from "@/lib/emotion-types"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface PatientViewProps {
  userId: string
  initialPatient: {
    id: string
    name: string
    email: string
    doctor_code: string | null
    doctor_id: string | null
    emergency_contacts: Array<{ name: string; phone: string }>
    current_distress_level: string
    current_mode: string
    camera_status: string
  } | null
}

export function PatientView({ userId, initialPatient }: PatientViewProps) {
  const router = useRouter()
  const [distressScore, setDistressScore] = useState(20)
  const [emotionLevel, setEmotionLevel] = useState<EmotionLevel>("calm")
  const [cameraActive, setCameraActive] = useState(initialPatient?.camera_status === "active")
  const [groundingModeActive, setGroundingModeActive] = useState(initialPatient?.current_mode === "grounding")
  const [showProfile, setShowProfile] = useState(false)

  const [profile, setProfile] = useState<PatientProfile>({
    id: initialPatient?.id || userId,
    name: initialPatient?.name || "Patient",
    isEnrolled: !!initialPatient?.doctor_id,
    doctorId: initialPatient?.doctor_id || undefined,
    emergencyContacts: initialPatient?.emergency_contacts || [],
  })

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  useEffect(() => {
    const updatePatientStatus = async () => {
      if (!initialPatient?.id) return
      const supabase = createClient()
      await supabase
        .from("patients")
        .update({
          camera_status: cameraActive ? "active" : "inactive",
          current_mode: groundingModeActive ? "grounding" : "normal",
          last_activity: new Date().toISOString(),
        })
        .eq("id", initialPatient.id)
    }
    updatePatientStatus()
  }, [cameraActive, groundingModeActive, initialPatient?.id])

  // Simulate emotion detection from camera
  useEffect(() => {
    if (!cameraActive) return

    const interval = setInterval(() => {
      setDistressScore((prev) => {
        const change = (Math.random() - 0.52) * 6
        return Math.max(0, Math.min(100, prev + change))
      })
    }, 2500)

    return () => clearInterval(interval)
  }, [cameraActive])

  // Update emotion level and trigger grounding mode
  useEffect(() => {
    const newLevel = getEmotionLevel(distressScore)
    setEmotionLevel(newLevel)

    if (newLevel === "elevated" && !groundingModeActive) {
      setGroundingModeActive(true)
    }

    const updateDistressLevel = async () => {
      if (!initialPatient?.id) return
      const supabase = createClient()
      await supabase
        .from("patients")
        .update({
          current_distress_level: newLevel === "calm" ? "low" : newLevel === "mild" ? "moderate" : "elevated",
        })
        .eq("id", initialPatient.id)
    }
    updateDistressLevel()
  }, [distressScore, groundingModeActive, initialPatient?.id])

  const handleCloseGrounding = () => {
    if (emotionLevel !== "elevated") {
      setGroundingModeActive(false)
    }
  }

  const handleEnrollDoctor = async (code: string) => {
    const supabase = createClient()

    // Verify doctor code
    const { data: doctorCode } = await supabase
      .from("doctor_codes")
      .select("*")
      .eq("code", code)
      .eq("is_active", true)
      .single()

    if (doctorCode) {
      // Update patient record
      await supabase
        .from("patients")
        .update({
          doctor_code: code,
          doctor_id: doctorCode.id,
        })
        .eq("id", initialPatient?.id)

      setProfile((prev) => ({
        ...prev,
        isEnrolled: true,
        doctorId: doctorCode.id,
        doctorName: doctorCode.doctor_name,
      }))
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Soothing animated background */}
      <SoothingBackground emotionLevel={emotionLevel} />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 sm:p-6">
          {/* Profile button */}
          <button
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 text-foreground/70 hover:bg-white/80 transition-all duration-300 shadow-sm"
          >
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">{profile.name}</span>
            {profile.isEnrolled && <span className="w-2 h-2 rounded-full bg-green-500" />}
          </button>

          <div className="flex items-center gap-3">
            <MusicPlayer autoPlay={true} />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 text-foreground/70 hover:bg-white/80 transition-all duration-300 shadow-sm"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center area - emotional visualization space */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Emotional pattern visualization hint - subtle */}
          <div className="text-center space-y-2 mb-8">
            <div
              className="w-24 h-24 mx-auto rounded-full opacity-60 animate-pulse"
              style={{
                animationDuration: "4s",
                background:
                  emotionLevel === "calm"
                    ? "radial-gradient(circle, rgba(125, 211, 192, 0.4) 0%, transparent 70%)"
                    : emotionLevel === "mild"
                      ? "radial-gradient(circle, rgba(135, 206, 235, 0.4) 0%, transparent 70%)"
                      : "radial-gradient(circle, rgba(240, 184, 122, 0.4) 0%, transparent 70%)",
              }}
            />
          </div>
        </div>

        {/* Bottom area */}
        <div className="p-6 space-y-6">
          {/* Camera controls */}
          <div className="flex justify-center">
            <LiveVideoPreview isActive={cameraActive} onToggle={() => setCameraActive(!cameraActive)} />
          </div>

          {/* Always visible reassurance message */}
          <div className="text-center space-y-2 py-6">
            <p className="text-xl sm:text-2xl font-semibold text-gray-700">System active: you are not alone.</p>
            <p className="text-gray-500 text-sm">Your wellbeing is being monitored with care</p>
          </div>
        </div>
      </div>

      {/* Demo controls - remove in production */}
      <div className="absolute top-20 left-4 z-20 space-y-2">
        <button
          onClick={() => setDistressScore(Math.min(100, distressScore + 35))}
          className="block text-xs px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 text-gray-500 hover:text-gray-700 transition-colors"
        >
          Simulate Distress
        </button>
        <button
          onClick={() => setDistressScore(Math.max(0, distressScore - 35))}
          className="block text-xs px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 text-gray-500 hover:text-gray-700 transition-colors"
        >
          Simulate Calm
        </button>
      </div>

      {/* Profile modal */}
      {showProfile && (
        <PatientProfileView
          profile={profile}
          onEnrollDoctor={handleEnrollDoctor}
          onClose={() => setShowProfile(false)}
        />
      )}

      {/* Grounding Mode Overlay */}
      {groundingModeActive && <GroundingMode onClose={handleCloseGrounding} canClose={emotionLevel !== "elevated"} />}
    </div>
  )
}
