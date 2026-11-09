"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type GenericAccelerometer = { x: number | null; y: number | null; z: number | null; start: () => void; stop: () => void; addEventListener: (type: string, listener: () => void) => void }
type SensorWindow = Window & { Accelerometer?: new (options: { frequency: number }) => GenericAccelerometer }
type MotionState = { isMoving: boolean; motionIntensity: number; permissionGranted: boolean; permissionDenied: boolean; isSupported: boolean; stepCount: number; eventRate: number; lastMagnitude: number; filteredMagnitude: number; threshold: number; lastReason: string; requestPermission: () => Promise<void> }

export function useMotionDetection(sensitivity = 0.6): MotionState {
  const [state, setState] = useState<MotionState>({ isMoving: false, motionIntensity: 0, permissionGranted: false, permissionDenied: false, isSupported: true, stepCount: 0, eventRate: 0, lastMagnitude: 0, filteredMagnitude: 0, threshold: 0.12, lastReason: "Esperando permiso" , requestPermission: async () => {}})
  const samples = useRef<number[]>([])
  const rotationSamples = useRef<number[]>([])
  const steps = useRef<number[]>([])
  const lastPeak = useRef(0)
  const previousMagnitude = useRef(0)
  const highPass = useRef(0)
  const lastEvent = useRef(0)
  const eventTimes = useRef<number[]>([])
  const wakeLock = useRef<WakeLockSentinel | null>(null)
  const genericSensor = useRef<GenericAccelerometer | null>(null)
  const listenersAttached = useRef(false)

  const processSample = useCallback((x: number, y: number, z: number, rotation = 0) => {
    const now = performance.now()
    const magnitude = Math.sqrt(x * x + y * y + z * z)
    const delta = Math.abs(magnitude - previousMagnitude.current)
    previousMagnitude.current = magnitude
    highPass.current = highPass.current * 0.85 + delta * 0.15
    samples.current = [...samples.current.slice(-59), highPass.current]
    rotationSamples.current = [...rotationSamples.current.slice(-59), rotation]
    const mean = samples.current.reduce((sum, value) => sum + value, 0) / samples.current.length
    const variance = samples.current.reduce((sum, value) => sum + (value - mean) ** 2, 0) / samples.current.length
    const rotationMean = rotationSamples.current.reduce((sum, value) => sum + value, 0) / rotationSamples.current.length
    const rotationVariance = rotationSamples.current.reduce((sum, value) => sum + (value - rotationMean) ** 2, 0) / rotationSamples.current.length
    const threshold = Math.max(0.12, mean + (1.65 - sensitivity) * Math.sqrt(variance))
    const isPeak = highPass.current > threshold && highPass.current >= (samples.current.at(-2) ?? 0) && now - lastPeak.current >= 250
    if (isPeak || rotationVariance > threshold * 2) { lastPeak.current = now; steps.current = [...steps.current.filter((time) => now - time < 1500), now] }
    steps.current = steps.current.filter((time) => now - time < 1500)
    eventTimes.current = [...eventTimes.current.filter((time) => now - time < 1000), now]
    const walking = steps.current.length >= 2
    setState((current) => ({ ...current, isMoving: walking, motionIntensity: Math.min(100, current.motionIntensity * 0.75 + Math.min(100, highPass.current * 90) * 0.25), stepCount: steps.current.length, eventRate: eventTimes.current.length, lastMagnitude: magnitude, filteredMagnitude: highPass.current, threshold, lastReason: walking !== current.isMoving ? (walking ? "2 pasos en 1,5 s" : "3 s sin pasos") : current.lastReason }))
  }, [sensitivity])

  const handleMotion = useCallback((event: DeviceMotionEvent) => { const a = event.accelerationIncludingGravity ?? event.acceleration; const r = event.rotationRate; if (a) processSample(a.x ?? 0, a.y ?? 0, a.z ?? 0, r ? Math.abs(r.alpha ?? 0) + Math.abs(r.beta ?? 0) + Math.abs(r.gamma ?? 0) : 0) }, [processSample])
  const attach = useCallback(() => { if (listenersAttached.current) return; window.addEventListener("devicemotion", handleMotion); listenersAttached.current = true }, [handleMotion])
  const requestPermission = useCallback(async () => {
    try {
      const motion = DeviceMotionEvent as typeof DeviceMotionEvent & { requestPermission?: () => Promise<string> }
      const orientation = DeviceOrientationEvent as typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> }
      if (motion.requestPermission && (await motion.requestPermission()) !== "granted") throw new Error("motion-denied")
      if (orientation.requestPermission && (await orientation.requestPermission()) !== "granted") throw new Error("orientation-denied")
      attach()
      if ("wakeLock" in navigator) wakeLock.current = await navigator.wakeLock.request("screen").catch(() => null)
      if (!("DeviceMotionEvent" in window)) { const Sensor = (window as SensorWindow).Accelerometer; if (Sensor) { const sensor = new Sensor({ frequency: 30 }); sensor.addEventListener("reading", () => processSample(sensor.x ?? 0, sensor.y ?? 0, sensor.z ?? 0)); sensor.start(); genericSensor.current = sensor } }
      setState((current) => ({ ...current, permissionGranted: true, permissionDenied: false, lastReason: "Permiso activo" }))
    } catch { setState((current) => ({ ...current, permissionDenied: true, permissionGranted: false, lastReason: "Permiso rechazado o perdido" })) }
  }, [attach, processSample])
  useEffect(() => { const visibility = () => { if (document.visibilityState === "visible" && state.permissionGranted) { attach(); navigator.wakeLock?.request("screen").then((lock) => { wakeLock.current = lock }).catch(() => {}) } }; document.addEventListener("visibilitychange", visibility); return () => { document.removeEventListener("visibilitychange", visibility); window.removeEventListener("devicemotion", handleMotion); genericSensor.current?.stop(); wakeLock.current?.release() } }, [attach, handleMotion, state.permissionGranted])
  return { ...state, requestPermission }
}
