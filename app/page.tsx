"use client"

import { DesktopBlocker } from "@/components/desktop-blocker"
import { ExperiencePlayer } from "@/components/experience-player"
import { useIsSmartphone } from "@/hooks/use-is-smartphone"
import { Spinner } from "@/components/ui/spinner"

export default function Home() {
  const isSmartphone = useIsSmartphone()

  // Loading state while detecting device
  if (isSmartphone === null) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )
  }

  // Block desktop users
  if (!isSmartphone) {
    return <DesktopBlocker />
  }

  return <ExperiencePlayer />
}
