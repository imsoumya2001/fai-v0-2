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

    // Use the queue endpoint for better reliability
    const response = await fetch("https://queue.fal.run/fal-ai/wan/v2.2-a14b/image-to-video/turbo", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.FAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: requestBody,
        webhook_url: null,
      }),
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

      throw new Error(`API request failed with status ${response.status}: ${errorText}`)
    }

    const queueData = await response.json()
    console.log("Fal.ai queue response:", queueData)

    // Get the request ID and poll for results
    const requestId = queueData.request_id
    if (!requestId) {
      throw new Error("No request ID received from Fal.ai")
    }

    // Poll for the result
    let attempts = 0
    const maxAttempts = 60 // Maximum 10 minutes (60 * 10 seconds)
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000)) // Wait 10 seconds
      
      const statusResponse = await fetch(`https://queue.fal.run/fal-ai/wan/v2.2-a14b/image-to-video/turbo/requests/${requestId}/status`, {
        headers: {
          Authorization: `Key ${process.env.FAL_API_KEY}`,
        },
      })

      if (statusResponse.ok) {
        const statusData = await statusResponse.json()
        console.log("Status check:", statusData)

        if (statusData.status === "COMPLETED") {
          // Get the final result
          const resultResponse = await fetch(`https://queue.fal.run/fal-ai/wan/v2.2-a14b/image-to-video/turbo/requests/${requestId}`, {
            headers: {
              Authorization: `Key ${process.env.FAL_API_KEY}`,
            },
          })

          if (resultResponse.ok) {
            const resultData = await resultResponse.json()
            console.log("Fal.ai final result:", resultData)
            
            if (resultData.video?.url) {
              return NextResponse.json({ video: resultData.video })
            } else {
              throw new Error("No video URL in response")
            }
          }
        } else if (statusData.status === "FAILED") {
          throw new Error(`Video generation failed: ${statusData.error || "Unknown error"}`)
        }
        // If status is IN_PROGRESS or IN_QUEUE, continue polling
        console.log(`Attempt ${attempts + 1}/${maxAttempts}: Status is ${statusData.status}`)
      } else {
        console.log(`Attempt ${attempts + 1}/${maxAttempts}: Status check failed`)
      }
      
      attempts++
    }

    throw new Error("Video generation timed out")
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
