"use client"

import { useState } from "react"
import { Home, BarChart3, Lightbulb, Settings, User, Menu, X } from "lucide-react"
import { InteractiveMenu, InteractiveMenuItem } from "@/components/ui/modern-mobile-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ModernFloatingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const menuItems: InteractiveMenuItem[] = [
    { label: 'home', icon: Home },
    { label: 'dashboard', icon: BarChart3 },
    { label: 'inspiration', icon: Lightbulb },
    { label: 'settings', icon: Settings },
    { label: 'profile', icon: User },
  ]

  return (
    <>
      {/* Desktop Navigation - Modern Menu */}
      <div className="hidden md:block fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="backdrop-blur-md bg-white/90 rounded-2xl border border-gray-200/50 shadow-lg p-2">
          <InteractiveMenu 
            items={menuItems}
            accentColor="var(--chart-2)"
          />
        </div>
      </div>

      {/* Mobile Navigation - Hamburger Menu */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="h-11 w-11 bg-white/90 backdrop-blur-md border-gray-200/50 shadow-lg rounded-xl hover:bg-white/95"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay with Modern Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute bottom-8 left-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="p-4">
              <InteractiveMenu 
                items={menuItems}
                accentColor="var(--chart-2)"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
} 