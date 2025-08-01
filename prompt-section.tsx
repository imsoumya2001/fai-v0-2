"use client"

import { useState } from "react"
import { Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface PromptSectionProps {
  prompt: string
  setPrompt: (prompt: string) => void
  uploadedImage: string
  selectedStyles: string[]
}

export function PromptSection({ prompt, setPrompt, uploadedImage, selectedStyles }: PromptSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const generatePrompt = async () => {
    if (!uploadedImage) return

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
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Magic Prompt Generation</h2>

      <div className="space-y-4">
        <Textarea
          placeholder="Describe your desired enhancement..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[120px] resize-none"
        />

        <Button onClick={generatePrompt} disabled={isGenerating || !uploadedImage} className="w-full sm:w-auto">
          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Generate Prompt with AI
        </Button>
      </div>
    </Card>
  )
}
