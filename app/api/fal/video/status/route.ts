import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const requestId = searchParams.get("requestId")

    if (!requestId) {
      return NextResponse.json({ error: "Request ID is required" }, { status: 400 })
    }

    // Try different endpoint formats for Fal.ai status checking
    const possibleEndpoints = [
      `https://fal.run/fal-ai/wan/v2.2-a14b/image-to-video/turbo/requests/${requestId}`,
      `https://queue.fal.run/fal-ai/wan/v2.2-a14b/image-to-video/turbo/requests/${requestId}`,
      `https://fal.run/requests/${requestId}`,
    ]

    let lastError: Error | null = null

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`)

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Authorization: `Key ${process.env.FAL_API_KEY}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          console.log("Status response:", data)

          // Handle different response formats
          if (data.video?.url) {
            return NextResponse.json({
              status: "completed",
              video: data.video,
            })
          } else if (data.status) {
            return NextResponse.json(data)
          } else if (data.error) {
            return NextResponse.json({
              status: "failed",
              error: data.error,
            })
          } else {
            return NextResponse.json({
              status: "in_progress",
            })
          }
        } else if (response.status === 404) {
          // Request might be completed or expired, try next endpoint
          continue
        } else {
          const errorText = await response.text()
          lastError = new Error(`${response.status}: ${errorText}`)
        }
      } catch (error) {
        lastError = error as Error
        continue
      }
    }

    // If all endpoints failed, return the last error
    console.error("All status endpoints failed:", lastError)
    return NextResponse.json(
      {
        status: "failed",
        error: "Unable to check video status - request may have expired",
      },
      { status: 500 },
    )
  } catch (error) {
    console.error("Fal.ai status API error:", error)
    return NextResponse.json(
      {
        status: "failed",
        error: "Failed to check video status",
      },
      { status: 500 },
    )
  }
}
