"use client"

import { Pause, Play, StepBack, StepForward } from "lucide-react"

interface PlaybackControlsProps {
  isPlaying: boolean
  onPrev: () => void
  onTogglePlay: () => void
  onNext: () => void
  canPrev: boolean
  canNext: boolean
}

export function PlaybackControls({
  isPlaying,
  onPrev,
  onTogglePlay,
  onNext,
  canPrev,
  canNext,
}: PlaybackControlsProps) {
  return (
    <div className="flex items-center justify-center gap-10">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Anterior"
        className="text-accent transition-transform duration-150 hover:scale-110 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
      >
        <StepBack className="h-9 w-9" fill="currentColor" strokeWidth={1.5} />
      </button>

      <button
        type="button"
        onClick={onTogglePlay}
        aria-label={isPlaying ? "Pausar" : "Reproducir"}
        className="text-accent transition-transform duration-150 hover:scale-110 active:scale-95"
      >
        {isPlaying ? (
          <Pause className="h-14 w-14 rounded-full border-[3px] border-accent p-3" fill="currentColor" strokeWidth={0} />
        ) : (
          <Play className="h-14 w-14 rounded-full border-[3px] border-accent p-3 pl-4" fill="currentColor" strokeWidth={0} />
        )}
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        aria-label="Siguiente"
        className="text-accent transition-transform duration-150 hover:scale-110 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
      >
        <StepForward className="h-9 w-9" fill="currentColor" strokeWidth={1.5} />
      </button>
    </div>
  )
}
