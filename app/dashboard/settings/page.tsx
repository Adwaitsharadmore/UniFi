"use client"

import { useEffect, useState } from "react"
import DashboardPageLayout from "@/components/dashboard/layout"
import { SettingsIcon } from "lucide-react"
import { getUser, getSettings, saveSettings, clearAllData, setOnboardingComplete } from "@/lib/finance-data"
import type { User, UserSettings } from "@/types/finance"
import { useRouter } from "next/navigation"
import ProfileSettings from "@/components/settings/profile-settings"
import NotificationSettings from "@/components/settings/notification-settings"
import PreferencesSettings from "@/components/settings/preferences-settings"
import DangerZone from "@/components/settings/danger-zone"
import GamificationPanel from "@/components/finance/gamification-panel"

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [settings, setSettings] = useState<UserSettings | null>(null)

  useEffect(() => {
    const loadedUser = getUser()
    const loadedSettings = getSettings()
    setUser(loadedUser)
    setSettings(loadedSettings)
  }, [])

  const handleSettingsUpdate = (newSettings: UserSettings) => {
    setSettings(newSettings)
    saveSettings(newSettings)
  }

  const handleResetData = () => {
    if (confirm("Are you sure you want to reset all data? This action cannot be undone.")) {
      clearAllData()
      setOnboardingComplete(false)
      router.push("/onboarding")
    }
  }

  if (!user || !settings) {
    return null
  }

  return (
    <>
      <div className="lg:col-span-7">
        <DashboardPageLayout
          header={{
            title: "Settings",
            description: "Manage your preferences",
            icon: SettingsIcon,
          }}
        >
          <div className="space-y-6">
            <ProfileSettings user={user} />
            <NotificationSettings settings={settings} onUpdate={handleSettingsUpdate} />
            <PreferencesSettings settings={settings} onUpdate={handleSettingsUpdate} />
            <DangerZone onReset={handleResetData} />
          </div>
        </DashboardPageLayout>
      </div>

      <div className="col-span-3 hidden lg:block">
        <div className="space-y-gap py-sides min-h-screen max-h-screen sticky top-0 overflow-y-auto">
          <GamificationPanel />
        </div>
      </div>
    </>
  )
}
