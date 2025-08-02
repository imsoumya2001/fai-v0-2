"use client"

import { useState } from "react"
import { RotateCcw, Play, X, Download, ZoomIn, ZoomOut, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"

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
  const [zoom, setZoom] = useState([100])
  const [brightness, setBrightness] = useState([100])
  const [contrast, setContrast] = useState([100])


  const recentImages = generatedImages.slice(0, 10)
  const totalImages = generatedImages.length



  const handleImageClick = (image: GeneratedImage) => {
    setPreviewImage(image)
    setPreviewOpen(true)
    // Reset sliders
    setZoom([100])
    setBrightness([100])
    setContrast([100])
  }

  const handleDownload = () => {
    if (previewImage) {
      const link = document.createElement('a')
      link.href = previewImage.url
      link.download = `furniture-${previewImage.id}.jpg`
      link.click()
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
            <h2 className="text-2xl font-bold">Generated Images</h2>
            {totalImages > 10 && (
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
                            <RotateCcw className="h-3 w-3" />
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
                            <Play className="h-3 w-3" />
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
                  <div key={image.id} className="group flex-shrink-0">
                    <div className="w-64 space-y-3">
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
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRetry(image)}
                          className="flex-1 flex items-center gap-2"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Retry
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleOpenVideoGeneration(image)}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center gap-2"
                        >
                          <Play className="h-4 w-4" />
                          Video
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
        <DialogContent className="max-w-6xl max-h-[95vh] p-0 bg-transparent border-0 shadow-none">
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
                    <h3 className="text-xl font-semibold text-white drop-shadow-lg">Image Preview</h3>
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

                {/* Content */}
                <div className="flex-1 flex items-center justify-center px-6 pb-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full h-full max-h-[70vh]">
                    {/* Image */}
                    <div className="lg:col-span-3 flex items-center justify-center">
                      <div className="relative backdrop-blur-md bg-white/10 rounded-3xl p-6 border border-white/30 shadow-2xl">
                        <img
                          src={previewImage.url || "/placeholder.svg"}
                          alt="Preview"
                          className="max-w-full max-h-[60vh] object-contain rounded-2xl shadow-lg"
                          style={{
                            transform: `scale(${zoom[0] / 100})`,
                            filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%)`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="backdrop-blur-md bg-white/20 rounded-3xl p-6 border border-white/30 space-y-6">
                      <div>
                        <label className="text-sm font-medium mb-3 block text-white drop-shadow flex items-center gap-2">
                          <ZoomIn className="h-4 w-4" />
                          Zoom: {zoom[0]}%
                        </label>
                        <Slider
                          value={zoom}
                          onValueChange={setZoom}
                          min={50}
                          max={200}
                          step={10}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-3 block text-white drop-shadow">Brightness: {brightness[0]}%</label>
                        <Slider
                          value={brightness}
                          onValueChange={setBrightness}
                          min={0}
                          max={200}
                          step={10}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-3 block text-white drop-shadow">Contrast: {contrast[0]}%</label>
                        <Slider
                          value={contrast}
                          onValueChange={setContrast}
                          min={0}
                          max={200}
                          step={10}
                          className="w-full"
                        />
                      </div>

                      <div className="flex flex-col gap-3 pt-4">
                        <Button 
                          onClick={handleDownload} 
                          className="w-full backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 text-white font-medium"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            onRecreate(previewImage)
                            setPreviewOpen(false)
                          }}
                          className="w-full backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Regenerate
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            onTurnIntoVideo(previewImage)
                            setPreviewOpen(false)
                          }}
                          className="w-full backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Turn into Video
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>


    </>
  )
}
