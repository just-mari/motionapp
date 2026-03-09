"use client"

import { DesktopBlocker } from "@/components/desktop-blocker"
import { MotionPlayer } from "@/components/motion-player"
import { useIsSmartphone } from "@/hooks/use-is-smartphone"
import { Spinner } from "@/components/ui/spinner"

export default function Home() {
  const isSmartphone = useIsSmartphone()

  // Loading state while detecting device
  if (isSmartphone === null) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    )
  }

  // Block desktop users
  if (!isSmartphone) {
    return <DesktopBlocker />
  }

  return <MotionPlayer />
}
