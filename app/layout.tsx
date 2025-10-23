import type React from "react"
import { Roboto_Mono } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import { V0Provider } from "@/lib/v0-context"
import { AuthProvider } from "@/lib/auth-context"
import localFont from "next/font/local"
import { SidebarProvider } from "@/components/ui/sidebar"
import { MobileHeader } from "@/components/dashboard/mobile-header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import mockDataJson from "@/mock.json"
import type { MockData } from "@/types/dashboard"
import { MobileChat } from "@/components/chat/mobile-chat"

const mockData = mockDataJson as MockData

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
})

const rebelGrotesk = localFont({
  src: "../public/fonts/Rebels-Fett.woff2",
  variable: "--font-rebels",
  display: "swap",
})

const isV0 = process.env["VERCEL_URL"]?.includes("vusercontent.net") ?? false

export const metadata: Metadata = {
  title: {
    template: "%s – UNIFI Financial OS",
    default: "UNIFI Financial OS",
  },
  description:
    "Gamified financial management for achieving your goals with intelligent insights and collaborative tracking.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preload" href="/fonts/Rebels-Fett.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className={`${rebelGrotesk.variable} ${robotoMono.variable} antialiased`}>
        <V0Provider isV0={isV0}>
          <AuthProvider>
            <SidebarProvider>
              {/* Mobile Header - only visible on mobile */}
              <MobileHeader mockData={mockData} />

              <div className="w-full grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-0">
                <div className="hidden lg:block top-0 relative">
                  <DashboardSidebar />
                </div>

                <div className="w-full px-sides">{children}</div>
              </div>

              {/* Mobile Chat - floating CTA with drawer */}
              <MobileChat />
            </SidebarProvider>
          </AuthProvider>
        </V0Provider>
      </body>
    </html>
  )
}
