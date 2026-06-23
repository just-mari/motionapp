"use client"

import { MeshBackground } from "./mesh-background"

interface HomeScreenProps {
  onStart: () => void
  permissionDenied?: boolean
}

export function HomeScreen({ onStart, permissionDenied = false }: HomeScreenProps) {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-8">
      <MeshBackground variant="warm" />

      {/* gear placeholder (decorative on splash, matches Figma) */}
      <div className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center ce-fade-up">
        <h1
          className="font-sans text-6xl font-extrabold leading-[0.95] tracking-tight text-balance"
          style={{
            color: "var(--brand-yellow)",
            textShadow: "0 0 28px rgba(244,224,40,0.45), 0 4px 14px rgba(0,0,0,0.55)",
          }}
        >
          Camino
          <br />
          Evolutivo
        </h1>

        <p className="mt-6 font-serif text-2xl italic text-foreground/90">camina y evoluciona</p>

        <button
          type="button"
          onClick={onStart}
          className="mt-12 rounded-full bg-primary px-12 py-5 font-sans text-xl font-bold leading-tight text-primary-foreground shadow-xl shadow-primary/30 transition-transform duration-150 hover:scale-[1.03] active:scale-95"
        >
          Iniciar
          <br />
          Simulación
        </button>

        {permissionDenied && (
          <p className="mt-6 max-w-xs text-pretty text-sm text-destructive">
            Permiso de movimiento denegado. Habilita el acceso al movimiento en los ajustes de tu
            navegador para continuar.
          </p>
        )}
      </div>
    </main>
  )
}
