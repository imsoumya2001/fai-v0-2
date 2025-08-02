"use client"

import { useState } from "react"
import { ImageGeneration } from "@/components/image-generation"

// Mock data for testing
const mockGeneratedImages = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    prompt: "Modern luxury furniture in a minimalist living room",
    timestamp: new Date()
  },
  {
    id: "2", 
    url: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    prompt: "Elegant dining table with contemporary chairs",
    timestamp: new Date()
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", 
    prompt: "Cozy bedroom with wooden furniture",
    timestamp: new Date()
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
    prompt: "Industrial style office desk setup",
    timestamp: new Date()
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
    prompt: "Vintage furniture in a rustic setting",
    timestamp: new Date()
  }
]

export default function TestImageGridPage() {
  const [generatedImages, setGeneratedImages] = useState(mockGeneratedImages)

  const handleRecreate = (image: any) => {
    console.log("Recreating image:", image)
    // In a real app, this would trigger image regeneration
  }

  const handleTurnIntoVideo = (image: any) => {
    console.log("Turning into video:", image)
    // In a real app, this would open video generation
  }

  const handleScrollToPrompt = () => {
    console.log("Scrolling to prompt")
    // In a real app, this would scroll to the prompt section
  }

  const handleShowVideoGeneration = (image: any) => {
    console.log("Showing video generation for:", image)
    // In a real app, this would show video generation UI
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Image Generation with Interactive Grid</h1>
        <ImageGeneration
          generatedImages={generatedImages}
          onRecreate={handleRecreate}
          onTurnIntoVideo={handleTurnIntoVideo}
          onScrollToPrompt={handleScrollToPrompt}
          onShowVideoGeneration={handleShowVideoGeneration}
        />
      </div>
    </div>
  )
} 