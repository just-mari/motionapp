"use client"

import { Smartphone } from "lucide-react"

export function DesktopBlocker() {
  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center p-8 text-center">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-8">
        <Smartphone className="w-12 h-12 text-primary" />
      </div>

      <h1 className="text-3xl font-bold text-foreground mb-4 text-balance">
        Smartphone Only
      </h1>

      <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
        This experience requires a smartphone with motion sensors. Please open
        this page on your mobile device to continue.
      </p>

      <div className="mt-12 flex flex-col gap-2">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm">Motion detection required</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm">Touch screen needed</span>
        </div>
      </div>
    </div>
  )
}
