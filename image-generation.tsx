"use client"

import { useState } from "react"
import { Download, Video, Loader2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { GeneratedImage } from "@/app/page"

interface ImageGenerationProps {
  uploadedImage: string
  prompt: string
  imageCount: 1 | 2 | 4
  generatedImages: GeneratedImage[]
  onImageGenerated: (images: GeneratedImage[]) => void
  onSelectForVideo: (image: GeneratedImage) => void
}

export function ImageGeneration({
  uploadedImage,
  prompt,
  imageCount,
  generatedImages,
  onImageGenerated,
  onSelectForVideo,
}: ImageGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [status, setStatus] = useState("")
  const { toast } = useToast()

  const generateImages = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing prompt",
        description: "Please enter a prompt or generate one with AI.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setStatus("Analyzing with Gemini...")

    try {
      setStatus("Generating with Runware...")

      const response = await fetch("/api/runware/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          image: uploadedImage,
          count: imageCount,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate images")
      }

      const data = await response.json()
      const images: GeneratedImage[] = data.images.map((url: string, index: number) => ({
        id: `${Date.now()}-${index}`,
        url,
        prompt,
        timestamp: Date.now(),
      }))

      onImageGenerated(images)
      setStatus("")

      toast({
        title: "Images generated!",
        description: `Successfully generated ${images.length} enhanced image${images.length > 1 ? "s" : ""}.`,
      })
    } catch (error) {
      console.error("Image generation error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate images. Please try again.",
        variant: "destructive",
      })
      setStatus("")
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download the image. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Image Generation</h2>

      <div className="space-y-6">
        <Button
          onClick={generateImages}
          disabled={isGenerating || !prompt.trim()}
          className="w-full sm:w-auto"
          size="lg"
        >
          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Generate Enhanced Images
        </Button>

        {status && (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{status}</span>
          </div>
        )}

        {generatedImages.length > 0 && (
          <div
            className={`grid gap-4 ${
              generatedImages.length === 1
                ? "grid-cols-1 max-w-md mx-auto"
                : generatedImages.length === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {generatedImages.map((image) => (
              <div key={image.id} className="space-y-3">
                <div className="relative group">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt="Generated furniture"
                    className="w-full rounded-lg shadow-md"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button variant="secondary" size="sm" onClick={() => window.open(image.url, "_blank")}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadImage(image.url, `furniture-ai-${image.id}.webp`)}
                    className="flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button size="sm" onClick={() => onSelectForVideo(image)} className="flex-1">
                    <Video className="mr-2 h-4 w-4" />
                    Create Video
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
