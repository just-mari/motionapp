"use client"

interface MotionVisualizerProps {
  isMoving: boolean
  intensity: number
}

export function MotionVisualizer({ isMoving, intensity }: MotionVisualizerProps) {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Outer ring - pulses when moving */}
      <div
        className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
          isMoving
            ? "border-primary scale-110 opacity-100"
            : "border-muted scale-100 opacity-50"
        }`}
        style={{
          transform: isMoving ? `scale(${1 + intensity / 100})` : "scale(1)",
        }}
      />

      {/* Middle ring */}
      <div
        className={`absolute inset-6 rounded-full border-2 transition-all duration-200 ${
          isMoving
            ? "border-primary/80 scale-105"
            : "border-muted/50 scale-100"
        }`}
      />

      {/* Inner ring */}
      <div
        className={`absolute inset-12 rounded-full border-2 transition-all duration-150 ${
          isMoving ? "border-primary/60" : "border-muted/30"
        }`}
      />

      {/* Center circle with icon */}
      <div
        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
          isMoving ? "bg-primary scale-110" : "bg-muted scale-100"
        }`}
      >
        {isMoving ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary-foreground animate-pulse"
          >
            <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <rect x="6" y="4" width="4" height="16" fill="currentColor" />
            <rect x="14" y="4" width="4" height="16" fill="currentColor" />
          </svg>
        )}
      </div>

      {/* Animated sound waves when playing */}
      {isMoving && (
        <>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border-2 border-primary/30 animate-ping"
              style={{
                width: `${180 + i * 40}px`,
                height: `${180 + i * 40}px`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: "1.5s",
              }}
            />
          ))}
        </>
      )}
    </div>
  )
}
