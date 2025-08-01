"use client"

import { useState, useCallback } from "react"
import { Header } from "@/components/header"
import { UploadSection } from "@/components/upload-section"
import { StyleTagsSection } from "@/components/style-tags-section"
import { PromptSection } from "@/components/prompt-section"
import { ImageGeneration } from "@/components/image-generation"
import { VideoGeneration } from "@/components/video-generation"
import { RecentHistory } from "@/components/recent-history"
import { useLocalStorage } from "@/hooks/use-local-storage"

export interface GeneratedImage {
  id: string
  url: string
  prompt: string
  timestamp: number
}

export interface GeneratedVideo {
  id: string
  url: string
  imageUrl: string
  prompt: string
  timestamp: number
}

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imageCount, setImageCount] = useState<1 | 2 | 4>(1)
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [prompt, setPrompt] = useState("")
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [selectedImageForVideo, setSelectedImageForVideo] = useState<GeneratedImage | null>(null)
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([])

  const [imageHistory, setImageHistory] = useLocalStorage<GeneratedImage[]>("furniture-ai-images", [])
  const [videoHistory, setVideoHistory] = useLocalStorage<GeneratedVideo[]>("furniture-ai-videos", [])

  const handleImageGenerated = useCallback(
    (images: GeneratedImage[]) => {
      setGeneratedImages(images)
      setImageHistory((prev) => [...images, ...prev].slice(0, 10))
    },
    [setImageHistory],
  )

  const handleVideoGenerated = useCallback(
    (video: GeneratedVideo) => {
      setGeneratedVideos((prev) => [video, ...prev])
      setVideoHistory((prev) => [video, ...prev].slice(0, 10))
    },
    [setVideoHistory],
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <UploadSection
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
          imageCount={imageCount}
          setImageCount={setImageCount}
        />

        {uploadedImage && (
          <>
            <StyleTagsSection selectedStyles={selectedStyles} setSelectedStyles={setSelectedStyles} />

            <PromptSection
              prompt={prompt}
              setPrompt={setPrompt}
              uploadedImage={uploadedImage}
              selectedStyles={selectedStyles}
            />

            <ImageGeneration
              uploadedImage={uploadedImage}
              prompt={prompt}
              imageCount={imageCount}
              generatedImages={generatedImages}
              onImageGenerated={handleImageGenerated}
              onSelectForVideo={setSelectedImageForVideo}
            />

            {selectedImageForVideo && (
              <VideoGeneration
                selectedImage={selectedImageForVideo}
                onVideoGenerated={handleVideoGenerated}
                generatedVideos={generatedVideos}
              />
            )}

            <RecentHistory imageHistory={imageHistory} videoHistory={videoHistory} />
          </>
        )}
      </main>
    </div>
  )
}
