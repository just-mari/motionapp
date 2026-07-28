export type BackgroundVariant = "warm" | "cool" | "black"
export type VisualVariant = "sphere" | "arrow" | "camera" | "none"

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
  /** Interactive stages require an action (e.g. taking a photo) rather than a Skip. */
  interactive?: boolean
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
    id: "timescale",
    text: "Estamos alrededor de 13 800 millones de años antes del final de la vida orgánica",
    background: "cool",
    visual: "sphere",
  },
  {
    id: "from-that-moment",
    text: "Desde ese momento,",
    background: "cool",
    visual: "none",
    vignette: true,
  },
  {
    id: "find-the-sun",
    text: "Encuentra el sol",
    background: "warm",
    visual: "camera",
    interactive: true,
  },
]
