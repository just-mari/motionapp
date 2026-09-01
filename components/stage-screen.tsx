"use client"

import type { Stage } from "@/lib/stages"
import { MeshBackground } from "./mesh-background"
import { OrganicSphere } from "./organic-sphere"
import { PlaybackControls } from "./playback-controls"
import { TimelineScale } from "./timeline-scale"
import { WalkSlider } from "./walk-slider"
import { CameraCapture } from "./camera-capture"

interface StageScreenProps {
  stage: Stage
  isPlaying: boolean
  isMoving: boolean
  intensity: number
  onPrev: () => void
  onTogglePlay: () => void
  onNext: () => void
  onSkip: () => void
  canPrev: boolean
  canNext: boolean
  settingsSlot: React.ReactNode
  activePeriodIndex: number
  walkProgress: number
  onWalkProgressChange: (value: number) => void
}

function UpArrow({ active }: { active: boolean }) {
  return (
    <div className={active ? "ce-animate-arrow" : undefined}>
      <svg
        width="150"
        height="200"
        viewBox="0 0 150 200"
        fill="none"
        aria-hidden
        style={{ filter: "drop-shadow(0 12px 30px rgba(0,0,0,0.45))" }}
      >
        <path
          d="M75 8 L142 90 a10 10 0 0 1 -8 16 H104 V184 a10 10 0 0 1 -10 10 H56 a10 10 0 0 1 -10 -10 V106 H16 a10 10 0 0 1 -8 -16 Z"
          fill="#ffffff"
        />
      </svg>
    </div>
  )
}

export function StageScreen({
  stage,
  isPlaying,
  isMoving,
  intensity,
  onPrev,
  onTogglePlay,
  onNext,
  onSkip,
  canPrev,
  canNext,
  settingsSlot,
  activePeriodIndex,
  walkProgress,
  onWalkProgressChange,
}: StageScreenProps) {
  const isCamera = stage.visual === "camera"

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden">
      <MeshBackground variant={stage.background} vignette={stage.vignette} active={isMoving} />

      {/* top bar: timeline scale + gear */}
      <header className="relative z-20 px-3 pt-4">
        <div className="mb-2 flex justify-end">{settingsSlot}</div>
        <TimelineScale activeIndex={activePeriodIndex} />
      </header>

      {/* central visual */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-4">
        {stage.visual === "sphere" && (
          <div key={`sphere-${stage.id}`} className="ce-fade-in">
            <OrganicSphere intensity={intensity} active={isMoving} />
          </div>
        )}
        {stage.visual === "arrow" && (
          <div key={`arrow-${stage.id}`} className="ce-fade-in">
            <UpArrow active={isMoving} />
          </div>
        )}
        {isCamera && (
          <div key={`camera-${stage.id}`} className="ce-fade-in flex w-full justify-center">
            <CameraCapture onCaptured={onNext} />
          </div>
        )}
      </div>

      {/* narration + controls */}
      <div className="relative z-10 flex flex-col items-center gap-5 px-8 pb-6">
        <p
          key={`text-${stage.id}`}
          className="ce-fade-up max-w-md text-balance text-center font-serif text-2xl italic leading-snug text-foreground"
        >
          {stage.text}
        </p>

        <PlaybackControls
          isPlaying={isPlaying}
          onPrev={onPrev}
          onTogglePlay={onTogglePlay}
          onNext={onNext}
          canPrev={canPrev}
          canNext={canNext}
        />

        {!stage.interactive && (
          <button
            type="button"
            onClick={onSkip}
            className="rounded-full bg-teal px-10 py-2.5 font-sans text-base font-bold text-teal-foreground shadow-lg shadow-teal/20 transition-transform duration-150 hover:scale-105 active:scale-95"
          >
            Skip
          </button>
        )}

        {/* bottom time scale: walk-to-evolve slider */}
        <div className="mt-1 w-full max-w-md">
          <WalkSlider value={walkProgress} onValueChange={onWalkProgressChange} />
        </div>
      </div>
    </main>
  )
}
