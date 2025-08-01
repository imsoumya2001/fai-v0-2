"use client"

import type React from "react"

import { useState, useRef } from "react"

interface UseImageUploadProps {
  onUpload: (url: string) => void
}

export function useImageUpload({ onUpload }: UseImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleThumbnailClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setPreviewUrl(result)
        setFileName(file.name)
        onUpload(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    setFileName(null)
    onUpload("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return {
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
  }
}
