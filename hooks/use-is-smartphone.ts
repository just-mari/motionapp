"use client"

import { useState, useEffect } from "react"

export function useIsSmartphone(): boolean | null {
  const [isSmartphone, setIsSmartphone] = useState<boolean | null>(null)

  useEffect(() => {
    const checkSmartphone = () => {
      const userAgent = navigator.userAgent || navigator.vendor

      // Check for mobile user agents
      const mobileRegex =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

      // Check screen size (typical smartphone dimensions)
      const isSmallScreen = window.innerWidth <= 768

      // Check for touch capability
      const hasTouch =
        "ontouchstart" in window || navigator.maxTouchPoints > 0

      // Must be mobile user agent AND small screen AND touch capable
      setIsSmartphone(mobileRegex.test(userAgent) && isSmallScreen && hasTouch)
    }

    checkSmartphone()
  }, [])

  return isSmartphone
}
