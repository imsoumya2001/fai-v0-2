"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { GeneratedImage, GeneratedVideo } from "@/app/page"

interface RecentHistoryProps {
  imageHistory: GeneratedImage[]
  videoHistory: GeneratedVideo[]
}

export function RecentHistory({ imageHistory, videoHistory }: RecentHistoryProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent History</h2>

        {imageHistory.length === 0 && videoHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity. Generate some images or videos to see them here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {imageHistory.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">Recent Images</h3>
                <div className="grid grid-cols-5 gap-3">
                  {imageHistory.slice(0, 5).map((image) => (
                    <div key={image.id} className="aspect-square">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt="Recent image"
                        className="w-full h-full object-cover rounded-lg shadow-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {videoHistory.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">Recent Videos</h3>
                <div className="grid grid-cols-3 gap-3">
                  {videoHistory.slice(0, 3).map((video) => (
                    <div key={video.id} className="aspect-video">
                      <video className="w-full h-full object-cover rounded-lg shadow-sm" poster={video.imageUrl}>
                        <source src={video.url} type="video/mp4" />
                      </video>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
