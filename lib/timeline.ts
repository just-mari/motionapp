import type { LucideIcon } from "lucide-react"
import { Sparkles, Sun, CircleDot, Grid2x2, Fish, Sprout, Flame, Zap, PersonStanding } from "lucide-react"

export interface Period {
  id: string
  /** Millions of years ago that the event begins. */
  ma: number
  /** Short label shown under the axis, e.g. "3800 Ma". */
  maLabel: string
  /** Title of the evolutionary milestone. */
  title: string
  /** Longer, plain-language description shown when the icon is tapped. */
  description: string
  icon: LucideIcon
}

/**
 * A simplified journey through the evolution of organic life,
 * distilled from the full phylogenetic timeline (4000 Ma → present).
 * Ordered from oldest (left) to most recent (right).
 */
export const PERIODS: Period[] = [
  {
    id: "origin",
    ma: 3800,
    maLabel: "3800 Ma",
    title: "Origen de la vida",
    description:
      "Hace unos 3800 millones de años aparecen las primeras células. La química de la Tierra primitiva da lugar a organismos capaces de copiarse a sí mismos.",
    icon: Sparkles,
  },
  {
    id: "photosynthesis",
    ma: 2400,
    maLabel: "2400 Ma",
    title: "Gran oxigenación",
    description:
      "La fotosíntesis de las cianobacterias llena la atmósfera de oxígeno. Este cambio hace posible la respiración aeróbica y transforma el planeta.",
    icon: Sun,
  },
  {
    id: "eukaryotes",
    ma: 2000,
    maLabel: "2000 Ma",
    title: "Células modernas",
    description:
      "Surgen las células eucariotas, con núcleo y organelos. Son la base de todos los animales, plantas y hongos que existen hoy.",
    icon: CircleDot,
  },
  {
    id: "multicellular",
    ma: 1200,
    maLabel: "1200 Ma",
    title: "Multicelularidad y sexualidad",
    description:
      "La vida aprende a cooperar: muchas células forman un solo organismo, y la reproducción sexual acelera la diversidad.",
    icon: Grid2x2,
  },
  {
    id: "cambrian",
    ma: 540,
    maLabel: "540 Ma",
    title: "Explosión del Cámbrico",
    description:
      "En un abrir y cerrar de ojos geológico aparecen casi todos los grandes grupos de animales, incluidos los primeros con ojos y esqueletos.",
    icon: Fish,
  },
  {
    id: "land",
    ma: 380,
    maLabel: "380 Ma",
    title: "La vida coloniza la tierra",
    description:
      "Plantas, insectos y los primeros vertebrados salen del agua. La superficie del planeta se cubre de vida por primera vez.",
    icon: Sprout,
  },
  {
    id: "permian",
    ma: 250,
    maLabel: "250 Ma",
    title: "Gran extinción del Pérmico",
    description:
      "La mayor extinción conocida elimina cerca del 90% de las especies marinas. La vida sobrevive y vuelve a diversificarse.",
    icon: Flame,
  },
  {
    id: "chicxulub",
    ma: 65,
    maLabel: "65 Ma",
    title: "Meteorito de Chicxulub",
    description:
      "Un impacto en Yucatán termina con los dinosaurios no aviares. Los mamíferos ocupan los espacios que quedan libres.",
    icon: Zap,
  },
  {
    id: "homo",
    ma: 0,
    maLabel: "Presente",
    title: "Homo sapiens",
    description:
      "Aparecen los humanos: lenguaje, fuego, agricultura y cultura. Es el punto al que ha llegado, por ahora, el camino evolutivo.",
    icon: PersonStanding,
  },
]

/** Map a 0..1 evolution progress value to the active period index. */
export function periodIndexFromProgress(progress: number): number {
  const clamped = Math.min(1, Math.max(0, progress))
  return Math.min(PERIODS.length - 1, Math.floor(clamped * PERIODS.length))
}
