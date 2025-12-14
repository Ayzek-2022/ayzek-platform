"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAdmin } from "@/contexts/admin-context"
import { Bell, LayoutDashboard, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

interface AdminNavbarProps {
  onNotificationsClick?: () => void
}

export function AdminNavbar({ onNotificationsClick }: AdminNavbarProps) {
  const { isAdminLoggedIn, unreadCount } = useAdmin()
  const [open, setOpen] = useState(false)

  const links = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/about", label: "Hakkımızda" },
    { href: "/events", label: "Etkinlikler" },
    { href: "/teams", label: "Takımlarımız" },
    { href: "/blog", label: "Bloglar" },
    { href: "/join", label: "Topluluğa Katıl" },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 theme-transition">
        <div className="container mx-auto flex h-15 md:h-16 max-w-screen-xl items-center justify-between px-3 sm:px-4 md:px-6">
          {/* Sol: Logo */}
          <div className="flex items-center gap-1.5 md:gap-2 min-w-0 flex-shrink-0">
            <a href="/" className="flex items-center space-x-1.5 md:space-x-2">
              <img src="/ayzek-logo.png" alt="AYZEK" className="w-7 h-7 md:w-8 md:h-8" />
              <span className="text-xl md:text-2xl font-display font-bold text-primary whitespace-nowrap">AYZEK</span>
            </a>
          </div>

          {/* Orta: Masaüstü menü (aynı kaldı) */}
          <nav className="hidden md:flex items-center justify-center space-x-4 lg:space-x-6 text-sm font-medium">
            <a href="/" className="transition-all duration-300 hover:text-primary hover:scale-105 focus-ring rounded-sm px-2 py-1 whitespace-nowrap">Ana Sayfa</a>
            <a href="/about" className="transition-all duration-300 hover:text-primary hover:scale-105 focus-ring rounded-sm px-2 py-1 whitespace-nowrap">Hakkımızda</a>
            <a href="/events" className="transition-all duration-300 hover:text-primary hover:scale-105 focus-ring rounded-sm px-2 py-1 whitespace-nowrap">Etkinlikler</a>
            <a href="/teams" className="transition-all duration-300 hover:text-primary hover:scale-105 focus-ring rounded-sm px-2 py-1 whitespace-nowrap">Takımlarımız</a>
            <a href="/blog" className="transition-all duration-300 hover:text-primary hover:scale-105 focus-ring rounded-sm px-2 py-1 whitespace-nowrap">Bloglar</a>
            <a href="/join" className="transition-all duration-300 hover:text-primary hover:scale-105 focus-ring rounded-sm px-2 py-1 whitespace-nowrap">Topluluğa Katıl</a>

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
              </>
            )}
          </nav>

          {/* Sağ: Aksiyonlar */}
          <div className="flex items-center gap-2">

            {isAdminLoggedIn && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-9 h-9 rounded-full p-0 hover:bg-primary/10 relative"
                  title="Bildirimler"
                  onClick={onNotificationsClick}
                  aria-label="Bildirimler"
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
                  className="w-9 h-9 rounded-full p-0 hover:bg-primary/10 hidden md:inline-flex"
                  title="Yönetici Paneli"
                  aria-label="Yönetici Paneli"
                >
                  <a href="/admin">
                    <LayoutDashboard className="w-4 h-4" />
                  </a>
                </Button>
              </>
            )}

            {/* Mobil: küçük POPUP menü (Dropdown) */}
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 rounded-full md:hidden"
                  aria-label="Menüyü aç"
                  title="Menü"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>

              {/* Küçük pop-up, sağa hizalı */}
              <DropdownMenuContent
                align="end"
                side="bottom"
                sideOffset={8}
                className="w-60 p-2 rounded-xl shadow-lg"
              >
                <DropdownMenuLabel className="px-2 py-1.5">Menü</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {links.map((l) => (
                  <DropdownMenuItem
                    key={l.href}
                    onClick={() => setOpen(false)}
                    className="px-2 py-2 cursor-pointer"
                    asChild
                  >
                    <a href={l.href} className="font-medium">
                      {l.label}
                    </a>
                  </DropdownMenuItem>
                ))}

                {isAdminLoggedIn && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setOpen(false)}
                      className="px-2 py-2 cursor-pointer text-orange-500"
                      asChild
                    >
                      <a href="/admin" className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        Yönetici Paneli
                      </a>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Spacer to prevent the fixed navbar from overlapping page content */}
      <div className="h-14 md:h-16" />
    </>
  )
}
