"use client"

import { useEffect, useRef, useState } from "react"
import { PERIODS } from "@/lib/timeline"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface TimelineScaleProps {
  /** Index of the currently active evolutionary period. */
  activeIndex: number
}

export function TimelineScale({ activeIndex }: TimelineScaleProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const rowRef = useRef<HTMLDivElement | null>(null)
  const activeRef = useRef<HTMLButtonElement | null>(null)

  // keep the active period scrolled into view
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  }, [activeIndex])

  const active = PERIODS[Math.min(activeIndex, PERIODS.length - 1)]

  return (
    <div className="w-full">
      {/* header: active milestone */}
      <div className="px-1 text-center">
        <p className="truncate font-serif text-base italic text-foreground">{active.title}</p>
        <p className="text-xs font-medium text-foreground/60">
          {active.ma > 0 ? `hace ${active.ma.toLocaleString("es")} millones de años` : "hasta el presente"}
        </p>
      </div>

      {/* scrollable icon axis */}
      <div
        ref={rowRef}
        className="mt-2 flex items-start gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {PERIODS.map((p, i) => {
          const Icon = p.icon
          const isActive = i === activeIndex
          const isPast = i < activeIndex
          return (
            <div key={p.id} className="flex shrink-0 flex-col items-center" style={{ width: 66 }}>
              <span className="mb-1 text-[10px] font-semibold tabular-nums text-foreground/50">{p.maLabel}</span>
              <button
                ref={isActive ? activeRef : undefined}
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={`${p.title}. ${p.maLabel}. Toca para más información`}
                className={[
                  "relative flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200",
                  isActive
                    ? "border-accent bg-accent/15 text-accent shadow-[0_0_18px] shadow-accent/40 scale-110"
                    : isPast
                      ? "border-foreground/25 bg-foreground/10 text-foreground/70"
                      : "border-foreground/15 bg-foreground/5 text-foreground/40",
                ].join(" ")}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-full ring-2 ring-accent/50 ce-fade-in" aria-hidden />
                )}
                <Icon className="h-5 w-5" strokeWidth={2} />
              </button>
              <span className="mt-1 line-clamp-2 text-center text-[9px] leading-tight text-foreground/55">
                {p.title}
              </span>
            </div>
          )
        })}
      </div>

      {/* per-period info */}
      <Dialog open={openIndex !== null} onOpenChange={(o) => !o && setOpenIndex(null)}>
        <DialogContent className="max-w-sm border-border/50 bg-card/95 backdrop-blur-xl">
          {openIndex !== null && (
            <DialogHeader>
              <div className="mb-2 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-accent">
                  {(() => {
                    const Icon = PERIODS[openIndex].icon
                    return <Icon className="h-5 w-5" />
                  })()}
                </span>
                <span className="text-sm font-semibold tabular-nums text-muted-foreground">
                  {PERIODS[openIndex].maLabel}
                </span>
              </div>
              <DialogTitle className="text-left font-sans text-xl font-bold">{PERIODS[openIndex].title}</DialogTitle>
              <DialogDescription className="text-pretty text-left text-sm leading-relaxed text-foreground/80">
                {PERIODS[openIndex].description}
              </DialogDescription>
            </DialogHeader>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
