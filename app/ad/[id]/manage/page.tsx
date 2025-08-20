"use client"

import { useParams } from "next/navigation"
import { getAdById } from "@/lib/store"
import { useEffect, useMemo, useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { getCurrentUser } from "@/components/sign-in-dialog"
import { updateAdAction, renewVipAction, deleteAdAction } from "@/app/actions"
import { CouponInput } from "@/components/coupon-input"
import { useI18n } from "@/providers/lang-provider"

export default function ManageAdPage() {
  const { t, locale } = useI18n()
  const { id } = useParams<{ id: string }>()
  const [finalPrice, setFinalPrice] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState({
    companyName: "",
    description: "",
    image: "",
    logo: "",
    phone: "",
    whatsapp: "",
    website: "",
    email: "",
  })

  const ad = useMemo(() => getAdById(id), [id])
  const user = getCurrentUser()

  useEffect(() => {
    if (ad) {
      setForm({
        companyName: ad.companyName,
        description: ad.description,
        image: ad.image,
        logo: ad.logo || "",
        phone: ad.phone,
        whatsapp: ad.whatsapp || "",
        website: ad.website || "",
        email: ad.email || "",
      })
    }
  }, [ad])

  if (!ad) return <div className="container py-10">Ad not found.</div>
  if (!user || ad.ownerEmail?.toLowerCase() !== user.email.toLowerCase()) {
    return (
      <div className="container py-10">
        <Card className="mx-auto max-w-xl">
          <CardHeader><CardTitle>غير مصرح</CardTitle></CardHeader>
          <CardContent>الرجاء تسجيل الدخول بحساب صاحب الإعلان للوصول.</CardContent>
        </Card>
      </div>
    )
  }

  const onSave = () => {
    startTransition(async () => {
      await updateAdAction(ad.id, form)
      alert(locale === "ar" ? "تم الحفظ" : "Saved")
      location.reload()
    })
  }

  const onVip = () => {
    startTransition(async () => {
      const res = await renewVipAction(ad.id)
      if (res.ok) {
        alert(locale === "ar" ? `تم تفعيل/تجديد VIP. السعر: $${res.amount}` : `VIP enabled/renewed. $${res.amount}`)
        location.reload()
      }
    })
  }

  const onDelete = () => {
    if (!confirm(locale === "ar" ? "حذف الإعلان نهائياً؟" : "Delete this ad?")) return
    startTransition(async () => {
      await deleteAdAction(ad.id)
      alert(locale === "ar" ? "تم الحذف" : "Deleted")
      location.href = "/"
    })
  }

  return (
    <div className="container py-8">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>إدارة شركة: {form.companyName}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded">
              <Image src={form.image || "/placeholder.svg"} alt={form.companyName} fill className="object-cover" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="companyName">{t("companyName")}</Label>
              <Input id="companyName" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">{t("description")}</Label>
              <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">{t("imageUrl")}</Label>
              <Input id="image" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="logo">{t("logoUrl")}</Label>
              <Input id="logo" value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <Button onClick={onSave} disabled={isPending}>حفظ</Button>
              <Button variant="destructive" onClick={onDelete} disabled={isPending}>حذف الإعلان</Button>
            </div>
          </div>
          <div className="space-y-4 rounded-lg border p-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="phone">{t("phone")}</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="whatsapp">{t("whatsapp")}</Label>
                <Input id="whatsapp" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website">{t("website")}</Label>
                <Input id="website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input id="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            <div className="text-lg font-semibold">{t("subscribeVip")}</div>
            <CouponInput onFinalPrice={(p) => setFinalPrice(p)} />
            <Button className="w-full" onClick={onVip} disabled={isPending}>
              {ad.isVip ? "تجديد VIP" : "تفعيل VIP"} {finalPrice ? `- $${finalPrice}` : ""}
            </Button>
            <p className="text-xs text-muted-foreground">سيتم محاكاة الدفع في حال عدم ضبط مفاتيح Stripe.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
