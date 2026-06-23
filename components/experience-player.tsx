"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useMotionDetection } from "@/hooks/use-motion-detection"
import { STAGES } from "@/lib/stages"
import { HomeScreen } from "./home-screen"
import { StageScreen } from "./stage-screen"
import { SettingsPanel } from "./settings-panel"
import { Button } from "@/components/ui/button"

type Phase = "home" | "experience" | "complete"

/** Time (ms) of sustained movement needed to advance one stage. */
const STAGE_ADVANCE_MS = 6000

export function ExperiencePlayer() {
  const [phase, setPhase] = useState<Phase>("home")
  const [stageIndex, setStageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [muted, setMuted] = useState(false)
  const [ambientVolume, setAmbientVolume] = useState(0.4)
  const [motionSensitivity, setMotionSensitivity] = useState(0.6)

  const { isMoving, motionIntensity, permissionGranted, permissionDenied, isSupported, requestPermission } =
    useMotionDetection(motionSensitivity)

  const narrationRef = useRef<HTMLAudioElement | null>(null)
  const ambient1Ref = useRef<HTMLAudioElement | null>(null)
  const ambient2Ref = useRef<HTMLAudioElement | null>(null)
  const progressRef = useRef(0)
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

  // ---- movement-driven stage progression ----
  useEffect(() => {
    if (phase !== "experience" || !isPlaying) return

    let raf = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = now - last
      last = now
      if (isMoving) {
        // faster progress with stronger movement
        const factor = 0.6 + Math.min(motionIntensity, 100) / 100
        progressRef.current += dt * factor
        if (progressRef.current >= STAGE_ADVANCE_MS) {
          progressRef.current = 0
          setStageIndex((i) => {
            if (i >= STAGES.length - 1) {
              setPhase("complete")
              return i
            }
            return i + 1
          })
        }
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase, isPlaying, isMoving, motionIntensity])

  // ---- handlers ----
  const handleStart = useCallback(async () => {
    await requestPermission()
    progressRef.current = 0
    setStageIndex(0)
    setIsPlaying(true)
    setPhase("experience")
  }, [requestPermission])

  const handlePrev = useCallback(() => {
    progressRef.current = 0
    setStageIndex((i) => Math.max(0, i - 1))
  }, [])

  const handleNext = useCallback(() => {
    progressRef.current = 0
    setStageIndex((i) => {
      if (i >= STAGES.length - 1) {
        setPhase("complete")
        return i
      }
      return i + 1
    })
  }, [])

  const handleRestart = useCallback(() => {
    progressRef.current = 0
    setStageIndex(0)
    setIsPlaying(true)
    setPhase("experience")
    if (narrationRef.current) {
      narrationRef.current.currentTime = 0
    }
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
      canNext={stageIndex < STAGES.length - 1}
      settingsSlot={
        <SettingsPanel
          muted={muted}
          onMutedChange={setMuted}
          ambientVolume={ambientVolume}
          onAmbientVolumeChange={setAmbientVolume}
          motionSensitivity={motionSensitivity}
          onMotionSensitivityChange={setMotionSensitivity}
          onRestart={handleRestart}
        />
      }
    />
  )
}
