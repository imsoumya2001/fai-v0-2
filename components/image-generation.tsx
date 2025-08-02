"use client"

import { useState } from "react"
import { RotateCcw, Play, X, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FaImage, FaVideo, FaRedo } from "react-icons/fa"

interface GeneratedImage {
  id: string
  url: string
  prompt: string
  timestamp: Date
}

interface ImageGenerationProps {
  generatedImages: GeneratedImage[]
  onRecreate: (image: GeneratedImage) => void
  onTurnIntoVideo: (image: GeneratedImage) => void
  onScrollToPrompt?: () => void
  onShowVideoGeneration?: (image: GeneratedImage) => void
}

export function ImageGeneration({ generatedImages = [], onRecreate, onTurnIntoVideo, onScrollToPrompt, onShowVideoGeneration }: ImageGenerationProps) {
  const [viewAllOpen, setViewAllOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<GeneratedImage | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const recentImages = generatedImages.slice(0, 8)
  const totalImages = generatedImages.length

  const handleImageClick = (image: GeneratedImage) => {
    setPreviewImage(image)
    setPreviewOpen(true)
  }

  const handleDownload = () => {
    if (previewImage) {
      const link = document.createElement('a')
      link.href = previewImage.url
      link.download = `furniture-${previewImage.id}.jpg`
      link.click()
    }
  }

  const handleShare = async () => {
    if (!previewImage) return

    if (navigator.share) {
      // Mobile share
      try {
        await navigator.share({
          title: 'FurnitureAI Generated Image',
          text: previewImage.prompt,
          url: previewImage.url
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      // Desktop - copy link to clipboard
      try {
        await navigator.clipboard.writeText(previewImage.url)
        // You could add a toast notification here
        alert('Image link copied to clipboard!')
      } catch (error) {
        console.error('Failed to copy link')
      }
    }
  }

  const handleRetry = (image: GeneratedImage) => {
    if (onScrollToPrompt) {
      onScrollToPrompt()
    }
  }

  const handleOpenVideoGeneration = (image: GeneratedImage) => {
    if (onShowVideoGeneration) {
      onShowVideoGeneration(image)
    }
  }

  return (
    <>
      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-playfair italic font-light">Generated Images</h2>
            {totalImages > 8 && (
              <Dialog open={viewAllOpen} onOpenChange={setViewAllOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">View All ({totalImages})</Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh]">
                  <ScrollArea className="h-full">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                      {generatedImages.map((image) => (
                        <div key={image.id} className="group space-y-3">
                          {/* Image */}
                          <div 
                            className="aspect-square overflow-hidden rounded-lg border cursor-pointer"
                            onClick={() => handleImageClick(image)}
                          >
                            <img
                              src={image.url || "/placeholder.svg"}
                              alt="Generated furniture"
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRetry(image)
                              }}
                              className="flex-1 flex items-center gap-1 text-xs px-2"
                            >
                              <FaRedo className="h-3 w-3" />
                              Retry
                            </Button>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleOpenVideoGeneration(image)
                              }}
                              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center gap-1 text-xs px-2"
                            >
                              <FaVideo className="h-3 w-3" />
                              Video
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {recentImages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No images generated yet. Upload a furniture photo and generate your first image!</p>
            </div>
          ) : (
            <ScrollArea className="w-full">
              <div className="flex gap-4 pb-4">
                {recentImages.map((image) => (
                  <div key={image.id} className="group relative flex-shrink-0">
                    <div 
                      className="w-64 aspect-square overflow-hidden rounded-lg border cursor-pointer"
                      onClick={() => handleImageClick(image)}
                    >
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt="Generated furniture"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600 truncate flex-1">
                        {image.prompt.slice(0, 40)}...
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRetry(image)}
                          className="h-8 w-8 p-0"
                        >
                          <FaRedo className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleOpenVideoGeneration(image)}
                          className="h-8 w-8 p-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        >
                          <FaVideo className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Glassmorphic Image Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-transparent border-0 shadow-none">
          {previewImage && (
            <div className="relative w-full h-full">
              {/* Blurred Background */}
              <div 
                className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-30"
                style={{
                  backgroundImage: `url(${previewImage.url || "/placeholder.svg"})`
                }}
              />
              
              {/* Main Content */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6">
                  <div className="backdrop-blur-md bg-white/20 rounded-2xl px-6 py-3 border border-white/30">
                    <h3 className="text-xl font-poppins font-medium text-white drop-shadow-lg">Image Preview</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewOpen(false)}
                    className="h-12 w-12 p-0 backdrop-blur-md bg-white/20 rounded-full border border-white/30 hover:bg-white/30 text-white"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                {/* Image Content */}
                <div className="flex-1 flex items-center justify-center px-6 pb-6">
                  <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/30 shadow-2xl">
                    <img
                      src={previewImage.url || "/placeholder.svg"}
                      alt="Preview"
                      className="max-w-full max-h-[60vh] object-contain rounded-2xl shadow-lg"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 pb-6">
                  <Button 
                    onClick={handleDownload} 
                    className="backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 text-white font-medium px-6 py-3"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    onClick={handleShare}
                    className="backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 text-white font-medium px-6 py-3"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
