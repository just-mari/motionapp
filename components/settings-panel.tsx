"use client"

import { Settings, Volume2, VolumeX, RotateCcw, Activity } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface SettingsPanelProps {
  muted: boolean
  onMutedChange: (muted: boolean) => void
  ambientVolume: number
  onAmbientVolumeChange: (value: number) => void
  motionSensitivity: number
  onMotionSensitivityChange: (value: number) => void
  onRestart: () => void
}

export function SettingsPanel({
  muted,
  onMutedChange,
  ambientVolume,
  onAmbientVolumeChange,
  motionSensitivity,
  onMotionSensitivityChange,
  onRestart,
}: SettingsPanelProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Ajustes"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-150 hover:scale-105 active:scale-95"
        >
          <Settings className="h-6 w-6" />
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[88%] max-w-sm border-border/40 bg-card/95 backdrop-blur-xl">
        <SheetHeader>
          <SheetTitle className="font-sans text-xl font-bold tracking-tight">Ajustes</SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex flex-col gap-8 px-1">
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
            className="mt-2 w-full gap-2 rounded-full border-border/60 bg-transparent"
          >
            <RotateCcw className="h-4 w-4" />
            Reiniciar simulación
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
