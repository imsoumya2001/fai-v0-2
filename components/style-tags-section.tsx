"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

const STYLE_TAGS = [
  "Minimalist",
  "Ecom-ready",
  "Cinematic",
  "Studio",
  "Dramatic",
  "Artistic",
  "Farmhouse",
]

interface StyleTagsSectionProps {
  selectedStyles: string[]
  setSelectedStyles: (styles: string[]) => void
}

export function StyleTagsSection({ selectedStyles, setSelectedStyles }: StyleTagsSectionProps) {
  const [showAll, setShowAll] = useState(false)
  const visibleTags = showAll ? STYLE_TAGS : STYLE_TAGS.slice(0, 4)

  const toggleStyle = (style: string) => {
    setSelectedStyles(
      selectedStyles.includes(style) ? selectedStyles.filter((s) => s !== style) : [...selectedStyles, style],
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Style tags</h3>
      <div className="flex flex-wrap gap-2 items-center">
        {visibleTags.map((style) => (
          <Button
            key={style}
            variant="ghost"
            className={`
              h-8 px-4 rounded-full text-sm font-medium transition-all duration-150 ease-out
              border-2 whitespace-nowrap
              ${
                selectedStyles.includes(style)
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              }
            `}
            onClick={() => toggleStyle(style)}
          >
            {style}
          </Button>
        ))}
        {STYLE_TAGS.length > 4 && (
          <Button
            variant="ghost"
            className="h-10 px-4 rounded-full text-sm font-medium border-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-all duration-150 ease-out"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>
                show less <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                show more <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
