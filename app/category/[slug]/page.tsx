"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { getCategories, getAdsByCategory } from "@/lib/store"
import { AdCard } from "@/components/ad-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useI18n } from "@/providers/lang-provider"
import { countries } from "@/data/countries"

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const { locale, t } = useI18n()
  const [q, setQ] = useState("")
  const [country, setCountry] = useState<string>("")
  const [city, setCity] = useState<string>("")

  const category = getCategories().find((c) => c.slug === slug)
  const ads = useMemo(() => {
    const list = getAdsByCategory(slug) // VIP أولاً
    const filtered = list.filter((a) => {
      const qLower = q.toLowerCase()
      const matchQ = q
        ? a.companyName.toLowerCase().includes(qLower) || a.description.toLowerCase().includes(qLower)
        : true
      const matchCountry = country ? a.country === country || a.country.toLowerCase() === country.toLowerCase() : true
      const matchCity = city ? a.city === city || a.city.toLowerCase() === city.toLowerCase() : true
      return matchQ && matchCountry && matchCity
    })
    return filtered
  }, [slug, q, country, city])

  const cities = useMemo(() => {
    const co = countries.find((c) => (locale === "ar" ? c.ar : c.en) === country)
    return co?.cities ?? []
  }, [country, locale])

  if (!category) return null
  const catName = locale === "ar" ? category.nameAr : category.nameEn

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{catName}</h1>
        <div className="h-2 w-24 rounded-full" style={{ backgroundColor: category.color }} />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <aside className="rounded-lg border p-4 md:col-span-1">
          <div className="space-y-3">
            <Label htmlFor="q">{t("search")}</Label>
            <Input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")} />

            <div className="space-y-2">
              <Label>{t("country")}</Label>
              <Select onValueChange={setCountry} value={country}>
                <SelectTrigger>
                  <SelectValue placeholder={t("country")} />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => {
                    const name = locale === "ar" ? c.ar : c.en
                    return (
                      <SelectItem key={c.code} value={name}>
                        {name}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("city")}</Label>
              <Select onValueChange={setCity} value={city} disabled={!country}>
                <SelectTrigger>
                  <SelectValue placeholder={t("city")} />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c, i) => {
                    const name = locale === "ar" ? c.ar : c.en
                    return (
                      <SelectItem key={i} value={name}>
                        {name}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </aside>

        <section className="md:col-span-3">
          {/* شبكة الإعلانات */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ads.length === 0 ? (
              <p className="text-muted-foreground">{t("noResults")}</p>
            ) : (
              ads.map((a) => <AdCard key={a.id} ad={a} />)
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
