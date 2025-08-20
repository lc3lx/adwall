"use client"

export function Footer() {
  return (
    <footer className="mt-12 border-t">
      <div className="container flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
        <div className="h-1 w-24 rounded-full bg-gradient-to-r from-sky-400 to-orange-400" />
        <p>© {new Date().getFullYear()} AdWell. All rights reserved.</p>
      </div>
    </footer>
  )
}
