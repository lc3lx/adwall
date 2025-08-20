"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useI18n } from "@/providers/lang-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { SignInButton } from "@/components/sign-in-dialog"
import { cn } from "@/lib/utils"
import { Plus, Home, Grid3X3, Settings } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function ModernHeader() {
  const { t } = useI18n()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const nav = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/category/cars", label: t("categories"), icon: Grid3X3 },
    { href: "/ad/new", label: t("addAd"), icon: Plus },
    { href: "/admin", label: t("admin"), icon: Settings },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass shadow-lg" : "bg-transparent",
      )}
    >
      <div className="container-modern">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative h-10 w-10 lg:h-12 lg:w-12 overflow-hidden rounded-2xl ring-2 ring-primary-200/50 group-hover:ring-primary-300 transition-all duration-300">
              <Image
                src="/images/adwell-logo.jpg"
                alt="AdWell Logo"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl lg:text-2xl font-bold gradient-text">AdWell</h1>
              <p className="text-xs text-muted-foreground -mt-1">جدار الإعلانات</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {nav.map((n) => {
              const Icon = n.icon
              const isActive = pathname === n.href
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                    "hover:bg-primary-50 dark:hover:bg-primary-950/50",
                    isActive
                      ? "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"
                      : "text-foreground/70 hover:text-primary-600",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {n.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <SignInButton />
            <div className="h-6 w-px bg-border" />
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="relative h-10 w-10 rounded-xl"
            >
              <div className="flex flex-col items-center justify-center">
                <span
                  className={cn(
                    "block h-0.5 w-5 bg-current transition-all duration-300",
                    mobileOpen ? "rotate-45 translate-y-1" : "",
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 w-5 bg-current transition-all duration-300 mt-1",
                    mobileOpen ? "opacity-0" : "",
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 w-5 bg-current transition-all duration-300 mt-1",
                    mobileOpen ? "-rotate-45 -translate-y-1" : "",
                  )}
                />
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-x-0 top-16 transition-all duration-300 ease-out",
          mobileOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none",
        )}
      >
        <div className="glass border-t mx-4 rounded-2xl shadow-xl">
          <div className="p-6 space-y-6">
            <nav className="space-y-2">
              {nav.map((n) => {
                const Icon = n.icon
                const isActive = pathname === n.href
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"
                        : "text-foreground/70 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-950/50",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {n.label}
                  </Link>
                )
              })}
            </nav>

            <div className="border-t pt-4 space-y-4">
              <SignInButton />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("theme")}</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
