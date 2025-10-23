"use client"

import type * as React from "react"
import { useEffect, useState } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import BracketsIcon from "@/components/icons/brackets"
import { Target, TrendingUp, BarChart3, Lightbulb, Settings, Users, BookOpen, User, LogOut } from "lucide-react"
import MonkeyIcon from "@/components/icons/monkey"
import DotsVerticalIcon from "@/components/icons/dots-vertical"
import { Bullet } from "@/components/ui/bullet"
import Image from "next/image"
import { useIsV0 } from "@/lib/v0-context"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getUser, DEFAULT_USER } from "@/lib/finance-data"
import type { User as FinanceUser } from "@/types/finance"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

// This is sample data for the sidebar
const data = {
  navMain: [
    {
      title: "Financial",
      items: [
        {
          title: "Overview",
          url: "/dashboard",
          icon: BracketsIcon,
          isActive: true,
        },
        {
          title: "Goals",
          url: "/dashboard/goals",
          icon: Target,
          isActive: false,
        },
        {
          title: "Transactions",
          url: "/dashboard/transactions",
          icon: TrendingUp,
          isActive: false,
        },
        {
          title: "Insights",
          url: "/dashboard/insights",
          icon: Lightbulb,
          isActive: false,
        },
        {
          title: "Community",
          url: "/dashboard/community",
          icon: Users,
          isActive: false,
        },
        {
          title: "Learning",
          url: "/dashboard/learning",
          icon: BookOpen,
          isActive: false,
        },
        {
          title: "Settings",
          url: "/dashboard/settings",
          icon: Settings,
          isActive: false,
        },
      ],
    },
  ],
  user: {
    name: "KRIMSON",
    email: "krimson@joyco.studio",
    avatar: "/avatars/user_krimson.png",
  },
}

function SidebarUserProfile() {
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
    <div className="flex items-center gap-3 p-3 bg-sidebar-accent rounded-lg">
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
        <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
          {getInitials(user.user_metadata?.full_name || user.email)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-sidebar-foreground truncate">
          {user.user_metadata?.full_name || 'User'}
        </p>
        <p className="text-xs text-sidebar-foreground/70 truncate">
          {user.email}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <DotsVerticalIcon className="h-4 w-4" />
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
    </div>
  )
}

export function DashboardSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  const isV0 = useIsV0()
  const pathname = usePathname()
  const [user, setUser] = useState<FinanceUser>(DEFAULT_USER)

  useEffect(() => {
    const loaded = getUser()
    setUser(loaded ?? DEFAULT_USER)
  }, [])

  return (
    <Sidebar {...props} className={cn("py-sides", className)}>
      <SidebarHeader className="rounded-t-lg flex gap-3 flex-row rounded-b-none">
        <div className="flex overflow-clip size-12 shrink-0 items-center justify-center rounded bg-sidebar-primary-foreground/10 transition-colors group-hover:bg-sidebar-primary text-sidebar-primary-foreground">
          <MonkeyIcon className="size-10 group-hover:scale-[1.7] origin-top-left transition-transform" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="text-2xl font-display">UNIFI</span>
          <span className="text-xs uppercase">Financial OS</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((group, i) => (
          <SidebarGroup className={cn(i === 0 && "rounded-t-none")} key={group.title}>
            <SidebarGroupLabel>
              <Bullet className="mr-2" />
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem
                    key={item.title}
                    className={cn((item as any).locked && "pointer-events-none opacity-50", isV0 && "pointer-events-none")}
                    data-disabled={(item as any).locked}
                  >
                    <SidebarMenuButton
                      asChild={!(item as any).locked}
                      isActive={pathname === item.url || (item.url !== "/dashboard" && pathname.startsWith(item.url))}
                      disabled={(item as any).locked}
                      className={cn("disabled:cursor-not-allowed", (item as any).locked && "pointer-events-none")}
                    >
                      {(item as any).locked ? (
                        <div className="flex items-center gap-3 w-full">
                          <item.icon className="size-5" />
                          <span>{item.title}</span>
                        </div>
                      ) : (
                        <Link href={item.url}>
                          <item.icon className="size-5" />
                          <span>{item.title}</span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                    {(item as any).locked && <SidebarMenuBadge>{/* Placeholder for lock icon */}</SidebarMenuBadge>}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-0">
        <SidebarGroup>
          <SidebarGroupLabel>
            <Bullet className="mr-2" />
            User
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarUserProfile />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
