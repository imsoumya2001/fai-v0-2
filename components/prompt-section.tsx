"use client"

import { useState } from "react"
import { Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ParticleButton } from "@/components/ui/particle-button"
import { useToast } from "@/hooks/use-toast"

interface PromptSectionProps {
  prompt: string
  setPrompt: (prompt: string) => void
  uploadedImage: string | null
  selectedStyles: string[]
  imageCount: 1 | 2 | 4
  setImageCount: (count: 1 | 2 | 4) => void
}

export function PromptSection({
  prompt,
  setPrompt,
  uploadedImage,
  selectedStyles,
  imageCount,
  setImageCount,
}: PromptSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const generatePrompt = async () => {
    if (!uploadedImage) {
      toast({
        title: "No image uploaded",
        description: "Please upload an image first to generate a prompt.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: uploadedImage,
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
        description: "AI has analyzed your image and created an enhancement prompt.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate prompt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prompt Section */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Write your prompt or</h2>
            <div className="space-y-4">
              <Textarea
                placeholder="Describe your desired enhancement..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              <ParticleButton
                onClick={generatePrompt}
                disabled={isGenerating}
                variant="outline"
                className="w-full bg-transparent"
                successDuration={800}
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Magic Prompt
              </ParticleButton>
            </div>
          </div>

          {/* Number of Images */}
          <div>
            <h3 className="text-xl font-semibold mb-4">No of images</h3>
            <div className="grid grid-cols-3 gap-2">
              {([1, 2, 4] as const).map((count) => (
                <Button
                  key={count}
                  variant={imageCount === count ? "default" : "outline"}
                  onClick={() => setImageCount(count)}
                  className="h-12 text-lg font-medium"
                >
                  {count}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
