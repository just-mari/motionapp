import type { Metadata } from "next"
import { ProjectLanding } from "@/components/project-landing"

export const metadata: Metadata = {
  title: "Camino Evolutivo · El proyecto",
  description:
    "Camino Evolutivo es un proyecto de investigación-creación: una experiencia sonora interactiva donde caminas para evolucionar y conocer la historia de la vida orgánica en la Tierra.",
}

export default function ProyectoPage() {
  return <ProjectLanding />
}
