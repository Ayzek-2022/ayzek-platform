"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAdmin } from "@/contexts/admin-context"
import { Bell, Shield, LayoutDashboard } from "lucide-react"

interface AdminNavbarProps {
  onNotificationsClick?: () => void
}

export function AdminNavbar({ onNotificationsClick }: AdminNavbarProps) {
  const { isAdminLoggedIn, unreadCount } = useAdmin()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 theme-transition">
      <div className="container flex h-16 max-w-screen-xl items-center justify-between">
        <div className="flex items-center space-x-2">
          <a href="/" className="flex items-center space-x-2">
            <img src="/ayzek-logo.png" alt="AYZEK" className="w-8 h-8" />
            <span className="text-2xl font-display font-bold text-primary">AYZEK</span>
          </a>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a href="/" className="transition-colors hover:text-primary focus-ring rounded-sm px-2 py-1">
            Ana Sayfa
          </a>
          <a href="/about" className="transition-colors hover:text-primary focus-ring rounded-sm px-2 py-1">
            Hakkımızda
          </a>
          <a href="/events" className="transition-colors hover:text-primary focus-ring rounded-sm px-2 py-1">
            Etkinlikler
          </a>
          <a href="/join" className="transition-colors hover:text-primary focus-ring rounded-sm px-2 py-1">
            Topluluğa Katıl
          </a>
          {isAdminLoggedIn && (
            <>
              <div className="h-4 w-px bg-border mx-2"></div>
              <a
                href="/admin"
                className="transition-colors hover:text-primary focus-ring rounded-sm px-2 py-1 flex items-center gap-1 text-orange-500"
              >
                <LayoutDashboard className="w-4 h-4" />
                Yönetici Paneli
              </a>
              <button
                onClick={onNotificationsClick}
                className="transition-colors hover:text-primary focus-ring rounded-sm px-2 py-1 flex items-center gap-1 relative"
              >
                <Bell className="w-4 h-4" />
                Bildirimler
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isAdminLoggedIn && (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="w-9 h-9 rounded-full p-0 hover:bg-primary/10 relative md:hidden"
                title="Bildirimler"
                onClick={onNotificationsClick}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="w-9 h-9 rounded-full p-0 hover:bg-primary/10"
                title="Yönetici Paneli"
              >
                <a href="/admin">
                  <LayoutDashboard className="w-4 h-4" />
                </a>
              </Button>
            </>
          )}
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
