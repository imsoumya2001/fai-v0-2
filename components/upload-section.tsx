"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { ImagePlus, X, Upload, Trash2, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { ParticleButton } from "@/components/ui/particle-button"
import { StyleTagsSection } from "@/components/style-tags-section"
import { useToast } from "@/hooks/use-toast"
import { useImageUpload } from "@/hooks/use-image-upload"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface UploadSectionProps {
  uploadedImage: string | null
  setUploadedImage: (image: string | null) => void
  imageCount: 1 | 2 | 4
  setImageCount: (count: 1 | 2 | 4) => void
  prompt: string
  setPrompt: (prompt: string) => void
  onGenerateImage: () => void
  isGenerating: boolean
}

export function UploadSection({
  uploadedImage,
  setUploadedImage,
  imageCount,
  setImageCount,
  prompt,
  setPrompt,
  onGenerateImage,
  isGenerating,
}: UploadSectionProps) {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const { toast } = useToast()

  const { previewUrl, fileName, fileInputRef, handleThumbnailClick, handleFileChange, handleRemove } = useImageUpload({
    onUpload: (url) => setUploadedImage(url),
  })

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file && file.type.startsWith("image/")) {
        const fakeEvent = {
          target: {
            files: [file],
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>
        handleFileChange(fakeEvent)
      }
    },
    [handleFileChange],
  )

  const generatePrompt = async () => {
    if (!previewUrl) {
      toast({
        title: "Missing image",
        description: "Please upload an image first.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingPrompt(true)

    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: previewUrl,
          styles: selectedStyles,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate prompt")
      }

      const data = await response.json()
      setPrompt(data.prompt)

      toast({
        title: "Prompt generated!",
        description: "AI has analyzed your image and created a prompt.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate prompt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPrompt(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-stretch">
      {/* Left Side - Upload */}
      <Card className="flex flex-col">
        <CardContent className="p-4 sm:p-6 flex flex-col flex-1">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Upload Your Furniture Photo</h2>

          <Input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

          {!previewUrl ? (
            <div
              onClick={handleThumbnailClick}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "flex flex-1 min-h-[280px] sm:min-h-[350px] lg:min-h-[400px] cursor-pointer flex-col items-center justify-center gap-3 sm:gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted",
                isDragging && "border-primary/50 bg-primary/5",
              )}
            >
              <div className="rounded-full bg-background p-2 sm:p-3 shadow-sm">
                <ImagePlus className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-base sm:text-lg lg:text-xl font-medium">Tap to select</p>
                <p className="text-xs sm:text-sm text-muted-foreground">or drag and drop file here</p>
              </div>
            </div>
          ) : (
            <div className="relative flex-1">
              <div className="group relative h-full min-h-[280px] sm:min-h-[350px] lg:min-h-[400px] overflow-hidden rounded-lg border">
                <Image
                  src={previewUrl || "/placeholder.svg"}
                  alt="Preview"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button size="sm" variant="secondary" onClick={handleThumbnailClick} className="h-9 w-9 p-0">
                    <Upload className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={handleRemove} className="h-9 w-9 p-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {fileName && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="text-sm font-medium text-gray-700 truncate">{fileName}</span>
                    </div>
                    <button 
                      onClick={handleRemove} 
                      className="ml-2 flex-shrink-0 rounded-full p-1.5 hover:bg-gray-200 transition-colors"
                      title="Remove image"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right Side - Parameters */}
      <Card className="flex flex-col">
        <CardContent className="p-4 sm:p-6 flex flex-col flex-1">
          

          <div className="flex-1 space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Style Tags - Now using the separate component */}
            <StyleTagsSection selectedStyles={selectedStyles} setSelectedStyles={setSelectedStyles} />

            {/* Number of Images - Mobile optimized */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2 sm:mb-3">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">No of images</h3>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {[1, 2, 4].map((count) => (
                    <Button
                      key={count}
                      variant={imageCount === count ? "default" : "outline"}
                      size="sm"
                      onClick={() => setImageCount(count as 1 | 2 | 4)}
                      className="min-w-[40px] h-9 sm:h-8 text-sm font-medium px-3 sm:px-2"
                    >
                      {count}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Prompt Section - Mobile optimized */}
            <div className="flex-1 flex flex-col">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Write your prompt</h3>
              <div className="flex-1 flex flex-col space-y-2 sm:space-y-3">
                <div className="relative flex-1">
                  <Textarea
                    placeholder="Describe your desired enhancement..."
                    value={prompt || ""}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="h-full min-h-[100px] sm:min-h-[120px] resize-none pr-2 pb-12 sm:pr-20 sm:pb-2 text-sm"
                  />
                  <ParticleButton
                    variant="default"
                    size="sm"
                    onClick={generatePrompt}
                    disabled={isGeneratingPrompt || !previewUrl}
                    className="absolute bottom-2 right-2 h-8 sm:h-9 px-2 sm:px-3 text-xs font-medium"
                    successDuration={800}
                  >
                    {isGeneratingPrompt ? (
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="mr-1 h-3 w-3" />
                    )}
                    Magic
                  </ParticleButton>
                </div>

                <RainbowButton
                  onClick={onGenerateImage}
                  disabled={isGenerating || !prompt || !prompt.trim() || !previewUrl}
                  className="w-full h-10 sm:h-11 text-sm sm:text-base font-medium"
                >
                  {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Generate Image
                </RainbowButton>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
