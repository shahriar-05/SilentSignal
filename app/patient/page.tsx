import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PatientView } from "@/components/patient/patient-view"

export const metadata = {
  title: "SilentSignals - Patient View",
  description: "Calm, supportive emotional monitoring experience",
}

export default async function PatientPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: patient } = await supabase.from("patients").select("*").eq("user_id", user.id).single()

  return <PatientView userId={user.id} initialPatient={patient} />
}
