export type Role = "visitor" | "advertiser" | "admin"

export type User = {
  id: string
  email: string
  name?: string
  phone?: string
  role: Role
}

export type Category = {
  slug: string
  nameAr: string
  nameEn: string
  image: string
  color: string // لون البطاقة يحدده الأدمن
}

// إعلان الشركة (شركة على جدار الإعلانات)
export type Ad = {
  id: string
  companyName: string
  description: string
  category: string // slug
  country: string
  city: string
  image: string // صورة الغلاف أو واجهة الشركة
  logo?: string // شعار الشركة
  isVip: boolean
  phone: string
  whatsapp?: string
  website?: string
  email?: string
  ownerEmail?: string // حساب المُعلِن
}
  
export type Coupon = {
  code: string
  percent: number // 0-100
  active: boolean
}
