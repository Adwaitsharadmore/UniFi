import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { User } from "@/types/finance"
import { UserIcon } from "lucide-react"

interface ProfileSettingsProps {
  user: User
}

export default function ProfileSettings({ user }: ProfileSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <Bullet />
          PROFILE SETTINGS
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-accent space-y-6">
        <div className="flex items-center gap-4">
          <div className="size-20 rounded-full bg-primary/20 flex items-center justify-center">
            <UserIcon className="size-10 text-primary" />
          </div>
          <div>
            <p className="text-lg font-display uppercase">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="uppercase text-xs font-display">
              Full Name
            </Label>
            <Input id="name" defaultValue={user.name} className="h-12" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="uppercase text-xs font-display">
              Email Address
            </Label>
            <Input id="email" type="email" defaultValue={user.email} className="h-12" />
          </div>
        </div>

        <div className="flex gap-3">
          <Button className="uppercase font-display">Save Changes</Button>
          <Button variant="outline" className="uppercase font-display bg-transparent">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
