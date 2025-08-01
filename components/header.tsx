import { FloatingNavbar } from "./floating-navbar"

export function Header() {
  return (
    <header className="relative">
      <FloatingNavbar />
      <div className="text-center pt-20 pb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Furniture AI Dashboard</h1>
        <p className="text-gray-600">Transform your furniture with AI-powered design</p>
      </div>
    </header>
  )
}
