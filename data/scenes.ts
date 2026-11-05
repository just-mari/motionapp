export type Branch = "mango" | "hongo" | "abeja" | "calamar" | "guacharaca" | "marmosa" | "humano"
export type SceneType = "narracion" | "caminata" | "interaccion" | "decision" | "evolucion" | "final"

export interface SceneOption { id: string; label: string; next: string; branch?: Branch }
export interface Scene {
  id: string
  branch: "tronco" | Branch
  phase: 1 | 2 | 3 | 4 | 5
  era?: string
  type: SceneType
  title: string
  subtitle?: string
  transcript: string[]
  visual: "sphere" | "arrow" | "camera" | "none"
  background: "warm" | "cool" | "black"
  interaction?: { type: string; fallback: string; seconds?: number }
  next?: string
  options?: SceneOption[]
}

const trunk: Scene[] = [
  { id: "intro", branch: "tronco", phase: 1, type: "narracion", title: "Hola, soy EV-A", subtitle: "Tu guía en este camino.", transcript: ["Iniciando el Archivo de la Vida Orgánica en la Tierra. Soy EV-A, tu facilitadora.", "Comenzarás como energía pura y, al final, descubrirás en qué tipo de ser te has convertido."], visual: "sphere", background: "warm", next: "walk" },
  { id: "walk", branch: "tronco", phase: 1, type: "caminata", title: "Camina hacia adelante", subtitle: "Cada paso representa tiempo transcurrido.", transcript: ["Toda transformación requiere un esfuerzo. Camina hacia adelante."], visual: "arrow", background: "warm", interaction: { type: "steps", fallback: "Mantén presionado para avanzar." }, next: "big-bang" },
  { id: "big-bang", branch: "tronco", phase: 1, era: "13 800 millones de años", type: "narracion", title: "Los primeros pasos del universo", transcript: ["Estos son los primeros pasos de nuestro universo. Cada paso que tomes ahora representa tiempo transcurrido en años."], visual: "none", background: "black", next: "find-sun" },
  { id: "find-sun", branch: "tronco", phase: 1, era: "3 500 millones de años", type: "interaccion", title: "Encuentra el sol", subtitle: "El sistema solar comienza a tomar forma.", transcript: ["Debes encontrar el sol de nuestro sistema solar."], visual: "camera", background: "cool", interaction: { type: "camera", fallback: "Toca el botón para continuar." }, next: "earth" },
  { id: "earth", branch: "tronco", phase: 1, era: "3 500 millones de años", type: "narracion", title: "Nace la Tierra", transcript: ["En uno de esos sistemas solares nace la Tierra."], visual: "sphere", background: "cool", next: "origin" },
  { id: "origin", branch: "tronco", phase: 1, era: "3 800 millones de años", type: "evolucion", title: "La vida encuentra un equilibrio", transcript: ["De combinaciones inusuales surge el primer ancestro celular de la vida orgánica."], visual: "sphere", background: "cool", next: "oxygen" },
  { id: "oxygen", branch: "tronco", phase: 2, era: "2 400 millones de años", type: "interaccion", title: "Respira y transforma", transcript: ["Las cianobacterias aprovechan la luz solar y liberan oxígeno. Esto lo cambia todo."], visual: "none", background: "cool", interaction: { type: "breath", fallback: "Mantén presionado para avanzar." }, next: "mitochondria" },
  { id: "mitochondria", branch: "tronco", phase: 2, era: "1 600 millones de años", type: "interaccion", title: "Forma una alianza", transcript: ["Mueve la bacteria dentro de la arquea. Con el tiempo se convertirá en la mitocondria."], visual: "none", background: "cool", interaction: { type: "drag", fallback: "Toca ambas formas para unirlas." }, next: "d1" },
  { id: "d1", branch: "tronco", phase: 2, type: "decision", title: "Necesitas manejar tu energía", subtitle: "¿Qué estrategia prefieres?", transcript: ["Puedes producir tu propia energía o buscar energía disponible en otros organismos."], visual: "none", background: "cool", options: [{ id: "a", label: "Producir mi propia energía", next: "mango-start", branch: "mango" }, { id: "b", label: "Buscar energía en otros seres", next: "d2" }] },
  { id: "d2", branch: "tronco", phase: 2, type: "decision", title: "¿Cómo obtendrás nutrientes?", subtitle: "Tu cuerpo depende de moléculas orgánicas.", transcript: ["Puedes digerir en el ambiente o incorporar el alimento y digerirlo internamente."], visual: "none", background: "cool", options: [{ id: "a", label: "Digerir en el ambiente", next: "hongo-placeholder", branch: "hongo" }, { id: "b", label: "Digerir internamente", next: "d3" }] },
  { id: "d3", branch: "tronco", phase: 3, type: "decision", title: "Organiza tu cuerpo", subtitle: "¿Qué ruta evolutiva exploras?", transcript: ["Un cuerpo flexible o un cuerpo con un eje interno y rigidez protectora."], visual: "none", background: "cool", options: [{ id: "a", label: "Cuerpo flexible y versátil", next: "d4" }, { id: "b", label: "Eje interno y rigidez protectora", next: "station-1" }] },
  { id: "d4", branch: "tronco", phase: 3, type: "decision", title: "Equilibra protección y función", subtitle: "¿Qué solución prefieres?", transcript: ["Una cubierta externa resistente o un cuerpo blando y muscular."], visual: "none", background: "cool", options: [{ id: "a", label: "Cubierta externa en piezas móviles", next: "abeja-placeholder", branch: "abeja" }, { id: "b", label: "Cuerpo blando y muscular", next: "calamar-placeholder", branch: "calamar" }] },
  { id: "station-1", branch: "tronco", phase: 3, era: "500 millones de años", type: "interaccion", title: "Dibuja tu eje interno", transcript: ["La notocorda te da soporte y permite que tu cuerpo se mueva con precisión."], visual: "none", background: "cool", interaction: { type: "draw", fallback: "Toca para formar la estructura." }, next: "station-2" },
  { id: "station-2", branch: "tronco", phase: 3, era: "320 millones de años", type: "evolucion", title: "Conquista nuevos espacios", transcript: ["La columna vertebral y el huevo amniota permiten explorar ambientes terrestres."], visual: "sphere", background: "cool", next: "d5" },
  { id: "d5", branch: "tronco", phase: 4, type: "decision", title: "Elige tu estrategia terrestre", subtitle: "¿Qué ruta prefieres?", transcript: ["Puedes priorizar la protección externa o especializar las estructuras internas y el cuidado de las crías."], visual: "none", background: "cool", options: [{ id: "a", label: "Mayor protección externa", next: "guacharaca-placeholder", branch: "guacharaca" }, { id: "b", label: "Mayor especialización interna", next: "station-3" }] },
  { id: "station-3", branch: "tronco", phase: 4, era: "252 millones de años", type: "evolucion", title: "Sobrevive al cambio", transcript: ["Tras la extinción del Pérmico, los mamíferos verdaderos comienzan a diversificarse."], visual: "none", background: "black", next: "d6" },
  { id: "d6", branch: "tronco", phase: 4, type: "decision", title: "Gestiona tu descendencia", subtitle: "¿Qué ventaja reproductiva priorizas?", transcript: ["Flexibilidad de escape o desarrollo avanzado."], visual: "none", background: "cool", options: [{ id: "a", label: "Flexibilidad de escape", next: "marmosa-placeholder", branch: "marmosa" }, { id: "b", label: "Desarrollo avanzado", next: "humano-placeholder", branch: "humano" }] },
]

const mango: Scene[] = [
  { id: "mango-start", branch: "mango", phase: 3, era: "1 000 millones de años", type: "evolucion", title: "Conquista los mares", subtitle: "La energía de la luz se vuelve alimento.", transcript: ["Incorporas una cianobacteria fotosintética. Con el tiempo se transforma en un cloroplasto."], visual: "sphere", background: "warm", next: "mango-land" },
  { id: "mango-land", branch: "mango", phase: 4, era: "500 millones de años", type: "caminata", title: "Explora la tierra firme", transcript: ["El ambiente terrestre es extremo. Desarrollas un tallo fuerte y sistemas para transportar agua."], visual: "arrow", background: "warm", interaction: { type: "steps", fallback: "Toca para avanzar." }, next: "mango-seeds" },
  { id: "mango-seeds", branch: "mango", phase: 4, era: "385 millones de años", type: "evolucion", title: "Protege tu futuro", transcript: ["Desarrollas semillas: pequeños embriones preparados para viajar por viento, agua u otros seres vivos."], visual: "sphere", background: "warm", next: "mango-flowers" },
  { id: "mango-flowers", branch: "mango", phase: 4, era: "140 millones de años", type: "interaccion", title: "Atrae a los polinizadores", transcript: ["Flores, colores y azúcares te permiten asociarte con animales y expandirte."], visual: "camera", background: "warm", interaction: { type: "flower", fallback: "Dibuja una flor para continuar." }, next: "mango-extinction" },
  { id: "mango-extinction", branch: "mango", phase: 5, era: "66 millones de años", type: "interaccion", title: "Resiste el impacto", transcript: ["El meteorito de Yucatán oscurece el cielo. La diversidad ayuda a tu especie a sobrevivir."], visual: "none", background: "black", interaction: { type: "tap", fallback: "Toca rápidamente para continuar." }, next: "mango-final" },
  { id: "mango-final", branch: "mango", phase: 5, era: "Antropoceno", type: "final", title: "Mango", subtitle: "Mangifera indica", transcript: ["Desarrollaste un tallo fuerte, hojas, flores y frutos. Felicitaciones: eres un mango."], visual: "sphere", background: "warm" },
]

const placeholders: Scene[] = (["hongo", "abeja", "calamar", "guacharaca", "marmosa", "humano"] as Branch[]).map((branch) => ({ id: `${branch}-placeholder`, branch, phase: 5, type: "final", title: `Rama ${branch}`, subtitle: "Esta rama se completará en la siguiente fase.", transcript: ["El camino está conectado. Las escenas detalladas de esta rama se incorporarán después."], visual: "sphere", background: branch === "humano" ? "cool" : "warm" }))

export const SCENES = [...trunk, ...mango, ...placeholders]
export const SCENE_MAP = Object.fromEntries(SCENES.map((scene) => [scene.id, scene])) as Record<string, Scene>
