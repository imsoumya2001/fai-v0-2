"use client"

import { useState } from "react"
import { Home, BarChart3, Lightbulb, Settings, User, Menu, X } from "lucide-react"
import { ExpandableTabs } from "@/components/ui/expandable-tabs"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function FloatingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const tabs = [
    { title: "Home", icon: Home },
    { title: "Dashboard", icon: BarChart3 },
    { type: "separator" as const },
    { title: "Inspiration", icon: Lightbulb },
    { title: "Settings", icon: Settings },
    { title: "Profile", icon: User },
  ]

  return (
    <>
      {/* Desktop Navigation - Sticky floating navbar */}
      <div className="hidden sm:block fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="backdrop-blur-md bg-white/90 rounded-2xl border border-gray-200/50 shadow-lg">
          <ExpandableTabs 
            tabs={tabs} 
            activeColor="text-blue-600" 
            className="border-0 bg-transparent shadow-none" 
          />
        </div>
      </div>

      {/* Mobile Navigation - Hamburger Menu */}
      <div className="sm:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="h-11 w-11 bg-white/90 backdrop-blur-md border-gray-200/50 shadow-lg rounded-xl hover:bg-white/95"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-40">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-20 right-4 left-4 bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="p-2">
              {tabs.map((tab, index) => (
                tab.type === "separator" ? (
                  <div key={`separator-${index}`} className="h-px bg-gray-200 my-2" />
                ) : (
                  <button
                    key={tab.title}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <tab.icon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">{tab.title}</span>
                  </button>
                )
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}