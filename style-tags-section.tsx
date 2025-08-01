"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const STYLE_TAGS = [
  "Studio Lighting",
  "Natural Light",
  "Clean Background",
  "Dramatic Shadows",
  "Luxury Style",
  "Modern Minimal",
  "Professional Product",
  "E-commerce Ready",
]

interface StyleTagsSectionProps {
  selectedStyles: string[]
  setSelectedStyles: (styles: string[]) => void
}

export function StyleTagsSection({ selectedStyles, setSelectedStyles }: StyleTagsSectionProps) {
  const toggleStyle = (style: string) => {
    setSelectedStyles(
      selectedStyles.includes(style) ? selectedStyles.filter((s) => s !== style) : [...selectedStyles, style],
    )
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Style Tags</h2>
      <div className="flex flex-wrap gap-2">
        {STYLE_TAGS.map((style) => (
          <Badge
            key={style}
            variant={selectedStyles.includes(style) ? "default" : "outline"}
            className="cursor-pointer px-4 py-2 text-sm hover:bg-blue-100 transition-colors"
            onClick={() => toggleStyle(style)}
          >
            {style}
          </Badge>
        ))}
      </div>
    </Card>
  )
}
