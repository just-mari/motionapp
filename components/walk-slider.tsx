"use client"

import { Slider } from "@/components/ui/slider"

interface WalkSliderProps {
  /** Evolution progress, 0..1. */
  value: number
  onValueChange: (value: number) => void
}

export function WalkSlider({ value, onValueChange }: WalkSliderProps) {
  return (
    <div className="w-full">
      <Slider
        value={[value]}
        onValueChange={(v) => onValueChange(v[0])}
        min={0}
        max={1}
        step={0.001}
        aria-label="Arrastra para simular tu avance al caminar"
      />
      <p className="mt-2 text-center text-xs italic text-foreground/60">arrastra para simular tu avance al caminar</p>
    </div>
  )
}
