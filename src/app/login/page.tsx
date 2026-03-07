"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
    } else {
      router.push("/admin")
      router.refresh()
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-black text-white px-4 object-cover overflow-hidden selection:bg-white/30 selection:text-white">
      {/* Subtle Grain Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-10" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      <div className="z-10 w-full max-w-sm">
        {/* Brand */}
        <div className="mb-16 text-center">
          <h1 className="select-none text-4xl font-black uppercase tracking-tighter md:text-5xl lg:text-6xl text-white mix-blend-difference drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
            Decants
            <br />
            <span className="text-muted-foreground font-medium tracking-widest text-lg opacity-80 mt-1 block">NI BRO</span>
          </h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col space-y-8">
          <div className="space-y-6">
            <div className="relative group">
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full appearance-none bg-transparent py-3 pr-2 
                           border-b border-white/20 text-white leading-tight 
                           focus:outline-none focus:ring-0 focus:border-white transition-colors
                           peer"
                placeholder=" "
                autoComplete="email"
              />
              <label 
                htmlFor="email"
                className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-white/50 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-white pointer-events-none uppercase tracking-widest text-xs"
              >
                Email
              </label>
            </div>

            <div className="relative group">
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full appearance-none bg-transparent py-3 pr-2 
                           border-b border-white/20 text-white leading-tight 
                           focus:outline-none focus:ring-0 focus:border-white transition-colors
                           peer"
                placeholder=" "
                autoComplete="current-password"
              />
              <label 
                htmlFor="password"
                className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-white/50 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-white pointer-events-none uppercase tracking-widest text-xs"
              >
                Password
              </label>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm tracking-wide text-center">
              {error}
            </div>
          )}

          <div className="pt-2">
            <Button 
              type="submit" 
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-neutral-200 uppercase tracking-widest text-xs h-12 rounded-none transition-all duration-300"
            >
              {loading ? "Authenticating..." : "Enter"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
