"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useI18n } from "@/providers/lang-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { SignInButton } from "@/components/sign-in-dialog"
import { cn } from "@/lib/utils"
import { Menu, Plus, Home, Grid3X3, Settings } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const { t } = useI18n()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const nav = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/category/cars", label: t("categories"), icon: Grid3X3 },
    { href: "/ad/new", label: t("addAd"), icon: Plus },
    { href: "/admin", label: t("admin"), icon: Settings },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b/0">
      <div className="glass border-b backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-105">
            <div className="relative h-9 w-9 overflow-hidden rounded-lg ring-2 ring-sky-200/50">
              <Image src="/images/adwell-logo.jpg" alt="AdWell Logo" fill className="object-cover" />
            </div>
            <span className="hidden font-bold text-xl tracking-tight sm:inline-block">AdWell</span>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Main" className="hidden gap-1 md:flex">
            {nav.map((n) => {
              const Icon = n.icon
              const isActive = pathname === n.href
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-sky-50 dark:hover:bg-sky-950/50",
                    isActive
                      ? "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300"
                      : "text-foreground/70 hover:text-sky-600",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {n.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 md:flex">
            <SignInButton />
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-6 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image src="/images/adwell-logo.jpg" alt="AdWell" width={32} height={32} className="rounded-md" />
                      <span className="font-bold text-lg">AdWell</span>
                    </div>
                  </div>

                  <nav className="flex flex-col gap-2">
                    {nav.map((n) => {
                      const Icon = n.icon
                      const isActive = pathname === n.href
                      return (
                        <Link
                          key={n.href}
                          href={n.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all",
                            isActive
                              ? "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300"
                              : "text-foreground/70 hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-950/50",
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          {n.label}
                        </Link>
                      )
                    })}
                  </nav>

                  <div className="flex flex-col gap-3 border-t pt-4">
                    <SignInButton />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t("theme")}</span>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
