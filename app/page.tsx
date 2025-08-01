"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { UploadSection } from "@/components/upload-section"
import { ImageGeneration } from "@/components/image-generation"
import { VideoGeneration } from "@/components/video-generation"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

interface GeneratedImage {
  id: string
  url: string
  prompt: string
  timestamp: Date
}

interface GeneratedVideo {
  id: string
  url: string
  thumbnail: string
  prompt: string
  timestamp: Date
  status: "generating" | "completed" | "failed"
  progress?: number
}

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imageCount, setImageCount] = useState<1 | 2 | 4>(4)
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([])
  const { toast } = useToast()

  const handleGenerateImage = async () => {
    if (!uploadedImage || !prompt.trim()) {
      toast({
        title: "Missing information",
        description: "Please upload an image and enter a prompt.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/runware/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          image: uploadedImage,
          numberOfImages: imageCount,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate images")
      }

      const data = await response.json()

      const newImages: GeneratedImage[] = data.images.map((url: string, index: number) => ({
        id: `${Date.now()}-${index}`,
        url,
        prompt,
        timestamp: new Date(),
      }))

      setGeneratedImages((prev) => [...newImages, ...prev])

      toast({
        title: "Images generated!",
        description: `Successfully generated ${newImages.length} image(s).`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRecreateImage = async (image: GeneratedImage) => {
    setPrompt(image.prompt)
    await handleGenerateImage()
  }

  const handleTurnIntoVideo = async (image: GeneratedImage) => {
    const videoId = `video-${Date.now()}`

    // Add video with generating status
    const newVideo: GeneratedVideo = {
      id: videoId,
      url: "",
      thumbnail: image.url,
      prompt: image.prompt,
      timestamp: new Date(),
      status: "generating",
      progress: 0,
    }

    setGeneratedVideos((prev) => [newVideo, ...prev])

    try {
      const response = await fetch("/api/fal/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: image.url,
          prompt: image.prompt,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate video")
      }

      const data = await response.json()

      // Update video with completed status
      setGeneratedVideos((prev) =>
        prev.map((video) =>
          video.id === videoId ? { ...video, url: data.videoUrl, status: "completed" as const } : video,
        ),
      )

      toast({
        title: "Video generated!",
        description: "Your furniture video is ready.",
      })
    } catch (error) {
      // Update video with failed status
      setGeneratedVideos((prev) =>
        prev.map((video) => (video.id === videoId ? { ...video, status: "failed" as const } : video)),
      )

      toast({
        title: "Error",
        description: "Failed to generate video. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRecreateVideo = async (video: GeneratedVideo) => {
    // Find the original image and recreate the video
    const originalImage = generatedImages.find((img) => img.prompt === video.prompt)
    if (originalImage) {
      await handleTurnIntoVideo(originalImage)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <UploadSection
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
          imageCount={imageCount}
          setImageCount={setImageCount}
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerateImage={handleGenerateImage}
          isGenerating={isGenerating}
        />

        <ImageGeneration
          generatedImages={generatedImages}
          onRecreate={handleRecreateImage}
          onTurnIntoVideo={handleTurnIntoVideo}
        />

        <VideoGeneration generatedVideos={generatedVideos} onRecreate={handleRecreateVideo} />
      </main>

      <Toaster />
    </div>
  )
}
