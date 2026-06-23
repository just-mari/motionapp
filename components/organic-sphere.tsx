"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface OrganicSphereProps {
  /** Reactive intensity 0-100 from motion, scales the glow + ball. */
  intensity?: number
  active?: boolean
}

/**
 * EV-A: a colorful woven organic ball suspended inside a dark glossy orb.
 * Recreated from the Figma frames.
 */
export function OrganicSphere({ intensity = 0, active = false }: OrganicSphereProps) {
  const scale = 1 + Math.min(intensity, 100) / 100 * 0.06

  return (
    <div className="relative flex items-center justify-center">
      {/* outer dark glossy orb */}
      <div
        className="relative h-64 w-64 rounded-full sm:h-72 sm:w-72"
        style={{
          background:
            "radial-gradient(circle at 50% 28%, rgba(60,60,68,0.55) 0%, rgba(12,12,16,0.92) 46%, rgba(0,0,0,0.96) 70%)",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.55), inset 0 2px 20px rgba(255,255,255,0.06)",
        }}
      >
        {/* reactive glow halo */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 rounded-full blur-2xl transition-opacity duration-500",
            active ? "opacity-70" : "opacity-40",
          )}
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(216,31,99,0.35), rgba(24,166,188,0.25) 55%, transparent 72%)",
          }}
        />

        {/* woven colorful ball */}
        <div
          className="absolute inset-0 flex items-center justify-center ce-animate-float"
          style={{ transform: `scale(${scale})`, transition: "transform 300ms ease-out" }}
        >
          <div
            className="ce-animate-spin-slow"
            style={{
              WebkitMaskImage: "radial-gradient(circle, #000 60%, transparent 72%)",
              maskImage: "radial-gradient(circle, #000 60%, transparent 72%)",
            }}
          >
            <Image
              src="/images/organic-ball.png"
              alt="EV-A, una esfera orgánica de hebras entrelazadas de colores"
              width={420}
              height={420}
              priority
              className="h-56 w-56 object-contain sm:h-64 sm:w-64"
            />
          </div>
        </div>

        {/* top specular highlight */}
        <div
          aria-hidden
          className="absolute left-1/2 top-3 h-16 w-32 -translate-x-1/2 rounded-full blur-xl"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)" }}
        />
      </div>
    </div>
  )
}
