"use client"

import { useState } from "react"
import { Play, Pause, Download, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface GeneratedVideo {
  id: string
  url: string
  thumbnail: string
  prompt: string
  timestamp: Date
  status: "generating" | "completed" | "failed"
  progress?: number
}

interface VideoGenerationProps {
  generatedVideos: GeneratedVideo[]
  onRecreate: (video: GeneratedVideo) => void
}

export function VideoGeneration({ generatedVideos = [], onRecreate }: VideoGenerationProps) {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)

  const handleVideoPlay = (videoId: string) => {
    setPlayingVideo(playingVideo === videoId ? null : videoId)
  }

  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Generated Videos</h2>

        {generatedVideos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No videos generated yet. Generate an image first, then turn it into a video!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedVideos.map((video) => (
              <div key={video.id} className="group relative">
                <div className="aspect-video overflow-hidden rounded-lg border bg-gray-100">
                  {video.status === "generating" ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                      <p className="text-sm text-gray-600 mb-2">Generating video...</p>
                      {video.progress && <Progress value={video.progress} className="w-3/4" />}
                    </div>
                  ) : video.status === "failed" ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-red-500">
                      <p className="text-sm">Generation failed</p>
                      <Button size="sm" variant="outline" onClick={() => onRecreate(video)} className="mt-2">
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Retry
                      </Button>
                    </div>
                  ) : (
                    <>
                      <video
                        src={video.url}
                        poster={video.thumbnail}
                        className="w-full h-full object-cover"
                        controls={playingVideo === video.id}
                        onPlay={() => setPlayingVideo(video.id)}
                        onPause={() => setPlayingVideo(null)}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleVideoPlay(video.id)}
                          className="h-10 w-10 p-0"
                        >
                          {playingVideo === video.id ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            const a = document.createElement("a")
                            a.href = video.url
                            a.download = `video-${video.id}.mp4`
                            a.click()
                          }}
                          className="h-10 w-10 p-0"
                        >
                          <Download className="h-5 w-5" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600 truncate">{video.prompt}</p>
                  <p className="text-xs text-gray-400">{video.timestamp.toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
