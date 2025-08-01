"use client"

import { Download, Video, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { GeneratedImage, GeneratedVideo } from "@/app/page"

interface RecentHistoryProps {
  imageHistory: GeneratedImage[]
  videoHistory: GeneratedVideo[]
}

export function RecentHistory({ imageHistory, videoHistory }: RecentHistoryProps) {
  if (imageHistory.length === 0 && videoHistory.length === 0) {
    return null
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Recent History
      </h2>

      <Tabs defaultValue="images" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="images">Images ({imageHistory.length})</TabsTrigger>
          <TabsTrigger value="videos">Videos ({videoHistory.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="images" className="space-y-4">
          {imageHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No images generated yet</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {imageHistory.map((image) => (
                <div key={image.id} className="space-y-2">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt="Generated furniture"
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">{formatTimestamp(image.timestamp)}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => {
                        const link = document.createElement("a")
                        link.href = image.url
                        link.download = `furniture-ai-${image.id}.webp`
                        link.click()
                      }}
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          {videoHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No videos generated yet</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videoHistory.map((video) => (
                <div key={video.id} className="space-y-2">
                  <video className="w-full aspect-video rounded-lg" poster={video.imageUrl} controls>
                    <source src={video.url} type="video/mp4" />
                  </video>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">{formatTimestamp(video.timestamp)}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => {
                        const link = document.createElement("a")
                        link.href = video.url
                        link.download = `furniture-video-${video.id}.mp4`
                        link.click()
                      }}
                    >
                      <Video className="mr-1 h-3 w-3" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  )
}
