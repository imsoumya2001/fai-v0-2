"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface UploadSectionProps {
  uploadedImage: string | null
  setUploadedImage: (image: string | null) => void
  imageCount: 1 | 2 | 4
  setImageCount: (count: 1 | 2 | 4) => void
}

export function UploadSection({ uploadedImage, setUploadedImage, imageCount, setImageCount }: UploadSectionProps) {
  const { toast } = useToast()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        if (file.size > 15 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please select an image under 15MB",
            variant: "destructive",
          })
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          setUploadedImage(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    },
    [setUploadedImage, toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxFiles: 1,
  })

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Upload Your Furniture Photo</h2>

      {!uploadedImage ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg text-gray-600 mb-2">Drop your furniture photo here or click to browse</p>
          <p className="text-sm text-gray-500">Supports JPG, PNG up to 15MB</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative">
            <img
              src={uploadedImage || "/placeholder.svg"}
              alt="Uploaded furniture"
              className="w-full max-w-md mx-auto rounded-lg shadow-md"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => setUploadedImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="max-w-md mx-auto">
            <Label className="text-base font-medium mb-3 block">Number of images to generate:</Label>
            <RadioGroup
              value={imageCount.toString()}
              onValueChange={(value) => setImageCount(Number.parseInt(value) as 1 | 2 | 4)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="count-1" />
                <Label htmlFor="count-1">1 image</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="count-2" />
                <Label htmlFor="count-2">2 images</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="count-4" />
                <Label htmlFor="count-4">4 images</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      )}
    </Card>
  )
}
