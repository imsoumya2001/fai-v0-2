"use client"

import { Home, BarChart3, Lightbulb, Settings, User } from "lucide-react"
import { ExpandableTabs } from "@/components/ui/expandable-tabs"

export function FloatingNavbar() {
  const tabs = [
    { title: "Home", icon: Home },
    { title: "Dashboard", icon: BarChart3 },
    { type: "separator" as const },
    { title: "Inspiration", icon: Lightbulb },
    { title: "Settings", icon: Settings },
    { title: "Profile", icon: User },
  ]

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="backdrop-blur-md bg-white/80 rounded-2xl border border-gray-200/50 shadow-lg">
        <ExpandableTabs tabs={tabs} activeColor="text-blue-600" className="border-0 bg-transparent shadow-none" />
      </div>
    </div>
  )
}
