"use client"

import { useState } from "react"
import { Play, RotateCcw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"

interface GeneratedImage {
  id: string
  url: string
  prompt: string
  timestamp: Date
}

interface GeneratedVideo {
  id: string
  url: string
  prompt: string
  timestamp: Date
  status: "generating" | "completed" | "failed"
}

interface VideoGenerationProps {
  generatedVideos: GeneratedVideo[]
  onRecreateVideo: (video: GeneratedVideo) => void
  selectedImageForVideo: GeneratedImage | null
  onGenerateVideo: (image: GeneratedImage, prompt: string) => void
}

export function VideoGeneration({ 
  generatedVideos = [], 
  onRecreateVideo, 
  selectedImageForVideo,
  onGenerateVideo 
}: VideoGenerationProps) {
  const [viewAllOpen, setViewAllOpen] = useState(false)
  const [videoPrompt, setVideoPrompt] = useState("")
  const [selectedVideoTags, setSelectedVideoTags] = useState<string[]>([])
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false)

  const recentVideos = generatedVideos.slice(0, 6)
  const totalVideos = generatedVideos.length

  // Video tags for video generation
  const videoTags = [
    "Dolly in", "Dolly out", "Zoom in", "Zoom out", "Pan left", "Pan right",
    "Tilt up", "Tilt down", "Rotate clockwise", "Rotate counter-clockwise",
    "Cinematic", "Smooth motion", "Slow motion", "Dynamic movement", "Static shot"
  ]

  const handleVideoTagToggle = (tag: string) => {
    setSelectedVideoTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const handleGenerateVideoPrompt = async () => {
    if (!selectedImageForVideo) return
    
    setIsGeneratingPrompt(true)
    try {
      const response = await fetch('/api/gemini/video-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImageForVideo.url,
          tags: selectedVideoTags,
          originalPrompt: selectedImageForVideo.prompt
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setVideoPrompt(data.prompt)
      }
    } catch (error) {
      console.error('Error generating video prompt:', error)
    } finally {
      setIsGeneratingPrompt(false)
    }
  }

  const handleGenerateVideo = () => {
    if (selectedImageForVideo && videoPrompt.trim()) {
      onGenerateVideo(selectedImageForVideo, videoPrompt)
    }
  }

  return (
    <>
      {selectedImageForVideo && (
        <Card className="mt-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Generate Video</h2>
            
            {/* Selected Image Preview */}
            <div className="flex justify-center mb-6">
              <div className="w-48 aspect-square overflow-hidden rounded-lg border">
                <img
                  src={selectedImageForVideo.url}
                  alt="Selected furniture"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Video Tags */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Style Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {videoTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleVideoTagToggle(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ease-out border-2 whitespace-nowrap ${
                        selectedVideoTags.includes(tag)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Prompt */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Write a prompt for your video</h3>
                  <Button
                    variant="outline"
                    onClick={handleGenerateVideoPrompt}
                    disabled={isGeneratingPrompt}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    {isGeneratingPrompt ? 'Generating...' : 'Magic Prompt'}
                  </Button>
                </div>
                <Textarea
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  placeholder="Describe the video movement and style you want (3-4 sentences max)..."
                  className="min-h-[120px] text-base resize-none"
                />
              </div>

              {/* Generate Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleGenerateVideo}
                  disabled={!videoPrompt.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Generate Video
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Generated Videos</h2>
            {totalVideos > 6 && (
              <Dialog open={viewAllOpen} onOpenChange={setViewAllOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">View All ({totalVideos})</Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh]">
                  <ScrollArea className="h-full">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                      {generatedVideos.map((video) => (
                        <div key={video.id} className="group relative">
                          <div className="aspect-video overflow-hidden rounded-lg border bg-gray-100">
                            {video.status === "completed" && video.url ? (
                              <video
                                src={video.url}
                                controls
                                className="w-full h-full object-cover"
                              />
                            ) : video.status === "generating" ? (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-red-500">
                                Generation failed
                              </div>
                            )}
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500 truncate flex-1">
                              {video.prompt.slice(0, 30)}...
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onRecreateVideo(video)}
                              className="ml-2"
                            >
                              <RotateCcw className="h-3 w-3" />
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

          {recentVideos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No videos generated yet. Click "Video" on any generated image!</p>
            </div>
          ) : (
            <ScrollArea className="w-full">
              <div className="flex gap-4 pb-4">
                {recentVideos.map((video) => (
                  <div key={video.id} className="group relative flex-shrink-0">
                    <div className="w-64 aspect-video overflow-hidden rounded-lg border bg-gray-100">
                      {video.status === "completed" && video.url ? (
                        <video
                          src={video.url}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : video.status === "generating" ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-red-500">
                          Generation failed
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600 truncate flex-1">
                        {video.prompt.slice(0, 40)}...
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRecreateVideo(video)}
                        className="ml-2"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </>
  )
}
