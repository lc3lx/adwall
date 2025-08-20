"use server"

import {
  addAd,
  createCoupon,
  setVip,
  toggleCoupon,
  updateAd,
  findCoupon,
  deleteAd,
  addCategory,
  updateCategory,
  getUsers,
  updateUser,
  deleteUser,
} from "@/lib/store"
import type { Ad, Category } from "@/types/types"
import { PRICES } from "@/data/pricing"

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

/* Helper used by client coupon input to preview price */
export async function calculatePriceWithCouponAction(couponCode?: string) {
  const base = PRICES.VIP_MONTHLY_USD
  const coupon = findCoupon(couponCode)
  const amount = coupon ? Math.max(0, Number.parseFloat((base * (1 - coupon.percent / 100)).toFixed(2))) : base
  return { ok: true, amount, coupon }
}

/* Ads (Advertiser) */
export async function addAdAction(formData: FormData) {
  const ad: Ad = {
    id: uid(),
    companyName: String(formData.get("companyName") || ""),
    description: String(formData.get("description") || ""),
    category: String(formData.get("category") || ""),
    country: String(formData.get("country") || ""),
    city: String(formData.get("city") || ""),
    image: String(formData.get("image") || "/placeholder.svg?height=400&width=600"),
    logo: String(formData.get("logo") || "/placeholder.svg?height=80&width=80"),
    isVip: false,
    phone: String(formData.get("phone") || ""),
    whatsapp: String(formData.get("whatsapp") || ""),
    website: String(formData.get("website") || ""),
    email: String(formData.get("email") || ""),
    ownerEmail: String(formData.get("ownerEmail") || formData.get("email") || ""),
  }
  addAd(ad)
  return { ok: true, ad }
}

export async function updateAdAction(
  adId: string,
  data: {
    companyName?: string
    description?: string
    image?: string
    logo?: string
    country?: string
    city?: string
    category?: string
    phone?: string
    whatsapp?: string
    website?: string
    email?: string
  },
) {
  const res = updateAd(adId, data)
  return { ok: true, ad: res }
}

export async function deleteAdAction(adId: string) {
  deleteAd(adId)
  return { ok: true }
}

export async function renewVipAction(adId: string, couponCode?: string) {
  const base = PRICES.VIP_MONTHLY_USD
  const coupon = findCoupon(couponCode)
  const amount = coupon ? Math.max(0, Number.parseFloat((base * (1 - coupon.percent / 100)).toFixed(2))) : base
  const ad = setVip(adId, true)
  return { ok: true, ad, amount, coupon }
}

/* Coupons (Admin) */
export async function createCouponAction(formData: FormData) {
  const code = String(formData.get("code") || "")
  const percent = Number(formData.get("percent") || 0)
  const coupon = createCoupon(code, percent)
  return { ok: true, coupon }
}
export async function toggleCouponAction(code: string, active: boolean) {
  const coupon = toggleCoupon(code, active)
  return { ok: true, coupon }
}

/* Categories (Admin) */
export async function adminAddCategoryAction(formData: FormData) {
  const cat: Category = {
    slug: String(formData.get("slug") || ""),
    nameAr: String(formData.get("nameAr") || ""),
    nameEn: String(formData.get("nameEn") || ""),
    image: String(formData.get("image") || "/placeholder.svg?height=400&width=600"),
    color: String(formData.get("color") || "#1e88e5"),
  }
  addCategory(cat)
  return { ok: true }
}
export async function adminUpdateCategoryColorAction(slug: string, color: string) {
  const updated = updateCategory(slug, { color })
  return { ok: true, category: updated }
}

/* Users (Admin) */
export async function adminUpdateUserAction(userId: string, data: { name?: string; phone?: string }) {
  const users = getUsers()
  const user = users.find((u) => u.id === userId)
  if (!user) return { ok: false, error: "User not found" }
  const updated = updateUser(userId, data)
  return { ok: true, user: updated }
}
export async function adminDeleteUserAction(userId: string) {
  deleteUser(userId)
  return { ok: true }
}
