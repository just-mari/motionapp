export type BackgroundVariant = "warm" | "cool" | "black"
export type VisualVariant = "sphere" | "arrow" | "none"

export interface Stage {
  id: string
  /** Narration text shown for this stage (italic serif). */
  text: string
  /** Background mesh variant. */
  background: BackgroundVariant
  /** Central visual element. */
  visual: VisualVariant
  /** Optional darkened center vignette over the mesh. */
  vignette?: boolean
}

/**
 * The evolutionary narration sequence.
 * Order and content follow the Figma source of truth.
 */
export const STAGES: Stage[] = [
  {
    id: "intro",
    text: "Hola, soy EV-A",
    background: "warm",
    visual: "sphere",
  },
  {
    id: "walk",
    text: "Camina hacia adelante",
    background: "warm",
    visual: "arrow",
    vignette: true,
  },
  {
    id: "first-steps",
    text: "Estos son los primeros pasos de nuestro universo.",
    background: "black",
    visual: "none",
  },
  {
    id: "from-that-moment",
    text: "Desde ese momento,",
    background: "cool",
    visual: "none",
    vignette: true,
  },
  {
    id: "timescale",
    text: "Estamos alrededor de 13 800 millones de años antes del final de la vida orgánica",
    background: "cool",
    visual: "sphere",
  },
]
