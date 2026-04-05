"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { releases } from "@/lib/releases"

export function ReleaseModal() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const latestRelease = releases[0]

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      const lastSeen = localStorage.getItem("last_seen_version")
      if (lastSeen !== latestRelease.version) {
        setOpen(true)
      }
    }, 50)
    return () => clearTimeout(timer)
  }, [latestRelease.version])

  const handleClose = () => {
    localStorage.setItem("last_seen_version", latestRelease.version)
    setOpen(false)
  }

  // Prevent any hydration mismatch issues by not rendering until client is ready
  if (!mounted) return null

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose() }}>
      <DialogContent className="sm:max-w-md border-border/40 bg-card/95 backdrop-blur">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/20 text-emerald-500 text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded">
              v{latestRelease.version}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase">{latestRelease.date}</span>
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight">{latestRelease.title}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            Novedades y mejoras en esta versión de Mi Retiro MX:
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <ul className="space-y-3">
            {latestRelease.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <span className="text-emerald-500 font-bold mt-0.5">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={handleClose} className="font-semibold">
            ¡Entendido!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
