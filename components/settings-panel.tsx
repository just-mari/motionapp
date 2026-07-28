"use client"

import { useState } from "react"
import {
  Settings,
  Volume2,
  VolumeX,
  RotateCcw,
  Activity,
  Home,
  LineChart,
  Award,
  Info,
  BookMarked,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { PERIODS } from "@/lib/timeline"

type View = "menu" | "recorrido" | "evoluciones" | "sonido" | "acerca" | "fuentes" | "ajustes"

interface SettingsPanelProps {
  muted: boolean
  onMutedChange: (muted: boolean) => void
  ambientVolume: number
  onAmbientVolumeChange: (value: number) => void
  motionSensitivity: number
  onMotionSensitivityChange: (value: number) => void
  onRestart: () => void
  onGoHome: () => void
  /** 0..1 evolution progress. */
  progress: number
  /** Index of the currently reached evolutionary period. */
  activePeriodIndex: number
}

const SOURCES = [
  "Timeline of the evolutionary history of life — Wikipedia",
  "Great Oxidation Event — Nature Reviews",
  "The Cambrian Explosion — Smithsonian Institution",
  "Permian–Triassic extinction — Science",
  "Chicxulub impact — NASA Earth Observatory",
]

export function SettingsPanel({
  muted,
  onMutedChange,
  ambientVolume,
  onAmbientVolumeChange,
  motionSensitivity,
  onMotionSensitivityChange,
  onRestart,
  onGoHome,
  progress,
  activePeriodIndex,
}: SettingsPanelProps) {
  const [view, setView] = useState<View>("menu")
  const percent = Math.round(Math.min(1, Math.max(0, progress)) * 100)

  const handleShare = async () => {
    const data = {
      title: "Camino Evolutivo",
      text: "Camina y evoluciona: recorre la historia de la vida orgánica.",
      url: typeof window !== "undefined" ? window.location.href : "",
    }
    try {
      if (navigator.share) await navigator.share(data)
      else if (navigator.clipboard) await navigator.clipboard.writeText(data.url)
    } catch {
      /* user cancelled */
    }
  }

  function MenuItem({
    icon: Icon,
    label,
    active,
    onClick,
    hasChevron,
  }: {
    icon: typeof Home
    label: string
    active?: boolean
    onClick: () => void
    hasChevron?: boolean
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={[
          "flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-colors",
          active ? "bg-accent/15 text-accent" : "text-foreground hover:bg-foreground/5",
        ].join(" ")}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span className="flex-1 text-[15px] font-medium">{label}</span>
        {hasChevron && <ChevronRight className="h-4 w-4 text-foreground/30" />}
      </button>
    )
  }

  const titles: Record<Exclude<View, "menu">, string> = {
    recorrido: "Mi recorrido",
    evoluciones: "Evoluciones logradas",
    sonido: "Sonido",
    acerca: "Acerca de EV-A",
    fuentes: "Fuentes científicas",
    ajustes: "Ajustes",
  }

  return (
    <Sheet onOpenChange={(o) => !o && setView("menu")}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Menú"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-150 hover:scale-105 active:scale-95"
        >
          <Settings className="h-6 w-6" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[86%] max-w-sm border-border/40 bg-card/95 p-0 backdrop-blur-xl">
        {/* header */}
        <SheetHeader className="border-b border-border/40 px-5 pb-4 pt-5">
          {view === "menu" ? (
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/40 to-primary/40 text-lg font-bold text-foreground">
                EV
              </span>
              <div className="min-w-0 flex-1">
                <SheetTitle className="font-serif text-lg italic tracking-wide">EV-A</SheetTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">{percent}% del camino a Homo sapiens</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
                  <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${percent}%` }} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setView("menu")}
                aria-label="Volver"
                className="flex h-8 w-8 items-center justify-center rounded-full text-foreground hover:bg-foreground/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <SheetTitle className="font-sans text-lg font-bold">{titles[view]}</SheetTitle>
            </div>
          )}
        </SheetHeader>

        <ScrollArea className="h-[calc(100dvh-6rem)]">
          {view === "menu" && (
            <nav className="flex flex-col gap-1 p-3">
              <SheetClose asChild>
                <MenuItem icon={Home} label="inicio" active onClick={onGoHome} />
              </SheetClose>
              <MenuItem icon={LineChart} label="mi recorrido" onClick={() => setView("recorrido")} hasChevron />
              <MenuItem icon={Award} label="evoluciones logradas" onClick={() => setView("evoluciones")} hasChevron />

              <div className="my-2 h-px bg-border/40" />

              <MenuItem icon={muted ? VolumeX : Volume2} label="sonido" onClick={() => setView("sonido")} hasChevron />
              <MenuItem icon={Info} label="acerca de EV-A" onClick={() => setView("acerca")} hasChevron />
              <MenuItem icon={BookMarked} label="fuentes científicas" onClick={() => setView("fuentes")} hasChevron />
              <MenuItem icon={Settings} label="ajustes" onClick={() => setView("ajustes")} hasChevron />

              <div className="my-2 h-px bg-border/40" />

              <MenuItem icon={Share2} label="compartir la app" onClick={handleShare} />
            </nav>
          )}

          {view === "recorrido" && (
            <div className="flex flex-col gap-3 p-5">
              <p className="text-sm text-muted-foreground">
                Vas por <span className="font-semibold text-accent">{PERIODS[activePeriodIndex]?.title}</span>. Este es
                el camino que has recorrido:
              </p>
              <ol className="flex flex-col gap-2">
                {PERIODS.map((p, i) => {
                  const reached = i <= activePeriodIndex
                  const Icon = p.icon
                  return (
                    <li
                      key={p.id}
                      className={[
                        "flex items-center gap-3 rounded-xl border px-3 py-2.5",
                        reached ? "border-accent/40 bg-accent/10" : "border-border/40 opacity-50",
                      ].join(" ")}
                    >
                      <Icon className={`h-5 w-5 ${reached ? "text-accent" : "text-muted-foreground"}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.maLabel}</p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          )}

          {view === "evoluciones" && (
            <div className="flex flex-col gap-3 p-5">
              <p className="text-sm text-muted-foreground">
                Has desbloqueado{" "}
                <span className="font-semibold text-accent">
                  {activePeriodIndex + 1} de {PERIODS.length}
                </span>{" "}
                hitos evolutivos.
              </p>
              <div className="flex flex-col gap-2">
                {PERIODS.slice(0, activePeriodIndex + 1).map((p) => {
                  const Icon = p.icon
                  return (
                    <div key={p.id} className="flex items-center gap-3 rounded-xl bg-accent/10 px-3 py-2.5">
                      <Award className="h-4 w-4 text-accent" />
                      <Icon className="h-5 w-5 text-accent" />
                      <span className="flex-1 text-sm font-medium text-foreground">{p.title}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {view === "sonido" && (
            <div className="flex flex-col gap-8 p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {muted ? (
                    <VolumeX className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-accent" />
                  )}
                  <span className="text-sm font-medium text-foreground">Silenciar</span>
                </div>
                <Switch checked={muted} onCheckedChange={onMutedChange} />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Volumen ambiental</span>
                  <span className="text-xs text-muted-foreground">{Math.round(ambientVolume * 100)}%</span>
                </div>
                <Slider
                  value={[ambientVolume]}
                  onValueChange={(v) => onAmbientVolumeChange(v[0])}
                  min={0}
                  max={1}
                  step={0.05}
                  disabled={muted}
                />
              </div>
            </div>
          )}

          {view === "ajustes" && (
            <div className="flex flex-col gap-8 p-5">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-accent" />
                    <span className="text-sm font-medium text-foreground">Sensibilidad de movimiento</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{motionSensitivity.toFixed(1)}</span>
                </div>
                <Slider
                  value={[motionSensitivity]}
                  onValueChange={(v) => onMotionSensitivityChange(v[0])}
                  min={0.2}
                  max={3}
                  step={0.1}
                />
                <p className="text-pretty text-xs leading-relaxed text-muted-foreground">
                  Más bajo = más sensible. Mueve tu teléfono para avanzar la narración.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={onRestart}
                className="w-full gap-2 rounded-full border-border/60 bg-transparent"
              >
                <RotateCcw className="h-4 w-4" />
                Reiniciar simulación
              </Button>
            </div>
          )}

          {view === "acerca" && (
            <div className="flex flex-col gap-4 p-5 text-sm leading-relaxed text-foreground/85">
              <p>
                <span className="font-serif text-lg italic text-accent">EV-A</span> es tu guía a través de la evolución
                de la vida orgánica. A medida que caminas, EV-A evoluciona contigo: si te mueves, avanzas por el tiempo;
                si te detienes, la narración se detiene.
              </p>
              <p>
                Cada etapa representa un momento clave, desde el origen de la vida hace 3800 millones de años hasta la
                aparición del Homo sapiens.
              </p>
              <p className="text-xs text-muted-foreground">Camino Evolutivo · experiencia interactiva</p>
            </div>
          )}

          {view === "fuentes" && (
            <div className="flex flex-col gap-3 p-5">
              <p className="text-sm text-muted-foreground">
                La línea de tiempo se basa en el consenso científico actual. Algunas referencias:
              </p>
              <ul className="flex flex-col gap-2">
                {SOURCES.map((s) => (
                  <li key={s} className="flex items-start gap-2 rounded-lg bg-foreground/5 px-3 py-2 text-sm">
                    <BookMarked className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span className="text-foreground/85">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
