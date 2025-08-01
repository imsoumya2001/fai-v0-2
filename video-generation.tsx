"use client"

import { useState, useRef } from "react"
import { Play, Download, Loader2, Sparkles, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import type { GeneratedImage, GeneratedVideo } from "@/app/page"

const VIDEO_STYLES = ["Zoom In", "Dolly In", "Pan Left", "Pan Right", "Static Hold", "Slow Motion", "Dynamic Movement"]

interface VideoGenerationProps {
  selectedImage: GeneratedImage
  onVideoGenerated: (video: GeneratedVideo) => void
  generatedVideos: GeneratedVideo[]
}

export function VideoGeneration({ selectedImage, onVideoGenerated, generatedVideos }: VideoGenerationProps) {
  const [selectedVideoStyles, setSelectedVideoStyles] = useState<string[]>([])
  const [videoPrompt, setVideoPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false)
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const [canCancel, setCanCancel] = useState(false)
  const { toast } = useToast()
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  const toggleVideoStyle = (style: string) => {
    setSelectedVideoStyles((prev) => (prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]))
  }

  const generateVideoPrompt = async () => {
    setIsGeneratingPrompt(true)
    setError("")

    try {
      const response = await fetch("/api/gemini/video-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: selectedImage.url,
          styles: selectedVideoStyles,
          originalPrompt: selectedImage.prompt,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate video prompt")
      }

      const data = await response.json()
      setVideoPrompt(data.prompt)

      toast({
        title: "Video prompt generated!",
        description: "AI has created a cinematic prompt for your video.",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate video prompt"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPrompt(false)
    }
  }

  const cancelVideoGeneration = () => {
    if (pollingRef.current) {
      clearTimeout(pollingRef.current)
      pollingRef.current = null
    }
    setIsGenerating(false)
    setCanCancel(false)
    setStatus("")
    setError("")
    toast({
      title: "Cancelled",
      description: "Video generation has been cancelled.",
    })
  }

  const generateVideo = async () => {
    if (!videoPrompt.trim()) {
      toast({
        title: "Missing prompt",
        description: "Please enter a video prompt or generate one with AI.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setCanCancel(true)
    setStatus("Submitting video generation request...")
    setError("")

    try {
      const response = await fetch("/api/fal/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: videoPrompt,
          imageUrl: selectedImage.url,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate video")
      }

      const data = await response.json()

      if (data.video?.url) {
        // Direct response - video is ready
        handleVideoComplete(data.video.url)
      } else if (data.requestId) {
        // Queued response - start polling
        setStatus("Video generation in progress...")
        pollVideoStatus(data.requestId)
      } else {
        throw new Error("Invalid response from video generation API")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate video"
      console.error("Video generation error:", error)
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      setStatus("")
      setIsGenerating(false)
      setCanCancel(false)
    }
  }

  const pollVideoStatus = async (requestId: string) => {
    let pollCount = 0
    const maxPolls = 120 // Maximum 10 minutes of polling (5 second intervals)

    const poll = async () => {
      try {
        if (pollCount >= maxPolls) {
          throw new Error("Video generation timeout - please try again with a shorter prompt")
        }

        const response = await fetch(`/api/fal/video/status?requestId=${requestId}`)

        if (!response.ok) {
          // If status check fails, wait a bit longer and try again
          if (pollCount < 5) {
            pollCount++
            setStatus(`Checking video status... (attempt ${pollCount})`)
            pollingRef.current = setTimeout(poll, 10000) // Wait 10 seconds for first few attempts
            return
          }
          throw new Error("Unable to check video status")
        }

        const data = await response.json()
        pollCount++

        if (data.status === "completed" && data.video?.url) {
          handleVideoComplete(data.video.url)
        } else if (data.status === "failed" || data.error) {
          throw new Error(data.error || "Video generation failed")
        } else {
          // Continue polling
          const minutes = Math.floor((pollCount * 5) / 60)
          const seconds = (pollCount * 5) % 60
          setStatus(`Video generation in progress... (${minutes}:${String(seconds).padStart(2, "0")})`)
          pollingRef.current = setTimeout(poll, 5000) // Poll every 5 seconds
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Video generation failed"
        console.error("Polling error:", error)
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        setStatus("")
        setIsGenerating(false)
        setCanCancel(false)
        if (pollingRef.current) {
          clearTimeout(pollingRef.current)
          pollingRef.current = null
        }
      }
    }

    poll()
  }

  const handleVideoComplete = (videoUrl: string) => {
    const video: GeneratedVideo = {
      id: `video-${Date.now()}`,
      url: videoUrl,
      imageUrl: selectedImage.url,
      prompt: videoPrompt,
      timestamp: Date.now(),
    }

    onVideoGenerated(video)
    setStatus("")
    setError("")
    setIsGenerating(false)
    setCanCancel(false)

    if (pollingRef.current) {
      clearTimeout(pollingRef.current)
      pollingRef.current = null
    }

    toast({
      title: "Video generated!",
      description: "Your cinematic furniture video is ready.",
    })
  }

  const downloadVideo = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download the video. Please try again.",
        variant: "destructive",
      })
    }
  }

  const retryGeneration = () => {
    setError("")
    generateVideo()
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Video Generation</h2>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <img
            src={selectedImage.url || "/placeholder.svg"}
            alt="Selected for video"
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div>
            <p className="font-medium">Selected Image</p>
            <p className="text-sm text-gray-600">Ready for video transformation</p>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Video Style Tags</h3>
          <div className="flex flex-wrap gap-2">
            {VIDEO_STYLES.map((style) => (
              <Badge
                key={style}
                variant={selectedVideoStyles.includes(style) ? "default" : "outline"}
                className="cursor-pointer px-3 py-1 hover:bg-blue-100 transition-colors"
                onClick={() => toggleVideoStyle(style)}
              >
                {style}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Video Prompt</h3>
            <Button variant="outline" size="sm" onClick={generateVideoPrompt} disabled={isGeneratingPrompt}>
              {isGeneratingPrompt ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Magic Prompt
            </Button>
          </div>

          <Textarea
            placeholder="Describe the cinematic movement and style for your video..."
            value={videoPrompt}
            onChange={(e) => setVideoPrompt(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={retryGeneration} className="ml-2 bg-transparent">
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3">
          <Button onClick={generateVideo} disabled={isGenerating || !videoPrompt.trim()} size="lg" className="flex-1">
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
            Generate Video
          </Button>

          {canCancel && (
            <Button variant="outline" size="lg" onClick={cancelVideoGeneration}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>

        {status && (
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{status}</span>
          </div>
        )}

        {generatedVideos.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Generated Videos</h3>
            <div className="grid gap-4">
              {generatedVideos.map((video) => (
                <div key={video.id} className="border rounded-lg p-4">
                  <video controls className="w-full max-w-md mx-auto rounded-lg mb-4" poster={video.imageUrl}>
                    <source src={video.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => downloadVideo(video.url, `furniture-video-${video.id}.mp4`)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download MP4
                    </Button>
                  </div>

                  <div className="mt-2 text-xs text-gray-500 text-center">
                    Generated: {new Date(video.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
