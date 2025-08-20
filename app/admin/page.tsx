"use client"

import { getAllAds, getUsers, getCoupons, getCategories } from "@/lib/store"
import { useMemo, useTransition, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createCouponAction, toggleCouponAction, adminAddCategoryAction, adminUpdateCategoryColorAction, adminDeleteUserAction, adminUpdateUserAction, deleteAdAction } from "@/app/actions"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useI18n } from "@/providers/lang-provider"

export default function AdminPage() {
  const { t } = useI18n()
  const [isPending, startTransition] = useTransition()

  const users = useMemo(() => getUsers(), [])
  const ads = useMemo(() => getAllAds(), [])
  const coupons = useMemo(() => getCoupons(), [])
  const categories = useMemo(() => getCategories(), [])

  const onCreateCoupon = (formData: FormData) => {
    startTransition(async () => {
      await createCouponAction(formData)
      location.reload()
    })
  }

  const vipCount = ads.filter((a) => a.isVip).length

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-2xl font-bold">{t("adminDashboard")}</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>{t("totalAds")}</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{ads.length}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>عدد المستخدمين</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{users.length}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t("totalVip")}</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{vipCount}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>{t("coupons")}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <form action={onCreateCoupon} className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="code">{t("code")}</Label>
              <Input id="code" name="code" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="percent">{t("discountPercent")}</Label>
              <Input id="percent" name="percent" type="number" min={0} max={100} defaultValue={10} />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={isPending} className="w-full">{t("create")}</Button>
            </div>
          </form>
          <div>
            <div className="mb-1 text-sm font-medium">{t("activeCoupons")}</div>
            <ul className="space-y-1 text-sm">
              {coupons.map((c) => (
                <li key={c.code} className="flex items-center justify-between">
                  <span>{c.code} — {c.percent}%</span>
                  <Button
                    size="sm"
                    variant={c.active ? "secondary" : "default"}
                    onClick={() => {
                      startTransition(async () => {
                        await toggleCouponAction(c.code, !c.active)
                        location.reload()
                      })
                    }}
                  >
                    {c.active ? "Deactivate" : "Activate"}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>إدارة التصنيفات</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <form action={adminAddCategoryAction} className="grid grid-cols-1 gap-3 md:grid-cols-5">
            <div className="space-y-1 md:col-span-1">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" placeholder="services" required />
            </div>
            <div className="space-y-1 md:col-span-1">
              <Label htmlFor="nameAr">الاسم (عربي)</Label>
              <Input id="nameAr" name="nameAr" required />
            </div>
            <div className="space-y-1 md:col-span-1">
              <Label htmlFor="nameEn">Name (EN)</Label>
              <Input id="nameEn" name="nameEn" required />
            </div>
            <div className="space-y-1 md:col-span-1">
              <Label htmlFor="color">اللون</Label>
              <Input id="color" name="color" type="color" defaultValue="#1e88e5" />
            </div>
            <div className="space-y-1 md:col-span-1">
              <Label htmlFor="image">الصورة</Label>
              <Input id="image" name="image" placeholder="/placeholder.svg?height=400&width=600" />
            </div>
            <div className="md:col-span-5">
              <Button type="submit" disabled={isPending}>إضافة تصنيف</Button>
            </div>
          </form>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <div key={c.slug} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{c.nameAr} / {c.nameEn}</div>
                  <div className="h-4 w-8 rounded" style={{ backgroundColor: c.color }} />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    type="color"
                    defaultValue={c.color}
                    onChange={(e) => {
                      startTransition(async () => {
                        await adminUpdateCategoryColorAction(c.slug, e.target.value)
                        location.reload()
                      })
                    }}
                  />
                  <span className="text-xs text-muted-foreground">{c.slug}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>المستخدمون</CardTitle></CardHeader>
        <CardContent>
          <UsersTable />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>الشركات (الإعلانات)</CardTitle></CardHeader>
        <CardContent>
          <AdsTable />
        </CardContent>
      </Card>
    </div>
  )
}

function UsersTable() {
  const { t } = useI18n()
  const [isPending, startTransition] = useTransition()
  const users = useMemo(() => getUsers(), [])
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((u) => (
          <TableRow key={u.id}>
            <TableCell>{u.id}</TableCell>
            <TableCell>{u.email}</TableCell>
            <TableCell>{u.role}</TableCell>
            <TableCell>{u.name || "-"}</TableCell>
            <TableCell>{u.phone || "-"}</TableCell>
            <TableCell className="space-x-2">
              <EditUserDialog
                userId={u.id}
                name={u.name}
                phone={u.phone}
                onSave={(data) => {
                  startTransition(async () => {
                    await adminUpdateUserAction(u.id, data)
                    location.reload()
                  })
                }}
              />
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (!confirm("حذف المستخدم؟ ستُحذف إعلاناته أيضاً.")) return
                  startTransition(async () => {
                    await adminDeleteUserAction(u.id)
                    location.reload()
                  })
                }}
              >
                حذف
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function AdsTable() {
  const { t } = useI18n()
  const [isPending, startTransition] = useTransition()
  const ads = useMemo(() => getAllAds(), [])
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>{t("companyName")}</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>{t("phone")}</TableHead>
          <TableHead>{t("vip")}</TableHead>
          <TableHead>{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ads.map((a) => (
          <TableRow key={a.id}>
            <TableCell>{a.id}</TableCell>
            <TableCell className="max-w-[240px] truncate">{a.companyName}</TableCell>
            <TableCell>{a.ownerEmail || "-"}</TableCell>
            <TableCell>{a.phone}</TableCell>
            <TableCell>{a.isVip ? "Yes" : "No"}</TableCell>
            <TableCell className="space-x-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (!confirm("حذف الإعلان؟")) return
                  startTransition(async () => {
                    await deleteAdAction(a.id)
                    location.reload()
                  })
                }}
              >
                حذف
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function EditUserDialog({ userId, name, phone, onSave }: { userId: string; name?: string; phone?: string; onSave: (data: { name?: string; phone?: string }) => void }) {
  const [open, setOpen] = useState(false)
  const [n, setN] = useState(name || "")
  const [p, setP] = useState(phone || "")
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">تعديل</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>تعديل المستخدم</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>الاسم</Label>
            <Input value={n} onChange={(e) => setN(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>الهاتف</Label>
            <Input value={p} onChange={(e) => setP(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => { onSave({ name: n, phone: p }); setOpen(false) }}>حفظ</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
