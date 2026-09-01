"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Camera, RefreshCw, Sun } from "lucide-react"

interface CameraCaptureProps {
  /** Fired once the player has captured their photo of the sun. */
  onCaptured?: () => void
}

type CamState = "idle" | "requesting" | "streaming" | "captured" | "denied" | "unsupported"

export function CameraCapture({ onCaptured }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [state, setState] = useState<CamState>("idle")
  const [photo, setPhoto] = useState<string | null>(null)

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [])

  const startCamera = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setState("unsupported")
      return
    }
    setState("requesting")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => {})
      }
      setState("streaming")
    } catch {
      setState("denied")
    }
  }, [])

  // auto-request on mount, clean up on unmount
  useEffect(() => {
    startCamera()
    return () => stopStream()
  }, [startCamera, stopStream])

  const capture = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    const w = video.videoWidth || 720
    const h = video.videoHeight || 1280
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0, w, h)
    setPhoto(canvas.toDataURL("image/jpeg", 0.9))
    setState("captured")
    stopStream()
    onCaptured?.()
  }, [onCaptured, stopStream])

  const retake = useCallback(() => {
    setPhoto(null)
    startCamera()
  }, [startCamera])

  return (
    <div className="flex w-full max-w-xs flex-col items-center">
      {/* viewfinder frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-black/60">
        {/* live feed or captured photo */}
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo || "/placeholder.svg"} alt="Foto del sol capturada" className="h-full w-full object-cover" />
        ) : (
          <video
            ref={videoRef}
            playsInline
            muted
            className="h-full w-full object-cover"
            aria-label="Vista de la cámara para encontrar el sol"
          />
        )}

        {/* fallback message when no camera */}
        {(state === "denied" || state === "unsupported" || state === "requesting") && !photo && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 px-6 text-center">
            <Sun className="h-10 w-10 text-accent" />
            <p className="text-pretty text-sm text-foreground/90">
              {state === "requesting"
                ? "Abriendo la cámara…"
                : state === "unsupported"
                  ? "Tu dispositivo no permite abrir la cámara."
                  : "Necesitamos permiso para usar la cámara y encontrar el sol."}
            </p>
            {state === "denied" && (
              <button
                type="button"
                onClick={startCamera}
                className="rounded-full bg-accent px-5 py-2 text-sm font-bold text-accent-foreground"
              >
                Reintentar
              </button>
            )}
          </div>
        )}

        {/* corner brackets */}
        <span className="pointer-events-none absolute left-3 top-3 h-7 w-7 rounded-tl-md border-l-2 border-t-2 border-white/90" />
        <span className="pointer-events-none absolute right-3 top-3 h-7 w-7 rounded-tr-md border-r-2 border-t-2 border-white/90" />
        <span className="pointer-events-none absolute bottom-3 left-3 h-7 w-7 rounded-bl-md border-b-2 border-l-2 border-white/90" />
        <span className="pointer-events-none absolute bottom-3 right-3 h-7 w-7 rounded-br-md border-b-2 border-r-2 border-white/90" />
        {/* center focus reticle */}
        {!photo && state === "streaming" && (
          <span className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2">
            <span className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-white/80" />
            <span className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-white/80" />
            <span className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-white/80" />
            <span className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-white/80" />
          </span>
        )}
      </div>

      {/* capture / retake */}
      <div className="mt-5 flex items-center justify-center">
        {state === "captured" ? (
          <button
            type="button"
            onClick={retake}
            className="flex items-center gap-2 rounded-full border border-foreground/30 bg-transparent px-5 py-2.5 text-sm font-semibold text-foreground transition-transform active:scale-95"
          >
            <RefreshCw className="h-4 w-4" />
            Tomar otra
          </button>
        ) : (
          <button
            type="button"
            onClick={capture}
            disabled={state !== "streaming"}
            aria-label="Tomar foto del sol"
            className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/80 bg-accent text-accent-foreground shadow-lg transition-transform active:scale-90 disabled:opacity-40"
          >
            <Camera className="h-6 w-6" />
          </button>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
