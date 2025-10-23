'use client'

import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { User, Settings, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function UserProfile() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  if (!user) {
    return (
      <Button 
        onClick={() => router.push('/auth/login')}
        variant="outline"
        className="w-full"
      >
        Sign In
      </Button>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth/login')
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
            <AvatarFallback>
              {getInitials(user.user_metadata?.full_name || user.email)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.user_metadata?.full_name || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function UserProfileCompact() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  if (!user) {
    return (
      <Button 
        onClick={() => router.push('/auth/login')}
        size="sm"
        variant="outline"
      >
        Sign In
      </Button>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth/login')
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-6 w-6">
        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
        <AvatarFallback className="text-xs">
          {getInitials(user.user_metadata?.full_name || user.email)}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium truncate max-w-24">
        {user.user_metadata?.full_name || 'User'}
      </span>
      <Button
        onClick={handleSignOut}
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0"
      >
        <LogOut className="h-3 w-3" />
      </Button>
    </div>
  )
}
