"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { TagGroup, TagList, Tag } from "@/components/ui/tag-group"
import { Selection } from "react-aria-components"

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

  const handleSelectionChange = (keys: Selection) => {
    const keysArray = Array.from(keys) as string[]
    setSelectedStyles(keysArray)
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      <TagGroup 
        selectionMode="multiple" 
        selectedKeys={selectedStyles}
        onSelectionChange={handleSelectionChange}
        className="space-y-2 sm:space-y-3"
      >
        <h3 className="text-sm sm:text-base font-semibold text-gray-900">Style tags</h3>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
          <TagList className="flex flex-wrap gap-1.5 sm:gap-2">
            {visibleTags.map((style) => (
              <Tag key={style} id={style} className="cursor-pointer text-xs font-medium min-h-[36px] sm:min-h-[32px] px-2.5 sm:px-3 py-1.5 sm:py-1 touch-manipulation transition-all duration-200">
                {style}
              </Tag>
            ))}
          </TagList>
          {STYLE_TAGS.length > 4 && (
            <Button
              variant="ghost"
              className="h-9 sm:h-8 px-3 sm:px-4 rounded-full text-xs font-medium border border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all duration-200 bg-gray-50/50 hover:bg-gray-100 touch-manipulation"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? (
                <>
                  show less <ChevronUp className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </>
              ) : (
                <>
                  show more <ChevronDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </TagGroup>
    </div>
  )
}
