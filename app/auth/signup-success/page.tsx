import Link from "next/link"
import { Activity, CheckCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroAnimation } from "@/components/landing/hero-animation"

export default function SignUpSuccessPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <HeroAnimation />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            <span className="font-semibold text-slate-800">SilentSignals</span>
          </div>
        </header>

        {/* Success Message */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <h1 className="text-2xl font-semibold text-slate-800 mb-3">Account Created!</h1>

              <div className="flex items-center justify-center gap-2 text-slate-600 mb-6">
                <Mail className="w-5 h-5" />
                <p className="text-sm">Please check your email to verify your account.</p>
              </div>

              <div className="bg-teal-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-teal-700">
                  Once verified, you'll have access to your personal monitoring space with calming visuals and
                  supportive features.
                </p>
              </div>

              <div className="space-y-3">
                <Link href="/auth/login">
                  <Button className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-medium">
                    Go to Login
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full h-12 border-slate-200 bg-transparent">
                    Return Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
