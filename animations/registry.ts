export type AnimationOrigin = "existente" | "nueva"
export interface AnimationRegistration { sceneId: string; component: string; origin: AnimationOrigin; recovered?: boolean }

export const animationRegistry: AnimationRegistration[] = [
  { sceneId: "intro", component: "OrganicSphere", origin: "existente", recovered: true },
  { sceneId: "earth", component: "OrganicSphere", origin: "existente", recovered: true },
  { sceneId: "big-bang", component: "MangoVisual / stars", origin: "nueva" },
  { sceneId: "find-sun", component: "MangoVisual / sun", origin: "nueva" },
  { sceneId: "origin", component: "MangoVisual / magma", origin: "nueva" },
  { sceneId: "oxygen", component: "MangoVisual / wind", origin: "nueva" },
  { sceneId: "mitochondria", component: "MangoVisual / cell", origin: "nueva" },
  { sceneId: "mango-start", component: "MangoVisual / cell", origin: "nueva" },
  { sceneId: "mango-land", component: "MangoVisual / plant", origin: "nueva" },
  { sceneId: "mango-seeds", component: "MangoVisual / forest", origin: "nueva" },
  { sceneId: "mango-flowers", component: "MangoVisual / flowers", origin: "nueva" },
  { sceneId: "mango-extinction", component: "MangoVisual / fire", origin: "nueva" },
  { sceneId: "mango-final", component: "MangoVisual / tree", origin: "nueva" },
]
