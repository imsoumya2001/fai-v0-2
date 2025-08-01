"use client"

import { useState } from "react"
import { RotateCcw, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

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
}

export function ImageGeneration({ generatedImages = [], onRecreate, onTurnIntoVideo }: ImageGenerationProps) {
  const [viewAllOpen, setViewAllOpen] = useState(false)

  const recentImages = generatedImages.slice(0, 10)
  const totalImages = generatedImages.length

  return (
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
                      <div key={image.id} className="group relative">
                        <div className="aspect-square overflow-hidden rounded-lg border">
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt="Generated furniture"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => onRecreate(image)}
                              className="h-8 w-8 p-0"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => onTurnIntoVideo(image)}
                              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Turn into Video
                            </Button>
                          </div>
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
                  <div className="w-64 aspect-square overflow-hidden rounded-lg border">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt="Generated furniture"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" onClick={() => onRecreate(image)} className="h-8 w-8 p-0">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onTurnIntoVideo(image)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Turn into Video
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
  )
}
