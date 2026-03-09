"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface MotionState {
  isMoving: boolean
  motionIntensity: number
  permissionGranted: boolean
  permissionDenied: boolean
  isSupported: boolean
  requestPermission: () => Promise<void>
}

export function useMotionDetection(threshold = 0.5): MotionState {
  const [isMoving, setIsMoving] = useState(false)
  const [motionIntensity, setMotionIntensity] = useState(0)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [isSupported, setIsSupported] = useState(true)

  const lastAcceleration = useRef({ x: 0, y: 0, z: 0 })
  const movementTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const supported =
      typeof window !== "undefined" && "DeviceMotionEvent" in window
    setIsSupported(supported)
  }, [])

  const handleMotion = useCallback(
    (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity

      if (!acceleration) return

      const deltaX = Math.abs(
        (acceleration.x || 0) - lastAcceleration.current.x
      )
      const deltaY = Math.abs(
        (acceleration.y || 0) - lastAcceleration.current.y
      )
      const deltaZ = Math.abs(
        (acceleration.z || 0) - lastAcceleration.current.z
      )

      const totalMotion = deltaX + deltaY + deltaZ

      lastAcceleration.current = {
        x: acceleration.x || 0,
        y: acceleration.y || 0,
        z: acceleration.z || 0,
      }

      // Smooth the intensity value
      setMotionIntensity((prev) => {
        const newIntensity = Math.min(totalMotion * 2, 100)
        return prev * 0.7 + newIntensity * 0.3
      })

      if (totalMotion > threshold) {
        setIsMoving(true)

        // Clear existing timeout
        if (movementTimeout.current) {
          clearTimeout(movementTimeout.current)
        }

        // Set timeout to detect when movement stops
        movementTimeout.current = setTimeout(() => {
          setIsMoving(false)
          setMotionIntensity(0)
        }, 200)
      }
    },
    [threshold]
  )

  const requestPermission = useCallback(async () => {
    if (
      typeof DeviceMotionEvent !== "undefined" &&
      // @ts-expect-error - requestPermission is only available on iOS 13+
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      try {
        // @ts-expect-error - requestPermission is only available on iOS 13+
        const permission = await DeviceMotionEvent.requestPermission()
        if (permission === "granted") {
          setPermissionGranted(true)
          setPermissionDenied(false)
          window.addEventListener("devicemotion", handleMotion)
        } else {
          setPermissionDenied(true)
        }
      } catch {
        setPermissionDenied(true)
      }
    } else {
      // Non-iOS devices don't need permission
      setPermissionGranted(true)
      window.addEventListener("devicemotion", handleMotion)
    }
  }, [handleMotion])

  useEffect(() => {
    return () => {
      window.removeEventListener("devicemotion", handleMotion)
      if (movementTimeout.current) {
        clearTimeout(movementTimeout.current)
      }
    }
  }, [handleMotion])

  return {
    isMoving,
    motionIntensity,
    permissionGranted,
    permissionDenied,
    isSupported,
    requestPermission,
  }
}
