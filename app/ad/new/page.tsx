"use client"

import type React from "react"
import { useI18n } from "@/providers/lang-provider"
import { getCurrentUser, SignInButton } from "@/components/sign-in-dialog"
import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { countries } from "@/data/countries"
import { addAdAction } from "@/app/actions"
import { getCategories } from "@/lib/store"
import { PRICES } from "@/data/pricing"
import { CouponInput } from "@/components/coupon-input"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Breadcrumb } from "@/components/breadcrumb"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Upload, Star, Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

function SingleImagePicker({
  label,
  onChangeDataUrl,
  aspect = "16/9",
  accept = "image/*",
  preview,
  error,
}: {
  label: string
  onChangeDataUrl: (dataUrl: string) => void
  aspect?: string
  accept?: string
  preview?: string | null
  error?: string
}) {
  const id = useMemo(() => Math.random().toString(36).slice(2, 10), [])
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = async (file?: File | null) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert("حجم الملف كبير جداً. الحد الأقصى 5MB")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") onChangeDataUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div
        className={`relative overflow-hidden rounded-lg ring-1 transition-all cursor-pointer ${
          dragOver
            ? "ring-sky-400 bg-sky-50"
            : error
              ? "ring-red-300 bg-red-50"
              : "ring-black/10 bg-muted/40 hover:ring-sky-300"
        }`}
        style={{ aspectRatio: aspect }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <Image src={preview || "/placeholder.svg"} alt={label} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
            <Upload className="h-8 w-8" />
            <span>{dragOver ? "اسحب الملف هنا" : label}</span>
            <span className="text-xs">PNG, JPG حتى 5MB</span>
          </div>
        )}
      </div>
      <Input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        onChange={(e) => handleFile(e.target.files?.[0] || null)}
        className="hidden"
      />
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  )
}

export default function NewAdPage() {
  const { t, locale } = useI18n()
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [country, setCountry] = useState<string>("")
  const [city, setCity] = useState<string>("")
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [plan, setPlan] = useState<"vip" | "standard">("vip")
  const [finalPrice, setFinalPrice] = useState<number | null>(null)
  const [couponCode, setCouponCode] = useState<string>("")
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const cities = useMemo(() => {
    const co = countries.find((c) => (locale === "ar" ? c.ar : c.en) === country)
    return co?.cities ?? []
  }, [country, locale])

  const categories = getCategories()

  const validateForm = (formData: FormData): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.get("companyName")) newErrors.companyName = "اسم الشركة مطلوب"
    if (!formData.get("description")) newErrors.description = "الوصف مطلوب"
    if (!formData.get("category")) newErrors.category = "التصنيف مطلوب"
    if (!country) newErrors.country = "الدولة مطلوبة"
    if (!city) newErrors.city = "المدينة مطلوبة"
    if (!formData.get("phone")) newErrors.phone = "رقم الهاتف مطلوب"
    if (!imageDataUrl) newErrors.image = "صورة الشركة مطلوبة"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onPublish = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set("ownerEmail", user!.email)
    if (imageDataUrl) formData.set("image", imageDataUrl)

    if (!validateForm(formData)) return

    startTransition(async () => {
      try {
        const res = await addAdAction(formData)
        if (!res.ok) {
          alert("فشل في النشر")
          return
        }
        const adId = res.ad.id

        const ck = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan,
            couponCode: plan === "vip" ? couponCode : undefined,
            adId,
          }),
        }).then((r) => r.json())

        if (ck.ok && ck.url) {
          window.location.href = ck.url
        } else {
          alert(ck.error || "فشل في الدفع")
        }
      } catch (error) {
        alert("حدث خطأ غير متوقع")
      }
    })
  }

  if (!user) {
    return (
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex-1">
          <div className="container py-10">
            <Breadcrumb items={[{ label: t("addAd") }]} />
            <Card className="mx-auto max-w-xl mt-6">
              <CardHeader>
                <CardTitle>{t("signIn")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">يجب تسجيل الدخول أولاً لإضافة شركتك</p>
                <SignInButton />
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          <Breadcrumb items={[{ label: t("addAd") }]} />

          <div className="mt-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">{t("addAd")}</h1>
              <p className="text-muted-foreground mt-2">أضف شركتك واختر الخطة المناسبة للحصول على أفضل ظهور</p>
            </div>

            <form className="grid gap-8 lg:grid-cols-3" onSubmit={onPublish}>
              {/* Left: company info */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-0 shadow-sm ring-1 ring-black/5">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-sky-500" />
                      معلومات الشركة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="companyName">
                        {t("companyName")} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        placeholder="اسم شركتك"
                        className={errors.companyName ? "border-red-300" : ""}
                      />
                      {errors.companyName && <p className="text-sm text-red-600">{errors.companyName}</p>}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">
                        {t("description")} <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        rows={4}
                        placeholder="نبذة مختصرة عن خدمات الشركة وما تقدمه..."
                        className={errors.description ? "border-red-300" : ""}
                      />
                      {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                    </div>

                    <div className="grid gap-2">
                      <Label>
                        {t("category")} <span className="text-red-500">*</span>
                      </Label>
                      <Select name="category">
                        <SelectTrigger className={errors.category ? "border-red-300" : ""}>
                          <SelectValue placeholder="اختر التصنيف المناسب" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.slug} value={c.slug}>
                              {locale === "ar" ? c.nameAr : c.nameEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label>
                          {t("country")} <span className="text-red-500">*</span>
                        </Label>
                        <Select onValueChange={setCountry}>
                          <SelectTrigger className={errors.country ? "border-red-300" : ""}>
                            <SelectValue placeholder={t("country")} />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((c) => (
                              <SelectItem key={c.code} value={locale === "ar" ? c.ar : c.en}>
                                {locale === "ar" ? c.ar : c.en}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <input type="hidden" name="country" value={country} />
                        {errors.country && <p className="text-sm text-red-600">{errors.country}</p>}
                      </div>
                      <div className="grid gap-2">
                        <Label>
                          {t("city")} <span className="text-red-500">*</span>
                        </Label>
                        <Select onValueChange={setCity} disabled={!country}>
                          <SelectTrigger className={errors.city ? "border-red-300" : ""}>
                            <SelectValue placeholder={t("city")} />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((c, i) => (
                              <SelectItem key={i} value={locale === "ar" ? c.ar : c.en}>
                                {locale === "ar" ? c.ar : c.en}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <input type="hidden" name="city" value={city} />
                        {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="phone">
                          {t("phone")} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="+966501234567"
                          className={errors.phone ? "border-red-300" : ""}
                        />
                        {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="whatsapp">{t("whatsapp")}</Label>
                        <Input id="whatsapp" name="whatsapp" placeholder="+966501234567" />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="website">{t("website")}</Label>
                        <Input id="website" name="website" type="url" placeholder="https://your-company.com" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">{t("email")}</Label>
                        <Input id="email" name="email" type="email" placeholder="contact@company.com" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Image upload */}
                <Card className="border-0 shadow-sm ring-1 ring-black/5">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-sky-500" />
                      صورة الشركة <span className="text-red-500">*</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SingleImagePicker
                      label="ارفع صورة تمثل شركتك (غلاف وشعار)"
                      aspect="16/9"
                      preview={imageDataUrl}
                      onChangeDataUrl={setImageDataUrl}
                      error={errors.image}
                    />
                    <input type="hidden" name="image" value={imageDataUrl || ""} />
                  </CardContent>
                </Card>
              </div>

              {/* Right: plan & publish */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24 border-0 shadow-sm ring-1 ring-black/5">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500" />
                      {t("choosePlan")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup
                      value={plan}
                      onValueChange={(v) => setPlan(v as "vip" | "standard")}
                      className="grid gap-4"
                    >
                      <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 hover:bg-sky-50/50 transition-colors">
                        <RadioGroupItem value="vip" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="h-4 w-4 text-amber-500" />
                            <span className="font-semibold">{t("vipPlan")}</span>
                            <span className="text-lg font-bold">${PRICES.VIP_MONTHLY_USD}</span>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-green-600" />
                              أولوية الظهور في النتائج
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-green-600" />
                              شارة VIP مميزة
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-green-600" />
                              إحصائيات متقدمة
                            </li>
                          </ul>
                        </div>
                      </label>

                      <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 hover:bg-sky-50/50 transition-colors">
                        <RadioGroupItem value="standard" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{t("standardPlan")}</span>
                            <span className="text-lg font-bold">${PRICES.STANDARD_MONTHLY_USD}</span>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-green-600" />
                              ظهور في النتائج
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-green-600" />
                              معلومات التواصل
                            </li>
                          </ul>
                        </div>
                      </label>
                    </RadioGroup>

                    {plan === "vip" && (
                      <div className="rounded-lg border bg-sky-50/50 p-4">
                        <div className="mb-3 text-sm font-medium">كوبون الخصم</div>
                        <CouponInput
                          plan="vip"
                          onFinalPrice={(p) => setFinalPrice(p)}
                          onCodeChange={(code) => setCouponCode(code)}
                        />
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isPending}>
                      {isPending ? (
                        <div className="flex items-center gap-2">
                          <LoadingSpinner size="sm" />
                          جاري النشر...
                        </div>
                      ) : (
                        <>
                          {t("publishAndPay")} {plan === "vip" && finalPrice ? `- $${finalPrice}` : ""}
                        </>
                      )}
                    </Button>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        سيتم توجيهك لصفحة الدفع الآمن. في وضع التطوير، سيتم تفعيل الخطة تلقائياً.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
