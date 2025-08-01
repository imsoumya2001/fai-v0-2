import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, imageUrl } = await request.json()

    if (!prompt || !imageUrl) {
      return NextResponse.json({ error: "Prompt and image URL are required" }, { status: 400 })
    }

    const requestBody = {
      prompt,
      image_url: imageUrl,
      resolution: "720p",
      aspect_ratio: "auto",
      enable_safety_checker: false,
      enable_prompt_expansion: false,
    }

    console.log("Sending request to Fal.ai:", requestBody)

    // Use the synchronous endpoint instead of queue for simpler handling
    const response = await fetch("https://fal.run/fal-ai/wan/v2.2-a14b/image-to-video/turbo", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.FAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Fal.ai API error: ${response.status} - ${errorText}`)

      // Handle specific error cases
      if (response.status === 401) {
        throw new Error("Invalid API key - please check your FAL_API_KEY")
      } else if (response.status === 429) {
        throw new Error("Rate limit exceeded - please try again later")
      } else if (response.status >= 500) {
        throw new Error("Fal.ai service temporarily unavailable - please try again")
      }

      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log("Fal.ai response:", data)

    // Handle the response
    if (data.video?.url) {
      return NextResponse.json({ video: data.video })
    } else if (data.request_id) {
      // If it returns a request ID, we'll need to poll
      return NextResponse.json({ requestId: data.request_id })
    } else {
      console.error("Unexpected Fal.ai response format:", data)
      throw new Error("Unexpected response format from Fal.ai")
    }
  } catch (error) {
    console.error("Fal.ai API error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate video",
      },
      { status: 500 },
    )
  }
}
