"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { isOnboardingComplete } from "@/lib/finance-data"

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push("/auth/login")
      return
    }

    if (isOnboardingComplete()) {
      router.push("/dashboard")
    } else {
      router.push("/onboarding")
    }
  }, [router, user, loading])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="text-2xl font-display uppercase">Loading...</div>
      </div>
    </div>
  )
}
