"use client"

interface IntensityBarProps {
  intensity: number
  isMoving: boolean
}

export function IntensityBar({ intensity, isMoving }: IntensityBarProps) {
  const bars = 20
  const activeBarCount = Math.floor((intensity / 100) * bars)

  return (
    <div className="flex flex-col items-center gap-3 w-full px-8">
      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Intensidad de Movimiento
      </span>
      <div className="flex gap-1 h-12 items-end w-full justify-center">
        {[...Array(bars)].map((_, i) => {
          const isActive = i < activeBarCount
          const height = 20 + (i / bars) * 80

          return (
            <div
              key={i}
              className={`w-2 rounded-full transition-all duration-100 ${
                isActive && isMoving
                  ? i < bars / 3
                    ? "bg-accent"
                    : i < (bars * 2) / 3
                    ? "bg-primary"
                    : "bg-destructive"
                  : "bg-muted"
              }`}
              style={{
                height: `${isActive && isMoving ? height : 20}%`,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
