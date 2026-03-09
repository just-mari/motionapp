"use client"

import { useEffect, useRef, useState } from "react"
import { useMotionDetection } from "@/hooks/use-motion-detection"
import { MotionVisualizer } from "./motion-visualizer"
import { IntensityBar } from "./intensity-bar"
import { Button } from "@/components/ui/button"

export function MotionPlayer() {
  const {
    isMoving,
    motionIntensity,
    permissionGranted,
    permissionDenied,
    isSupported,
    requestPermission,
  } = useMotionDetection(0.5)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Initialize audio
  useEffect(() => {
    const audio = new Audio("/audio/narracion.mp3")
    audio.loop = false
    audio.preload = "auto"

    audio.addEventListener("canplaythrough", () => setAudioLoaded(true))
    audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime))
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration))

    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ""
    }
  }, [])

  // Play/Pause based on motion
  useEffect(() => {
    if (!audioRef.current || !permissionGranted || !audioLoaded) return

    if (isMoving) {
      audioRef.current.play().catch(console.error)
    } else {
      audioRef.current.pause()
    }
  }, [isMoving, permissionGranted, audioLoaded])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (!isSupported) {
    return (
      <div className="min-h-dvh bg-background flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-destructive"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Motion Not Supported
        </h2>
        <p className="text-muted-foreground">
          Your device does not support motion detection.
        </p>
      </div>
    )
  }

  if (!permissionGranted) {
    return (
      <div className="min-h-dvh bg-background flex flex-col items-center justify-center p-8 text-center">
        <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-8 animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M12 2v4" />
            <path d="m16.2 7.8 2.9-2.9" />
            <path d="M18 12h4" />
            <path d="m16.2 16.2 2.9 2.9" />
            <path d="M12 18v4" />
            <path d="m4.9 19.1 2.9-2.9" />
            <path d="M2 12h4" />
            <path d="m4.9 4.9 2.9 2.9" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-3 text-balance">
          Enable Motion Detection
        </h1>

        <p className="text-muted-foreground mb-8 max-w-xs leading-relaxed">
          Allow motion access to control the audio with your movements.
        </p>

        {permissionDenied ? (
          <div className="text-destructive text-sm">
            Permission denied. Please enable motion in your browser settings.
          </div>
        ) : (
          <Button
            onClick={requestPermission}
            size="lg"
            className="px-8 py-6 text-lg rounded-full"
          >
            Start Experience
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-between py-12 px-6">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">
          Motion Sound
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isMoving ? "Playing..." : "Move to play"}
        </p>
      </header>

      {/* Main Visualizer */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <MotionVisualizer isMoving={isMoving} intensity={motionIntensity} />

        <div
          className={`text-4xl font-bold transition-colors duration-300 ${
            isMoving ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {isMoving ? "PLAYING" : "PAUSED"}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="w-full flex flex-col gap-6">
        <IntensityBar intensity={motionIntensity} isMoving={isMoving} />

        {/* Progress Bar */}
        <div className="flex flex-col gap-2 px-4">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-100"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                audioLoaded ? "bg-accent" : "bg-muted animate-pulse"
              }`}
            />
            <span className="text-xs text-muted-foreground">
              {audioLoaded ? "Audio Ready" : "Loading..."}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isMoving ? "bg-primary animate-pulse" : "bg-muted"
              }`}
            />
            <span className="text-xs text-muted-foreground">Motion</span>
          </div>
        </div>
      </div>
    </div>
  )
}
