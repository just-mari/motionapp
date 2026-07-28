"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useMotionDetection } from "@/hooks/use-motion-detection"
import { STAGES } from "@/lib/stages"
import { periodIndexFromProgress } from "@/lib/timeline"
import { HomeScreen } from "./home-screen"
import { StageScreen } from "./stage-screen"
import { SettingsPanel } from "./settings-panel"
import { Button } from "@/components/ui/button"

type Phase = "home" | "experience" | "complete"

/** Time (ms) of sustained movement needed to advance one stage. */
const STAGE_ADVANCE_MS = 6000
const LEN = STAGES.length
/** Highest progress motion alone can reach (keeps player on the final stage). */
const MAX_MOTION_PROGRESS = (LEN - 0.02) / LEN

/** Center of a stage's band, so flooring maps back to the same index. */
function stageToProgress(i: number) {
  return (i + 0.5) / LEN
}
function progressToStage(p: number) {
  return Math.min(LEN - 1, Math.max(0, Math.floor(p * LEN)))
}

export function ExperiencePlayer() {
  const [phase, setPhase] = useState<Phase>("home")
  const [walkProgress, setWalkProgress] = useState(stageToProgress(0))
  const [isPlaying, setIsPlaying] = useState(true)
  const [muted, setMuted] = useState(false)
  const [ambientVolume, setAmbientVolume] = useState(0.4)
  const [motionSensitivity, setMotionSensitivity] = useState(0.6)

  const stageIndex = progressToStage(walkProgress)
  const activePeriodIndex = periodIndexFromProgress(walkProgress)

  const { isMoving, motionIntensity, permissionGranted, permissionDenied, isSupported, requestPermission } =
    useMotionDetection(motionSensitivity)

  const narrationRef = useRef<HTMLAudioElement | null>(null)
  const ambient1Ref = useRef<HTMLAudioElement | null>(null)
  const ambient2Ref = useRef<HTMLAudioElement | null>(null)
  const ambientStartedRef = useRef(false)

  // ---- audio setup ----
  useEffect(() => {
    const narration = new Audio("/audio/narracion.mp3")
    narration.preload = "auto"
    narrationRef.current = narration

    const ambient1 = new Audio("/audio/cosmic-cloud.mp3")
    ambient1.loop = true
    ambient1Ref.current = ambient1

    const ambient2 = new Audio("/audio/cosmic-guitar.mp3")
    ambient2.loop = true
    ambient2Ref.current = ambient2

    return () => {
      ;[narration, ambient1, ambient2].forEach((a) => {
        a.pause()
        a.src = ""
      })
    }
  }, [])

  // ---- apply volume / mute ----
  useEffect(() => {
    if (ambient1Ref.current) ambient1Ref.current.volume = muted ? 0 : ambientVolume
    if (ambient2Ref.current) ambient2Ref.current.volume = muted ? 0 : ambientVolume * 0.7
    if (narrationRef.current) narrationRef.current.volume = muted ? 0 : 1
  }, [muted, ambientVolume])

  // ---- start ambient once we enter the experience ----
  useEffect(() => {
    if (phase !== "experience" || ambientStartedRef.current) return
    ambientStartedRef.current = true
    ambient1Ref.current?.play().catch(() => {})
    ambient2Ref.current?.play().catch(() => {})
  }, [phase])

  // ---- narration follows movement + play state ----
  useEffect(() => {
    const narration = narrationRef.current
    if (!narration || phase !== "experience") return
    if (isPlaying && isMoving) {
      narration.play().catch(() => {})
    } else {
      narration.pause()
    }
  }, [isPlaying, isMoving, phase])

  // ---- movement drives the walk progress: move to evolve ----
  useEffect(() => {
    if (phase !== "experience" || !isPlaying) return

    let raf = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = now - last
      last = now
      if (isMoving) {
        const factor = 0.6 + Math.min(motionIntensity, 100) / 100
        const delta = (dt * factor) / (STAGE_ADVANCE_MS * LEN)
        setWalkProgress((p) => Math.min(MAX_MOTION_PROGRESS, p + delta))
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase, isPlaying, isMoving, motionIntensity])

  // ---- handlers ----
  const handleStart = useCallback(async () => {
    await requestPermission()
    setWalkProgress(stageToProgress(0))
    setIsPlaying(true)
    setPhase("experience")
  }, [requestPermission])

  const handlePrev = useCallback(() => {
    setWalkProgress((p) => stageToProgress(Math.max(0, progressToStage(p) - 1)))
  }, [])

  const handleNext = useCallback(() => {
    setWalkProgress((p) => {
      const cur = progressToStage(p)
      if (cur >= LEN - 1) {
        setPhase("complete")
        return p
      }
      return stageToProgress(cur + 1)
    })
  }, [])

  const handleWalkProgressChange = useCallback((value: number) => {
    setWalkProgress(Math.min(MAX_MOTION_PROGRESS, Math.max(0, value)))
  }, [])

  const handleGoHome = useCallback(() => {
    setPhase("home")
    ambientStartedRef.current = false
    ambient1Ref.current?.pause()
    ambient2Ref.current?.pause()
    narrationRef.current?.pause()
  }, [])

  const handleRestart = useCallback(() => {
    setWalkProgress(stageToProgress(0))
    setIsPlaying(true)
    setPhase("experience")
    if (narrationRef.current) narrationRef.current.currentTime = 0
  }, [])

  // ---- unsupported device ----
  if (!isSupported) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-8 text-center">
        <h2 className="font-sans text-2xl font-bold text-foreground">Movimiento no disponible</h2>
        <p className="mt-3 text-pretty text-muted-foreground">
          Tu dispositivo no admite la detección de movimiento necesaria para esta experiencia.
        </p>
      </div>
    )
  }

  if (phase === "home" || !permissionGranted) {
    return <HomeScreen onStart={handleStart} permissionDenied={permissionDenied} />
  }

  if (phase === "complete") {
    return (
      <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-8 text-center">
        <div className="ce-fade-up flex flex-col items-center">
          <h2
            className="font-sans text-4xl font-extrabold text-balance"
            style={{ color: "var(--brand-yellow)", textShadow: "0 0 24px rgba(244,224,40,0.4)" }}
          >
            Fin del camino
          </h2>
          <p className="mt-5 max-w-sm text-pretty font-serif text-xl italic text-foreground/90">
            Has recorrido la evolución de la vida orgánica.
          </p>
          <Button
            onClick={handleRestart}
            className="mt-10 rounded-full bg-primary px-10 py-6 font-sans text-lg font-bold text-primary-foreground hover:bg-primary/90"
          >
            Volver a empezar
          </Button>
        </div>
      </main>
    )
  }

  const stage = STAGES[stageIndex]

  return (
    <StageScreen
      stage={stage}
      isPlaying={isPlaying}
      isMoving={isMoving}
      intensity={motionIntensity}
      onPrev={handlePrev}
      onTogglePlay={() => setIsPlaying((p) => !p)}
      onNext={handleNext}
      onSkip={handleNext}
      canPrev={stageIndex > 0}
      canNext={stageIndex < LEN - 1}
      activePeriodIndex={activePeriodIndex}
      walkProgress={walkProgress}
      onWalkProgressChange={handleWalkProgressChange}
      settingsSlot={
        <SettingsPanel
          muted={muted}
          onMutedChange={setMuted}
          ambientVolume={ambientVolume}
          onAmbientVolumeChange={setAmbientVolume}
          motionSensitivity={motionSensitivity}
          onMotionSensitivityChange={setMotionSensitivity}
          onRestart={handleRestart}
          onGoHome={handleGoHome}
          progress={walkProgress}
          activePeriodIndex={activePeriodIndex}
        />
      }
    />
  )
}
