"use client"

import type { BackgroundVariant } from "@/lib/stages"
import { cn } from "@/lib/utils"

interface MeshBackgroundProps {
  variant: BackgroundVariant
  /** Darken the center so foreground text/visuals pop. */
  vignette?: boolean
  /** Subtle reactive scale boost when the user is moving. */
  active?: boolean
}

/**
 * Soft, blurred mesh-gradient backgrounds recreated from the Figma frames.
 * - "warm": rainbow mesh (yellow / orange / crimson / teal)
 * - "cool": blue + teal mesh
 * - "black": near-solid black
 */
export function MeshBackground({ variant, vignette = false, active = false }: MeshBackgroundProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-background">
      {variant !== "black" && (
        <div
          aria-hidden
          className={cn(
            "absolute inset-[-30%] blur-2xl transition-transform duration-[1200ms] ease-out ce-animate-drift",
            active ? "scale-110" : "scale-100",
          )}
          style={{
            backgroundColor: variant === "warm" ? "#1b1230" : "#0a1c3a",
            backgroundImage:
              variant === "warm"
                ? [
                    "radial-gradient(38% 38% at 12% 10%, #f4d020 0%, transparent 60%)",
                    "radial-gradient(40% 40% at 30% 22%, #ef7d2e 0%, transparent 62%)",
                    "radial-gradient(46% 46% at 22% 52%, #d61f63 0%, transparent 60%)",
                    "radial-gradient(50% 50% at 78% 30%, #18a6bc 0%, transparent 60%)",
                    "radial-gradient(55% 55% at 85% 85%, #e0712c 0%, transparent 60%)",
                    "radial-gradient(50% 50% at 15% 92%, #18a6bc 0%, transparent 60%)",
                    "radial-gradient(45% 45% at 60% 70%, #c01f5e 0%, transparent 65%)",
                  ].join(",")
                : [
                    "radial-gradient(45% 45% at 18% 8%, #1f4fd6 0%, transparent 60%)",
                    "radial-gradient(50% 50% at 80% 12%, #143a9e 0%, transparent 62%)",
                    "radial-gradient(55% 55% at 12% 55%, #18a6bc 0%, transparent 60%)",
                    "radial-gradient(50% 50% at 88% 70%, #1f4fd6 0%, transparent 60%)",
                    "radial-gradient(55% 55% at 50% 95%, #16899c 0%, transparent 62%)",
                  ].join(","),
          }}
        />
      )}

      {/* center darkening so foreground content reads clearly */}
      {(vignette || variant === "warm" || variant === "cool") && (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              variant === "black"
                ? "transparent"
                : "radial-gradient(60% 50% at 50% 50%, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 45%, transparent 78%)",
          }}
        />
      )}

      {/* film grain-ish overlay for depth */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  )
}
