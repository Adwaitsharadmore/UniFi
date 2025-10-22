"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isOnboardingComplete } from "@/lib/finance-data"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    if (isOnboardingComplete()) {
      router.push("/dashboard")
    } else {
      router.push("/onboarding")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="text-2xl font-display uppercase">Loading...</div>
      </div>
    </div>
  )
}
