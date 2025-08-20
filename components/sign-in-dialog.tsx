"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useI18n } from "@/providers/lang-provider"

export function getCurrentUser() {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem("user")
  return raw ? JSON.parse(raw) as { email: string } : null
}

export function SignInButton() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [user, setUser] = useState<{ email: string } | null>(null)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const signIn = () => {
    if (!email) return
    localStorage.setItem("user", JSON.stringify({ email }))
    setUser({ email })
    setOpen(false)
  }

  const signOut = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  if (user) {
    return (
      <Button variant="outline" size="sm" onClick={signOut}>
        {t("signOut")}
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">{t("signIn")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("signIn")}</DialogTitle>
          <DialogDescription>{t("continue")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <label className="text-sm">{t("email")}</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={signIn}>{t("continue")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
