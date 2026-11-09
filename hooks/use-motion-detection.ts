"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type GenericAccelerometer = { x: number | null; y: number | null; z: number | null; start: () => void; stop: () => void; addEventListener: (type: string, listener: () => void) => void }
type SensorWindow = Window & { Accelerometer?: new (options: { frequency: number }) => GenericAccelerometer }

interface MotionState { isMoving: boolean; motionIntensity: number; permissionGranted: boolean; permissionDenied: boolean; isSupported: boolean; stepCount: number; eventRate: number; lastMagnitude: number; requestPermission: () => Promise<void> }

export function useMotionDetection(sensitivity = 0.6): MotionState {
  const [state, setState] = useState({ isMoving: false, motionIntensity: 0, permissionGranted: false, permissionDenied: false, isSupported: true, stepCount: 0, eventRate: 0, lastMagnitude: 0 })
  const samples = useRef<number[]>([])
  const steps = useRef<number[]>([])
  const lastPeak = useRef(0)
  const lastEvent = useRef(0)
  const eventTimes = useRef<number[]>([])
  const wakeLock = useRef<WakeLockSentinel | null>(null)
  const genericSensor = useRef<GenericAccelerometer | null>(null)

  const processMagnitude = useCallback((x: number, y: number, z: number) => {
    const now = performance.now()
    const magnitude = Math.sqrt(x * x + y * y + z * z)
    const delta = Math.abs(magnitude - (lastEvent.current || magnitude))
    lastEvent.current = magnitude
    samples.current = [...samples.current.slice(-59), delta]
    const mean = samples.current.reduce((sum, value) => sum + value, 0) / samples.current.length
    const variance = samples.current.reduce((sum, value) => sum + (value - mean) ** 2, 0) / samples.current.length
    const threshold = Math.max(0.12, mean + (1.35 - sensitivity) * Math.sqrt(variance))
    const previous = samples.current.at(-2) ?? 0
    const isPeak = delta > threshold && delta >= previous && now - lastPeak.current > 300
    if (isPeak) { lastPeak.current = now; steps.current = [...steps.current.filter((time) => now - time < 2500), now] }
    steps.current = steps.current.filter((time) => now - time < 2500)
    eventTimes.current = [...eventTimes.current.filter((time) => now - time < 1000), now]
    setState((current) => ({ ...current, isMoving: steps.current.length >= 2, motionIntensity: Math.min(100, current.motionIntensity * 0.75 + Math.min(100, delta * 90) * 0.25), stepCount: steps.current.length, eventRate: eventTimes.current.length, lastMagnitude: magnitude }))
  }, [sensitivity])

  const handleMotion = useCallback((event: DeviceMotionEvent) => {
    const acceleration = event.accelerationIncludingGravity ?? event.acceleration
    if (acceleration) processMagnitude(acceleration.x ?? 0, acceleration.y ?? 0, acceleration.z ?? 0)
  }, [processMagnitude])

  const requestPermission = useCallback(async () => {
    try {
      const motion = DeviceMotionEvent as typeof DeviceMotionEvent & { requestPermission?: () => Promise<string> }
      const orientation = DeviceOrientationEvent as typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> }
      if (motion.requestPermission && (await motion.requestPermission()) !== "granted") throw new Error("motion-denied")
      if (orientation.requestPermission && (await orientation.requestPermission()) !== "granted") throw new Error("orientation-denied")
      window.addEventListener("devicemotion", handleMotion)
      setState((current) => ({ ...current, permissionGranted: true, permissionDenied: false }))
      if ("wakeLock" in navigator) wakeLock.current = await navigator.wakeLock.request("screen").catch(() => null)
      if (!("DeviceMotionEvent" in window)) {
        const Sensor = (window as SensorWindow).Accelerometer
        if (Sensor) { const sensor = new Sensor({ frequency: 30 }); sensor.addEventListener("reading", () => processMagnitude(sensor.x ?? 0, sensor.y ?? 0, sensor.z ?? 0)); sensor.start(); genericSensor.current = sensor }
      }
    } catch { setState((current) => ({ ...current, permissionDenied: true })) }
  }, [handleMotion, processMagnitude])

  useEffect(() => () => { window.removeEventListener("devicemotion", handleMotion); genericSensor.current?.stop(); wakeLock.current?.release() }, [handleMotion])
  return { ...state, requestPermission }
}
