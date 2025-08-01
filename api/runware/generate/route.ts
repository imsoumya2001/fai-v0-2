import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const { prompt, image, count = 1 } = await request.json()

    if (!prompt || !image) {
      return NextResponse.json({ error: "Prompt and image are required" }, { status: 400 })
    }

    // Convert data URL to base64
    const base64Data = image.split(",")[1]

    const requestBody = [
      {
        taskType: "authentication",
        apiKey: process.env.RUNWARE_API_KEY,
      },
      {
        taskType: "imageInference",
        taskUUID: uuidv4(),
        model: "bfl:3@1",
        positivePrompt: prompt,
        referenceImages: [base64Data],
        width: 1024,
        height: 1024,
        numberResults: count,
        outputFormat: "WEBP",
        outputType: ["URL"],
        includeCost: true,
      },
    ]

    const response = await fetch("https://api.runware.ai/v1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()

    // Handle different response formats from Runware API
    let images: string[] = []

    if (Array.isArray(data)) {
      // If data is an array, filter for imageInference results
      images = data
        .filter((item: any) => item.taskType === "imageInference" && item.imageURL)
        .map((item: any) => item.imageURL)
    } else if (data.data && Array.isArray(data.data)) {
      // If data has a nested data array
      images = data.data
        .filter((item: any) => item.taskType === "imageInference" && item.imageURL)
        .map((item: any) => item.imageURL)
    } else if (data.result && Array.isArray(data.result)) {
      // If data has a result array
      images = data.result.filter((item: any) => item.imageURL).map((item: any) => item.imageURL)
    } else if (data.imageURL) {
      // If it's a single image response
      images = [data.imageURL]
    } else if (data.images && Array.isArray(data.images)) {
      // If it has an images array
      images = data.images
    } else {
      // Log the actual response for debugging
      console.log("Unexpected Runware response format:", JSON.stringify(data, null, 2))

      // Try to extract any URLs from the response
      const extractUrls = (obj: any): string[] => {
        const urls: string[] = []

        const traverse = (item: any) => {
          if (
            typeof item === "string" &&
            item.startsWith("http") &&
            (item.includes(".webp") || item.includes(".jpg") || item.includes(".png"))
          ) {
            urls.push(item)
          } else if (typeof item === "object" && item !== null) {
            Object.values(item).forEach(traverse)
          }
        }

        traverse(obj)
        return urls
      }

      images = extractUrls(data)
    }

    if (images.length === 0) {
      console.error("No images found in Runware response:", JSON.stringify(data, null, 2))
      throw new Error("No images generated - please check API response format")
    }

    return NextResponse.json({ images })
  } catch (error) {
    console.error("Runware API error:", error)
    return NextResponse.json({ error: "Failed to generate images" }, { status: 500 })
  }
}
