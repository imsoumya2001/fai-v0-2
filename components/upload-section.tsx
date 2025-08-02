"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { ImagePlus, X, Upload, Trash2, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
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
        } as React.ChangeEvent<HTMLInputElement>
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
    <div className="grid grid-cols-2 gap-8 items-stretch">
      {/* Left Side - Upload */}
      <Card className="flex flex-col">
        <CardContent className="p-6 flex flex-col flex-1">
          <h2 className="text-xl font-semibold mb-4">Upload Your Furniture Photo</h2>

          <Input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

          {!previewUrl ? (
            <div
              onClick={handleThumbnailClick}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "flex flex-1 min-h-[400px] cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted",
                isDragging && "border-primary/50 bg-primary/5",
              )}
            >
              <div className="rounded-full bg-background p-3 shadow-sm">
                <ImagePlus className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-xl font-medium">Click to select</p>
                <p className="text-sm text-muted-foreground">or drag and drop file here</p>
              </div>
            </div>
          ) : (
            <div className="relative flex-1">
              <div className="group relative h-full min-h-[400px] overflow-hidden rounded-lg border">
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
        <CardContent className="p-6 flex flex-col flex-1">
          

          <div className="flex-1 space-y-6">
            {/* Style Tags - Now using the separate component */}
            <StyleTagsSection selectedStyles={selectedStyles} setSelectedStyles={setSelectedStyles} />

            {/* Number of Images - Removed blue number display */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">No of images</h3>
                <div className="flex items-center gap-2">
                  {[1, 2, 4].map((count) => (
                    <Button
                      key={count}
                      variant={imageCount === count ? "default" : "outline"}
                      size="sm"
                      onClick={() => setImageCount(count as 1 | 2 | 4)}
                      className="w-8 h-8 p-0"
                    >
                      {count}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Prompt Section - Updated Magic button text */}
            <div className="flex-1 flex flex-col">
              <h3 className="text-lg font-semibold mb-3">Write your prompt</h3>
              <div className="flex-1 flex flex-col space-y-3">
                <div className="relative flex-1">
                  <Textarea
                    placeholder="Describe your desired enhancement..."
                    value={prompt || ""}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="h-full min-h-[120px] resize-none pr-28"
                  />
                  <Button
                    variant="default"
                    size="sm"
                    onClick={generatePrompt}
                    disabled={isGeneratingPrompt || !previewUrl}
                    className="absolute bottom-2 right-2"
                  >
                    {isGeneratingPrompt ? (
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="mr-1 h-3 w-3" />
                    )}
                    Magic Prompt
                  </Button>
                </div>

                <Button
                  onClick={onGenerateImage}
                  disabled={isGenerating || !prompt || !prompt.trim() || !previewUrl}
                  size="lg"
                  className="w-full"
                >
                  {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Generate Image
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
