"use client"

import { cn } from "@/lib/utils"

interface MangoVisualProps { sceneId: string; active: boolean; intensity: number }

const visualByScene: Record<string, string> = {
  intro: "energy", walk: "energy", "big-bang": "stars", "find-sun": "sun", earth: "orbit", origin: "magma", oxygen: "wind", mitochondria: "cell", "mango-start": "cell", "mango-land": "plant", "mango-seeds": "forest", "mango-flowers": "flowers", "mango-extinction": "fire", "mango-final": "tree",
}

export function MangoVisual({ sceneId, active, intensity }: MangoVisualProps) {
  const kind = visualByScene[sceneId] ?? "energy"
  return <div aria-hidden className={cn("mango-visual", `mango-visual-${kind}`, active && "mango-visual-active")} style={{ "--motion": `${Math.min(1, intensity / 100)}` } as React.CSSProperties}>
    {kind === "energy" && <><span className="energy-core" /><i /><i /><i /><i /></>}
    {kind === "stars" && <><span className="star-burst" /><span className="star-field" /></>}
    {kind === "sun" && <><span className="sun-disc" /><span className="sun-crosshair" /></>}
    {kind === "orbit" && <><span className="planet earth" /><i /><i /><i /></>}
    {kind === "magma" && <><span className="magma-glow" /><i /><i /><i /></>}
    {kind === "wind" && <><i /><i /><i /><span className="oxygen-dot" /></>}
    {kind === "cell" && <><span className="cell-body" /><i /><i /></>}
    {kind === "plant" && <><span className="stem" /><i /><i /><i /></>}
    {kind === "forest" && <><span className="forest-ground" /><i /><i /><i /><i /></>}
    {kind === "flowers" && <><span className="flower flower-a" /><span className="flower flower-b" /><span className="flower flower-c" /></>}
    {kind === "fire" && <><span className="fire-core" /><i /><i /><i /></>}
    {kind === "tree" && <><span className="tree-trunk" /><span className="tree-crown" /><span className="tree-fruit" /></>}
  </div>
}
