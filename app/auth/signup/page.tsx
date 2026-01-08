"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Activity, ArrowLeft, User } from "lucide-react"
import { HeroAnimation } from "@/components/landing/hero-animation"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/patient`,
          data: {
            name: name,
          },
        },
      })

      if (signUpError) throw signUpError

      // Create patient record
      if (authData.user) {
        const { error: patientError } = await supabase.from("patients").insert({
          user_id: authData.user.id,
          name: name,
          email: email,
          current_distress_level: "low",
          current_mode: "normal",
          camera_status: "inactive",
        })

        if (patientError) {
          console.error("Error creating patient record:", patientError)
        }
      }

      router.push("/auth/signup-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <HeroAnimation />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            <span className="font-semibold text-slate-800">SilentSignals</span>
          </div>
        </header>

        {/* Sign Up Form */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 shadow-lg">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-teal-100 mb-4">
                  <User className="w-7 h-7 text-teal-600" />
                </div>
                <h1 className="text-2xl font-semibold text-slate-800 mb-2">Create Account</h1>
                <p className="text-slate-600 text-sm">Join our supportive monitoring community</p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 bg-white border-slate-200 focus:border-teal-400 focus:ring-teal-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-white border-slate-200 focus:border-teal-400 focus:ring-teal-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-white border-slate-200 focus:border-teal-400 focus:ring-teal-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 bg-white border-slate-200 focus:border-teal-400 focus:ring-teal-400"
                  />
                </div>

                {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}

                <Button
                  type="submit"
                  className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-teal-600 font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>

            <p className="text-center text-xs text-slate-400 mt-6">
              By signing up, you agree to our privacy-first approach.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
