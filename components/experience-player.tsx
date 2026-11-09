"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useMotionDetection } from "@/hooks/use-motion-detection"
import { SCENE_MAP } from "@/data/scenes"
import type { Branch } from "@/data/scenes"
import { HomeScreen } from "./home-screen"
import { StageScreen } from "./stage-screen"
import { SettingsPanel } from "./settings-panel"
import { Button } from "@/components/ui/button"

const BRANCH_ACCENTS: Record<Branch, string> = { mango: "#A6D63C", hongo: "#9B6BFF", abeja: "#F5A623", calamar: "#2EC4D6", guacharaca: "#D9694A", marmosa: "#F27BA8", humano: "#5B7CFA" }
const ROOT = "intro"

export function ExperiencePlayer() {
  const [sceneId, setSceneId] = useState(ROOT)
  const [isPlaying, setIsPlaying] = useState(true)
  const [muted, setMuted] = useState(false)
  const [ambientVolume, setAmbientVolume] = useState(0.4)
  const [motionSensitivity, setMotionSensitivity] = useState(0.6)
  const [branch, setBranch] = useState<Branch | undefined>()
  const [transcriptOpen, setTranscriptOpen] = useState(false)
  const [manualProgress, setManualProgress] = useState(0)
  const narrationRef = useRef<HTMLAudioElement | null>(null)
  const ambientRef = useRef<HTMLAudioElement | null>(null)
  const scene = SCENE_MAP[sceneId]
  const motion = useMotionDetection(motionSensitivity)
  const { isMoving, motionIntensity, permissionGranted, permissionDenied, isSupported, requestPermission } = motion

  useEffect(() => {
    const ambient = new Audio("/audio/cosmic-cloud.mp3")
    ambient.loop = true
    ambient.preload = "auto"
    ambientRef.current = ambient
    return () => { ambient.pause(); ambient.src = "" }
  }, [])
  useEffect(() => { if (ambientRef.current) ambientRef.current.volume = muted ? 0 : ambientVolume }, [muted, ambientVolume])
  useEffect(() => {
    if (!scene) return
    narrationRef.current?.pause()
    const narration = new Audio("/audio/narracion.mp3")
    narration.preload = "auto"
    narration.volume = muted ? 0 : 1
    narration.onerror = () => { if (typeof window !== "undefined" && "speechSynthesis" in window) { window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(scene.transcript.join(" ")); utterance.lang = "es-ES"; utterance.rate = 0.92; window.speechSynthesis.speak(utterance) } }
    narrationRef.current = narration
    return () => { narration.pause(); narration.src = ""; if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel() }
  }, [sceneId, muted])
  useEffect(() => {
    if (!permissionGranted || !ambientRef.current) return
    ambientRef.current.play().catch(() => {})
  }, [permissionGranted])
  useEffect(() => {
    const narration = narrationRef.current
    if (!narration || !scene || !isPlaying) return
    if (scene.interaction || scene.type === "narracion" || isMoving) { narration.volume = muted ? 0 : 1; narration.play().catch(() => {}) }
    else { narration.volume = muted ? 0 : 0.25; window.setTimeout(() => { if (narrationRef.current === narration && !isMoving) narration.pause() }, 3000) }
  }, [isMoving, isPlaying, muted, scene])
  useEffect(() => {
    if (!scene || !isPlaying || (scene.type !== "caminata" && scene.type !== "narracion") || !isMoving) return
    const timer = window.setTimeout(() => scene.next && setSceneId(scene.next), 7000)
    return () => window.clearTimeout(timer)
  }, [isMoving, isPlaying, scene])

  const goNext = useCallback(() => { if (scene?.next) setSceneId(scene.next) }, [scene])
  const choose = useCallback((next: string, selected?: Branch) => { if (selected) setBranch(selected); setSceneId(next) }, [])
  const restart = useCallback(() => { setSceneId(ROOT); setBranch(undefined); setManualProgress(0); setIsPlaying(true) }, [])
  const accent = branch ? BRANCH_ACCENTS[branch] : "var(--accent)"
  const sceneCount = useMemo(() => Object.keys(SCENE_MAP).indexOf(sceneId) + 1, [sceneId])

  if (!isSupported) return <div className="flex min-h-dvh items-center justify-center bg-background p-8 text-center"><p>Movimiento no disponible. Puedes usar el modo táctil para probar la experiencia.</p></div>
  if (!permissionGranted) return <HomeScreen onStart={() => { requestPermission(); setIsPlaying(true) }} permissionDenied={permissionDenied} />
  if (!scene) return null
  if (scene.type === "final") return <main className="flex min-h-dvh flex-col items-center justify-center bg-background p-8 text-center" style={{ "--branch-accent": accent } as React.CSSProperties}><h1 className="text-4xl font-bold" style={{ color: accent }}>Fin del camino</h1><p className="mt-4 max-w-sm text-lg">{scene.title} · {scene.subtitle}</p><Button onClick={restart} className="mt-8 rounded-full px-8">Volver a empezar</Button></main>

  const debug = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("debug") === "1"
  return <><StageScreen scene={scene} branch={branch} accent={accent} sceneCount={sceneCount} isPlaying={isPlaying} isMoving={isMoving} intensity={motionIntensity} transcriptOpen={transcriptOpen} onTranscriptOpenChange={setTranscriptOpen} onPrev={() => {}} onTogglePlay={() => setIsPlaying((value) => !value)} onNext={goNext} onChoose={choose} settingsSlot={<SettingsPanel muted={muted} onMutedChange={setMuted} ambientVolume={ambientVolume} onAmbientVolumeChange={setAmbientVolume} motionSensitivity={motionSensitivity} onMotionSensitivityChange={setMotionSensitivity} onRestart={restart} onGoHome={restart} progress={manualProgress} activePeriodIndex={scene.phase - 1} />} manualProgress={manualProgress} onManualProgressChange={setManualProgress} />{debug && <aside className="fixed bottom-2 left-2 z-50 rounded-lg bg-black/80 p-3 font-mono text-[10px] text-white">{motion.eventRate} eps · {motion.filteredMagnitude.toFixed(3)} filtrada · umbral {motion.threshold.toFixed(3)} · pasos {motion.stepCount} · {motion.isMoving ? "caminando" : "detenido"} · {motion.lastReason}</aside>}</>
}
