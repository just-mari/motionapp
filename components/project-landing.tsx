"use client"

import { useEffect, useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Smartphone, FileText, Sprout, Footprints, Music, ArrowDown, MapPin } from "lucide-react"
import { MeshBackground } from "@/components/mesh-background"

const FINAL_FORMS = [
  { emoji: "un mango", label: "Mangifera indica" },
  { emoji: "un hongo", label: "Agaricus bisphorus" },
  { emoji: "una abeja", label: "Apis mellifera" },
  { emoji: "un calamar", label: "Loligo vulgaris" },
  { emoji: "una guacharaca", label: "Ortalis garrula" },
  { emoji: "una marmosa", label: "Marmosa magdalenae" },
  { emoji: "un humano", label: "Homo sapiens" },
]

const TEAM = [
  { role: "Dirección General", names: ["Clara Machacon", "María Isabella Osio", "Lorna Campo "] },
  { role: "Guion", names: ["Lorna Campo", "Clara Machacon", "Ramón Escorcia"] },
  { role: "Diseño", names: ["Laura Micolta", "Gina Ayala"] },
  { role: "Desarrollo", names: ["María Isabella Osio"]}
  { role: "Recopilación del material cientifico", names: ["Biología 1", "Biología 2", "Biología 3"] },
  { role: "Producción", names: ["María Cecilia Reyes", "Rafik Neme", "UNI5LAB - UNINORTE"] },
]

/**
 * Research-creation landing page for Camino Evolutivo.
 * Shown to desktop visitors (via DesktopBlocker) and reachable from
 * mobile through the /proyecto route.
 */
export function ProjectLanding() {
  const [url, setUrl] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.origin)
    }
  }, [])

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-background text-foreground">
      {/* ---------- Hero ---------- */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-20 text-center">
        <MeshBackground variant="warm" vignette />
        <div className="ce-fade-up relative z-10 flex max-w-3xl flex-col items-center">
          <span className="mb-6 rounded-full border border-foreground/15 bg-background/30 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-foreground/80 backdrop-blur-sm">
            Proyecto de investigación-creación
          </span>
          <h1
            className="text-balance font-sans text-6xl font-extrabold leading-[0.95] text-brand-yellow sm:text-7xl md:text-8xl"
            style={{ textShadow: "0 0 40px rgba(244,208,32,0.35)" }}
          >
            Camino
            <br />
            Evolutivo
          </h1>
          <p className="mt-6 font-serif text-2xl italic text-foreground/90 sm:text-3xl">camina y evoluciona</p>
          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-foreground/80 sm:text-lg">
            Una experiencia sonora interactiva, accesible desde el navegador de tu celular, donde caminas para dar vida
            a la música y a tu propia evolución.
          </p>
          <a
            href="#experiencia"
            className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
          >
            Conoce el proyecto
            <ArrowDown className="h-4 w-4 ce-animate-arrow" />
          </a>
        </div>
      </section>

      {/* ---------- Sinopsis ---------- */}
      <section className="relative mx-auto max-w-3xl px-6 py-20">
        <SectionTag icon={Sprout} label="Sinopsis" />
        <h2 className="mt-4 text-balance text-3xl font-bold sm:text-4xl">
          ¿Y si en el futuro un agente artificial recreara la vida en la Tierra?
        </h2>
        <div className="mt-6 flex flex-col gap-5 text-pretty text-lg leading-relaxed text-foreground/80">
          <p>
            Miles de años después de la extinción de la vida orgánica en la Tierra, una compañía robótica intenta
            recrearla dentro de una simulación. En este viaje interactivo, tú eres <strong>energía libre</strong> que
            deberá recorrer un camino hacia su forma final.
          </p>
          <p>
            Inspirado en el <em>Camino Evolutivo de Plön</em> (Alemania), el proyecto combina narrativa, artes digitales
            y una base edu-informativa para contar la historia de la vida orgánica en la Tierra —y también su
            desaparición.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {FINAL_FORMS.map((f) => (
            <div
              key={f.label}
              className="rounded-2xl border border-border/50 bg-card/50 px-4 py-5 text-center backdrop-blur-sm"
            >
              <p className="font-serif text-lg italic text-accent">{f.emoji}</p>
              <p className="mt-1 text-[11px] leading-tight text-muted-foreground">{f.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Cómo funciona ---------- */}
      <section className="relative border-y border-border/40 bg-card/30 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <SectionTag icon={Footprints} label="Cómo funciona" />
          <h2 className="mt-4 text-balance text-3xl font-bold sm:text-4xl">
            Si caminas, evolucionas. Si te detienes, la narración se detiene.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Feature
              icon={Footprints}
              title="Camina para avanzar"
              body="La webapp usa el acelerómetro y el GPS del teléfono para registrar la distancia que recorres. El movimiento impulsa tu evolución."
            />
            <Feature
              icon={Music}
              title="Música evolutiva"
              body="Una banda sonora que crece en complejidad a medida que avanzas hacia formas de vida más desarrolladas."
            />
            <Feature
              icon={Sprout}
              title="Puntos de inflexión"
              body="Ante los problemas del ambiente, decides. Tus elecciones marcan la dirección y la forma de vida hacia la que evolucionas."
            />
          </div>
        </div>
      </section>

      {/* ---------- Artículo científico ---------- */}
      <section className="relative mx-auto max-w-3xl px-6 py-20">
        <div className="overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-8 backdrop-blur-sm sm:p-10">
          <SectionTag icon={FileText} label="Investigación" />
          <h2 className="mt-4 text-balance text-2xl font-bold sm:text-3xl">Respaldado por un artículo científico</h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-foreground/80">
            Camino Evolutivo es un proyecto de investigación-creación: la línea de tiempo, las formas de vida y los
            hitos evolutivos se basan en el consenso científico actual sobre la historia de la vida orgánica. El
            proyecto está documentado en un artículo científico que sustenta su propuesta narrativa y edu-informativa.
          </p>
          <a
            href="#experiencia"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/60 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
          >
            <FileText className="h-4 w-4" />
            Leer el artículo (próximamente)
          </a>
        </div>
      </section>

      {/* ---------- Equipo ---------- */}
      <section className="relative mx-auto max-w-4xl px-6 py-20">
        <SectionTag icon={MapPin} label="Equipo" />
        <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Quiénes lo hacen</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {TEAM.map((group) => (
            <div key = {group.role} className="rounded-2xl border border-border/50 bg-card/40 p-6">
              <p classname  = "text-xs font-semibold uppercase tracking-[0.15em] text-accent">{group.role}</p>
              <ul className="mt-3 flex flex-col gap-2">
                {group.names.map((n) => (
                  <li key={n} className="text-sm leading-relaxed text-foreground/85">
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- CTA: vive la experiencia ---------- */}
      <section
        id="experiencia"
        className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
      >
        <MeshBackground variant="cool" vignette />
        <div className="relative z-10 flex max-w-2xl flex-col items-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            <Smartphone className="h-8 w-8" />
          </div>
          <h2 className="text-balance text-4xl font-bold sm:text-5xl">Vive la experiencia desde tu celular</h2>
          <p className="mt-5 max-w-lg text-pretty text-lg leading-relaxed text-foreground/85">
            Camino Evolutivo se camina. Abre esta página en tu teléfono, sal a moverte y deja que la vida —y la música—
            evolucionen contigo.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-border/50 bg-background/70 p-6 backdrop-blur-md">
            <div className="rounded-2xl bg-white p-4">
              {url ? (
                <QRCodeSVG value={url} size={168} bgColor="#ffffff" fgColor="#0a0a0f" level="M" />
              ) : (
                <div className="h-[168px] w-[168px]" />
              )}
            </div>
            <p className="text-sm font-medium text-foreground/70">Escanea para abrir en tu teléfono</p>
            {url && <p className="max-w-[240px] break-all text-xs text-muted-foreground">{url}</p>}
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-border/40 px-6 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Camino Evolutivo · UNI5LAB · Universidad del Norte — experiencia interactiva de investigación-creación
        </p>
      </footer>
    </main>
  )
}

function SectionTag({ icon: Icon, label }: { icon: typeof Sprout; label: string }) {
  return (
    <div className="flex items-center gap-2 text-accent">
      <Icon className="h-5 w-5" />
      <span className="text-xs font-semibold uppercase tracking-[0.2em]">{label}</span>
    </div>
  )
}

function Feature({ icon: Icon, title, body }: { icon: typeof Sprout; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-background/40 p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-pretty text-sm leading-relaxed text-foreground/75">{body}</p>
    </div>
  )
}
