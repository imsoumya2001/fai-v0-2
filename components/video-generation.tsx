"use client"

import { useState } from "react"
import { Play, RotateCcw, Sparkles, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { TagGroup, TagList, Tag } from "@/components/ui/tag-group"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { ParticleButton } from "@/components/ui/particle-button"

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
  const [showAllVideoTags, setShowAllVideoTags] = useState(false)

  const recentVideos = generatedVideos.slice(0, 6)
  const totalVideos = generatedVideos.length

  // Video tags for video generation
  const videoTags = [
    "Dolly in", "Dolly out", "Zoom in", "Zoom out", "Pan left", "Pan right",
    "Tilt up", "Tilt down", "Rotate clockwise", "Rotate counter-clockwise",
    "Cinematic", "Smooth motion", "Slow motion", "Dynamic movement", "Static shot"
  ]
  
  const visibleVideoTags = showAllVideoTags ? videoTags : videoTags.slice(0, 5)

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-stretch">
          {/* Left Side - Image Preview */}
          <Card className="flex flex-col">
            <CardContent className="p-4 sm:p-6 flex flex-col flex-1">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Selected Image</h2>
              
              {/* Image Preview */}
              <div className="relative flex-1">
                <div className="group relative h-full min-h-[280px] sm:min-h-[350px] lg:min-h-[400px] overflow-hidden rounded-lg border">
                  <img
                    src={selectedImageForVideo.url}
                    alt="Selected furniture"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Video Parameters */}
          <Card className="flex flex-col">
            <CardContent className="p-4 sm:p-6 flex flex-col flex-1">
              <div className="flex-1 space-y-4 sm:space-y-5 lg:space-y-6">
                {/* Style Tags */}
                <TagGroup 
                  selectionMode="multiple" 
                  selectedKeys={selectedVideoTags}
                  onSelectionChange={(keys) => setSelectedVideoTags(Array.from(keys) as string[])}
                  className="space-y-2 sm:space-y-3"
                >
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">Style Tags</h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
                    <TagList className="flex flex-wrap gap-1.5 sm:gap-2">
                      {visibleVideoTags.map((tag) => (
                        <Tag key={tag} id={tag} className="cursor-pointer text-xs font-medium min-h-[36px] sm:min-h-[32px] px-2.5 sm:px-3 py-1.5 sm:py-1 touch-manipulation transition-all duration-200">
                          {tag}
                        </Tag>
                      ))}
                    </TagList>
                    {videoTags.length > 5 && (
                      <Button
                        variant="ghost"
                        className="h-9 sm:h-8 px-3 sm:px-4 rounded-full text-xs font-medium border border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all duration-200 bg-gray-50/50 hover:bg-gray-100 touch-manipulation"
                        onClick={() => setShowAllVideoTags(!showAllVideoTags)}
                      >
                        {showAllVideoTags ? (
                          <>
                            show less <ChevronUp className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                          </>
                        ) : (
                          <>
                            show more <ChevronDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </TagGroup>

                {/* Video Prompt */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Write a prompt for your video</h3>
                  <div className="flex-1 flex flex-col space-y-2 sm:space-y-3">
                    <div className="relative flex-1">
                      <Textarea
                        value={videoPrompt}
                        onChange={(e) => setVideoPrompt(e.target.value)}
                        placeholder="Describe the video movement and style you want..."
                        className="h-full min-h-[100px] sm:min-h-[120px] resize-none pr-2 pb-12 sm:pr-20 sm:pb-2 text-sm"
                      />
                      <ParticleButton
                        variant="default"
                        size="sm"
                        onClick={handleGenerateVideoPrompt}
                        disabled={isGeneratingPrompt}
                        className="absolute bottom-2 right-2 h-8 sm:h-9 px-2 sm:px-3 text-xs font-medium"
                        successDuration={800}
                      >
                        {isGeneratingPrompt ? (
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        ) : (
                          <Sparkles className="mr-1 h-3 w-3" />
                        )}
                        Magic Prompt
                      </ParticleButton>
                    </div>

                    <RainbowButton
                      onClick={handleGenerateVideo}
                      disabled={!videoPrompt.trim()}
                      className="w-full h-10 sm:h-11 text-sm sm:text-base font-medium"
                    >
                      <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Generate Video
                    </RainbowButton>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
