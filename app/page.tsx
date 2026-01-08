import Link from "next/link"
import { HeroAnimation } from "@/components/landing/hero-animation"
import { Activity, Stethoscope, User, Shield, Heart, Eye } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <HeroAnimation />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-teal-600" />
            <span className="font-semibold text-slate-800">SilentSignals</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Shield className="w-4 h-4" />
            <span>Privacy-First Monitoring</span>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-4xl w-full">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-100 mb-6">
                <Heart className="w-10 h-10 text-teal-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold text-slate-800 tracking-tight mb-4 text-balance">
                Emotional Wellbeing,
                <br />
                <span className="text-teal-600">Visualized with Care</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-xl mx-auto text-balance">
                A gentle, privacy-first system that monitors emotional patterns through abstract visuals. No intrusive
                data. No clinical labels. Just supportive presence.
              </p>
            </div>

            {/* Role Selection */}
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Patient Card - Requires Auth */}
              <Link href="/auth/login" className="group block">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-teal-300 hover:bg-white">
                  <div className="w-14 h-14 rounded-xl bg-teal-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <User className="w-7 h-7 text-teal-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800 mb-2">I'm a Patient</h2>
                  <p className="text-slate-600 text-sm mb-4">
                    Access your personal monitoring space with calming visuals and grounding support.
                  </p>
                  <div className="flex items-center gap-2 text-teal-600 text-sm font-medium">
                    <Shield className="w-4 h-4" />
                    <span>Secure Login Required</span>
                  </div>
                </div>
              </Link>

              {/* Doctor Card - No Auth Required */}
              <Link href="/doctor" className="group block">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-slate-400 hover:bg-white">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Stethoscope className="w-7 h-7 text-slate-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800 mb-2">I'm a Doctor</h2>
                  <p className="text-slate-600 text-sm mb-4">
                    Monitor patient emotional patterns through abstract visualizations and receive alerts.
                  </p>
                  <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <Eye className="w-4 h-4" />
                    <span>Direct Dashboard Access</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Features */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
              <div>
                <div className="text-2xl font-semibold text-teal-600 mb-1">100%</div>
                <div className="text-xs text-slate-500">Privacy Protected</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-teal-600 mb-1">24/7</div>
                <div className="text-xs text-slate-500">Gentle Monitoring</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-teal-600 mb-1">Real-time</div>
                <div className="text-xs text-slate-500">Family Alerts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="p-6 text-center">
          <p className="text-xs text-slate-400">You are never alone. Help is always available.</p>
        </footer>
      </div>
    </main>
  )
}
