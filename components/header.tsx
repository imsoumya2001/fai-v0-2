import { FloatingNavbar } from "./floating-navbar"

export function Header() {
  return (
    <header className="relative">
      <FloatingNavbar />
                <div className="text-center pt-14 sm:pt-16 lg:pt-20 pb-4 sm:pb-6 lg:pb-8 px-4">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-playfair italic font-light text-gray-900 mb-1 sm:mb-2 leading-tight">
          Furniture AI Dashboard
        </h1>
                    <p className="text-xs sm:text-sm lg:text-base font-poppins text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Transform your furniture with AI-powered design
        </p>
      </div>
    </header>
  )
}
