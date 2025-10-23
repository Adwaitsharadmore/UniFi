"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UserSettings } from "@/types/finance"
import { Palette } from "lucide-react"

interface PreferencesSettingsProps {
  settings: UserSettings
  onUpdate: (settings: UserSettings) => void
}

export default function PreferencesSettings({ settings, onUpdate }: PreferencesSettingsProps) {
  const handleCurrencyChange = (value: string) => {
    onUpdate({
      ...settings,
      preferences: {
        ...settings.preferences,
        currency: value,
      },
    })
  }

  const handleDateFormatChange = (value: string) => {
    onUpdate({
      ...settings,
      preferences: {
        ...settings.preferences,
        dateFormat: value,
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <Bullet />
          PREFERENCES
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-accent space-y-6">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
          <Palette className="size-5 text-primary" />
          <p className="text-sm">Customize your app experience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currency" className="uppercase text-xs font-display">
              Currency
            </Label>
            <Select value={settings.preferences.currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-format" className="uppercase text-xs font-display">
              Date Format
            </Label>
            <Select value={settings.preferences.dateFormat} onValueChange={handleDateFormatChange}>
              <SelectTrigger id="date-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-background/50 border border-border">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Theme</Label>
            <span className="text-xs text-muted-foreground uppercase">Dark Mode Active</span>
          </div>
          <p className="text-xs text-muted-foreground">Currently using the UNIFI dark theme</p>
        </div>
      </CardContent>
    </Card>
  )
}
