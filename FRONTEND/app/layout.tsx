// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AdminProvider } from "@/contexts/admin-context"
import { ThemeProvider } from "@/components/theme-provider"
import AnimatedBg from "@/components/ui/animated-bg"
import { NotificationsProvider } from "@/contexts/notifications"

export const metadata: Metadata = {
  title: "AYZEK - Community Memory & Event Showcase",
  description: "A modern platform for showcasing community achievements and organizing events",
  other: {
    viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="dark" suppressHydrationWarning>
      <head />
      {/* overflow-x-clip = sağdaki hayalet boşlukları keser */}
      <body className="antialiased font-sans min-h-dvh bg-background text-foreground overflow-x-clip">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          enableColorScheme
          disableTransitionOnChange
        >
          {/* Global hareketli arka plan */}
          <AnimatedBg />
          <NotificationsProvider>
            <AdminProvider>
              {/* Mobil/tablette padding kalsın, PC'de sıfırla */}
              <main className="px-3 sm:px-4 md:px-6 lg:px-0 pt-4 md:pt-6">
                {children}
              </main>
            </AdminProvider>
          </NotificationsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
